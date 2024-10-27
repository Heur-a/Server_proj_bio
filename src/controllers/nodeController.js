/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-27 18:19:33 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-27 19:23:23
 */

/**
*@module nodeController
*@description Defines the functions for handling node-related requests.
*@requires nodeService
 */

// Import the nodeService module
import * as nodeService from '../services/nodeService.js';
// Import the HttpError class
import { HttpError } from '../components/HttpErrorClass.js';
//Import the user by id form userService module
import { getUserById } from '../services/userService.js';


/**
* Creates a new node in the database.
* @function createNode
* @param {Request} req - The request object.
* @param {Response} res - The response object.
* @returns {Response} The response object with the status code and a message.
*/
export const createNode = async (req, res) => {
    try {
        // Get the UUID and ID of the user from the request body
        const { uuid, idUser } = req.body;

        //check if uuid and idUser are not empty
        if (!uuid || !idUser) {
            throw new HttpError(400, 'Missing required fields');
        }

        //check if idUser is a number
        if (isNaN(idUser)) {
            throw new HttpError(400, 'idUser must be a number');
        }

        //check if uuid is a string
        if (typeof uuid !== 'string') {
            throw new HttpError(400, 'uuid must be a string');
        }

        //check if user exists
        const user = await getUserById(idUser);
        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        // Call the createNode function from the nodeService module
        const result = await nodeService.createNode(uuid, idUser);
        // Send a success response
        res.status(201).json({ message: 'Node created successfully', id: result });

    } catch (error) {
        // Send an error response
        res.status(error.statusCode).json({ message: error.message });
    }
};