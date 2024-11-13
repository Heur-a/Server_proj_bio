import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import medicionesRoutes from './routes/medicionesRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoutes.js';
import nodeRoutes from './routes/nodeRoutes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { config } from 'dotenv';
import https from 'https';
import fs from 'fs';
import { sessionMiddleware, verifyIdentity } from './services/authService.js';

/**
 * @file index.js
 * @module server
 * @description Entry point of the API application that initializes the Express server, sets up routes, and serves API documentation.
 * This file configures and starts the Express server, connects to the database, sets up middleware, and loads API documentation using Swagger UI.
 */

/**
 * Initializes the Express application and middleware.
 * Loads environment variables, sets up session management, and configures JSON parsing.
 */
const app = express();
config();

/**
 * Loads the Swagger API documentation from a YAML file.
 * @constant {Object} swaggerDocument - The loaded Swagger documentation object.
 */
const swaggerDocument = YAML.load('./doc/api/api.yaml');

/**
 * Middleware for session management.
 * @function sessionMiddleware
 */
app.use(sessionMiddleware);

/**
 * Middleware for parsing JSON requests.
 * @function express.json
 */
app.use(express.json());

/**
 * Retrieves the current file's directory name.
 * @constant {string} __filename - The current file's URL.
 * @constant {string} __dirname - The directory name of the current module.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates an HTTPS server with SSL certificates.
 * @constant {https.Server} server - The HTTPS server instance.
 */
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, './certs/fake-key.pem'), 'utf8'),
    cert: fs.readFileSync(path.join(__dirname, './certs/fake-cert.pem'), 'utf8'),
}, app);

/**
 * Sets up the Swagger API documentation route.
 * @route /api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Sets up the routes for measurement endpoints.
 * @route /mediciones
 */
app.use('/mediciones', medicionesRoutes);

/**
 * Sets up the routes for user endpoints.
 * @route /users
 */
app.use('/users', usersRoutes);

/**
 * Sets up the routes for authentication endpoints.
 * @route /auth
 */
app.use('/auth', authRoutes);

/**
 * Sets up the routes for node endpoints.
 * @route /node
 */
app.use('/node', nodeRoutes);

/**
 * Serves static files for authenticated users from the public/user directory.
 * @route /user
 */
app.use('/user', verifyIdentity, express.static(path.join(__dirname, 'public/user')));

/**
 * Serves static files from the public directory.
 * @route /
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Main route for serving the index.html file.
 * @route /
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Starts the HTTPS server and listens on port 443.
 * Logs the server status and database connection details.
 */
server.listen(443, () => {
    console.log('Server running on port 443');
    console.log(`Connected to MySQL database at ${process.env.MYSQLDB_HOST}:${process.env.MYSQLDB_PORT}`);
});

/**
* Starts the HTTP server and listens on port 80.
* Redirects all HTTP requests to the HTTPS server.
*/
app.listen(80, () => {
    console.log('Server running on port 80');
});
