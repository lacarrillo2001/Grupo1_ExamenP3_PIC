import type { LineaInvestigacion } from "../../types/lineaInvestigacio";

import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

interface LineasInvestigacionFormProps {
    visible: boolean;
    linea: LineaInvestigacion;
    onHide(): void;
    onSave(linea: LineaInvestigacion): void;
}

export const LineasInvestigacionForm: React.FC<LineasInvestigacionFormProps> = ({ visible, linea, onHide, onSave }) => {
    const [current, setCurrent] = useState<LineaInvestigacion>(linea);

    useEffect(() => {
        setCurrent(linea);
    }, [linea]);

    const save = () => {
        onSave(current);
        onHide();
    };

    return (
        <Dialog
            header={linea.id ? "Editar Línea de Investigación" : "Nueva Línea de Investigación"}
            visible={visible}
            onHide={onHide}
        >
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="nombre">Nombre:</label>
                    <InputText
                        id="nombre"
                        value={current.nombre}
                        onChange={(e) => setCurrent({ ...current, nombre: e.target.value })}
                        placeholder="Nombre de la línea"
                    />

                    <label htmlFor="area">Área:</label>
                    <InputText
                        id="area"
                        value={current.area}
                        onChange={(e) => setCurrent({ ...current, area: e.target.value })}
                        placeholder="Área de investigación"
                    />
                </div>

                <Button
                    label="Guardar"
                    icon="pi pi-check"
                    onClick={save}
                    className="mt-3"
                />
            </div>
        </Dialog>
    );
};
