import React, { useRef, useState, useEffect } from "react";
import type { Disponibilidad } from "../../types/disponibilidad";
import {
    getDisponibilidades,
    updateDisponibilidad,
    createDisponibilidad,
    deleteDisponibilidad
} from "../../services/disponibilidadService";
import { DisponibilidadTable } from "./disponibilidadDataTable";
import { DisponibilidadForm } from "./disponibilidadForm";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const DisponibilidadComponent: React.FC = () => {
    const [items, setItems] = useState<Disponibilidad[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selected, setSelected] = useState<Disponibilidad>({
        id: 0,
        franja_horaria: "",
        modalidad: ""
    });

    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getDisponibilidades();
        setItems(data);
    };

    const saveItem = async (item: Disponibilidad) => {
        try {
            if (items.find(i => i.id === item.id)) {
                await updateDisponibilidad(item.id, item);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Disponibilidad actualizada', life: 3000 });
            } else {
                await createDisponibilidad(item);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Disponibilidad creada', life: 3000 });
            }
            await loadItems();
            setDialogVisible(false);
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar disponibilidad', life: 3000 });
        }
    };

    const openNew = () => {
        setSelected({ id: 0, franja_horaria: "", modalidad: "" });
        setDialogVisible(true);
    };

    const confirmarDelete = (item: Disponibilidad) => {
        confirmDialog({
            message: '¿Eliminar esta disponibilidad?',
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteDisponibilidad(item.id);
                    await loadItems();
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Disponibilidad eliminada', life: 3000 });
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
            <Button label="Nueva Disponibilidad" icon="pi pi-plus" onClick={openNew} className="mb-3" />

            <DisponibilidadTable
                disponibilidades={items}
                onEdit={(i) => {
                    setSelected(i);
                    setDialogVisible(true);
                }}
                onDelete={confirmarDelete}
            />

            <DisponibilidadForm
                visible={dialogVisible}
                disponibilidad={selected}
                onHide={() => setDialogVisible(false)}
                onSave={saveItem}
            />
        </div>
    );
};
