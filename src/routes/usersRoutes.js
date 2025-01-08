/** 
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-21 12:57:37 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-11-09 12:36:28
 */

/**
 * @module medicionesService
 * @description Routing for the users API.
 * This module defines the routes for user-related operations, including fetching,
 * creating, updating, and deleting users. It utilizes Express Router to handle
 * incoming requests and delegates the logic to the appropriate controller functions.
 */

import { Router } from 'express';  // Import the Router from Express
import { checkEmailInUse, createUser, deleteUser, getUserByEmail, updateUser } from '../controllers/userController.js';
// Initialize the router
const router = Router();

/**
 * @brief Route for fetching all users.
 * 
 * This route handles GET requests to the `/users` endpoint. It invokes the
 * `getUserByEmail` controller function to retrieve all users from the database.
 * 
 * @route GET /users
 * @see getUserByEmail
 */
router.get('/', getUserByEmail);

/**
 * @brief Route for posting a new user.
 * 
 * This route handles POST requests to the `/users` endpoint. It invokes the
 * `createUser` controller function to add a new user to the database.
 * 
 * @route POST /users
 * @see createUser
 */
router.post('/', createUser);

/**
 * @brief Route for deleting a user by id.
 * 
 * This route handles DELETE requests to the `/users/:id` endpoint. It invokes the
 * `deleteUser` controller function to delete a user from the database.
 * 
 * @route DELETE /users/:id
 * @see deleteUser
 */
router.delete('/:id', deleteUser);

/**
 * @brief Route for updating a user by id.
 * 
 * This route handles PUT requests to the `/users/:id` endpoint. It invokes the
 * `updateUser` controller function to update a user in the database.
 * 
 * @route PUT /users/:id
 * @see updateUser
 */
router.put('/:id', updateUser);

/**
 * @brief Route for checking if an email is already in use.
 * 
 * This route handles GET requests to the `/users/checkemail` endpoint. It invokes the
 * `checkUserExists` controller function to check if the provided email exists in the database.
 * 
 * @route GET /users/checkemail
 * @see checkEmailInUse
 */
router.get('/checkemail', checkEmailInUse);

// Export the router to be used in other modules
export default router;
