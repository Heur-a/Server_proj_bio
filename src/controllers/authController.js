import { authenticateUser, blacklistToken, decodeToken } from '../services/authService.js'; // Importem authService
import { getUserByEmail,createUser } from '../services/userService.js'; // Utilitzem el servei per crear l'usuari
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

//ENUMERACIÓ DE TIPUS D'USUARIS
// 1: Admin
// 2: User
const userType = {
    ADMIN: 1,
    USER: 2
}
config();
const jwt_secret = process.env.JWT_SECRET;


/**
 * @brief Registra un nou usuari.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 * @returns {json} Missatge d'èxit o d'error.
 */
export const register = async (req, res) => {
    try {
        const newUser = req.body;
        //check every field is filled
        if (!newUser.name || !newUser.surname_1 || !newUser.surname_2 || !newUser.email || !newUser.telephone || !newUser.password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        //check email is valid
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(newUser.email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        //check telephone is valid
        const telephoneRegex = /^[679]\d{8}$/;
        if (!telephoneRegex.test(newUser.telephone)) {
            return res.status(400).json({ message: 'Invalid telephone' });
        }
        //check password is valid
        if (newUser.password.length < 6) {
            return res.status(400).json({ message: 'Password must have at least 6 characters' });
        }
        // add usertypeId
        newUser.userTypeId = 2;
        console.log("authController.register, newUser:",newUser);

        //check if user already exists
        const user = await getUserByEmail(newUser.email);
        if (user) {
            return res.status(409).message({ message: 'User already exists' });
        }


        const createdUser = await createUser(newUser);
        
        const token = jwt.sign({ id: createdUser.id, email: createdUser.email }, jwt_secret, {
            expiresIn: '90d', // Expira als 90 dies
        });

        const email = createdUser.email;
    

        res.status(201).json({ message: 'User registered successfully', token: token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @brief Inicia sessió d'un usuari.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 * @returns {json} Token JWT o missatge d'error.
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Autentica l'usuari utilitzant el servei
        const { token} = await authenticateUser(email, password);

        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @brief Tanca sessió d'un usuari afegint el token a la blacklist.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 * @returns {json} Missatge d'èxit.
 */
export const logout = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Suposa que és un token Bearer
        console.log("authController.logout, token:",token);

        // Afegeix el token a la blacklist utilitzant authService
        blacklistToken(token);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @brief Comprova si l'usuari ja està autenticat.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 * @returns {json} Dades de l'usuari si està autenticat, o missatge d'error.
 */
export const checkAuthentication = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Suposa que és un token Bearer

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = decodeToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Retorna les dades de l'usuari si el token és vàlid
    res.status(200).json({ message: 'User is authenticated', user: decoded });
};
