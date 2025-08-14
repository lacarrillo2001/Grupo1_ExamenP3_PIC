import type React from "react";
import type { LineaInvestigacio } from "../../types/lineaInvestigacio";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";

interface LIFTableProps {
    items: LineaInvestigacioForm[];
    onEdit(item: LineaInvestigacioForm): void;
    onDelete(item: LineaInvestigacioForm): void;
}

export const LineaInvestigacioFormTable: React.FC<LIFTableProps> = ({ items, onEdit, onDelete }) => {

    const actionBodyTemplate = (rowData: LineaInvestigacioForm) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => onDelete(rowData)} />
        </>
    );

    return (
        <DataTable value={items} header="Gestión de Línea Investigación Form" responsiveLayout="scroll">
            <Column field="id" header="ID" />
            <Column field="nombre" header="Nombre" />
            <Column field="descripcion" header="Descripción" />
            <Column header="Acciones" body={actionBodyTemplate} />
        </DataTable>
    );
};
