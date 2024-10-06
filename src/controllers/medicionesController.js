import pool from '../config/db_conection.js';
import { readFile } from 'fs/promises';

// Obtenir totes les medicions amb opcions de filtratge
export const getMediciones = async (req, res) => {
    try {
        let query = await readFile('./src/models/queries/getMediciones.sql', 'utf-8');
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error obteining readings:', error);
        res.status(500).send('Erro obteining readings');
    }
};

// Enviar una nova medició
export const postMedicion = async (req, res) => {
    try {
        const { medida, lugar, tipo_gas, hora } = req.body;
        if (!medida || !lugar || !tipo_gas || !hora) {
            return res.status(400).send('Incomplete data');
        }

        const query = await readFile('./src/models/queries/insertMedicion.sql', 'utf-8');
        await pool.query(query, [medida, lugar, tipo_gas, hora]);
        res.status(201).send('Reading created successfully');
    } catch (error) {
        console.error('Error sending reading', error);
        res.status(500).send('Error sending reading');
    }
};

// Obtenir la última medició
export const getUltimaMedicion = async (req, res) => {
    try {
        const query = await readFile('./src/models/queries/getUltimaMedicion.sql', 'utf-8');
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
