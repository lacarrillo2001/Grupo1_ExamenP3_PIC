import { Router } from 'express';
import {
  assign,
  unassign,
  resyncAll
} from '../controllers/asignacionController.js';

const router = Router();

// Crea asignación y sincroniza grupo (usa fn_asignar_y_sync)
router.post('/', assign);

// Elimina asignación y sincroniza grupo (usa fn_sync_grupo)
router.delete('/', unassign);

// Recalcula todos los grupos desde tabla intermedia (usa fn_sync_todos)
router.post('/recalcular', resyncAll); // ?umbral=3

export default router;
