/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-09 09:51:26 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-21 20:32:54
 */

//todo: CAMBIAR ESTO PARA QUE FUNCIONE CON BASE DE DATOS NUEVA YEY
/**
 * @module medicionesService
 * @description Database logic for managing measurements.
 * @requires fs/promises
 * @requires pool
 */

import pool from '../config/db_conection.js';
import { readFile } from 'fs/promises';

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
        console.error('Error fetching all readings:', error);
        throw new Error('Database query error');
    }
};

/**
 * Inserts a new measurement into the database.
 * @function insertMedicionDB
 * @param {string} medida - Measurement value taken by the sensor.
 * @param {string} lugar - Location where the measurement was taken.
 * @param {string} tipo_gas - Type of gas measured by the sensor.
 * @param {string} hora - Time when the measurement was taken.
 * @returns {Promise<boolean>} True if the measurement was successfully inserted.
 * @throws Will throw an error if the insertion fails.
 * @description This corresponds to the `POST /mediciones` operation, where the data of the new measurement is provided in the request body.
 */
export const insertMedicionDB = async (medida, lugar, tipo_gas, hora) => {
    try {
        const query = await readFile('./src/sql/insertMedicion.sql', 'utf-8');
        const result = await pool.query(query, [medida, lugar, tipo_gas, hora]);
        return result[0].affectedRows === 1;
    } catch (error) {
        console.error('Error inserting new reading:', error);
        throw new Error('Database insertion error');
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
        console.error('Error fetching last reading:', error);
        throw new Error('Database query error');
    }
};

export default { getMedicionesDB, insertMedicionDB, getUltimaMedicionDB };
