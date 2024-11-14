import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserPasswordById, createUser } from './userService.js';
import { config } from 'dotenv';
import session from 'express-session';
import { HttpError } from '../components/HttpErrorClass.js';
import nodemailer from 'nodemailer';
import { readFile } from 'fs/promises';
import pool from '../config/db_conection.js';
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
 * @async
 * @function
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {object} session - User's session.
 * @returns {Promise<object>} The updated session object if authentication is successful.
 * @throws {HttpError} Throws an error if the user is not found or credentials are invalid.
 */
const loginUser = async (email, password, session) => {
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        const res = await getUserPasswordById(user.id);
        const isMatch = await bcrypt.compare(password, res.password);
        if (!isMatch) {
            throw new HttpError(400, 'Invalid credentials');
        }

        // Store user in session
        session.user = { id: user.id, email: user.email };
        console.log('User is now logged in', session.user);
        return session;
    } catch (error) {
        throw new HttpError(error.statusCode, error.message);
    }
};

/**
 * @brief Logs out the user.
 * @function
 * @param {object} session - Express session.
 * @returns {Promise<string>} A success message if logout is successful.
 * @throws {HttpError} Throws an error if no session is found or logout fails.
 */
const logoutUser = (session) => {
    // Check if session exists
    if (!session) {
        return new Promise((resolve, reject) => {
            reject(new HttpError(401, 'No session found'));
        });
    }
    return new Promise((resolve, reject) => {
        session.destroy((err) => {
            if (err) {
                reject(new HttpError(500, 'Could not log out'));
            }
            resolve('Logged out successfully');
        });
    });
};

/**
 * @brief Checks if the user is already authenticated.
 * @function
 * @param {object} session - Express session.
 * @returns {object|boolean} Returns the user if authenticated or false if not.
 */
const isAuthenticated = (session) => {
    return session.user || false;
};

/**
 * @brief Registers a new user in the database.
 * @async
 * @function
 * @param {object} newUser - Object containing new user data.
 * @returns {Promise<object>} Returns the user session if registration is successful.
 * @throws {HttpError} Throws an error if user data is invalid or user already exists.
 */
const registerUser = async (newUser) => {
    // User validations
    if (!newUser.name || !newUser.surname_1 || !newUser.surname_2 || !newUser.email || !newUser.telephone || !newUser.password) {
        throw new HttpError(400, 'All fields are required');
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(newUser.email)) {
        throw new HttpError(400, 'Invalid email');
    }

    const telephoneRegex = /^[679]\d{8}$/;
    if (!telephoneRegex.test(newUser.telephone)) {
        throw new HttpError(400, 'Invalid telephone');
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordPattern.test(newUser.password)) {
        throw new HttpError(400, 'Password must have at least 6 characters, 1 uppercase, 1 lowercase and 1 number');
    }

    const userExists = await getUserByEmail(newUser.email);
    if (userExists) {
        throw new HttpError(409, 'User already exists');
    }

    // Add the user type to the newUser object
    newUser.userTypeId = 2;

    try {
        const createdUser = await createUser(newUser);
        session.user = { id: createdUser.id, email: createdUser.email };
        return session;
    } catch (error) {
        throw new HttpError(500, error.message);
    }
};

/**
 * @brief Middleware to verify user identity.
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @returns {void} Calls next middleware if authenticated, otherwise sends a 401 response.
 */
const verifyIdentity = (req, res, next) => {
    if (req.session.user) {
        console.log('User is authenticated');
        next(); // User is authenticated, proceed to the next middleware
    } else {
        res.status(401).json({ message: 'Unauthorized access' }); // User is not authenticated
    }
};

/**
 * @brief Sends email for verifying email using JWT and Nodemailer.
 * @async
 * @function
 * @param {string} email - The email address to send the verification code to.
 * @returns {Promise<void>} Sends a verification email to the user.
 * @throws {HttpError} Throws an error if sending the email fails.
 */
