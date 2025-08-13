import type React from "react";
import type { Disponibilidad } from "../../types/disponibilidad";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";

interface DisponibilidadTableProps {
    disponibilidades: Disponibilidad[];
    onEdit(item: Disponibilidad): void;
    onDelete(item: Disponibilidad): void;
}

export const DisponibilidadTable: React.FC<DisponibilidadTableProps> = ({ disponibilidades, onEdit, onDelete }) => {

    const actionBodyTemplate = (rowData: Disponibilidad) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => onDelete(rowData)} />
        </>
    );

    // Ejemplo booleano
    const activoTemplate = (rowData: Disponibilidad) => (
        <span>{rowData.activo ? 'Sí' : 'No'}</span>
    );

    // Formatear fecha si aplica
    const fechaTemplate = (rowData: Disponibilidad) => {
        if(!rowData.fecha) return 'N/A';
        const iso = typeof rowData.fecha === 'string' ? rowData.fecha.replace(' ', 'T') : rowData.fecha;
        const fecha = new Date(iso);
        if(isNaN(fecha.getTime())) return 'Fecha inválida';
        return fecha.toLocaleDateString('es-EC');
    };

    return (
        <DataTable value={disponibilidades} header="Gestión de Disponibilidades" responsiveLayout="scroll">
            <Column field="id" header="ID" />
            <Column field="descripcion" header="Descripción" />
            <Column field="activo" header="Activo" body={activoTemplate} />
            <Column field="fecha" header="Fecha" body={fechaTemplate} />
            <Column header="Acciones" body={actionBodyTemplate} />
        </DataTable>
    );
};
