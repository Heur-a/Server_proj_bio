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
import {HttpError} from '../components/HttpErrorClass.js';
//Import the user by id form userService module
import {getUserById} from '../services/userService.js';
import session from 'express-session';
import {getNodeUuid} from "../services/nodeService.js";


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

        const {id: idUser, email} = userSession;

        console.log('create Node, idUser: ' + idUser)

        // Validar que `idUser` és un número
        if (!idUser || isNaN(idUser)) {
            throw new HttpError(400, 'Invalid session data');
        }

        //Ver si ya existe un nodo
        const uuidNodeExists =  await getNodeUuid(idUser);
        if (uuidNodeExists) {
            console.log("nodeController.createNode, uuid of already existing node: ", uuidNodeExists);
            throw new HttpError(403, 'A node already exists');
        }


        console.log('create Node, req.body: ' + req.body.uuid)
        const uuid = req.body.uuid; // Obté el UUID del cos de la petició

        // Valida que el UUID és correcte
        if (!uuid) {
            throw new HttpError(400, 'Invalid UUID');
        }

        // Lògica per crear el node
        const result = await nodeService.createNode(uuid, idUser);
        res.status(201).json({message: 'Node created successfully', id: result});
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

/**
 * @function handleGetNode
 * @brief Handles API request and response
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const handleGetNode = async (req, res) => {
    try {
        if (!req.session.user.id) {
            throw new HttpError(401, 'Invalid id user id');
        }

        const {id: id, email} = req.session.user;

        console.log('handleGetNode, idUser: ' + id);

        const node = await nodeService.getNodeUuid(id);

        if (!node) {
            throw new HttpError(400, 'User has no associated node');
        }

        console.log("NodeController.handleGetNode, UUID obtained: " + node.uuid);

        res.json({ uuid: node.uuid }); // Retorna directament l'UUID

    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
}



