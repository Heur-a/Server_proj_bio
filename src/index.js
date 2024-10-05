import express from 'express';
import medicionesRoutes from './routes/medicionesRoutes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import 'dotenv/config';

const app = express();
const swaggerDocument = YAML.load('./doc/api.yaml');

// Middleware per a JSON
app.use(express.json());

// Documentació Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Carrega de rutes per a "mediciones"
app.use('/api/mediciones', medicionesRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('Servidor web i API REST en funcionament!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
