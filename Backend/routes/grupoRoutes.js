import { Router } from 'express';
import {
  list,
  miembros,
  resyncAll
} from '../controllers/grupoController.js';

const router = Router();

router.get('/grupos', list);                 // lista grupos (fn_listar_grupos)
router.get('/grupos/:id/miembros', miembros); // lista miembros de un grupo
router.post('/grupos/recalcular', resyncAll); // opcional: recalcular global ?umbral=3

export default router;
