/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-06 16:52:55 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-06 17:06:16
 */

/**
 * API request export file
 * @module medicionesController
 * @requires express
 * @requires fs
 */
import pool from '../config/db_conection.js';
import { readFile } from 'fs/promises';



// Obtenir totes les medicions amb opcions de filtratge
/**
 * Retrieves all readings
 * @param {*} req not used
 * @param {Response} res HTTP response with a JSON object if successfull
 */
export const getMediciones = async (req, res) => {
    try {
        let query = await readFile('./src/sql/getMediciones.sql', 'utf-8');
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error obteining readings:', error);
        res.status(500).send('Erro obteining readings');
    }
};

/**
 * Adds a new reading 
 * @param {JSON} req JSON with the API schema
 * @param {Response} res HTTP response
 * @returns 
 */
export const postMedicion = async (req, res) => {
    try {
        const { medida,lugar,tipo_gas,hora } = req.body; // Llegeix les dades del cos de la petició JSON
        
        console.log(req.body);
            console.log(medida);
            console.log(lugar);
            console.log(tipo_gas);
            console.log(hora);

        if (!medida || !lugar || !tipo_gas || !hora) {
            console.error('Incomplete data');
            // Mostra les dades rebudes
            return res.status(400).send('Incomplete data');
        }

        const query = await readFile('./src/sql/insertMedicion.sql', 'utf-8');
        const result = await pool.query(query, [medida, lugar, tipo_gas, hora]);
        result[0].affectedRows === 1 ? res.status(201).send('Reading created') : res.status(500).send('Error creating reading');
    } catch (error) {
        console.error('Error sending reading', error);
        res.status(500).send('Error sending reading');
    }
};


/**
 * Retrieves the last reading
 * @param {*} req not used
 * @param {Response} res  HTTP response with a JSON object if successfull
 * @returns 
 */
export const getUltimaMedicion = async (req, res) => {
    try {
        const query = await readFile('./src/sql/getUltimaMedicion.sql', 'utf-8');
        const [rows] = await pool.query(query);
        
        if (rows.length === 0) {
            return res.status(404).send('No readings found');
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error obtaining last reading:', error);
        res.status(500).send('Error obtaining last reading');
    }
};
