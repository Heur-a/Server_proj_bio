import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUserPasswordById } from './userService.js'; // Importem el servei d'usuaris

const blacklistedTokens = [];
const jwt_secret = 'auth_token'
const createdToken = "";

/**
 * @brief Autentica un usuari comprovant les credencials.
 * @param {string} email - Correu electrònic de l'usuari.
 * @param {string} password - Contrasenya de l'usuari.
 * @returns {Promise<Object>} Un objecte que conté el token JWT i les dades de l'usuari o un missatge d'error.
 */
export const authenticateUser = async (email, password) => {
    try {
        // Troba l'usuari pel correu utilitzant el servei
        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        // Obtenir la contrasenya de l'usuari
        const res =  await getUserPasswordById(user.id);
        console.log("authService.authenticateUser, res:",res);
        user.password = res.password;

        console.log("authService.authenticateUser, user:",user);

        // Compara les contrasenyes
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        

        // Genera el token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, jwt_secret, {
            expiresIn: '90d', // Expira als 90 dies
        });



        return { token, user };
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @brief Comprova si el token JWT és vàlid.
 * @param {string} token - El token JWT a comprovar.
 * @returns {Object|boolean} Les dades del token si és vàlid o false si no ho és.
 */
export const verifyToken = (token) => {
    try {
        console.log("authService.verifyToken, token:",token);
        console.log("authService.verifyToken, createdToken:",createdToken);
        console.log("authService.verifyToken, blacklistedTokens:",blacklistedTokens);
        // Comprova si el token ha estat posat en la blacklist
        if (blacklistedTokens.includes(token)) {
            throw new Error('Token has been blacklisted');
        }

        // Verifica i decodifica el token
        const decoded = jwt.verify(token, jwt_secret);
        console.log("authService.verifyToken, decoded:",decoded);
        return decoded;
    } catch (error) {
        console.log("authService.verifyToken, error:",error);
        return false;
    }
};

/**
 * @brief Afegeix el token a la blacklist per evitar el seu ús posterior.
 * @param {string} token - El token JWT a posar en la blacklist.
 * @returns {void}
 */
export const blacklistToken = (token) => {
    blacklistedTokens.push(token);
};

