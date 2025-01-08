import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { loginUser, logoutUser, isAuthenticated, registerUser, verifyIdentity, sendVerificationEmail, validateEmailCode, sendNewPasswordEmail, addEmailVerification, getEmailVerification, makeEmailValid, isEmailVerified, changePassword } from './authService';
import { getUserByEmail, getUserPasswordById, createUser } from './userService';
import pool from '../config/db_conection';
import { HttpError } from '../components/HttpErrorClass';
import { emailValidated } from '../components/emailValidatedClass';

jest.mock('bcryptjs');
jest.mock('nodemailer');
jest.mock('./userService');
jest.mock('../config/db_conection');
jest.mock('../components/HttpErrorClass');
jest.mock('../components/emailValidatedClass');

describe('authService', () => {
    let session;

    beforeEach(() => {
        session = { user: null, destroy: jest.fn((callback) => callback()) };
    });

    describe('loginUser', () => {
        it('should authenticate user and save session on valid credentials', async () => {
            // Arrange
            const email = 'test@example.com';
            const password = 'Password123';
            const user = { id: 1, email };
            const userPassword = { password: 'hashedPassword' };

            getUserByEmail.mockResolvedValue(user);
            getUserPasswordById.mockResolvedValue(userPassword);
            bcrypt.compare.mockResolvedValue(true);

            // Act
            const result = await loginUser(email, password, session);

            // Assert
            expect(result.user).toEqual({ id: user.id, email: user.email });
        });

        it('should throw error if user not found', async () => {
            // Arrange
            const email = 'nonexistent@example.com';
            const password = 'Password123';

            getUserByEmail.mockResolvedValue(null);

            // Act & Assert
            await expect(loginUser(email, password, session)).rejects.toThrow(HttpError);
        });

        it('should throw error on invalid credentials', async () => {
            // Arrange
            const email = 'test@example.com';
            const password = 'WrongPassword';
            const user = { id: 1, email };
            const userPassword = { password: 'hashedPassword' };

            getUserByEmail.mockResolvedValue(user);
            getUserPasswordById.mockResolvedValue(userPassword);
            bcrypt.compare.mockResolvedValue(false);

            // Act & Assert
            await expect(loginUser(email, password, session)).rejects.toThrow(HttpError);
        });
    });

    describe('logoutUser', () => {
        it('should destroy session and return success message', async () => {
            // Act
            const result = await logoutUser(session);

            // Assert
            expect(result).toBe('Logged out successfully');
            expect(session.destroy).toHaveBeenCalled();
        });

        it('should throw error if no session found', async () => {
            // Act & Assert
            await expect(logoutUser(null)).rejects.toThrow(HttpError);
        });
    });

    describe('isAuthenticated', () => {
        it('should return user if authenticated', () => {
            // Arrange
            session.user = { id: 1, email: 'test@example.com' };

            // Act
            const result = isAuthenticated(session);

            // Assert
            expect(result).toEqual(session.user);
        });

        it('should return false if not authenticated', () => {
            // Act
            const result = isAuthenticated(session);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('registerUser', () => {
        it('should register a new user and return session', async () => {
            // Arrange
            const newUser = {
                name: 'John',
                surname_1: 'Doe',
                surname_2: 'Smith',
                email: 'john.doe@example.com',
                telephone: '612345678',
                password: 'Password123'
            };
            const createdUser = { id: 1, email: newUser.email };

            getUserByEmail.mockResolvedValue(null);
            createUser.mockResolvedValue(createdUser);

            // Act
            const result = await registerUser(newUser);

            // Assert
            expect(result.user).toEqual({ id: createdUser.id, email: createdUser.email });
        });

        it('should throw error if user data is invalid', async () => {
            // Arrange
            const newUser = {
                name: '',
                surname_1: 'Doe',
                surname_2: 'Smith',
                email: 'john.doe@example.com',
                telephone: '612345678',
                password: 'Password123'
            };

            // Act & Assert
            await expect(registerUser(newUser)).rejects.toThrow(HttpError);
        });

        it('should throw error if user already exists', async () => {
            // Arrange
            const newUser = {
                name: 'John',
                surname_1: 'Doe',
                surname_2: 'Smith',
                email: 'john.doe@example.com',
                telephone: '612345678',
                password: 'Password123'
            };

            getUserByEmail.mockResolvedValue({ id: 1 });

            // Act & Assert
            await expect(registerUser(newUser)).rejects.toThrow(HttpError);
        });
    });

    describe('sendVerificationEmail', () => {
        it('should send verification email', async () => {
            // Arrange
            const email = 'test@example.com';
            const transporter = { sendMail: jest.fn().mockResolvedValue(true) };
            nodemailer.createTransport.mockReturnValue(transporter);
            bcrypt.hash.mockResolvedValue('hashedCode');
            addEmailVerification.mockResolvedValue();

            // Act
            await sendVerificationEmail(email);

            // Assert
            expect(transporter.sendMail).toHaveBeenCalled();
        });

        it('should throw error if email is invalid', async () => {
            // Arrange
            const email = 'invalid-email';

            // Act & Assert
            await expect(sendVerificationEmail(email)).rejects.toThrow(HttpError);
        });
    });

    describe('validateEmailCode', () => {
        it('should validate email code successfully', async () => {
            // Arrange
            const email = 'test@example.com';
            const code = '123456';
            const emailVerification = { hashedCode: 'hashedCode' };

            getEmailVerification.mockResolvedValue(emailVerification);
            bcrypt.compare.mockResolvedValue(true);
            makeEmailValid.mockResolvedValue();

            // Act
            await validateEmailCode(email, code);

            // Assert
            expect(makeEmailValid).toHaveBeenCalledWith(email);
        });

        it('should throw error if code is invalid', async () => {
            // Arrange
            const email = 'test@example.com';
            const code = 'wrongCode';
            const emailVerification = { hashedCode: 'hashedCode' };

            getEmailVerification.mockResolvedValue(emailVerification);
            bcrypt.compare.mockResolvedValue(false);

            // Act & Assert
            await expect(validateEmailCode(email, code)).rejects.toThrow(HttpError);
        });
    });

    describe('sendNewPasswordEmail', () => {
        it('should send new password email', async () => {
            // Arrange
            const email = 'test@example.com';
            const user = { id: 1, email };
            const transporter = { sendMail: jest.fn().mockResolvedValue(true) };
            nodemailer.createTransport.mockReturnValue(transporter);
            getUserByEmail.mockResolvedValue(user);
            changePassword.mockResolvedValue();

            // Act
            await sendNewPasswordEmail(email);

            // Assert
            expect(transporter.sendMail).toHaveBeenCalled();
        });

        it('should throw error if user not found', async () => {
            // Arrange
            const email = 'nonexistent@example.com';

            getUserByEmail.mockResolvedValue(null);

            // Act & Assert
            await expect(sendNewPasswordEmail(email)).rejects.toThrow(HttpError);
        });
    });

    describe('changePassword', () => {
        it('should change user password', async () => {
            // Arrange
            const email = 'test@example.com';
            const password = 'NewPassword123';
            bcrypt.hash.mockResolvedValue('hashedPassword');
            pool.query.mockResolvedValue();

            // Act
            await changePassword(email, password);

            // Assert
            expect(pool.query).toHaveBeenCalledWith('UPDATE Users SET password = ? WHERE mail = ?', ['hashedPassword', email]);
        });
    });
});
