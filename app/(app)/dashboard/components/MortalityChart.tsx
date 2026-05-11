"use client";

import { ChartPoint } from "../types/dashboard";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface MortalityChartProps {
    data: ChartPoint[];
}

export default function MortalityChart({ data }: MortalityChartProps) {

    const chartData = {
        labels: data.map((item) => item.date ?? item.label ?? ""),

        datasets: [
            {
                label: "Mortality",
                data: data.map((item) => item.total_mortality ?? item.value ?? 0),
                backgroundColor: "#ef4444",
            },
        ],
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <Bar data={chartData} />
        </div>
    );
}
