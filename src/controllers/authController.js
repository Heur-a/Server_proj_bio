import { authenticateUser, blacklistToken, verifyToken } from '../services/authService.js'; // Importem authService
import { createUser } from '../services/userService.js'; // Utilitzem el servei per crear l'usuari

/**
 * @brief Registra un nou usuari.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 * @returns {json} Missatge d'èxit o d'error.
 */
export const register = async (req, res) => {
    try {
        const newUser = req.body;
        const createdUser = await createUser(newUser);
        const email = createdUser.email;

        res.status(201).json({ message: 'User registered successfully', user_email: email  });
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

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Retorna les dades de l'usuari si el token és vàlid
    res.status(200).json({ message: 'User is authenticated', user: decoded });
};
