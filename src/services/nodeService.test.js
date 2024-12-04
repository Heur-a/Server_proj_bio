import { createNode, getNodeUuid, getNodeIdWithUuuid } from './nodeService';
import { HttpError } from '../components/HttpErrorClass.js';
import pool from '../config/db_conection.js';
import { readFile } from 'fs/promises';

jest.mock('fs/promises');
jest.mock('../config/db_conection.js');

describe('nodeService', () => {
    describe('createNode', () => {
        it('should create a node and return the insertId on success', async () => {
            // Arrange
            const uuid = 'test-uuid';
            const idUser = 1;
            const mockQuery = 'INSERT INTO nodes ...';
            const mockResult = [{ insertId: 123 }];
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockResolvedValue(mockResult);

            // Act
            const result = await createNode(uuid, idUser);

            // Assert
            expect(result).toBe(123);
            expect(readFile).toHaveBeenCalledWith('./src/sql/createNode.sql', 'utf-8');
            expect(pool.query).toHaveBeenCalledWith(mockQuery, [uuid, idUser]);
        });

        it('should throw HttpError on database error', async () => {
            // Arrange
            const uuid = 'test-uuid';
            const idUser = 1;
            readFile.mockRejectedValue(new Error('File read error'));

            // Act & Assert
            await expect(createNode(uuid, idUser)).rejects.toThrow(HttpError);
            await expect(createNode(uuid, idUser)).rejects.toThrow('Database insertion error');
        });
    });

    describe('getNodeUuid', () => {
        it('should return the node uuid for a valid user id', async () => {
            // Arrange
            const id = 'user-id';
            const mockQuery = 'SELECT uuid FROM nodes WHERE ...';
            const mockRows = [{ uuid: 'node-uuid' }];
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockResolvedValue([mockRows]);

            // Act
            const result = await getNodeUuid(id);

            // Assert
            expect(result).toStrictEqual({"uuid": "node-uuid"});
            expect(readFile).toHaveBeenCalledWith('./src/sql/getNodeById.sql', 'utf-8');
            expect(pool.query).toHaveBeenCalledWith(mockQuery, [id]);
        });

        it('should return null if no node is found', async () => {
            // Arrange
            const id = 'user-id';
            const mockQuery = 'SELECT uuid FROM nodes WHERE ...';
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockResolvedValue([[]]);

            // Act
            const result = await getNodeUuid(id);

            // Assert
            expect(result).toBeNull();
        });

        it('should throw HttpError on unexpected error', async () => {
            // Arrange
            const id = 'user-id';
            readFile.mockRejectedValue(new Error('Unexpected error'));

            // Act & Assert
            await expect(getNodeUuid(id)).rejects.toThrow(HttpError);
            await expect(getNodeUuid(id)).rejects.toThrow('Internal Server Error');
        });
    });

    describe('getNodeIdWithUuuid', () => {
        it('should return the node id for a valid uuid', async () => {
            // Arrange
            const uuid = 'node-uuid';
            const mockQuery = 'SELECT idnodes FROM nodes WHERE ...';
            const mockRows = [{ idnodes: 456 }];
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockResolvedValue([mockRows]);

            // Act
            const result = await getNodeIdWithUuuid(uuid);

            // Assert
            expect(result).toBe(456);
            expect(readFile).toHaveBeenCalledWith('./src/sql/getNodeIdWithUuid.sql', 'utf-8');
            expect(pool.query).toHaveBeenCalledWith(mockQuery, [uuid]);
        });

        it('should return null if no node is found', async () => {
            // Arrange
            const uuid = 'node-uuid';
            const mockQuery = 'SELECT idnodes FROM nodes WHERE ...';
            readFile.mockResolvedValue(mockQuery);
            pool.query.mockResolvedValue([[]]);

            // Act
            const result = await getNodeIdWithUuuid(uuid);

            // Assert
            expect(result).toBeNull();
        });

        it('should throw HttpError on unexpected error', async () => {
            // Arrange
            const uuid = 'node-uuid';
            readFile.mockRejectedValue(new Error('Unexpected error'));

            // Act & Assert
            await expect(getNodeIdWithUuuid(uuid)).rejects.toThrow(HttpError);
            await expect(getNodeIdWithUuuid(uuid)).rejects.toThrow('Unexpected error');
        });
    });
});
