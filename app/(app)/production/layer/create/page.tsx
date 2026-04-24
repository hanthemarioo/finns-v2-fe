"use client";

import Button from "@/components/form/Button";
import Input from "@/components/form/Input";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";

export default function CreateProductionLayerPage() {
    return (
        <div>
            <div className="flex items-center p-2 rounded-md gap-2">
                <div className="rounded bg-orange-500 text-white p-2">
                    <FeatherIcon icon="home" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">Produksi Layer</h2>
                    <h5>Input detail produksi layer harian disini</h5>
                </div>
            </div>
            <div className="grid grid-cols-2 items-center p-2 rounded-md gap-2">
                <div className="p-6 rounded-lg shadow-lg">
                    <h1 className="text-xl mb-4">Tambah data baru</h1>
                    <Input name="location" label="Pilih Lokasi" />
                    <Input name="flock" label="Pilih Flock" />
                    <Input name="shed" label="Pilih Kandang" />
                    <Input name="date" label="Pilih Tanggal" />
                    <Input name="feed" label="Masukkan Jumlah Pakan" />
                    <Input name="drink" label="Masukkan Jumlah Minum" />
                    <Input name="death" label="Masukkan Jumlah Kematian" />
                    <Input name="afkir" label="Masukkan Jumlah Afkir" />
                    <div className="flex gap-2 py-2">
                        <Button text="Simpan" color="orange" />
                        <Link href="/production/layer">
                            <Button text="Batal" color="gray" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
