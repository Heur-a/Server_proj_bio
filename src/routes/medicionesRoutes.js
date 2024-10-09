/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-06 16:52:59 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-10-09 09:51:39
 */


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
