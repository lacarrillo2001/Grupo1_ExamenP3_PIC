import React, { useRef, useState, useEffect } from "react";
import type { Grupo } from "../../types/grupo";
import {
    getGrupos,
    updateGrupo,
    createGrupo,
    deleteGrupo
} from "../../services/grupoService";
import { GrupoTable } from "./grupoDataTable";
import { GrupoForm } from "./grupoForm";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const GrupoComponent: React.FC = () => {
    const [items, setItems] = useState<Grupo[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selected, setSelected] = useState<Grupo>({
        id: 0,
        linea_id: 0,
        disponibilidad_id: 0,
        miembros: 0,
        creado_en: "",
        actualizado_en: ""
    });

    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getGrupos();
        setItems(data);
    };

    const saveItem = async (item: Grupo) => {
        try {
            if (items.find(i => i.id === item.id)) {
                await updateGrupo(item.id, item);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Grupo actualizado', life: 3000 });
            } else {
                await createGrupo(item);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Grupo creado', life: 3000 });
            }
            await loadItems();
            setDialogVisible(false);
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar grupo', life: 3000 });
        }
    };

    const openNew = () => {
        setSelected({ id: 0, linea_id: 0, disponibilidad_id: 0, miembros: 0, creado_en: "", actualizado_en: "" });
        setDialogVisible(true);
    };

    const confirmarDelete = (item: Grupo) => {
        confirmDialog({
            message: '¿Eliminar este grupo?',
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteGrupo(item.id);
                    await loadItems();
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Grupo eliminado', life: 3000 });
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
            <Button label="Nuevo Grupo" icon="pi pi-plus" onClick={openNew} className="mb-3" />

            <GrupoTable
                grupos={items}
                onEdit={(i) => {
                    setSelected(i);
                    setDialogVisible(true);
                }}
                onDelete={confirmarDelete}
            />

            <GrupoForm
                visible={dialogVisible}
                grupo={selected}
                onHide={() => setDialogVisible(false)}
                onSave={saveItem}
            />
        </div>
    );
};
