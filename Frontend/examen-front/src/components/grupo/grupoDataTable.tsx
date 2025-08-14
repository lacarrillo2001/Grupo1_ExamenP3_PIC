import type React from "react";
import type { Grupo } from "../../types/grupo";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";

interface GrupoTableProps {
    grupos: Grupo[];
    onEdit(item: Grupo): void;
    onDelete(item: Grupo): void;
}

export const GrupoTable: React.FC<GrupoTableProps> = ({ grupos, onEdit, onDelete }) => {

    const actionBodyTemplate = (rowData: Grupo) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => onDelete(rowData)} />
        </>
    );

    return (
        <DataTable value={grupos} header="Gestión de Grupos" responsiveLayout="scroll">
            <Column field="id" header="ID" />
            <Column field="nombre" header="Nombre" />
            <Column field="descripcion" header="Descripción" />
            <Column header="Acciones" body={actionBodyTemplate} />
        </DataTable>
    );
};
