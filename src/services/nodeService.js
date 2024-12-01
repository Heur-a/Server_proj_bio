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


/**
 * @function getNodeUuid
 * @brief Gets the node associated with a user
 * @param {string} id - User id
 * @returns {string} Node uuid
 */
export const getNodeUuid = async (id) => {
    try {
        const query = await readFile('./src/sql/getNodeById.sql', 'utf-8');
        const [rows] = await pool.query(query, [id]); // Usa la desestructuració per obtenir directament `rows`

        if (!rows.length) {
            return null; // Si no hi ha resultats
        }

        return rows[0];

    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        } else {
            throw new HttpError(500, 'Internal Server Error');
        }
    }
}

    /**
     * getNodeIdWithUuid
     * Gets the node id with a given uuid
     * @param {string} uuid - Uuid of the node to search for
     * @returns {Promise<number>} Id of the requested node
     */
    export const getNodeIdWithUuuid = async (uuid) => {
        try {
            const query = await readFile('./src/sql/getNodeIdWithUuid.sql', 'utf-8');
            const [rows] = await pool.query(query, [uuid]);
            if (!rows.length) {
                return null;
            }
            const result = rows[0];
            return result.idnodes;

        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else {
                throw new HttpError(500, error.message);
            }
        }

    }
