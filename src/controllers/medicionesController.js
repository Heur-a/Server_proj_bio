/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-09 09:51:18 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-09 09:51:39
 */

/**
 * @module medicionesController
 * @description API Controller for managing measurements (mediciones).
 * @requires medicionesService
 */

import { getMedicionesDB, insertMedicionDB, getUltimaMedicionDB } from '../services/medicionesService.js';

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
 * - `medida` (number, required): The value of the measurement taken by the sensor.
 * - `lugar` (string, required): The location where the measurement was taken.
 * - `tipo_gas` (string, required): The type of gas being measured.
 * - `hora` (string, date-time, required): The time when the measurement was taken.
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
 * @response 500 - Error creating the measurement.
 * 
 * @example
 * // Example request body
 * {
 *   "medida": 75.3,
 *   "lugar": "Park Area",
 *   "tipo_gas": "O3",
 *   "hora": "2024-10-08T12:00:00Z"
 * }
 */
export const postMedicion = async (req, res) => {
    try {
        const { medida, lugar, tipo_gas, hora } = req.body;

        // Check if all required fields are present
        if (!medida || !lugar || !tipo_gas || !hora) {
            console.error('Incomplete data');
            return res.status(400).send('Incomplete data');
        }

        // Insert the new measurement into the database
        const success = await insertMedicionDB(medida, lugar, tipo_gas, hora);
        success ? res.status(201).send('Reading created') : res.status(500).send('Error creating reading');
    } catch (error) {
        console.error('Error sending reading:', error);
        res.status(500).send('Error sending reading');
    }
};

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
