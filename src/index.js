/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-09 10:23:28 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-23 19:11:05
 */
/**
 * @file index
 * @brief Entry point of the API application that initializes the Express server, sets up routes, and serves API documentation.
 * @requires express
 * @requires path
 * @requires fileURLToPath
 * @requires medicionesRoutes
 * @requires swaggerUi
 * @requires YAML
 * @requires config
 * @description This file configures and starts the Express server, connects to the database, sets up middleware, and loads API documentation using Swagger UI.
 * 
 * 
 * This file configures and starts the Express server, connects to the database, sets up middleware, and loads API documentation using Swagger UI.
 * It defines the main route and handles requests to other routes through dedicated route modules.
 * 
 * @author Alex Escrivà Caravaca
 * @date 2024-10-06
 * @version 1.0.0
 * @last_modified 2024-10-09
 */

import express from 'express';
import path from 'path';  // To resolve file paths
import { fileURLToPath } from 'url';  // To work with ES modules
import medicionesRoutes from './routes/medicionesRoutes.js';  // Route handling for measurement endpoints
import usersRoutes from './routes/usersRoutes.js';  // Route handling for user endpoints
import swaggerUi from 'swagger-ui-express';  // Swagger UI for API documentation
import YAML from 'yamljs';  // To load the API documentation from a YAML file
import { config } from 'dotenv';  // To load environment variables from a .env file
import fetch from 'node-fetch';  // To perform HTTP requests
import https from 'https';
import fs from 'fs';

// Initialize the Express app
const app = express();

// Load Swagger API documentation from YAML file
const swaggerDocument = YAML.load('./doc/api/api.yaml');

// Load environment variables from .env file
config();

// URL to fetch the latest measurement
const url = 'http://localhost/mediciones/ultima';

// Middleware for parsing JSON requests
app.use(express.json());

// Get the current directory (ES modules replacement for __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Configure https server
https.createServer({
    key: fs.readFileSync(path.join(__dirname,'./certs/fake-key.pem'), 'utf8'),
    cert: fs.readFileSync(path.join(__dirname,'./certs/fake-cert.pem'), 'utf8'),
    
}, app);

/**
 * @brief Serves the Swagger API documentation.
 * 
 * This middleware serves the API documentation generated from the `api.yaml` file in the `/api-docs` path.
 * It provides an interactive interface for testing the API's endpoints.
 * 
 * @route /api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @brief Sets up the routes for measurement (mediciones) endpoints.
 * 
 * This middleware uses the `medicionesRoutes` module to handle all requests to `/mediciones`.
 * The actual logic for these routes is managed in the corresponding controller.
 * 
 * @route /mediciones
 */
app.use('/mediciones', medicionesRoutes);

/**
 * @brief Serves up the routes for users endpoints.
 * 
 * This middleware uses the `usersRoutes` module to handle all requests to `/users`.
 * The actual logic for these routes is managed in the corresponding controller.
 * 
 * @route /users
 * @see usersRoutes
 */
app.use('/users', usersRoutes);


/**
 * @brief Main route for the web server.
 * 
 * The root route `/` sends a message confirming the server's status.
 * It also makes a request to the `/mediciones/ultima` endpoint to fetch the latest measurement.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @route /
 */

//todo: Hacer la ruta principal un servidor web con https y  que ponga una pagina html
/**
 * @brief Serves static HTML files from the "public" directory.
 * 
 * This middleware serves any static files (HTML, CSS, JS, images) located in the `public` directory.
 * For example, requests to `/index.html` will serve `public/index.html`.
 */
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.html') {
            res.setHeader('Content-Disposition', 'inline');
        }
    }
}));

/**
 * @brief Main route for the web server.
 * 
 * The root route `/` serves the `index.html` file located in the `public` directory.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @route /
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});





/**
 * @brief Starts the Express server and listens on a specific port.
 * 
 * The server listens on the port specified in the environment variables (`PORT`) or defaults to port 3000.
 * When the server starts, it logs the MySQL database connection details from the environment variables.
 */
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
    console.log(`Connected to MySQL database at ${process.env.DB_HOST}:${process.env.MYSQLDB_PORT}`);
});

