"use client";

import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatDate } from "@/lib/formatDate";
import { ChartPoint } from "../types/dashboard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type EggChartProps = {
    data: ChartPoint[];
};

function eggValue(item: ChartPoint) {
    return item.total_egg ?? item.total_eggs ?? item.egg_total ?? item.value ?? 0;
}

export default function EggChart({ data }: EggChartProps) {
    const chartData = {
        labels: data.map((item) => item.date ? formatDate(item.date) : item.label ?? ""),
        datasets: [
            {
                label: "Egg Production",
                data: data.map(eggValue),
                backgroundColor: "#f97316",
            },
        ],
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <Bar data={chartData} />
        </div>
    );
}
