// app/production/growers/tableColumns.tsx

import { TableColumn } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/formatDate";
import { GrowerProduction } from "@/types/grower-production";

export function createGrowerProductionTableColumns(onEdit: (growerProduction: GrowerProduction) => void): TableColumn<GrowerProduction>[] {
    return [
        // { key: "id", label: "ID" },
        {
            key: "date",
            label: "Tanggal",
            render: (value: string) => (
                <span className="text-gray-500">{formatDate(value)}</span>
            ),
        },
        {
            key: "coop",
            label: "Peternakan",
            render: (value: any) => (
                <span className="font-medium text-gray-900">{value.flock.farm.name}</span>
            )
        },
        {
            key: "coop",
            label: "Nama Flock",
            render: (value: any) => (
                <span className="font-medium text-gray-900">{value.flock.name}</span>
            )
        },
        {
            key: "coop",
            label: "Kandang",
            render: (value: any) => (
                <span className="font-medium text-gray-900">{value.name}</span>
            )
        },
        {
            key: "feed_kg",
            label: "Pakan",
            render: (value: string) => (
                <span>{value} kg</span>
            )
        },
        {
            key: "water_l",
            label: "Minum",
            render: (value: string) => (
                <span>{value} l</span>
            )
        },
        {
            key: "avg_body_weight_kg",
            label: "Bobot",
            render: (value: string) => (
                <span>{value} kg</span>
            )
        },
        {
            key: "mortality_count",
            label: "Kematian",
        },
        {
            key: "culling_count",
            label: "Afkir",
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