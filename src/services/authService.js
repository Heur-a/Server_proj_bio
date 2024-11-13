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
 * @param {object} session - Express session.
 * @returns {Promise<string>} A success or error message.
 */
export const logoutUser = (session) => {
    //check if session exists
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

    //todo: Mirar si correo esta verificado


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
    //Hacer que la contraseña tenga al menos 6 caracteres, 1 mayúscula, 1 minúscula y 1 número

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordPattern.test(newUser.password)) {
        throw new HttpError(400, 'Password must have at least 6 characters, 1 uppercase, 1 lowercase and 1 number');
    }


    const userExists = await getUserByEmail(newUser.email);
    if (userExists) {
        throw new HttpError(409, 'User already exists');
    }

    //add the user type to the newUser object
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



//todo: Añadir correo para verificar a bbdd

// Crear numero aleatorio de 6 digitos, hacer un hash
// Crear el campo de correo con el email y el hash
// Enviar el correo con el digito

export const sendVerificationEmail = async (email) => {
    // Generate random 6-digit number
    let randomCode;
    for (let i = 0; i < 6; i++) {
        randomCode += Math.floor(Math.random() * 10) * Math.pow(10, i);
    }
    const hashedCode = await bcrypt.hash(randomCode.toString(), 10);
    // Configure nodemailer
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

    //Send email
    await transporter.sendMail(emailData, async (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            throw new HttpError(500, 'Error sending email');
        } else {
            console.log('Email sent:', info.response);

            //Store email, hashed code on db
            try {
                await addEmailVerification(email, hashedCode);
            } catch (error) {
                throw new HttpError(500, 'Failed to add email verification');
            }
        }
    });
}

//todo: Verificar el correo

//Sacar el digito
//Mirar si el digito es válido
// Mirar si el digito es el mismo que el de la bbdd comprando el hash
// Si es válido, seguimos 200 OK
// Si no es válido, 400 Bad Request

export const verifyEmail = async (email, code) => {
    // Get hashed code from db
    const emailVerification = await getEmailVerification(email);
    if (!emailVerification) {
        throw new HttpError(400, 'Email not found');
    }

    const isMatch = await bcrypt.compare(code, emailVerification.code);
    if (!isMatch) {
        throw new HttpError(400, 'Invalid code');
    }
}

//todo: resetear la contraseña

//todo: enviar correo contraseña nueva


const addEmailVerification = async (email, hashedCode) => {
    try {
        const sql = await readFile('./src/sql/addEmailVerification.sql', 'utf-8');
        await pool.query(sql, [email, hashedCode]);
    } catch (error) {
        throw new HttpError(500, 'Failed to add email verification');
    }
}

const getEmailVerification = async (email) => {
    try {
        const sql = await readFile('./src/sql/getEmailVerification.sql', 'utf-8');
        const result = await pool.query(sql, [email]);
        return result[0];
    } catch (error) {
        throw new HttpError(500, 'Failed to get email verification');
    }
}

