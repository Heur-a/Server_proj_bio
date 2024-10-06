import { Router } from 'express';
import { getMediciones, postMedicion, getUltimaMedicion } from '../controllers/medicionesController.js';

const router = Router();

// GET /mediciones
router.get('/', getMediciones);

// POST /mediciones
router.post('/', postMedicion);

// GET /mediciones/ultima
router.get('/ultima', getUltimaMedicion);

export default router;
