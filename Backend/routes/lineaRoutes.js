import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove
} from '../controllers/lineaController.js';

const router = Router();

router.get('/lineas', getAll);
router.get('/lineas/:id', getById);
router.post('/lineas', create);
router.put('/lineas/:id', update);
router.delete('/lineas/:id', remove);

export default router;
