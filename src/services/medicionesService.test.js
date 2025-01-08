import { getMedicionesDB, insertMedicionDB, getUltimaMedicionDB } from './medicionesService';
import pool from '../config/db_conection.js';
import { readFile } from 'fs/promises';
import { HttpError } from "../components/HttpErrorClass.js";

jest.mock('../config/db_conection.js');
jest.mock('fs/promises');

describe('medicionesService', () => {
    describe('getMedicionesDB', () => {
        it('should return all measurements on success', async () => {
            // Arrange
            const mockQuery = 'SELECT * FROM mediciones';
            const mockRows = [{ id: 1, value: 100 }];
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockResolvedValue([mockRows]);

            // Act
            const result = await getMedicionesDB();

            // Assert
            expect(result).toEqual(mockRows);
        });

        it('should handle errors when reading the SQL file', async () => {
            // Arrange
            readFile.mockRejectedValue(new Error('File read error'));


            // Assert
            expect(getMedicionesDB()).rejects.toBeInstanceOf(Error);
        });

        it('should handle errors when querying the database', async () => {
            // Arrange
            const mockQuery = 'SELECT * FROM mediciones';
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockRejectedValue(new Error('Database error'));

            // Act

            // Assert
            await expect(getMedicionesDB()).rejects.toThrow(
                new HttpError(500, 'Database error')
            );
        });
    });

    describe('insertMedicionDB', () => {
        it('should insert a measurement successfully', async () => {
            // Arrange
            const medida = { value: 100, LocX: 1, LocY: 2, nodeId: 3, gasId: 4 };
            const mockQuery = 'INSERT INTO mediciones ...';
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockResolvedValue([{ affectedRows: 1 }]);

            // Act
            const result = await insertMedicionDB(medida);

            // Assert
            expect(result).toBe(true);
        });

        it('should throw HttpError on database error', async () => {
            // Arrange
            const medida = { value: 100, LocX: 1, LocY: 2, nodeId: 3, gasId: 4 };
            const mockQuery = 'INSERT INTO mediciones ...';
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockRejectedValue(new Error('Database error'));

            // Act & Assert
            await expect(insertMedicionDB(medida)).rejects.toThrow(
                new HttpError(500,'Database error')
            );
        });

        it('should rethrow HttpError if already thrown', async () => {
            // Arrange
            const medida = { value: 100, LocX: 1, LocY: 2, nodeId: 3, gasId: 4 };
            const mockQuery = 'INSERT INTO mediciones ...';
            readFile.mockResolvedValue(mockQuery);
            const httpError = new HttpError(400, 'Bad Request');
            pool.query.mockRejectedValue(httpError);

            // Act & Assert
            await expect(insertMedicionDB(medida)).rejects.toThrow(httpError);
        });
    });

    describe('getUltimaMedicionDB', () => {
        it('should return the latest measurement on success', async () => {
            // Arrange
            const mockQuery = 'SELECT * FROM mediciones ORDER BY id DESC LIMIT 1';
            const mockRows = [{ id: 1, value: 100 }];
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockResolvedValue([mockRows]);

            // Act
            const result = await getUltimaMedicionDB();

            // Assert
            expect(result).toEqual(mockRows[0]);
        });

        it('should return null if no measurements are found', async () => {
            // Arrange
            const mockQuery = 'SELECT * FROM mediciones ORDER BY id DESC LIMIT 1';
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockResolvedValue([[]]);

            // Act
            const result = await getUltimaMedicionDB();

            // Assert
            expect(result).toBeNull();
        });

        it('should throw an error if the query fails', async () => {
            // Arrange
            const mockQuery = 'SELECT * FROM mediciones ORDER BY id DESC LIMIT 1';
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockRejectedValue(new Error('Database error'));

            // Act & Assert
            await expect(getUltimaMedicionDB()).rejects.toThrow(
                new HttpError(500, 'Database error')
            );
        });
    });
});
