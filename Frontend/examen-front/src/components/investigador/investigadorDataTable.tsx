import type React from "react";
import type { Investigador } from "../../types/investigador";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";

interface InvestigadorTableProps {
    investigadores: Investigador[];
    onEdit(item: Investigador): void;
    onDelete(item: Investigador): void;
}

export const InvestigadorTable: React.FC<InvestigadorTableProps> = ({ investigadores, onEdit, onDelete }) => {

    const actionBodyTemplate = (rowData: Investigador) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => onDelete(rowData)} />
        </>
    );

    return (
        <DataTable value={investigadores} header="Gestión de Investigadores" responsiveLayout="scroll">
            <Column field="id" header="ID" />
            <Column field="nombre" header="Nombre" />
            <Column field="correo" header="Correo" />
            <Column field="telefono" header="Teléfono" />
            <Column header="Acciones" body={actionBodyTemplate} />
        </DataTable>
    );
};
