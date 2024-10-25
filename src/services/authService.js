import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserPasswordById, createUser } from './userService.js';
import { config } from 'dotenv';
import session from 'express-session';

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
            throw new Error('User not found');
        }

        const res = await getUserPasswordById(user.id);
        const isMatch = await bcrypt.compare(password, res.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Store user in session
        session.user = { id: user.id, email: user.email };
        return 'Logged in successfully';
    } catch (error) {
        throw new Error(error.message);
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
            reject(new Error('No session found'));
        });
    }
    return new Promise((resolve, reject) => {
        session.destroy((err) => {
            if (err) {
                reject(new Error('Could not log out'));
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
 * @returns {Promise<string>} Success message.
 */
export const registerUser = async (newUser) => {
    // User validations
    if (!newUser.name || !newUser.surname_1 || !newUser.surname_2 || !newUser.email || !newUser.telephone || !newUser.password) {
        throw new Error('All fields are required');
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(newUser.email)) {
        throw new Error('Invalid email');
    }

    const telephoneRegex = /^[679]\d{8}$/;
    if (!telephoneRegex.test(newUser.telephone)) {
        throw new Error('Invalid telephone');
    }

    if (newUser.password.length < 6) {
        throw new Error('Password must have at least 6 characters');
    }

    newUser.userTypeId = 2;

    const userExists = await getUserByEmail(newUser.email);
    if (userExists) {
        throw new Error('User already exists');
    }

    await createUser(newUser);
    return 'User registered successfully';
};

/**
 * @brief Middleware to verify user identity.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 */
export const verifyIdentity = (req, res, next) => {
    if (req.session.user) {
        next(); // User is authenticated, proceed to the next middleware
    } else {
        res.status(401).json({ message: 'Unauthorized access' }); // User is not authenticated
    }
};