const sendVerificationEmail = async (email) => {
    // Generate random 6-digit number
    let randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(randomCode, 10);

    console.log('SendVerificationEmail:', email);
    console.log('Verification code:', randomCode);
    console.log('Hashed code:', hashedCode);
    console.log('Email user:', process.env.EMAIL_USER);
    console.log('Email pass:', process.env.EMAIL_PASS);
    
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Create email
    const emailData = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Ozone - Email Verification',
        text: `Your verification code is: ${randomCode}`,
    };

    // Add email verification to the database, if successful send mail
    try {
        await addEmailVerification(email, hashedCode);
        await transporter.sendMail(emailData);
    } catch (error) {
        // If error caused by sendMail, try again, max 3 times
        if (error.code === 'ECONNECTION') {
            for (let i = 0; i < 3; i++) {
                try {
                    await transporter.sendMail(emailData);
                    break;
                } catch (error) {
                    console.log('Error sending email:', error);
                }
            }
        }
        console.log('Error sending email:', error);
        throw new HttpError(500, 'Failed to send verification email');
    }
};

/**
 * @brief Verifies the user's email using the provided code.
 * @async
 * @function
 * @param {string} email - The email address of the user.
 * @param {string} code - The verification code sent to the user.
 * @returns {Promise<void>} Verifies the email code and updates the user's status.
 * @throws {HttpError} Throws an error if the email is not found or the code is invalid.
 */
const verifyEmail = async (email, code) => {
    // Get hashed code from the database
    const emailVerification = await getEmailVerification(email);
    if (!emailVerification) {
        throw new HttpError(400, 'Email not found');
    }

    const isMatch = await bcrypt.compare(code, emailVerification.code);
    if (!isMatch) {
        throw new HttpError(400, 'Invalid code');
    }
};

/**
 * @brief Resets the user's password.
 * @async
 * @function
 * @param {string} email - The email address of the user.
 * @param {string} password - The new password for the user.
 * @returns {Promise<void>} Updates the user's password in the database.
 * @throws {HttpError} Throws an error if the password change fails.
 */
const changePassword = async (email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE Users SET password = ? WHERE mail = ?', [hashedPassword, email]);
    } catch (error) {
        throw new HttpError(500, 'Failed to change password');
    }
};

/**
 * @brief Sends a new password to the user's email.
 * @async
 * @function
 * @param {string} email - The email address of the user.
 * @returns {Promise<void>} Sends an email with the new password to the user.
 * @throws {HttpError} Throws an error if sending the email fails.
 */
 const sendNewPasswordEmail = async (email) => {
    // Generate random 8-character password
    let randomPassword = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
        randomPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Create email
    const emailData = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Ozone - New Password',
        text: `Your new password is: ${randomPassword}`,
    };

    // Change password, if successful send mail
    try {
        await changePassword(email, randomPassword);
        await transporter.sendMail(emailData);
    } catch (error) {
        // If error caused by sendMail, try again, max 3 times
        if (error.code === 'ECONNECTION') {
            for (let i = 0; i < 3; i++) {
                try {
                    await transporter.sendMail(emailData);
                    break;
                } catch (error) {
                    console.log('Error sending email:', error);
                }
            }
        }
        throw new HttpError(500, 'Failed to send new password email');
    }
};

/**
 * @brief Adds email verification details to the database.
 * @async
 * @function
 * @param {string} email - The email address of the user.
 * @param {string} hashedCode - The hashed verification code.
 * @returns {Promise<void>} Adds the email verification to the database.
 * @throws {HttpError} Throws an error if adding verification fails.
 */
const addEmailVerification = async (email, hashedCode) => {
    try {
        const sql = await readFile('./src/sql/addEmailVerification.sql', 'utf-8');
        await pool.query(sql, [email, hashedCode]);
    } catch (error) {
        throw new HttpError(500, error.message);
    }
};

/**
 * @brief Retrieves email verification details from the database.
 * @async
 * @function
 * @param {string} email - The email address of the user.
 * @returns {Promise<Object>} Returns the email verification details.
 * @throws {HttpError} Throws an error if retrieving verification fails.
 */
const getEmailVerification = async (email) => {
    try {
        const sql = await readFile('./src/sql/getEmailVerification.sql', 'utf-8');
        const result = await pool.query(sql, [email]);
        return result[0];
    } catch (error) {
        throw new HttpError(500, 'Failed to get email verification');
    }
};

export {
    loginUser,
    logoutUser,
    isAuthenticated,
    registerUser,
    verifyIdentity,
    sendVerificationEmail,
    verifyEmail,
    sendNewPasswordEmail,
    addEmailVerification,
    getEmailVerification
};
