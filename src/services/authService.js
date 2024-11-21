import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserPasswordById, createUser } from './userService.js';
import { config } from 'dotenv';
import session from 'express-session';
import { HttpError } from '../components/HttpErrorClass.js';
import nodemailer from 'nodemailer';
import { readFile } from 'fs/promises';
import pool from '../config/db_conection.js';
import { emailValidated } from '../components/emailValidatedClass.js';
import { updateUser } from '../controllers/userController.js';
import { UserUpdate } from '../components/userClass.js';
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

    //check if email has been verified
    const emailVerified = await isEmailVerified(newUser.email);
    if (!emailVerified) {
        throw new HttpError(400, 'Email not verified');
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
    console.log('User request: ', req)
    if (req.session.user) {
        console.log('User is authenticated');
        next(); // User is authenticated, proceed to the next middleware
    } else {
        res.status(401).json({ message: 'Unauthorized access' }); // User is not authenticated
    }
};

const updateUserData = async (user) => {
    try {

        //mirar si user es un objeto UserUpdate
        if (!(user instanceof UserUpdate)) {
            throw new HttpError(400, 'Invalid user object');
        }

        //mirar si el id del usuario no es null
        if (!user.id) {
            throw new HttpError(400, 'Invalid user id');
        }

        //mirar si el id del usuario es un número
        if (typeof user.id !== 'number') {
            throw new HttpError(400, 'Invalid user id');
        }

        //mirar si el id del usuario es mayor que 0
        if (user.id <= 0) {
            throw new HttpError(400, 'Invalid user id');
        }

        //mirar si el id del usuario existe
        if (!(await getUserById(user.id))) {
            throw new HttpError(404, 'User not found');
        }

        await updateUser(user);
    } catch (error) {

        // Detailed logging to debug issues with email verification
        console.error('Error in verifyEmail function:', error);

        // Check for specific error cases and throw meaningful HttpError
        if (error instanceof HttpError) {
            // Re-throw known errors as-is, preserving status and message
            throw error;
        } else {
            // For other errors, respond with a generic server error message
            throw new HttpError(500, 'Failed to verify email');
        }

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

    //check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        throw new HttpError(400, 'Invalid email');
    }

    const emailVerified = await isEmailVerified(email);
    if (emailVerified) {
        throw new HttpError(400, 'Email already verified');
    }

    // Generate random 6-digit number
    let randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(randomCode, 10);

    console.log('SendVerificationEmail:', email);
    console.log('Verification code:', randomCode);
    console.log('Hashed code:', hashedCode);
    console.log('Email user:', process.env.EMAIL_USER);
    console.log('Email pass:', process.env.EMAIL_PASS);
    console.log('\r\n');

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
const validateEmailCode = async (email, code) => {
    try {
        // Retrieve the hashed code for email verification from the database
        const emailVerification = await getEmailVerification(email);

        // If no email verification data found, throw an error for "Email not found"
        if (!emailVerification || typeof emailVerification === 'undefined') {
            throw new HttpError(400, 'Email not found');
        }

        console.log('authService.verifyEmail:');
        console.log('Code:', code);
        console.log('Email verification:', emailVerification);
        // Compare the provided code with the hashed code from the database
        const isMatch = await bcrypt.compare(code, emailVerification.hashedCode);
        if (!isMatch) {
            throw new HttpError(400, 'Invalid code'); // Error for invalid code
        }

        // If code matches, mark the email as valid in the database
        await makeEmailValid(email);

    } catch (error) {
        // Detailed logging to debug issues with email verification
        console.error('Error in verifyEmail function:', error);

        // Check for specific error cases and throw meaningful HttpError
        if (error instanceof HttpError) {
            // Re-throw known errors as-is, preserving status and message
            throw error;
        } else {
            // For other errors, respond with a generic server error message
            throw new HttpError(500, 'Failed to verify email');
        }
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
    //Check if user w/ email exists
    const user = await getUserByEmail(email);
    if (!user) {
        throw new HttpError(404, 'User not found');
    }

    // Generate random password
    const randomPassword = generateRandomPassword();

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
        const [result] = await pool.query(sql, [email]);
        console.log('getEmailVerification:', result);
        if (result.length) {
            const row = result[0];
            return new emailValidated(row.idEmailValidated, row.email, row.code, row.isValidated);
        }

    } catch (error) {
        throw new HttpError(500, 'Failed to get email verification');
    }
};

const makeEmailValid = async (email) => {
    try {
        const sql = await readFile('./src/sql/makeEmailValid.sql', 'utf-8');
        await pool.query(sql, [email]);
    } catch (error) {
        throw new HttpError(500, 'Failed to make email valid');
    }
}

const isEmailVerified = async (email) => {
    try {
        const emailVerifiedRow = await getEmailVerification(email);
        return emailVerifiedRow.isValidated;
    } catch (error) {
        throw new HttpError(500, 'Failed to check email verification');
    }
}

const generateRandomPassword = () => {
    const getRandomChar = (charSet) =>
        charSet[Math.floor(Math.random() * charSet.length)];

    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";

    // Assegurem un caràcter de cada tipus requerit
    const mandatoryChars = [
        getRandomChar(lowerCaseChars),
        getRandomChar(upperCaseChars),
        getRandomChar(numberChars),
    ];

    // Omplim la resta amb caràcters aleatoris de l'alfabet i números
    const allChars = lowerCaseChars + upperCaseChars + numberChars;
    while (mandatoryChars.length < 8) {
        mandatoryChars.push(getRandomChar(allChars));
    }

    // Barregem els caràcters per evitar un patró previsible
    for (let i = mandatoryChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mandatoryChars[i], mandatoryChars[j]] = [mandatoryChars[j], mandatoryChars[i]];
    }

    // Convertim l'array a cadena i la retornem
    return mandatoryChars.join("");
};

console.log(generateRandomPassword());




export {
    loginUser,
    logoutUser,
    isAuthenticated,
    registerUser,
    verifyIdentity,
    sendVerificationEmail,
    validateEmailCode,
    sendNewPasswordEmail,
    addEmailVerification,
    getEmailVerification,
    makeEmailValid,
    isEmailVerified,
    changePassword
};
