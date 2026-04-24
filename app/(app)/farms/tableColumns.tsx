// app/farms/tableColumns.tsx

import { TableColumn } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/formatDate";
import { Farm } from "@/types/farm";

export function createFarmTableColumns(onEdit: (farm: Farm) => void): TableColumn<Farm>[] {
    return [
        { key: "id", label: "ID" },
        {
            key: "name",
            label: "Farm Name",
            render: (val) => <span className="font-medium text-gray-900">{val}</span>,
        },
        {
            key: "type",
            label: "Type",
            render: (val) => (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {val}
                </span>
            ),
        },
        { key: "location", label: "Location" },
        {
            key: "created_at",
            label: "Created At",
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