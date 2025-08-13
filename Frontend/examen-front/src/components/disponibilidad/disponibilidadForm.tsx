import type { Disponibilidad } from "../../types/disponibilidad";

import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

interface DisponibilidadFormProps {
    visible: boolean;
    disponibilidad: Disponibilidad;
    onHide(): void;
    onSave(disponibilidad: Disponibilidad): void;
}

export const DisponibilidadForm: React.FC<DisponibilidadFormProps> = ({ visible, disponibilidad, onHide, onSave }) => {
    const [current, setCurrent] = useState<Disponibilidad>(disponibilidad);

    useEffect(() => {
        setCurrent(disponibilidad);
    }, [disponibilidad]);

    const save = () => {
        onSave(current);
        onHide();
    };

    return (
        <Dialog header={disponibilidad.id ? "Editar Disponibilidad" : "Nueva Disponibilidad"} visible={visible} onHide={onHide}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="franja_horaria">Franja Horaria:</label>
                    <InputText
                        id="franja_horaria"
                        value={current.franja_horaria}
                        onChange={(e) => setCurrent({ ...current, franja_horaria: e.target.value })}
                        placeholder="Franja horaria"
                    />

                    <label htmlFor="modalidad">Modalidad:</label>
                    <InputText
                        id="modalidad"
                        value={current.modalidad}
                        onChange={(e) => setCurrent({ ...current, modalidad: e.target.value })}
                        placeholder="Modalidad"
                    />
                </div>
                <Button label="Guardar" icon="pi pi-check" onClick=
