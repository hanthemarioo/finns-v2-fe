// app/flocks/tableColumns.tsx

import { TableColumn } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/formatDate";
import { Flock } from "@/types/flock";

export function createFlockTableColumns(onEdit: (flock: Flock) => void): TableColumn<Flock>[] {
    return [
        // { key: "id", label: "ID" },
        {
            key: "name",
            label: "Flock Name",
            render: (val) => <span className="font-medium text-gray-900">{val}</span>,
        },
        { key: "house_code", label: "Kode kandang" },
        { key: "age_in_day", label: "Umur dalam hari" },
        { key: "strain", label: "Strain" },
        {
            key: "start_date",
            label: "Tanggal mulai",
            render: (value: string) => (
                <span className="text-gray-500">{formatDate(value)}</span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (_val, row) => (
                <button
                    onClick={() => onEdit(row)}
                    className="px-3 py-1 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                    Edit
                </button>
            ),
        },
    ];
}