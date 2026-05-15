// app/users/tableColumns.tsx

import { TableColumn } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/formatDate";
import { User } from "@/types/user";

export function createUserTableColumns(
    onEdit: (user: User) => void,
    onDelete: (user: User) => void
): TableColumn<User>[] {
    return [
        {
            key: "name",
            label: "Name",
            render: (val) => <span className="font-medium text-gray-900">{val}</span>,
        },
        { key: "email", label: "Email" },
        {
            key: "phone_number",
            label: "Phone",
            render: (val) => val || <span className="text-gray-400">-</span>,
        },
        {
            key: "role",
            label: "Role",
            render: (val) => (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {String(val).replace("_", " ")}
                </span>
            ),
        },
        {
            key: "farm.name",
            label: "Farm",
            render: (val) => val || <span className="text-gray-400">-</span>,
        },
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(row)}
                        className="px-3 py-1 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];
}
