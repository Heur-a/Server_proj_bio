/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-09 09:51:18 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-22 11:41:25
 */

/**
 * @module medicionesController
 * @description API Controller for managing measurements (mediciones).
 * @requires medicionesService
 */

import {
    getMedicionesDB,
    insertMedicionDB,
    getUltimaMedicionDB,
    getMedicionesDiariasDB
} from '../services/medicionesService.js';
import pool from '../config/db_conection.js';
import {Medida} from "../components/medidaClass.js";
import {getNodeIdWithUuuid} from "../services/nodeService.js";
import {HttpError} from "../components/HttpErrorClass.js";
/**
 * @function getMapaCalorData
 * @description Retrieves the coordinates and values for the heatmap.
 * @param {Request} req - The HTTP request.
 * @param {Response} res - The HTTP response containing an array of data for the heatmap.
 */
export const getMapaCalorData = async (req, res) => {
    try {
        const query = 'SELECT LocX, LocY, value FROM Measurements';
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving heatmap data:', error);
        res.status(500).send('Error retrieving heatmap data');
    }
};

/**
 * @function getMediciones
 * @description Handles the GET request to `/mediciones`.
 * Retrieves all measurements from the database
 * 
 * @param {Request} req - The HTTP request, containing optional query parameters for filtering:
 * - `lugar` (string): Filter by the location where the measurement was taken.
 * - `tipo_gas` (string): Filter by the type of gas measured.
 * - `desde_hora` (string, date-time): Filter measurements taken after this time.
 * - `hasta_hora` (string, date-time): Filter measurements taken before this time.
 * 
 * @param {Response} res - The HTTP response, which contains a JSON array of measurement objects if successful.
 * 
 * @returns {void}
 * @summary Retrieves all stored measurements, filtered by the provided query parameters.
 * 
 * @operationId obtener_mediciones
 * 
 * @response 200 - A list of measurements is returned successfully.
 * @response 400 - Invalid query parameters.
 * @response 500 - Error retrieving measurements.
 * 
 * @example
 * // Example response format (200)
 * [
 *   {
 *     "medida": 50.5,
 *     "lugar": "Zona Industrial",
 *     "tipo_gas": "CO2",
 *     "hora": "2024-09-26T14:30:00Z"
 *   }
 * ]
 */
export const getMediciones = async (req, res) => {
    try {
        const readings = await getMedicionesDB();
        res.json(readings);
    } catch (error) {
        console.error('Error obtaining readings:', error);
        res.status(500).send('Error obtaining readings');
    }
};

/**
 * @function postMedicion
 * @description Handles the POST request to `/mediciones`.
 * Submits a new measurement to the server, expecting a JSON object in the request body.
 * 
 * @param {Request} req - The HTTP request containing a JSON object with the following properties:
 * - `value` (number, required): The value of the measurement taken by the sensor.
 * - `LocX` (number, required): The longitude where the measurement was taken.
 * - `LocY` (number,required): The latitude where the measurement was taken.
 * - `gasId` (number, required): The type of gas being measured.
 * - `uuid` (string,required)
 * 
 * @param {Response} res - The HTTP response indicating the result of the operation.
 * 
 * @returns {void}
 * @summary Creates a new measurement based on the provided data.
 * 
 * @operationId enviar_medicion
 * 
 * @response 201 - The measurement was successfully created.
 * @response 400 - Invalid or incomplete measurement data.
 * @response 404 - Invalid uuid
 * @response 500 - Error creating the measurement.
 * 
 * @example
 * // Example request body
 * {
 *   "value": 2.3,
 *   "LocX" : -2.5,
 *   "LocY": 40,
 *   "gasId": 1,
 *   "uuid": "abcdefgh12345678"
 * }
 */
export const postMedicion = async (req, res) => {
    try {
        // Parse and validate the request body
        const {value, LocX, LocY, gasId, uuid} = req.body;

        if (
            typeof value !== 'number' ||
            typeof LocX !== 'number' ||
            typeof LocY !== 'number' ||
            typeof gasId !== 'number' ||
            typeof uuid !== 'string'
        ) {
            console.log('Error retrieving postMedicion');
            return res.status(400).send('Invalid or incomplete measurement data');
        }
        //Tranform uuid into id
        const nodeId = await getNodeIdWithUuuid(uuid);

        if(!nodeId) {
            return res.status(404).send('Node sensor doesn\'t exist');
        }


        // Create a new Medida instance
        const medida = new Medida(value, LocX, LocY, gasId, nodeId);

        // Insert the new measurement into the database
        await insertMedicionDB(medida);

        //Send created successfully
        return res.status(201).send('Measurement added successfully');

    } catch (error) {
        console.error('Error creating measurement:', error.message);
        res.status(500).send(error.message);
    }
}

/**
 * @function getUltimaMedicion
 * @description Handles the GET request to `/mediciones/ultima`.
 * Retrieves the last recorded measurement from the database.
 * 
 * @param {Request} req - The HTTP request (not used).
 * @param {Response} res - The HTTP response, containing the last measurement as a JSON object if successful.
 * 
 * @returns {void}
 * @summary Retrieves the last recorded measurement.
 * 
 * @operationId obtener_ultima_medicion
 * 
 * @response 200 - The last measurement is returned successfully.
 * @response 404 - No measurements found.
 * @response 500 - Error retrieving the last measurement.
 * 
 * @example
 * // Example response format (200)
 * {
 *   "medida": 60.1,
 *   "lugar": "Downtown",
 *   "tipo_gas": "NO2",
 *   "hora": "2024-10-08T14:45:00Z"
 * }
 */
export const getUltimaMedicion = async (req, res) => {
    try {
        const lastReading = await getUltimaMedicionDB();
        if (!lastReading) {
            return res.status(404).send('No readings found');
        }
        res.json(lastReading);
    } catch (error) {
        console.error('Error obtaining last reading:', error);
        res.status(500).send('Error obtaining last reading');
    }
};

export const handleGetMedicionesDiarias = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).send('Not authorized');
        }
        const userSession = req.session.user;
        const {id: userId, email: email} = userSession;

        if (!userId || !email) {
            return res.status(401).send('Not authorized');
        }

        if (!req.query.date) {
            return res.status(400).send('Date not found');
        }

        const {date} = req.query;

        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

        if (!regex.test(date)) {
            res.status(400).send('Invalid date, not a YYYY-MM-DD format date');
        }

        const mediciones = await getMedicionesDiariasDB(userId, date);

        return res.json(mediciones || []); // Si mediciones és null o undefined, envia un array buit

    } catch (error) {
        console.error('Error retrieving mediciones:', error);
        if (!res.headersSent) {
            return res.status(500).send('Error obtaining mediciones data');
        }
    }
    
}
