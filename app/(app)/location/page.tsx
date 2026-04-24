"use client";

import Button from "@/components/form/Button";
import Table from "@/components/form/Table";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";

export default function LocationPage() {
    const columns = [
        { key: 'name', label: 'Nama', sortable: true },
        { key: 'location', label: 'Lokasi', sortable: true },
        { key: 'coordinate', label: 'Longitude, Latitude', sortable: true },
    ];

    const data = [
        { name: 'John Doe', location: 'John Doe', coordinate: '234.29573, 1627.30473' },
        { name: 'Jane Smith', location: 'Jane Smith', coordinate: '234.29573, 1627.30473' },
        { name: 'Sam Green', location: 'Sam Green', coordinate: '234.29573, 1627.30473' },
        { name: 'Andra Tisna', location: 'Andra Tisna', coordinate: '234.29573, 1627.30473' },
        { name: 'Satya Wira', location: 'Satya Wira', coordinate: '234.29573, 1627.30473' },
        { name: 'Awangtukam', location: 'Awangtukam', coordinate: '234.29573, 1627.30473' },
    ];
    return (
        <div>
            <div className="flex items-center p-2 rounded-md gap-2">
                <div className="rounded bg-orange-500 text-white p-2">
                    <FeatherIcon icon="home" />
                </div>
                <h2 className="text-2xl font-semibold">Daftar Lokasi</h2>
            </div>

            <div className="my-4">
                <Link href="/location/create">
                    <Button text="+ Tambah Lokasi" color="gray" />
                </Link>
            </div>
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
