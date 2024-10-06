import express from 'express';
import medicionesRoutes from './routes/medicionesRoutes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { config } from 'dotenv';

const app = express();
const swaggerDocument = YAML.load('./doc/api.yaml');
config();


// Middleware per a JSON
app.use(express.json());

// Documentació Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Carrega de rutes per a "mediciones"
app.use('/mediciones', medicionesRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('Servidor web i API REST en funcionament!');
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
