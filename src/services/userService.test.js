import { readFile } from 'fs/promises';
import pool from '../config/db_conection.js';
import bcrypt from 'bcrypt';
import { getUserByEmail, getUserById, createUser, updateUser, deleteUser, getUserPasswordById, checkUserExists, checkUserExistsById } from './userService.js';

jest.mock('fs/promises');
jest.mock('../config/db_conection.js');
jest.mock('bcrypt');

describe('User Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getUserByEmail - happy path', async () => {
        // Arrange
        const email = 'test@example.com';
        const sql = 'SELECT * FROM users WHERE email = ?';
        const mockUser = {
            idUsers: 1,
            name: 'John',
            lastName1: 'Doe',
            lastName2: 'Smith',
            mail: email,
            tel: '123456789'
        };
        readFile.mockResolvedValue(sql);
        pool.query.mockResolvedValue([[mockUser]]);

        // Act
        const result = await getUserByEmail(email);

        // Assert
        expect(result).toEqual({
            id: 1,
            name: 'John',
            surname_1: 'Doe',
            surname_2: 'Smith',
            email: 'test@example.com',
            telephone: '123456789'
        });
    });

    test('getUserByEmail - user not found', async () => {
        // Arrange
        const email = 'notfound@example.com';
        const sql = 'SELECT * FROM users WHERE email = ?';
        readFile.mockResolvedValue(sql);
        pool.query.mockResolvedValue([[]]);

        // Act
        const result = await getUserByEmail(email);

        // Assert
        expect(result).toBeNull();
    });

    test('getUserByEmail - SQL error', async () => {
        // Arrange
        const email = 'error@example.com';
        const sql = 'SELECT * FROM users WHERE email = ?';
        readFile.mockResolvedValue(sql);
        pool.query.mockRejectedValue(new Error('SQL error'));

        // Act & Assert
        await expect(getUserByEmail(email)).rejects.toThrow('Failed to fetch user: SQL error');
    });

    test('getUserById - happy path', async () => {
        // Arrange
        const id = 1;
        const sql = 'SELECT * FROM users WHERE id = ?';
        const mockUser = { id: 1, name: 'John' };
        readFile.mockResolvedValue(sql);
        pool.query.mockResolvedValue([[mockUser]]);

        // Act
        const result = await getUserById(id);

        // Assert
        expect(result).toEqual(mockUser);
    });

    test('getUserById - user not found', async () => {
        // Arrange
        const id = 999;
        const sql = 'SELECT * FROM users WHERE id = ?';
        readFile.mockResolvedValue(sql);
        pool.query.mockResolvedValue([[]]);

        // Act
        const result = await getUserById(id);

        // Assert
        expect(result).toBeNull();
    });

    test('createUser - happy path', async () => {
        // Arrange
        const userData = {
            name: 'John',
            lastName1: 'Doe',
            lastName2: 'Smith',
            tel: '123456789',
            password: 'password123',
            userTypeId: 1,
            mail: 'john@example.com'
        };
        const sql = 'INSERT INTO users ...';
        const hashedPassword = 'hashedPassword123';
        readFile.mockResolvedValue(sql);
        bcrypt.hash.mockResolvedValue(hashedPassword);
        pool.query.mockResolvedValue([{ insertId: 1 }]);

        // Act
        const result = await createUser(userData);

        // Assert
        expect(result).toEqual({ id: 1, ...userData, password: hashedPassword });
    });

    test('createUser - SQL error', async () => {
        // Arrange
        const userData = {
            name: 'John',
            lastName1: 'Doe',
            lastName2: 'Smith',
            tel: '123456789',
            password: 'password123',
            userTypeId: 1,
            mail: 'john@example.com'
        };
        const sql = 'INSERT INTO users ...';
        readFile.mockResolvedValue(sql);
        bcrypt.hash.mockResolvedValue('hashedPassword123');
        pool.query.mockRejectedValue(new Error('SQL error'));

        // Act & Assert
        await expect(createUser(userData)).rejects.toThrow('Failed to create user: SQL error');
    });

    test('updateUser - happy path', async () => {
        // Arrange
        const userData = {
            id: 1,
            name: 'John',
            lastName1: 'Doe',
            lastName2: 'Smith',
            tel: '123456789',
            password: 'newpassword123'
        };
        const sqlBase = 'UPDATE users SET';
        const hashedPassword = 'hashedNewPassword123';
        readFile.mockResolvedValue(sqlBase);
        bcrypt.hash.mockResolvedValue(hashedPassword);
        pool.query.mockResolvedValue([{ affectedRows: 1 }]);

        // Act
        const result = await updateUser(userData);

        // Assert
        expect(result).toBe(true);
    });

    test('updateUser - no fields to update', async () => {
        // Arrange
        const userData = { id: 1 };
        const sqlBase = 'UPDATE users SET';
        readFile.mockResolvedValue(sqlBase);

        // Act & Assert
        await expect(updateUser(userData)).rejects.toThrow('No fields to update.');
    });

    test('deleteUser - happy path', async () => {
        // Arrange
        const email = 'delete@example.com';
        const sql = 'DELETE FROM users WHERE email = ?';
        readFile.mockResolvedValue(sql);
        pool.query.mockResolvedValue([{ affectedRows: 1 }]);

        // Act
        const result = await deleteUser(email);

        // Assert
        expect(result).toBe(true);
    });

    test('deleteUser - user not found', async () => {
        // Arrange
        const email = 'notfound@example.com';
        const sql = 'DELETE FROM users WHERE email = ?';
        readFile.mockResolvedValue(sql);
        pool.query.mockResolvedValue([{ affectedRows: 0 }]);

        // Act
        const result = await deleteUser(email);

        // Assert
        expect(result).toBe(false);
    });

    test('getUserPasswordById - happy path', async () => {
        // Arrange
        const id = 1;
        const sql = 'SELECT password FROM users WHERE id = ?';
        const mockUser = { password: 'hashedPassword123' };
        readFile.mockResolvedValue(sql);
        pool.query.mockResolvedValue([[mockUser]]);

        // Act
        const result = await getUserPasswordById(id);

        // Assert
        expect(result).toEqual(mockUser);
    });

    test('checkUserExists - user exists', async () => {
        // Arrange
        const email = 'exists@example.com';
        const sql = 'SELECT COUNT(*) as email_exists FROM users WHERE email = ?';
        readFile.mockResolvedValue(sql);
        pool.execute.mockResolvedValue([[{ email_exists: 1 }]]);

        // Act
        const result = await checkUserExists(email);

        // Assert
        expect(result).toBe(true);
    });

    test('checkUserExists - user does not exist', async () => {
        // Arrange
        const email = 'notexists@example.com';
        const sql = 'SELECT COUNT(*) as email_exists FROM users WHERE email = ?';
        readFile.mockResolvedValue(sql);
        pool.execute.mockResolvedValue([[{ email_exists: 0 }]]);

        // Act
        const result = await checkUserExists(email);

        // Assert
        expect(result).toBe(false);
    });

    test('checkUserExistsById - user exists', async () => {
        // Arrange
        const id = 1;
        const sql = 'SELECT COUNT(*) as id_exists FROM users WHERE id = ?';
        readFile.mockResolvedValue(sql);
        pool.execute.mockResolvedValue([[{ id_exists: 1 }]]);

        // Act
        const result = await checkUserExistsById(id);

        // Assert
        expect(result).toBe(true);
    });

    test('checkUserExistsById - user does not exist', async () => {
        // Arrange
        const id = 999;
        const sql = 'SELECT COUNT(*) as id_exists FROM users WHERE id = ?';
        readFile.mockResolvedValue(sql);
        pool.execute.mockResolvedValue([[{ id_exists: 0 }]]);

        // Act
        const result = await checkUserExistsById(id);

        // Assert
        expect(result).toBe(false);
    });
});
