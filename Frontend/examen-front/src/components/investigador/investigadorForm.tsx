import type { Investigador } from "../../types/investigador";

import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

interface InvestigadorFormProps {
    visible: boolean;
    investigador: Investigador;
    onHide(): void;
    onSave(investigador: Investigador): void;
}

export const InvestigadorForm: React.FC<InvestigadorFormProps> = ({ visible, investigador, onHide, onSave }) => {
    const [current, setCurrent] = useState<Investigador>(investigador);

    useEffect(() => {
        setCurrent(investigador);
    }, [investigador]);

    const save = () => {
        onSave(current);
        onHide();
    };

    return (
        <Dialog header={investigador.id ? "Editar Investigador" : "Nuevo Investigador"} visible={visible} onHide={onHide}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="nombre">Nombre:</label>
                    <InputText
                        id="nombre"
                        value={current.nombre}
                        onChange={(e) => setCurrent({ ...current, nombre: e.target.value })}
                        placeholder="Nombre"
                    />

                    <label htmlFor="apellido">Apellido:</label>
                    <InputText
                        id="apellido"
                        value={current.apellido}
                        onChange={(e) => setCurrent({ ...current, apellido: e.target.value })}
                        placeholder="Apellido"
                    />

                    <label htmlFor="departamento">Departamento:</label>
                    <InputText
                        id="departamento"
                        value={current.departamento}
                        onChange={(e) => setCurrent({ ...current, departamento: e.target.value })}
                        placeholder="Departamento"
                    />

                    <label htmlFor="experiencia">Experiencia (años):</label>
                    <InputNumber
                        id="experiencia"
                        value={current.experiencia}
                        onValueChange={(e) => setCurrent({ ...current, experiencia: e.value ?? 0 })}
                    />
                </div>
                <Button label="Guardar" icon="pi pi-check" onClick={save} className="mt-3" />
            </div>
        </Dialog>
    );
};
