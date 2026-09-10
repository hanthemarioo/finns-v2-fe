import { TableColumn } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/formatDate";
import { Farm } from "@/types/farm";
import { User } from "@/types/user";

export function createFarmTableColumns(
    onEdit: (farm: Farm) => void,
    onDelete: (farm: Farm) => void,
    user: User | null
): TableColumn<Farm>[] {

    const columns: TableColumn<Farm>[] = [
        {
            key: "name",
            label: "Farm Name",
            render: (val: string) => (
                <span className="font-medium text-gray-900">{val}</span>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (val: string) => (
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
    ];

    if (user?.role === "super_admin") {
        columns.push({
            key: "actions",
            label: "Actions",
            render: (_val: string, row: Farm) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                        Edit
                    </button>
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
        });
    }

    return columns;
}
