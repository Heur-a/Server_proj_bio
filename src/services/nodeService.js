/**
* @module nodeService
* @description Database logic for managing nodes.
* @requires fs/promises
* @requires pool
*/

import { HttpError } from '../components/HttpErrorClass.js';
import pool from '../config/db_conection.js';
import { readFile } from 'fs/promises';

/**
*
* @function createNode
* @brief Creates a new node in the database.
* @param {string} uuid - Unique identifier for the node.
* @param {number} idUser - ID of the user who owns the node.
*/

export const createNode = async (uuid, idUser) => {
    try {
        const query = await readFile('./src/sql/createNode.sql', 'utf-8');
        const result = await pool.query(query, [uuid, idUser]);
        return result[0].insertId;
    } catch (error) {
        console.error('Error creating node:', error);
        throw new HttpError(500, 'Database insertion error');
    }
};