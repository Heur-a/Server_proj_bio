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
 * Creates a new node in the database associated with a specific user.
 *
 * This asynchronous function reads an SQL query from a file and executes it to insert a new node using the provided UUID and user ID.
 * It returns the ID of the newly created node. If an error occurs during the process, it logs the error and throws an HttpError.
 *
 * @async
 * @function createNode
 * @param {string} uuid - The unique identifier for the node to be created.
 * @param {number} idUser - The ID of the user associated with the new node.
 * @returns {Promise<number>} A promise that resolves to the ID of the newly created node.
 * @throws {HttpError} Throws an error with a 500 status code if the database insertion fails.
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
 * Retrieves the UUID of a node based on its ID from the database.
 *
 * This asynchronous function reads an SQL query from a file and executes it to fetch the node details associated with the provided ID.
 * If no results are found, it returns `null`. If an error occurs, it throws an HttpError with a 500 status code for unexpected errors.
 *
 * @async
 * @function getNodeUuid
 * @param {number} id - The ID of the node whose UUID is to be retrieved.
 * @returns {Promise<Object|null>} A promise that resolves to the node object containing the UUID, or `null` if no node is found.
 * @throws {HttpError} Throws an error with a 500 status code if an unexpected error occurs during the operation.
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
 * Retrieves the node ID associated with a given UUID from the database.
 *
 * This asynchronous function reads an SQL query from a file and executes it to fetch the node ID corresponding to the provided UUID.
 * If no results are found, it returns `null`. If an error occurs, it throws an HttpError with a 500 status code for unexpected errors.
 *
 * @async
 * @function getNodeIdWithUuuid
 * @param {string} uuid - The UUID of the node whose ID is to be retrieved.
 * @returns {Promise<number|null>} A promise that resolves to the ID of the node, or `null` if no node is found.
 * @throws {HttpError} Throws an error with a 500 status code if an unexpected error occurs during the operation.
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

/**
 * Retrieves all nodes with their last date from the database.
 *
 * This asynchronous function reads a SQL query from a file and executes it against the database connection pool.
 * It returns the rows retrieved from the query or null if no rows are found.
 *
 * @async
 * @function getAllNodesWithLastDate
 * @returns {Promise<Array<Object>|null>} A promise that resolves to an array of node objects or null if no nodes are found.
 */
    export const getAllNodesWithLastDate = async () => {
        const query = await readFile('./src/sql/getAllNodesWithLastDate.sql', 'utf-8');
        const [rows] = await pool.query(query)
        return rows || null;
    }
