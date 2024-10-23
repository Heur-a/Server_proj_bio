import { readFile } from 'fs/promises';
import { pool } from '../db_connection.js';

/**
 * @file userService.js
 * @module services/userService
 * @description Service layer for handling user-related operations.
 */

/**
 * Retrieves a user by their email.
 * @async
 * @function getUserByEmail
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object|null>} Returns the user object or null if not found.
 * @throws Will throw an error if the SQL query fails.
 */
export const getUserByEmail = async (email) => {
    try {
        const sql = await readFile('./sql/getUserByEmail.sql', 'utf-8');
        const [rows] = await pool.query(sql, [email]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw new Error('Failed to fetch user: ' + error.message);
    }
};

/**
 * Creates a new user.
 * @async
 * @function createUser
 * @param {Object} userData - The data of the user to create.
 * @param {string} userData.name - First name of the user.
 * @param {string} userData.lastName1 - First last name of the user.
 * @param {string} userData.lastName2 - Second last name of the user.
 * @param {string} userData.tel - Phone number of the user.
 * @param {string} userData.password - Password of the user.
 * @param {number} userData.userTypeId - ID of the user type.
 * @param {string} userData.mail - Email of the user.
 * @returns {Promise<Object>} Returns the created user object.
 * @throws Will throw an error if the SQL query fails.
 */
export const createUser = async (userData) => {
    try {
        const sql = await readFile('./sql/createUser.sql', 'utf-8');
        const [result] = await pool.query(sql, [
            userData.name,
            userData.lastName1,
            userData.lastName2,
            userData.tel,
            userData.password,
            userData.userTypeId,
            userData.mail
        ]);
        return { id: result.insertId, ...userData };
    } catch (error) {
        throw new Error('Failed to create user: ' + error.message);
    }
};

/**
 * Updates an existing user.
 * @async
 * @function updateUser
 * @param {string} email - The email of the user to update.
 * @param {Object} userData - The updated user data.
 * @param {string} userData.name - Updated first name.
 * @param {string} userData.lastName1 - Updated first last name.
 * @param {string} userData.lastName2 - Updated second last name.
 * @param {string} userData.tel - Updated phone number.
 * @param {string} userData.password - Updated password.
 * @returns {Promise<boolean>} Returns true if the user was updated successfully.
 * @throws Will throw an error if the SQL query fails.
 */
export const updateUser = async (email, userData) => {
    try {
        const sql = await readFile('./sql/updateUser.sql', 'utf-8');
        const [result] = await pool.query(sql, [
            userData.name,
            userData.lastName1,
            userData.lastName2,
            userData.tel,
            userData.password,
            email
        ]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Failed to update user: ' + error.message);
    }
};

/**
 * Deletes a user by their email.
 * @async
 * @function deleteUser
 * @param {string} email - The email of the user to delete.
 * @returns {Promise<boolean>} Returns true if the user was deleted successfully.
 * @throws Will throw an error if the SQL query fails.
 */
export const deleteUser = async (email) => {
    try {
        const sql = await readFile('./sql/deleteUser.sql', 'utf-8');
        const [result] = await pool.query(sql, [email]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Failed to delete user: ' + error.message);
    }
};
