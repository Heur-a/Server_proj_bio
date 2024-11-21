import { loginUser, logoutUser, isAuthenticated, registerUser, sendVerificationEmail, sendNewPasswordEmail, validateEmailCode } from '../services/authService.js';

/**
 * @brief Registra un nou usuari.
 * @param {object} req - Objecte de sol·licitud d'Express.
 * @param {object} res - Objecte de resposta d'Express.
 */
export const register = async (req, res) => {
    try {
        req.session = await registerUser(req.body, req.session);
        console.log('User registered successfully');
        console.log(req.session);
        console.log('Redirecting to user-profile.html');
        res.status(201).redirect('/user/user-profile.html');
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
        req.session = await loginUser(req.body.email, req.body.password, req.session);
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

    res.status(200).json({ message: 'User is authenticated', user });
};


export const handleEmailVerification = async (req, res) => {
    //Llamar a la función verifyEmail del servicio authService
    try {
        await sendVerificationEmail(req.query.email);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        //todo: change to dinamyc when everything works
        res.status(500).json({ message: error.message });
    }
}

export const handleMakeEmailVerified = async (req, res) => {
    //Call verifyEmail from authService
    try{
        await validateEmailCode(req.query.email, req.query.code);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const handleResetPassword = async (req, res) => {
    try {
        await sendNewPasswordEmail(req.query.email);
        res.status(200).json({ message: 'Password changed successfully, ' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
