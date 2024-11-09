import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserPasswordById, createUser } from './userService.js';
import { config } from 'dotenv';
import session from 'express-session';
import { HttpError } from '../components/HttpErrorClass.js';
import jwt from 'jsonwebtoken';

// Load environment variables from .env file
config();

// Middleware for session configuration
export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET, // Secret key for signing the session ID
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 }, // 2 days
});

/**
 * @brief Authenticates a user with email and password, and saves the session.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {object} session - User's session.
 * @returns {Promise<string>} A success or error message.
 */
export const loginUser = async (email, password, session) => {
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new HttpError(404,'User not found');
        }

        const res = await getUserPasswordById(user.id);
        const isMatch = await bcrypt.compare(password, res.password);
        if (!isMatch) {
            throw new HttpError(400,'Invalid credentials');
        }

        // Store user in session
        session.user = { id: user.id, email: user.email };
        console.log('User is now logged in', session.user );
        return session;
    } catch (error) {
        throw new HttpError(error.statusCode, error.message);
    }
};

/**
 * @brief Logs out the user.
 * @param {object} session - Express session.
 * @returns {Promise<string>} A success or error message.
 */
export const logoutUser = (session) => {
    //check if session exists
    if (!session) {
        return new Promise((resolve, reject) => {
            reject(new HttpError(401,'No session found'));
        });
    }
    return new Promise((resolve, reject) => {
        session.destroy((err) => {
            if (err) {
                reject(new HttpError(500,'Could not log out'));
            }
            resolve('Logged out successfully');
        });
    });
};

/**
 * @brief Checks if the user is already authenticated.
 * @param {object} session - Express session.
 * @returns {object|boolean} Returns the user if authenticated or false if not.
 */
export const isAuthenticated = (session) => {
    return session.user || false;
};

/**
 * @brief Registers a new user in the database.
 * @param {object} newUser - Object with new user data.
 * @returns {session} user session to respond with
 */
//todo: Hacer que todos los errores 400, si hay mas de uno, se envien todos y no solo uno !!!
export const registerUser = async (newUser) => {

    // User validations
    if (!newUser.name || !newUser.surname_1 || !newUser.surname_2 || !newUser.email || !newUser.telephone || !newUser.password) {
        throw new HttpError(400,'All fields are required');
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(newUser.email)) {
        throw new HttpError(400,'Invalid email');
    }

    const telephoneRegex = /^[679]\d{8}$/;
    if (!telephoneRegex.test(newUser.telephone)) {
        throw new HttpError(400,'Invalid telephone');
    }
    //Hacer que la contraseña tenga al menos 6 caracteres, 1 mayúscula, 1 minúscula y 1 número

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordPattern.test(newUser.password)) {
        throw new HttpError(400,'Password must have at least 6 characters, 1 uppercase, 1 lowercase and 1 number');
    }


    const userExists = await getUserByEmail(newUser.email);
    if (userExists) {
        throw new HttpError(409,'User already exists');
    }

    //add the user type to the newUser object
    newUser.userTypeId = 2;

    try {
        const createdUser = await createUser(newUser);
        session.user = { id: createdUser.id, email: createdUser.email };
        return session;
    } catch (error) {
        throw new HttpError(500,error.message);
    }

    
};

/**
 * @brief Middleware to verify user identity.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 */
export const verifyIdentity = (req, res, next) => {
    if (req.session.user) {
        console.log('User is authenticated');
        next(); // User is authenticated, proceed to the next middleware
    } else {
        res.status(401).json({ message: 'Unauthorized access' }); // User is not authenticated
    }
};

/**
* @brief Sends email for verifying email using jwt and nodemailer.
* @param {object} req - Express request object.
* @param {object} res - Express response object.
* @param {function} next - Next middleware function.
*/



