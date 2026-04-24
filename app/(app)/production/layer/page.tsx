"use client";

import Button from "@/components/form/Button";
import Table from "@/components/form/Table";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";

export default function ProduksiLayerPage() {
    const columns = [
        { key: 'date', label: 'Tanggal', sortable: true },
        { key: 'location', label: 'Lokasi', sortable: true },
        { key: 'flock_name', label: 'Nama Flock', sortable: true },
        { key: 'place', label: 'Kandang' },
        { key: 'food', label: 'Pakan' },
        { key: 'drink', label: 'Minum' },
        { key: 'death', label: 'Kematian' },
        { key: 'afkir', label: 'Afkir' },
    ];

    const data = [
        { date: '2025-06-18', location: 'John Doe', flock_name: 'Admin Flock', place: '123 Main St', food: '10 kg', drink: '1 L', death: 0, afkir: 0 },
        { date: '2025-06-18', location: 'Jane Smith', flock_name: 'Admin Flock', place: '456 Elm St', food: '10 kg', drink: '1 L', death: 0, afkir: 0 },
        { date: '2025-06-18', location: 'Sam Green', flock_name: 'Admin Flock', place: '789 Oak St', food: '10 kg', drink: '1 L', death: 0, afkir: 0 },
        { date: '2025-06-18', location: 'Andra Tisna', flock_name: 'Admin Flock', place: 'P. Sumadi', food: '10 kg', drink: '1 L', death: 0, afkir: 0 },
        { date: '2025-06-18', location: 'Satya Wira', flock_name: 'Admin Flock', place: 'P. Sumadi', food: '10 kg', drink: '1 L', death: 0, afkir: 0 },
        { date: '2025-06-18', location: 'Awangtukam', flock_name: 'Admin Flock', place: 'Demangans', food: '10 kg', drink: '1 L', death: 0, afkir: 0 },
    ];
    return (
        <div>
            <div className="flex items-center p-2 rounded-md gap-2">
                <div className="rounded bg-orange-500 text-white p-2">
                    <FeatherIcon icon="plus-circle" />
                </div>
                <h2 className="text-2xl font-semibold">List produksi Ayam Fase Layer</h2>
            </div>

            <Link href="/production/layer/create">
                <Button text="+ Input Data Produksi" color="gray" />
            </Link>
            <Table
                columns={columns}
                data={data}
                searchable
                sortable
                pagination
                actions={["edit", "delete"]}
                onRowClick={(row) => console.log('Row clicked:', row)}
            />
        </div>
    );
}
