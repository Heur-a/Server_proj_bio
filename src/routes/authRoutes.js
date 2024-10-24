/**

    @file authRouter.js
    @brief Defines authentication routes (login, logout, register).
    @details This module handles user authentication such as login, logout, and registration, using password-based authentication. */

import express from 'express';
import { login, register, logout, checkAuthentication } from '../controllers/authController.js';

const router = express.Router();

/**
 * @brief Log in a user.
 * @route POST /auth/login
 * @group Authentication - Operations related to user authentication.
 * @param {string} email.query.required - User's email.
 * @param {string} password.query.required - User's password.
 * @returns {object} 200 - Successful login, returns JWT token.
 * @returns {object} 400 - Invalid login credentials.
 * @returns {object} 500 - Server error.
 * @security This route does not require a token.
 */
router.post('/login', login);

/**
 * @brief Register a new user.
 * @route POST /auth/register
 * @group Authentication - Operations related to user authentication.
 * @param {string} email.body.required - New user's email.
 * @param {string} password.body.required - New user's password.
 * @param {string} name.body.required - New user's name.
 * @returns {object} 201 - User successfully registered.
 * @returns {object} 400 - Invalid registration data.
 * @returns {object} 500 - Server error.
 */
router.post('/register', register);

/**
 * @brief Log out a user.
 * @route POST /auth/logout
 * @group Authentication - Operations related to user authentication.
 * @returns {object} 200 - Successful logout.
 * @returns {object} 500 - Server error.
 * @security This route requires a valid JWT token.
 */
router.post('/logout', logout);

/**
* @brief Check if the user is authenticated.
* @route GET /auth/checkAuth
* @group Authentication - Operations related to user authentication.
* @returns {object} 200 - User is authenticated.
* @returns {object} 401 - User is not authenticated.
* @security This route requires a valid JWT token.
*/
router.get('/checkAuth',checkAuthentication)

export default router;
