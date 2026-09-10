"use client";

import { useState, useEffect } from "react";
import { Flock } from "@/types/flock";
import { Input } from "@/components/form/Input";
import { Option, Select } from "@/components/form/Select";
import { Farm } from "@/types/farm";

interface FlockModalProps {
    flock: Flock | null;
    onClose: () => void;
    onSuccess: () => void;
}

function dateInputValue(value: string | null | undefined) {
    if (!value) return "";

    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.slice(0, 10);
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export function FlockModal({ flock, onClose, onSuccess }: FlockModalProps) {
    const isEditing = !!flock;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State untuk opsi farm yang didapat dari API
    const [farmOptions, setFarmOptions] = useState<Option[]>([]);

    // State untuk form utama
    const [form, setForm] = useState({
        farm_id: flock?.farm_id?.toString() || "",
        name: flock?.name || "",
        house_code: flock?.house_code || "",
        age_in_day: flock?.age_in_day?.toString() || "",
        strain: flock?.strain || "",
        start_date: dateInputValue(flock?.start_date),
    });

    // State khusus untuk array dinamis kandang (coops)
    const [coops, setCoops] = useState<{ name: string; initial_population: number | "" }[]>(
        flock?.coops || []
    );

    // Fetch data farm saat komponen dimuat
    useEffect(() => {
        const fetchFarms = async () => {
            try {
                // Sesuaikan endpoint ini dengan endpoint API list farm kamu
                const res = await fetch("/api/proxy/farms");

                if (res.ok) {
                    const data = (await res.json()).data;
                    const options = data.map((farm: Farm) => ({
                        label: `${farm.name} - (${farm.type})`,
                        value: farm.id.toString(),
                    }));
                    setFarmOptions(options);
                }
            } catch (err) {
                console.error("Gagal mengambil data farm:", err);
            }
        };

        fetchFarms();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Fungsi untuk menambah field kandang
    const handleAddCoop = () => {
        setCoops((prev) => [
            ...prev,
            { name: `Kandang ${prev.length + 1}`, initial_population: "" },
        ]);
    };

    // Fungsi untuk menghapus semua field kandang
    const handleResetCoops = () => {
        setCoops([]);
    };

    // Fungsi untuk menangani perubahan input populasi pada kandang tertentu
    const handleCoopChange = (index: number, value: string) => {
        const newCoops = [...coops];
        newCoops[index].initial_population = value === "" ? "" : Number(value);
        setCoops(newCoops);
    };

    const handleSubmit = async () => {
        if (
            !form.farm_id ||
            !form.name ||
            !form.house_code ||
            !form.age_in_day ||
            !form.strain ||
            !form.start_date
        ) {
            return setError("Semua field utama wajib diisi.");
        }

        if (coops.some((c) => c.initial_population === "" || c.initial_population <= 0)) {
            return setError("Pastikan semua kandang memiliki jumlah populasi yang valid.");
        }

        setSubmitting(true);
        setError(null);

        // Susun payload sesuai dengan struktur JSON yang diminta
        const payload = {
            ...form,
            farm_id: Number(form.farm_id),
            age_in_day: Number(form.age_in_day),
            coops: coops,
        };

        const url = isEditing ? `/api/proxy/flocks/${flock.id}` : "/api/proxy/flocks";

        try {
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.message || "Gagal menyimpan flock.");
            }

            onSuccess(); // Refresh & tutup modal
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            {/* Ditambahkan max-h-[90vh] dan overflow-y-auto agar modal bisa di-scroll jika field banyak */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isEditing ? "Edit Flock" : "Tambah Flock"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="space-y-4 flex-1">
                    {isEditing ? <Input
                        readOnly
                        label="Pilih Farm"
                        name="farm_id"
                        value={flock.farm.name}
                        onChange={handleChange}
                        placeholder="-- Pilih Farm --"
                        required
                    /> : <Select
                        label="Pilih Farm"
                        name="farm_id"
                        value={form.farm_id}
                        onChange={handleChange}
                        options={farmOptions}
                        placeholder="-- Pilih Farm --"
                        required
                    />}

                    <Input
                        label="Nama Flock"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Contoh: flock 4"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            readOnly={isEditing}
                            label="House Code"
                            name="house_code"
                            value={form.house_code}
                            onChange={handleChange}
                            placeholder="Contoh: 20260420Flock4"
                            required
                        />
                        <Input
                            readOnly={isEditing}
                            type="date"
                            label="Start Date"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            readOnly={isEditing}
                            type="number"
                            label="Age in Day"
                            name="age_in_day"
                            value={form.age_in_day}
                            onChange={handleChange}
                            placeholder="Contoh: 56"
                            required
                        />
                        {/* <Select
                            label="Strain"
                            name="strain"
                            value={form.strain}
                            onChange={handleChange}
                            options={Flock_TYPE_OPTIONS}
                            placeholder="-- Pilih Strain --"
                            required
                        /> */}
                        <Input
                            readOnly={isEditing}
                            label="Strain"
                            name="strain"
                            value={form.strain}
                            onChange={handleChange}
                            placeholder="Contoh: Loghmann Brown"
                            required
                        />
                    </div>

                    <hr className="my-4 border-gray-200" />

                    {/* Bagian Dynamic Coops */}
                    <div className="space-y-3">
                        {!isEditing && <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleAddCoop}
                                className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-3 py-1.5 rounded-lg flex items-center transition-colors"
                            >
                                Tambah Kandang <span className="ml-1 text-lg leading-none">+</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleResetCoops}
                                className="bg-[#ff4757] hover:bg-[#ff6b81] text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Reset Kandang
                            </button>
                        </div>}

                        <div className="space-y-2 mt-4">
                            {coops.map((coop, index) => (
                                <div
                                    key={index}
                                    className="flex rounded border border-gray-200 overflow-hidden shadow-sm"
                                >
                                    <div className="bg-gray-100 text-gray-600 px-4 py-2 border-r border-gray-200 flex items-center min-w-[120px] justify-center text-sm">
                                        {coop.name}
                                    </div>
                                    <input
                                        readOnly={isEditing}
                                        type="number"
                                        min="0"
                                        className="flex-1 px-4 py-2 text-sm outline-none focus:bg-gray-50 transition-colors"
                                        placeholder="Jumlah Ayam"
                                        value={coop.initial_population}
                                        onChange={(e) => handleCoopChange(index, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors"
                    >
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
