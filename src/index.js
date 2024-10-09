/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-06 16:52:16 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-09 09:51:32
 */

import express from 'express';
import medicionesRoutes from './routes/medicionesRoutes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { config } from 'dotenv';
import  fetch  from 'node-fetch';

const app = express();
const swaggerDocument = YAML.load('./doc/api.yaml');
config();
const url = 'http://localhost/mediciones/ultima';

// Middleware per a JSON
app.use(express.json());

// Documentació Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Carrega de rutes per a "mediciones"
app.use('/mediciones', medicionesRoutes);

// Ruta principal
app.get('/', (req, res) => {
    
    fetch(url)
        .then(resGet => resGet.json()) // Convertir la resposta a JSON
        .then(data => {
            console.log(data);  
            res.send('Servidor web i API REST en funcionament!' + JSON.stringify(data));

        })
        .catch(error => {
            console.error('Error: ', error);
            res.send('ALGO NO VA PELIGRO');
        });

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(process.env.MYSQLDB_HOST);
    console.log(process.env.MYSQLDB_USER);
    console.log(process.env.MYSQLDB_PASSWORD);
    console.log(process.env.MYSQLDB_PORT);
    console.log(process.env.MYSQLDB_DATABASE);
    console.log('Press Ctrl+C to quit.');
});
