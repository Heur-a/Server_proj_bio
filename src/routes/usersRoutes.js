/** 
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-21 12:57:37 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-23 19:56:27
 */

/**
 * @module medicionesService
 * @description Routing for the users api
 */

import { Router } from 'express';  // Import the Router from Express
import { createUser, deleteUser, getUserByEmail, updateUser } from '../controllers/userController.js';

// Initialize the router
const router = Router();

/**
 * @brief Route for fetching all users.
 * 
 * This route handles GET requests to the `/users` endpoint. It invokes the
 * `getUsers` controller function to retrieve all users from the database.
 * 
 * @route GET /users
 * @see getUsers
 */
router.get('/', getUserByEmail);

/**
 * @brief Route for posting a new user.
 *  This route handles POST requests to the `/users` endpoint. It invokes the
 * `postUser` controller function to add a new user to the database.
 *  @route POST /users
 * @see postUser
 */
router.post('/', createUser);




/**
 * @brief Route for deleting a user by id.
 * This route handles DELETE requests to the `/users/:id` endpoint. It invokes the
 * `deleteUserById` controller function to delete a user from the database.
 * @route DELETE /users/:id
 * @see deleteUserById
 */

router.delete('/', deleteUser);

/**
 * @brief Route for updating a user by id.
 * This route handles PUT requests to the `/users/:id` endpoint. It invokes the
 * `updateUser` controller function to update a user from the database.
 * @route PUT /users/:id
 * @see updateUser
 */

router.put('/', updateUser);

// Export the router to be used in other modules
export default router;
