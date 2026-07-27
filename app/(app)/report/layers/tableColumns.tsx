import { TableColumn } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/formatDate";
import type { LayerReportRow } from "@/types/layer-report";

function numberText(value: number | null | undefined, suffix = "") {
    if (value === null || value === undefined) return "-";
    return `${value.toLocaleString("id-ID")}${suffix}`;
}

export function createLayerReportTableColumns(): TableColumn<LayerReportRow>[] {
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
            key: "age_day",
            label: "Umur Hari",
            render: (value: number | null) => <span>{numberText(value)}</span>,
        },
        {
            key: "current_population",
            label: "Populasi",
            render: (value: number) => <span>{numberText(value)}</span>,
        },
        {
            key: "mortality",
            label: "Mati",
            render: (value: number) => <span>{numberText(value)}</span>,
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
            key: "normal_egg_count",
            label: "Telur Normal",
            render: (value: number) => <span>{numberText(value)}</span>,
        },
        {
            key: "normal_egg_weight_kg",
            label: "Berat Normal",
            render: (value: number) => <span>{numberText(value, " kg")}</span>,
        },
        {
            key: "sorted_egg_count",
            label: "Telur Sortir",
            render: (value: number) => <span>{numberText(value)}</span>,
        },
        {
            key: "broken_egg_count",
            label: "Telur Pecah",
            render: (value: number) => <span>{numberText(value)}</span>,
        },
        {
            key: "spoiled_egg_count",
            label: "Telur Busuk",
            render: (value: number) => <span>{numberText(value)}</span>,
        },
        {
            key: "avg_egg_weight_g",
            label: "Avg Egg",
            render: (value: number) => <span>{numberText(value, " g")}</span>,
        },
        {
            key: "hen_day_production",
            label: "HDP",
            render: (value: number) => <span>{numberText(value, "%")}</span>,
        },
        {
            key: "fcr",
            label: "FCR",
            render: (value: number) => <span>{numberText(value)}</span>,
        },
    ];
}
