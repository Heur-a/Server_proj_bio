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
jest.mock('../components/HttpErrorClass', () => {
    return {
        HttpError: jest.fn().mockImplementation((statusCode, message) => {
            const error = new Error(message);
            error.statusCode = statusCode || 500;
            error.name = 'HttpError';
            return error;
        })
    };
});
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

            expect.assertions(1);

            // Act & Assert
            await expect(loginUser(email, password, session)).rejects.toThrow(
                new HttpError(404, 'User not found')
            );
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
            await expect(loginUser(email, password, session)).rejects.toThrow(
                new HttpError(400, 'Invalid credentials')
            );
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
            await expect(logoutUser(null)).rejects.toThrow(
                new HttpError(500, 'No session found')
            );
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
            await expect(registerUser(newUser)).rejects.toThrow(
                expect.objectContaining({
                    statusCode: 400,
                    message: expect.any(String)  // This allows any string for the message
                })
            );
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
            await expect(registerUser(newUser)).rejects.toThrow(
                new HttpError(400, 'User already exists')
            );
        });
    });

    describe('sendVerificationEmail', () => {
        it('should send verification email', async () => {
            // Mock `addEmailVerification`
            const mockAddEmailVerification = jest.fn().mockResolvedValue();
            jest.mock('../services/authService', () => ({
                ...jest.requireActual('../services/authService'),
                addEmailVerification: mockAddEmailVerification
            }));

            // Arrange
            const email = 'test@example.com';
            const transporter = { sendMail: jest.fn().mockResolvedValue(true) };
            nodemailer.createTransport.mockReturnValue(transporter);
            bcrypt.hash.mockResolvedValue('hashedCode');

            // Act
            await sendVerificationEmail(email);

            // Assert
            expect(mockAddEmailVerification).toHaveBeenCalledWith(email, 'hashedCode');
            expect(transporter.sendMail).toHaveBeenCalled();
            
        });

        it('should throw error if email is invalid', async () => {
            // Arrange
            const email = 'invalid-email';

            // Act & Assert
            await expect(sendVerificationEmail(email)).rejects.toThrow(
                new HttpError(400, 'Invalid email')
            );
        });
    });

    describe('validateEmailCode', () => {
        it('should validate email code successfully', async () => {
            // Mock `getEmailVerification` for this test
            const mockGetEmailVerification = jest.fn().mockResolvedValue(new emailValidated(1,'test@example.com', 'hashedCode', false));
            jest.mock('../services/authService', () => ({
                ...jest.requireActual('../services/authService'),
                getEmailVerification: mockGetEmailVerification
            }));

            // Mock `makeEmailValid`
            const mockmakeEmailValid = jest.fn().mockResolvedValue();
            jest.mock('../components/emailValidatedClass', () => {
                return {
                    emailValidated: mockmakeEmailValid
                };
            });

            // Arrange
            const email = 'test@example.com';
            const code = '123456';
            bcrypt.compare.mockResolvedValue(true);

            // Act
            await validateEmailCode(email, code);

            expect.assertions(2);

            // Assert
            expect(mockmakeEmailValid).toHaveBeenCalledWith(email);
            expect(mockGetEmailVerification).toHaveBeenCalledWith(email);
        });

        it('should throw error if code is invalid', async () => {
            // Mock `getEmailVerification` for this test
            const mockGetEmailVerification = jest.fn().mockResolvedValue({ hashedCode: 'hashedCode' });
            jest.mock('../services/authService', () => ({
                ...jest.requireActual('../services/authService'),
                getEmailVerification: mockGetEmailVerification
            }));

            // Arrange
            const email = 'test@example.com';
            const code = 'wrongCode';
            bcrypt.compare.mockResolvedValue(false);

            // Act & Assert
            await expect(validateEmailCode(email, code)).rejects.toThrow(
                new HttpError(400, 'Failed to verify email')
            );
        });
    });

    describe('sendNewPasswordEmail', () => {
        it('should send new password email', async () => {
            // Mock `changePassword`
            const mockChangePassword = jest.fn().mockResolvedValue();
            jest.mock('../services/authService', () => ({
                ...jest.requireActual('../services/authService'),
                changePassword: mockChangePassword
            }));

            // Arrange
            const email = 'test@example.com';
            const user = { id: 1, email };
            const transporter = { sendMail: jest.fn().mockResolvedValue(true) };
            nodemailer.createTransport.mockReturnValue(transporter);
            getUserByEmail.mockResolvedValue(user);

            // Act
            await sendNewPasswordEmail(email);

            // Assert
            expect(transporter.sendMail).toHaveBeenCalled();
            expect(mockChangePassword).toHaveBeenCalledWith(user.id);
        });
    });
});
