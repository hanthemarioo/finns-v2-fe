"use client";

import { useState } from "react";
import { Farm } from "@/types/farm";
import { Input } from "@/components/form/Input";
import { Option, Select } from "@/components/form/Select";

interface FarmModalProps {
    farm: Farm | null;
    onClose: () => void;
    onSuccess: () => void;
}

// Pisahkan opsi ke constant agar rapi
const FARM_TYPE_OPTIONS: Option[] = [
    { label: "Layer", value: "layer" },
    { label: "Grower", value: "grower" },
];

export function FarmModal({ farm, onClose, onSuccess }: FarmModalProps) {
    const isEditing = !!farm;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: farm?.name || "",
        type: farm?.type || "",
        location: farm?.location || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.type || !form.location) {
            return setError("Semua field wajib diisi.");
        }

        setSubmitting(true);
        setError(null);

        const url = isEditing ? `/api/proxy/farms/${farm.id}` : "/api/proxy/farms";

        try {
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.message || "Gagal menyimpan farm.");
            }

            onSuccess(); // Refresh & tutup modal
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {isEditing ? "Edit Farm" : "Tambah Farm"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
                </div>

                {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    <Input
                        label="Nama Farm"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Contoh: Farm Alpha"
                        required
                    />

                    <Select
                        label="Tipe Farm"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        options={FARM_TYPE_OPTIONS}
                        placeholder="-- Pilih Tipe --"
                        required
                    />

                    <Input
                        label="Lokasi"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Contoh: Jawa Barat"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50">
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {submitting ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </div>
        </div>
    );
}