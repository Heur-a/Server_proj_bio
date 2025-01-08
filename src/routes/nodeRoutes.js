/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-27 18:19:43 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-27 19:24:18
 */
/**
*@file nodeRoutes.js
*@brief Sets up the nodes routes for the Node.js server.
 */

// Import the express module
import express from 'express';
// Import the node controller
import {createNode, handleGetNode} from '../controllers/nodeController.js';
import { verifyIdentity } from '../services/authService.js';
import {getNodeUuid} from "../services/nodeService.js";
import {handleGetAllNodesWithLastDate} from "../controllers/medicionesController.js";

// Create a new router object
const nodeRoutes = express.Router();

// Set up the routes for the nodes endpoints verifying is user is logged in
nodeRoutes.post('/', verifyIdentity, createNode);

nodeRoutes.get('/', verifyIdentity, handleGetNode );

nodeRoutes.get('/all', verifyIdentity, handleGetAllNodesWithLastDate);

// Export the router object
export default nodeRoutes;
