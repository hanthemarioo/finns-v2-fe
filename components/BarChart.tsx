"use client";

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
        {
            label: "Produksi Telur (ton)",
            data: [12, 19, 3, 5, 2, 8],
            backgroundColor: "#fd7e14",
        },
    ],
};

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Grafik Produksi Statik",
        },
    },
};

export default function BarChart() {
    return <Bar options={options} data={data} />;
}
