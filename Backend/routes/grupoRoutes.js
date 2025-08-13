import { Router } from 'express';
import {
  list,
  miembros,
  resyncAll
} from '../controllers/grupoController.js';

const router = Router();

router.get('/', list);                 // lista grupos (fn_listar_grupos)
router.get('/:id/miembros', miembros); // lista miembros de un grupo
router.post('/recalcular', resyncAll); // opcional: recalcular global ?umbral=3

export default router;
