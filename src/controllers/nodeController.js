/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-27 18:19:33 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-11-20 18:40:03
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
import session from 'express-session';


/**
* Creates a new node in the database.
* @function createNode
* @param {Request} req - The request object.
* @param {Response} res - The response object.
* @returns {Response} The response object with the status code and a message.
*/
export const createNode = async (req, res) => {
    try {
        const userSession = req.session.user;

        // Validar si hi ha informació a la sessió
        if (!userSession) {
            throw new HttpError(401, 'No active session found');
        }

        const { id: idUser, email } = userSession;

        console.log('create Node, idUser: ' + idUser)

        // Validar que `idUser` és un número
        if (!idUser || isNaN(idUser)) {
            throw new HttpError(400, 'Invalid session data');
        }


        console.log('create Node, req.body: ' + req.body.uuid)
        const uuid = req.body.uuid; // Obté el UUID del cos de la petició

        // Valida que el UUID és correcte
        if (!uuid) {
            throw new HttpError(400, 'Invalid UUID');
        }

        // Lògica per crear el node
        const result = await nodeService.createNode(uuid, idUser);
        res.status(201).json({ message: 'Node created successfully', id: result });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
