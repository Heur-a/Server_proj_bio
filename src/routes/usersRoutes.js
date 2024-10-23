/** 
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-21 12:57:37 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-23 18:06:47
 */

/**
 * @module medicionesService
 * @description Routing for the users api
 */

import { Router } from 'express';  // Import the Router from Express

import { getUsers, postUser, getUserById, deleteUserById, updateUser} from '../controllers/usersController.js';  // Import the controller functions

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
router.get('/', getUsers);

/**
 * @brief Route for posting a new user.
 *  This route handles POST requests to the `/users` endpoint. It invokes the
 * `postUser` controller function to add a new user to the database.
 *  @route POST /users
 * @see postUser
 */
router.post('/', postUser);


/**
 * @brief Route for fetching a user by username.
 * This route handles GET requests to the `/users/:id` endpoint. It invokes the
 * `getUserById` controller function to retrieve a user from the database.
 * @route GET /users/:id
 * @see getUserById
 */
router.get('/:username', getUserById);

/**
 * @brief Route for deleting a user by id.
 * This route handles DELETE requests to the `/users/:id` endpoint. It invokes the
 * `deleteUserById` controller function to delete a user from the database.
 * @route DELETE /users/:id
 * @see deleteUserById
 */

router.delete('/:username', deleteUserById);

/**
 * @brief Route for updating a user by id.
 * This route handles PUT requests to the `/users/:id` endpoint. It invokes the
 * `updateUser` controller function to update a user from the database.
 * @route PUT /users/:id
 * @see updateUser
 */

router.put('/:username', updateUser);

// Export the router to be used in other modules
export default router;

