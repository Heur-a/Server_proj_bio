// userController.js

import * as userService from '../services/userService.js';

/**
 * @file userController.js
 * @module controllers/userController
 * @description Controller for user-related operations.
 * This module defines the controller functions for handling user requests, including
 * fetching, creating, updating, and deleting users. It interacts with the user service
 * to perform the necessary operations and sends appropriate responses to the client.
 */

/**
 * @typedef {Object} User
 * @property {number} id - User identifier.
 * @property {string} name - User's first name.
 * @property {string} surname_1 - User's first surname.
 * @property {string} surname_2 - User's second surname.
 * @property {string} email - User's email address.
 * @property {string} telephone - User's telephone number.
 */

/**
 * Retrieves a user by their email.
 * @async
 * @function
 * @name getUserByEmail
 * @memberof module:controllers/userController
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Returns the user if found or an error otherwise.
 */
export const getUserByEmail = async (req, res) => {
    const { email } = req.query;
    console.log("Estamos en getUserByEmail, userController.js, email: ", email);
    if (!email) {
        return res.status(400).json({ message: 'The email parameter is required' });
    }

    try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'No user found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Creates a new user.
 * @async
 * @function
 * @name createUser
 * @memberof module:controllers/userController
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Returns the created user if successful or an error otherwise.
 */
export const createUser = async (req, res) => {
    const userData = req.body;
    console.log("Estamos en createUser, userController.js, userData: ", userData);
    try {
        const user = await userService.createUser(userData);
        return res.status(201).send();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid user data', error: error.message });
    }
};

/**
 * Updates an existing user.
 * @async
 * @function
 * @name updateUser
 * @memberof module:controllers/userController
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Returns the updated user if successful or an error otherwise.
 */
export const updateUser = async (req, res) => {
    const userData = req.body;
    const { email } = req.query;
    console.log("Estamos en updateUser, userController.js, email: ", email);
    console.log("Estamos en updateUser, userController.js, userData: ", userData);
    if (!email) {
        return res.status(400).json({ message: 'The email parameter is required' });
    }
    console.log("Estamos en updateUser, userController.js, userData: ", userData);
    try {
        const user = await userService.updateUser(email, userData);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(202).send();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid user data', error: error.message });
    }
};

/**
 * Deletes a user by their email.
 * @async
 * @function
 * @name deleteUser
 * @memberof module:controllers/userController
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Returns a response with no content if the user was deleted successfully.
 */
export const deleteUser = async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'The email parameter is required' });
    }

    try {
        const result = await userService.deleteUser(email);
        if (!result) {
            return res.status(404).json({ message: 'No user found' });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Checks if a user exists by their email.
 * @async
 * @function
 * @name checkUserExists
 * @memberof module:controllers/userController
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Returns true if the user exists or an error otherwise.
 */
export const checkEmailInUse = async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'The email parameter is required' });
    }

    try {
        const exists = await userService.checkUserExists(email);
        if (!exists) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            return res.status(200).json({ exists });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

/**
 * Exports the user controller functions for use in routing.
 * @exports {Object} UserController - The user controller functions.
 */
export default { getUserByEmail, createUser, updateUser, deleteUser, checkUserExists: checkEmailInUse };
