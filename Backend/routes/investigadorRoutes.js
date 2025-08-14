import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove
} from '../controllers/investigadorController.js';

const router = Router();

router.get('/investigadores/', getAll);
router.get('/investigadores/:id', getById);
router.post('/investigadores/', create);
router.put('/investigadores/:id', update);
router.delete('/investigadores/:id', remove);

export default router;
