import React, { useRef, useState, useEffect } from "react";
import type { LineaInvestigacion } from "../../types/lineaInvestigacio";
import {
  getLineasInvestigacion,
  createLineaInvestigacion,
  updateLineaInvestigacion,
  deleteLineaInvestigacion,
} from "../../services/lineaInvestigacionService
import { LineaInvestigacionTable } from "./lineaInvestigacioDataTable"; // Tu tabla personalizada
import { LineaInvestigacionForm } from "./lineaInvestigacioForm"; // Tu formulario personalizado
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const LineaInvestigacionComponent: React.FC = () => {
  const [lineas, setLineas] = useState<LineaInvestigacion[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedLinea, setSelectedLinea] = useState<LineaInvestigacion>({
    id: 0,
    nombre: "",
    area: "",
  });

  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadLineas();
  }, []);

  const loadLineas = async () => {
    try {
      const data = await getLineasInvestigacion();
      setLineas(data);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las líneas de investigación",
        life: 3000,
      });
    }
  };

  const saveLinea = async (linea: LineaInvestigacion) => {
    try {
      if (lineas.find((l) => l.id === linea.id)) {
        await updateLineaInvestigacion(linea.id, {
          nombre: linea.nombre,
          area: linea.area,
        });
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Línea actualizada exitosamente",
          life: 3000,
        });
      } else {
        await createLineaInvestigacion({
          nombre: linea.nombre,
          area: linea.area,
        });
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Línea creada exitosamente",
          life: 3000,
        });
      }
      await loadLineas();
      setDialogVisible(false);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Hubo un problema al guardar la línea",
        life: 3000,
      });
    }
  };

  const openNew = () => {
    setSelectedLinea({
      id: 0,
      nombre: "",
      area: "",
    });
    setDialogVisible(true);
  };

  const confirmarDelete = (linea: LineaInvestigacion) => {
    confirmDialog({
      message: `¿Deseas eliminar la línea "${linea.nombre}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteLineaInvestigacion(linea.id);
          await loadLineas();
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Línea eliminada exitosamente",
            life: 3000,
          });
        } catch {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo eliminar la línea",
            life: 3000,
          });
        }
      },
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Button
        label="Nueva Línea de Investigación"
        icon="pi pi-plus"
        onClick={openNew}
        className="mb-3"
      />

      <LineaInvestigacionTable
        lineas={lineas}
        onEdit={(l) => {
          setSelectedLinea(l);
          setDialogVisible(true);
        }}
        onDelete={confirmarDelete}
      />

      <LineaInvestigacionForm
        visible={dialogVisible}
        linea={selectedLinea}
        onHide={() => setDialogVisible(false)}
        onSave={saveLinea}
      />
    </div>
  );
};
