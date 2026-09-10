// app/flocks/tableColumns.tsx

import { TableColumn } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/formatDate";
import { Flock } from "@/types/flock";

export function createFlockTableColumns(
    onEdit: (flock: Flock) => void,
    onClose: (flock: Flock) => void,
    onDelete: (flock: Flock) => void
): TableColumn<Flock>[] {
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
            key: "status",
            label: "Status",
            render: (value: string) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    value === "closed"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-green-100 text-green-700"
                }`}>
                    {value}
                </span>
            ),
        },
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                        Edit
                    </button>
                    {row.status === "active" && row.can_delete === false && (
                        <button
                            onClick={() => onClose(row)}
                            className="px-3 py-1 text-xs rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                            Close
                        </button>
                    )}
                    {row.can_delete && (
                        <button
                            onClick={() => onDelete(row)}
                            className="px-3 py-1 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ),
        },
    ];
}
