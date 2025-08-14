import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove
} from '../controllers/disponibilidadController.js';

const router = Router();

router.get('/disponibilidades', getAll);
router.get('/disponibilidades/:id', getById);
router.post('/disponibilidades', create);
router.put('/disponibilidades/:id', update);
router.delete('/disponibilidades/:id', remove);

export default router;
