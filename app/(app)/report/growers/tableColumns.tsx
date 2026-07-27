import { TableColumn } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/formatDate";
import type { GrowerReportRow } from "@/types/grower-report";

function numberText(value: number | null | undefined, suffix = "") {
    if (value === null || value === undefined) return "-";
    return `${value.toLocaleString("id-ID")}${suffix}`;
}

export function createGrowerReportTableColumns(): TableColumn<GrowerReportRow>[] {
    return [
        {
            key: "date",
            label: "Tanggal",
            render: (value: string) => (
                <span className="text-gray-500">{formatDate(value)}</span>
            ),
        },
        {
            key: "age_week",
            label: "Umur Minggu",
            render: (value: number | null) => <span>{numberText(value)}</span>,
        },
        {
            key: "population",
            label: "Populasi",
            render: (value: number) => <span>{numberText(value)}</span>,
        },
        {
            key: "mortality",
            label: "Mati",
            render: (value: number) => <span>{numberText(value)}</span>,
        },
        {
            key: "culling",
            label: "Afkir",
            render: (value: number) => <span>{numberText(value)}</span>,
        },
        {
            key: "mortality_percent",
            label: "Mortalitas",
            render: (value: number) => <span>{numberText(value, "%")}</span>,
        },
        {
            key: "feed_total_kg",
            label: "Pakan",
            render: (value: number) => <span>{numberText(value, " kg")}</span>,
        },
        {
            key: "feed_gram_per_bird",
            label: "Pakan/Ekor",
            render: (value: number) => <span>{numberText(value, " g")}</span>,
        },
        {
            key: "water_total_l",
            label: "Air",
            render: (value: number) => <span>{numberText(value, " l")}</span>,
        },
        {
            key: "water_ml_per_bird",
            label: "Air/Ekor",
            render: (value: number) => <span>{numberText(value, " ml")}</span>,
        },
        {
            key: "actual_body_weight_g",
            label: "Bobot Aktual",
            render: (value: number) => <span>{numberText(value, " g")}</span>,
        },
        {
            key: "standard_body_weight_g",
            label: "Bobot Standar",
            render: (value: number | null) => <span>{numberText(value, " g")}</span>,
        },
        {
            key: "actual_uniformity_percent",
            label: "Uniformity",
            render: (value: number | null) => <span>{numberText(value, "%")}</span>,
        },
    ];
}
