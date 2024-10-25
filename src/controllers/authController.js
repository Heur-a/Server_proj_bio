import { loginUser, logoutUser, isAuthenticated, registerUser } from '../services/authService.js';

/**
 * @brief Registra un nou usuari.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 */
export const register = async (req, res) => {
    try {
        res.session = await registerUser(req.body);
        res.redirect(200,'/user/user-profile.html');
    } catch (error) {
        res.status(error.statusCode).json({ message: error.message });
    }
};

/**
 * @brief Inicia sessió d'un usuari.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 */
export const login = async (req, res) => {
    try {
        res.session = await loginUser(req.body.email, req.body.password, req.session);
        res.redirect(200,'/user/user-profile.html');
    } catch (error) {
        res.status(error.statusCode).json({ message: error.message });
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
        res.redirect(201,'/index.html');
    } catch (error) {
        res.status(error.statusCode).json({ message: error.message });
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

    res.status(error.statusCode).json({ message: 'User is authenticated', user });
};
