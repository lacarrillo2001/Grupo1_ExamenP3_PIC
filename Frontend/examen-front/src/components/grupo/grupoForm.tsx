import type { Grupo } from "../../types/grupo";

import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";

interface GrupoFormProps {
    visible: boolean;
    grupo: Grupo;
    onHide(): void;
    onSave(grupo: Grupo): void;
}

export const GrupoForm: React.FC<GrupoFormProps> = ({ visible, grupo, onHide, onSave }) => {
    const [current, setCurrent] = useState<Grupo>(grupo);

    useEffect(() => {
        setCurrent(grupo);
    }, [grupo]);

    const save = () => {
        onSave(current);
        onHide();
    };

    return (
        <Dialog header={grupo.id ? "Editar Grupo" : "Nuevo Grupo"} visible={visible} onHide={onHide}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="linea_id">Línea ID:</label>
                    <InputNumber
                        id="linea_id"
                        value={current.linea_id}
                        onValueChange={(e) => setCurrent({ ...current, linea_id: e.value ?? 0 })}
                    />

                    <label htmlFor="disponibilidad_id">Disponibilidad ID:</label>
                    <InputNumber
                        id="disponibilidad_id"
                        value={current.disponibilidad_id}
                        onValueChange={(e) => setCurrent({ ...current, disponibilidad_id: e.value ?? 0 })}
                    />

                    <label htmlFor="miembros">Miembros:</label>
                    <InputNumber
                        id="miembros"
                        value={current.miembros}
                        onValueChange={(e) => setCurrent({ ...current, miembros: e.value ?? 0 })}
                    />

                    <label htmlFor="creado_en">Creado en:</label>
                    <Calendar id="creado_en" value={current.creado_en ? new Date(current.creado_en) : undefined} disabled showIcon />

                    <label htmlFor="actualizado_en">Actualizado en:</label>
                    <Calendar id="actualizado_en" value={current.actualizado_en ? new Date(current.actualizado_en) : undefined} disabled showIcon />
                </div>
                <Button label="Guardar" icon="pi pi-check" onClick={save} className="mt-3" />
            </div>
        </Dialog>
    );
};
