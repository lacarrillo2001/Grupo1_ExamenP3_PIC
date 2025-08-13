import type { InvestigadorLineaDisponibilidad } from "../../types/investigadorLineaDisponibilidad";

import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";

interface InvestigadorLineaDisponibilidadFormProps {
    visible: boolean;
    asignacion: InvestigadorLineaDisponibilidad;
    onHide(): void;
    onSave(asignacion: InvestigadorLineaDisponibilidad): void;
}

export const InvestigadorLineaDisponibilidadForm: React.FC<InvestigadorLineaDisponibilidadFormProps> = ({ visible, asignacion, onHide, onSave }) => {
    const [current, setCurrent] = useState<InvestigadorLineaDisponibilidad>(asignacion);

    useEffect(() => {
        setCurrent(asignacion);
    }, [asignacion]);

    const save = () => {
        onSave(current);
        onHide();
    };

    return (
        <Dialog header={asignacion.investigador_id ? "Editar Asignación" : "Nueva Asignación"} visible={visible} onHide={onHide}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="investigador_id">Investigador ID:</label>
                    <InputNumber
                        id="investigador_id"
                        value={current.investigador_id}
                        onValueChange={(e) => setCurrent({ ...current, investigador_id: e.value ?? 0 })}
                    />

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
                </div>
                <Button label="Guardar" icon="pi pi-check" onClick={save} className="mt-3" />
            </div>
        </Dialog>
    );
};
