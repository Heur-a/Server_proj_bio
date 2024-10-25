import { loginUser, logoutUser, isAuthenticated, registerUser } from '../services/authService.js';

/**
 * @brief Registra un nou usuari.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 */
export const register = async (req, res) => {
    try {
        const message = await registerUser(req.body);
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @brief Inicia sessió d'un usuari.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 */
export const login = async (req, res) => {
    try {
        const message = await loginUser(req.body.email, req.body.password, req.session);
        res.status(200).json({ message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @brief Tanca sessió d'un usuari.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 */
export const logout = async (req, res) => {
    try {
        const message = await logoutUser(req.session);
        res.clearCookie('connect.sid'); // Opcional: elimina la cookie de sessió
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @brief Comprova si l'usuari ja està autenticat.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 */
export const checkAuthentication = (req, res) => {
    const user = isAuthenticated(req.session);

    if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    res.status(200).json({ message: 'User is authenticated', user });
};
