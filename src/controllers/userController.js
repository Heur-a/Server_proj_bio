// userController.js

import * as userService from '../services/userService.js';

/**
 * @file userController.js
 * @module controllers/userController
 * @description Controlador per a les operacions relacionades amb els usuaris.
 */

/**
 * @typedef {Object} User
 * @property {number} id - Identificador de l'usuari.
 * @property {string} name - Nom de l'usuari.
 * @property {string} surname_1 - Primer cognom de l'usuari.
 * @property {string} surname_2 - Segon cognom de l'usuari.
 * @property {string} email - Correu electrònic de l'usuari.
 * @property {string} telephone - Telèfon de l'usuari.
 */

/**
 * Obté un usuari pel seu email.
 * @async
 * @function
 * @name getUserByEmail
 * @memberof module:controllers/userController
 * @param {Object} req - Objecte de la petició HTTP.
 * @param {Object} res - Objecte de la resposta HTTP.
 * @returns {Promise<void>} Retorna l'usuari amb èxit o un error en cas contrari.
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
 * Crea un nou usuari.
 * @async
 * @function
 * @name createUser
 * @memberof module:controllers/userController
 * @param {Object} req - Objecte de la petició HTTP.
 * @param {Object} res - Objecte de la resposta HTTP.
 * @returns {Promise<void>} Retorna l'usuari creat amb èxit o un error en cas contrari.
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
 * Actualitza un usuari existent.
 * @async
 * @function
 * @name updateUser
 * @memberof module:controllers/userController
 * @param {Object} req - Objecte de la petició HTTP.
 * @param {Object} res - Objecte de la resposta HTTP.
 * @returns {Promise<void>} Retorna l'usuari actualitzat amb èxit o un error en cas contrari.
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
 * Elimina un usuari pel seu email.
 * @async
 * @function
 * @name deleteUser
 * @memberof module:controllers/userController
 * @param {Object} req - Objecte de la petició HTTP.
 * @param {Object} res - Objecte de la resposta HTTP.
 * @returns {Promise<void>} Retorna una resposta sense contingut si l'usuari s'ha eliminat correctament.
 */
export const deleteUser = async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'El paràmetre email és obligatori' });
    }

    try {
        const result = await userService.deleteUser(email);
        if (!result) {
            return res.status(404).json({ message: 'No s\'ha trobat cap usuari' });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export default { getUserByEmail, createUser, updateUser, deleteUser };
