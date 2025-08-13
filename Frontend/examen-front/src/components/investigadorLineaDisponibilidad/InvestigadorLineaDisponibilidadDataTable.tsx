import type React from "react";
import type { InvestigadorLineaDisponibilidad } from "../../types/investigadorLineaDisponibilidad";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";

interface ILDTableProps {
    items: InvestigadorLineaDisponibilidad[];
    onEdit(item: InvestigadorLineaDisponibilidad): void;
    onDelete(item: InvestigadorLineaDisponibilidad): void;
}

export const InvestigadorLineaDisponibilidadTable: React.FC<ILDTableProps> = ({ items, onEdit, onDelete }) => {

    const actionBodyTemplate = (rowData: InvestigadorLineaDisponibilidad) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => onDelete(rowData)} />
        </>
    );

    return (
        <DataTable value={items} header="Gestión de Investigador - Línea Disponibilidad" responsiveLayout="scroll">
            <Column field="id" header="ID" />
            <Column field="investigadorNombre" header="Investigador" />
            <Column field="lineaDisponibilidadNombre" header="Línea Disponibilidad" />
            <Column header="Acciones" body={actionBodyTemplate} />
        </DataTable>
    );
};
