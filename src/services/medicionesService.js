/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-09 09:51:26 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-21 20:32:54
 */

/**
 * @module medicionesService
 * @description Database logic for managing measurements.
 * @requires fs/promises
 * @requires pool
 */

import pool from '../config/db_conection.js';
import { readFile } from 'fs/promises';
import {HttpError} from "../components/HttpErrorClass.js";

/**
 * Fetches all measurements from the database.
 * @function getMedicionesDB
 * @returns {Promise<Array>} A list of all measurements.
 * @throws Will throw an error if the database query fails.
 * @description This function corresponds to the `GET /mediciones` operation, which allows filtering results by location, gas type, or a time range.
 */
export const getMedicionesDB = async () => {
    try {
        const query = await readFile('./src/sql/getMediciones.sql', 'utf-8');
        const [rows] = await pool.query(query);
        console.log(rows);
        return rows;
    } catch (error) {
        throw new HttpError(500, error.message);
    }
};

/**
 * Inserts a new measurement into the database.
 * @function insertMedicionDB
 * @param {Medida} medida - Object containing the measurement
 * @returns {Promise<boolean>} True if the measurement was successfully inserted.
 * @throws Will throw an error if the insertion fails.
 * @description This corresponds to the `POST /mediciones` operation, where the data of the new measurement is provided in the request body.
 */
export const insertMedicionDB = async (medida) => {
    try {
        console.log(medida);
        const query = await readFile('./src/sql/insertMedicion.sql', 'utf-8');
        const result = await pool.query(query, [medida.value,medida.LocX,medida.LocY,medida.nodeId,medida.gasId]);
        return result[0].affectedRows === 1;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        } else {
            throw new HttpError(500,error.message);
        }
    }
};

/**
 * Fetches the latest measurement from the database.
 * @function getUltimaMedicionDB
 * @returns {Promise<Object|null>} The last recorded measurement or `null` if none is found.
 * @throws Will throw an error if the query fails.
 * @description This function corresponds to the `GET /mediciones/ultima` operation.
 */
export const getUltimaMedicionDB = async () => {
    try {
        const query = await readFile('./src/sql/getUltimaMedicion.sql', 'utf-8');
        const [rows] = await pool.query(query);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw new HttpError(500, error.message);
    }
};

export const getMedicionesDiariasDB = async (userId,date) => {
    try{
        const query = await readFile('./src/sql/getMeasurementsUserDay.sql', 'utf-8');
        const params = [userId, date];
        const [rows] = await pool.query(query, params);
        return rows.length ? rows[0] : null;
    } catch (e) {
        throw new HttpError(500, e.message);
    }
}

export const getMedicionesRangoFechasDB = async (date1,date2) => {
    try{
        const query = await readFile('./src/sql/getMedicionesRangoFecha.sql', 'utf-8');
        const params = [date1, date2];
        const [rows] = await pool.query(query, params);
        return rows.length ? rows[0] : null;
    } catch (e) {
        throw new HttpError(500, e.message);
    }
}

export default { getMedicionesDB, insertMedicionDB, getUltimaMedicionDB };
