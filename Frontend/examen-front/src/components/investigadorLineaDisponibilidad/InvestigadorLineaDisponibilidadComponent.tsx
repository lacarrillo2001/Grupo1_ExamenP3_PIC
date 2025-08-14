import React, { useRef, useState, useEffect } from "react";
import type { InvestigadorLineaDisponibilidad } from "../../types/investigadorLineaDisponibilidad";
import {
    getAsignaciones,
    createAsignacion,
    deleteAsignacion
} from "../../services/investigadorLineaDisponibilidadService";
import { InvestigadorLineaDisponibilidadTable } from "./InvestigadorLineaDisponibilidadDataTable";
import { InvestigadorLineaDisponibilidadForm } from "./investigadorLineaDisponibilidad";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const InvestigadorLineaDisponibilidadComponent: React.FC = () => {
    const [items, setItems] = useState<InvestigadorLineaDisponibilidad[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selected, setSelected] = useState<InvestigadorLineaDisponibilidad>({
        investigador_id: 0,
        linea_id: 0,
        disponibilidad_id: 0
    });

    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getAsignaciones();
        setItems(data);
    };

    const saveItem = async (item: InvestigadorLineaDisponibilidad) => {
        try {
            // Aquí es posible que debas implementar lógica para actualizar o crear compuesta (tres claves)
            // O usar delete + create, según tu API.
            await createAsignacion(item); // Ejemplo simple
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado', life: 3000 });

            await loadItems();
            setDialogVisible(false);
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar registro', life: 3000 });
        }
    };

    const openNew = () => {
        setSelected({ investigador_id: 0, linea_id: 0, disponibilidad_id: 0 });
        setDialogVisible(true);
    };

    const confirmarDelete = (item: InvestigadorLineaDisponibilidad) => {
        confirmDialog({
            message: '¿Eliminar este registro?',
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteAsignacion(item.investigador_id, item.linea_id, item.disponibilidad_id);
                    await loadItems();
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado', life: 3000 });
                } catch {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 });
                }
            }
        });
    };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Button label="Nuevo Registro" icon="pi pi-plus" onClick={openNew} className="mb-3" />

            <InvestigadorLineaDisponibilidadTable
                items={items}
                onEdit={(i) => {
                    setSelected(i);
                    setDialogVisible(true);
                }}
                onDelete={confirmarDelete}
            />

            <InvestigadorLineaDisponibilidadForm
                visible={dialogVisible}
                item={selected}
                onHide={() => setDialogVisible(false)}
                onSave={saveItem}
            />
        </div>
    );
};
