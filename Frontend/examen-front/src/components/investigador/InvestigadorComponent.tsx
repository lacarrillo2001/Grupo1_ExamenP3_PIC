import React, { useRef, useState, useEffect } from "react";
import type { Investigador } from "../../types/investigador";
import {
    getInvestigadores,
    updateInvestigador,
    createInvestigador,
    deleteInvestigador
} from "../../services/investigadorService";
import { InvestigadorTable } from "./investigadorDataTable";
import { InvestigadorForm } from "./investigadorForm";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const InvestigadorComponent: React.FC = () => {
    const [items, setItems] = useState<Investigador[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selected, setSelected] = useState<Investigador>({
        id: 0,
        nombre: "",
        apellido: "",
        departamento: "",
        experiencia: 0
    });

    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getInvestigadores();
        setItems(data);
    };

    const saveItem = async (item: Investigador) => {
        try {
            if (items.find(i => i.id === item.id)) {
                await updateInvestigador(item.id, item);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Investigador actualizado', life: 3000 });
            } else {
                await createInvestigador(item);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Investigador creado', life: 3000 });
            }
            await loadItems();
            setDialogVisible(false);
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar investigador', life: 3000 });
        }
    };

    const openNew = () => {
        setSelected({ id: 0, nombre: "", apellido: "", departamento: "", experiencia: 0 });
        setDialogVisible(true);
    };

    const confirmarDelete = (item: Investigador) => {
        confirmDialog({
            message: '¿Eliminar este investigador?',
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteInvestigador(item.id);
                    await loadItems();
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Investigador eliminado', life: 3000 });
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
            <Button label="Nuevo Investigador" icon="pi pi-plus" onClick={openNew} className="mb-3" />

            <InvestigadorTable
                investigadores={items}
                onEdit={(i) => {
                    setSelected(i);
                    setDialogVisible(true);
                }}
                onDelete={confirmarDelete}
            />

            <InvestigadorForm
                visible={dialogVisible}
                investigador={selected}
                onHide={() => setDialogVisible(false)}
                onSave={saveItem}
            />
        </div>
    );
};
