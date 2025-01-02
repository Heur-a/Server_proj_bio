/**
 * @file medicionesRoutes.js
 * @brief Defines the routes for handling measurement (mediciones) endpoints.
 * 
 * This module sets up the Express router for handling HTTP requests related to
 * measurements. It includes routes for fetching all measurements, posting a new
 * measurement, and retrieving the latest measurement.
 * 
 * @author Alex Escrivà Caravaca
 * @date 2024-10-06
 * @version 1.0.0
 * @last_modified 2024-10-09
 */

import { Router } from 'express';  // Import the Router from Express
import {
    getMediciones,
    postMedicion,
    getUltimaMedicion,
    getMapaCalorData,
    handleGetMedicionesDiarias
} from '../controllers/medicionesController.js';
import {verifyIdentity} from "../services/authService.js";  // Import the controller functions

// Initialize the router
const router = Router();

router.get('/mapa-calor', getMapaCalorData);

/**
 * @brief Route for fetching all measurements.
 * 
 * This route handles GET requests to the `/mediciones` endpoint. It invokes the
 * `getMediciones` controller function to retrieve all measurements from the database.
 * 
 * @route GET /mediciones
 * @see getMediciones
 */
router.get('/', getMediciones);

/**
 * @brief Route for posting a new measurement.
 * 
 * This route handles POST requests to the `/mediciones` endpoint. It invokes the
 * `postMedicion` controller function to add a new measurement to the database.
 * 
 * @route POST /mediciones
 * @see postMedicion
 */
router.post('/', postMedicion);

/**
 * @brief Route for fetching the latest measurement.
 * 
 * This route handles GET requests to the `/mediciones/ultima` endpoint. It invokes
 * the `getUltimaMedicion` controller function to retrieve the latest measurement
 * recorded in the database.
 * 
 * @route GET /mediciones/ultima
 * @see getUltimaMedicion
 */
router.get('/ultima', verifyIdentity, getUltimaMedicion);

router.get("/diaria",verifyIdentity, handleGetMedicionesDiarias)




// Export the router to be used in other modules
export default router;
