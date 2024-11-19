import { readFile } from 'fs/promises';
import pool from '../config/db_conection.js';
import bcrypt from 'bcrypt';

/**
 * @file userService.js
 * @module services/userService
 * @description Service layer for handling user-related operations.
 * This module provides functions to create, retrieve, update, and delete user information
 * in the database, as well as to check user existence and retrieve user passwords.
 */

/**
 * Retrieves a user by their email.
 * @async
 * @function getUserByEmail
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object|null>} Returns the user object or null if not found.
 * @throws {Error} Will throw an error if the SQL query fails.
 */
export const getUserByEmail = async (email) => {
    try {
        const sql = await readFile('./src/sql/getUserByEmail.sql', 'utf-8');
        const [rows] = await pool.query(sql, [email]);

        // If a user is found, format the response to match the OpenAPI schema
        if (rows.length) {
            const user = rows[0];
            return {
                id: user.idUsers, // Assuming your SQL query returns 'id'
                name: user.name, // Assuming 'name' is returned from SQL
                surname_1: user.lastName1, // Adjust field names if necessary
                surname_2: user.lastName2, // Adjust field names if necessary
                email: user.mail, // Assuming the SQL returns 'mail'
                telephone: user.tel // Assuming the SQL returns 'tel'
            };
        }

        return null; // Return null if no user is found
    } catch (error) {
        throw new Error('Failed to fetch user: ' + error.message);
    }
};

/**
 * Retrieves a user by their ID.
 * @async
 * @function getUserById
 * @param {number} id - The ID of the user to retrieve.
 * @returns {Promise<Object|null>} Returns the user object or null if not found.
 * @throws {Error} Will throw an error if the SQL query fails.
 */
export const getUserById = async (id) => {
    try {
        const sql = await readFile('./src/sql/getUserById.sql', 'utf-8');
        const [rows] = await pool.query(sql, [id]);
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
 * @throws {Error} Will throw an error if the SQL query fails.
 */
export const createUser = async (userData) => {
    try {
        const sql = await readFile('./src/sql/createUser.sql', 'utf-8');
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        const [result] = await pool.query(sql, [
            userData.name,
            userData.surname_1,
            userData.surname_2,
            userData.telephone,
            userData.password,
            userData.userTypeId,
            userData.email
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
 * @throws {Error} Will throw an error if the SQL query fails or if no fields are provided for update.
 */
export const updateUser = async (email, userData) => {
    try {
        // Read the base SQL from the updateUser.sql file
        const sqlBase = await readFile('./src/sql/updateUser.sql', 'utf-8');

        // Initialize an array to hold the fields and values for updating
        const fields = [];
        const values = [];

        // Check each userData field, if present, add it to the arrays
        if (userData.name) {
            fields.push('name = ?');
            values.push(userData.name);
        }
        if (userData.lastName1) {
            fields.push('lastName1 = ?');
            values.push(userData.surname_1);
        }
        if (userData.lastName2) {
            fields.push('lastName2 = ?');
            values.push(userData.surname_2);
        }
        if (userData.tel) {
            fields.push('tel = ?');
            values.push(userData.telephone);
        }
        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            fields.push('password = ?');
            values.push(hashedPassword);
        }

        // If no fields to update, throw an error
        if (fields.length === 0) {
            throw new Error('No fields to update.');
        }

        // Construct the final SQL statement by appending the dynamic fields
        const sql = `${sqlBase} SET ${fields.join(', ')} WHERE mail = ?`;
        values.push(email);

        // Execute the query with the constructed SQL and values
        const [result] = await pool.query(sql, values);
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
 * @throws {Error} Will throw an error if the SQL query fails.
 */
export const deleteUser = async (email) => {
    try {
        const sql = await readFile('./src/sql/deleteUser.sql', 'utf-8');
        const [result] = await pool.query(sql, [email]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Failed to delete user: ' + error.message);
    }
};

/**
 * Retrieves a user password by their ID.
 * @async
 * @function getUserPasswordById
 * @param {number} id - The ID of the user to retrieve.
 * @returns {Promise<Object|null>} Returns the user object or null if not found.
 * @throws {Error} Will throw an error if the SQL query fails.
 */
export const getUserPasswordById = async (id) => {
    try {
        const sql = await readFile('./src/sql/getUserPasswordById.sql', 'utf-8');
        const [rows] = await pool.query(sql, [id]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw new Error('Failed to fetch user password: ' + error.message);
    }
};

/**
 * Checks if a user with the specified email exists.
 * @async
 * @function checkUserExists
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} Returns true if the user exists, false otherwise.
 * @throws {Error} Will throw an error if the SQL query fails.
 */
export const checkUserExists = async (email) => {
    try {
        // Read the SQL query from file
        const sql = await readFile('./src/sql/checkUserExists.sql', 'utf-8');

        // Execute the query, passing the email as a parameter
        const [rows] = await pool.execute(sql, [email]);

        // Check the result to see if any rows were returned
        return rows[0]?.email_exists > 0;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Failed to check user existence.');
    }
}
