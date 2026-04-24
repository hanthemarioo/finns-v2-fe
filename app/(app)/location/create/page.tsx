"use client";

import Button from "@/components/form/Button";
import Input from "@/components/form/Input";
import Table from "@/components/form/Table";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";

export default function CreateLocationPage() {
    return (
        <div>
            <div className="flex items-center p-2 rounded-md gap-2">
                <div className="rounded bg-orange-500 text-white p-2">
                    <FeatherIcon icon="home" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">Tambah Lokasi</h2>
                    <h5>Tambahkan lokasi peternakan</h5>
                </div>
            </div>
            <div className="grid grid-cols-2 items-center p-2 rounded-md gap-2">
                <div className="p-6 rounded-lg shadow-lg">
                    <h1 className="text-xl mb-4">Tambah data baru</h1>
                    <Input name="name" label="Name" />
                    <Input name="location" label="Lokasi" />
                    <Input name="coordinate" label="Longitude, Latitude" />
                    <div className="flex gap-2 py-2">
                        <Button text="Simpan" color="orange" />
                        <Link href="/location">
                            <Button text="Batal" color="gray" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
