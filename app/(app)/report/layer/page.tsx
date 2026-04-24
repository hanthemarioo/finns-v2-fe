"use client";

import Button from "@/components/form/Button";
import Table from "@/components/form/Table";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";

export default function ReportLayerPage() {
    const columns = [
        { key: 'name', label: 'Nama', sortable: true },
        { key: 'location', label: 'Lokasi', sortable: true },
        { key: 'coordinate', label: 'Longitude, Latitude', sortable: true },
    ];

    const data = [
        { name: 'John Doe', location: 'John Doe', coordinate: 28 },
        { name: 'Jane Smith', location: 'Jane Smith', coordinate: 34 },
        { name: 'Sam Green', location: 'Sam Green', coordinate: 45 },
        { name: 'Andra Tisna', location: 'Andra Tisna', coordinate: 4 },
        { name: 'Satya Wira', location: 'Satya Wira', coordinate: 45 },
        { name: 'Awangtukam', location: 'Awangtukam', coordinate: 45 },
    ];
    return (
        <div>
            <div className="flex items-center p-2 rounded-md gap-2">
                <div className="rounded bg-orange-500 text-white p-2">
                    <FeatherIcon icon="file-minus" />
                </div>
                <h2 className="text-2xl font-semibold">Report Fase Layer</h2>
            </div>

        </div>
    );
}
