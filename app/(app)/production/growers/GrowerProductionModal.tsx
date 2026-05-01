"use client";

import { useState, useEffect } from "react";
import { GrowerProduction } from "@/types/grower-production";
import { Input } from "@/components/form/Input";
import { Option, Select } from "@/components/form/Select";
import { Farm } from "@/types/farm";
import { Flock } from "@/types/flock";
import { Coop } from "@/types/coop";

interface GrowerProductionModalProps {
    growerProduction: GrowerProduction | null;
    onClose: () => void;
    onSuccess: () => void;
}

type FormState = {
    farm_id: string;
    flock_id: string;
    coop_id: string;
    feed_kg: string;
    water_l: string;
    avg_body_weight_kg: string;
    mortality_count: string;
    culling_count: string;
};

type SelectField = "farm_id" | "flock_id" | "coop_id";

export function GrowerProductionModal({ growerProduction, onClose, onSuccess }: GrowerProductionModalProps) {
    console.log(growerProduction);

    const isEditing = !!growerProduction;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State untuk opsi farm yang didapat dari API
    const [farmOptions, setFarmOptions] = useState<Option[]>([]);
    const [flockOptions, setFlockOptions] = useState<Option[]>([]);
    const [coopOptions, setCoopOptions] = useState<Option[]>([]);

    // State untuk form utama
    const [form, setForm] = useState<FormState>({
        farm_id: growerProduction?.coop?.flock?.farm?.id.toString() || "",
        flock_id: growerProduction?.coop?.flock?.id.toString() || "",
        coop_id: growerProduction?.coop_id?.toString() || "",
        feed_kg: growerProduction?.feed_kg ?? "",
        water_l: growerProduction?.water_l ?? "",
        avg_body_weight_kg: growerProduction?.avg_body_weight_kg ?? "",
        mortality_count: growerProduction?.mortality_count ?? "",
        culling_count: growerProduction?.culling_count ?? "",
    });

    const fieldDependencies: Partial<Record<SelectField, SelectField[]>> = {
        farm_id: ["flock_id", "coop_id"],
        flock_id: ["coop_id"],
    };

    // Fetch data farm saat komponen dimuat
    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const res = await fetch("/api/proxy/farms?type=grower");

                if (res.ok) {
                    const data = (await res.json()).data;

                    if (data.length === 0) {
                        const options = [{
                            label: "Farm tidak ditemukan!",
                            value: "",
                            disabled: true,
                        }];
                        setFarmOptions(options);
                        return;
                    }

                    const options = data.map((farm: Farm) => ({
                        label: farm.name,
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

    // Fetch data flock setelah fetch data farm
    useEffect(() => {
        if (form.farm_id === "") return;

        const fetchFlocks = async () => {
            try {
                const res = await fetch(`/api/proxy/flocks?farm_id=${form.farm_id}`);

                if (res.ok) {
                    const data = (await res.json()).data;

                    if (data.length === 0) {
                        const options = [{
                            label: "Flock tidak ditemukan!",
                            value: "",
                            disabled: true,
                        }];
                        setFlockOptions(options);
                        return;
                    }

                    const options = data.map((flock: Flock) => ({
                        label: flock.name,
                        value: flock.id.toString(),
                    }));
                    setFlockOptions(options);
                }
            } catch (err) {
                console.error("Gagal mengambil data flock:", err);
            }
        };

        fetchFlocks();
    }, [form.farm_id]);

    // Fetch data coop setelah fetch data flock
    useEffect(() => {
        if (form.flock_id === "") return;

        const fetchCoops = async () => {
            try {
                const res = await fetch(`/api/proxy/coops?flock_id=${form.flock_id}`);

                if (res.ok) {
                    const data = (await res.json()).data;

                    if (data.length === 0) {
                        const options = [{
                            label: "Kandang tidak ditemukan!",
                            value: "",
                            disabled: true,
                        }];
                        setCoopOptions(options);
                        return;
                    }

                    const options = data.map((coop: Coop) => ({
                        label: coop.name,
                        value: coop.id.toString(),
                    }));
                    setCoopOptions(options);
                }
            } catch (err) {
                console.error("Gagal mengambil data coop:", err);
            }
        };

        fetchCoops();
    }, [form.flock_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const fieldName = name as keyof FormState;

        setForm((prev) => {
            const updated: FormState = {
                ...prev,
                [fieldName]: value as string | number,
            };

            if (fieldName in fieldDependencies) {
                const dependencies = fieldDependencies[fieldName as SelectField];

                dependencies?.forEach((dep) => {
                    updated[dep] = "";
                });
            }

            return updated;
        });

        if (fieldName === "farm_id") {
            setFlockOptions([]);
            setCoopOptions([]);
        }

        if (fieldName === "flock_id") {
            setCoopOptions([]);
        }
    };

    const handleSubmit = async () => {
        // console.log(form);

        // if (
        //     !form.coop_id ||
        //     !form.feed_kg ||
        //     !form.water_l ||
        //     !form.avg_body_weight_kg ||
        //     !form.mortality_count ||
        //     !form.culling_count ||
        //     !form.marketable_eggs_count ||
        //     !form.marketable_eggs_weight_kg ||
        //     !form.sorted_eggs_count ||
        //     !form.sorted_eggs_weight_kg ||
        //     !form.spoiled_eggs_count ||
        //     !form.spoiled_eggs_weight_kg ||
        //     !form.broken_eggs_count ||
        //     !form.broken_eggs_weight_kg
        // ) {
        //     return setError("Semua field utama wajib diisi.");
        // }

        setSubmitting(true);
        setError(null);

        // Susun payload sesuai dengan struktur JSON yang diminta
        const payload = {
            ...form,
            coop_id: Number(form.coop_id),
            feed_kg: Number(form.feed_kg),
            water_l: Number(form.water_l),
            avg_body_weight_kg: Number(form.avg_body_weight_kg),
            mortality_count: Number(form.mortality_count),
            culling_count: Number(form.culling_count),
        };

        const url = isEditing ? `/api/proxy/grower-phases/${growerProduction.id}` : "/api/proxy/grower-phases";

        try {
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                setError(errData?.message);
                throw new Error(errData?.message || "Gagal menyimpan Grower Production.");
            }

            onSuccess(); // Refresh & tutup modal
        } catch (err: any) {
            setError(err.message);
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
                        {isEditing ? "Edit Produksi Grower" : "Tambah Produksi Grower"}
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
                    <Select
                        label="Pilih Farm"
                        name="farm_id"
                        value={form.farm_id}
                        onChange={handleChange}
                        options={farmOptions}
                        placeholder="-- Pilih Farm --"
                        required
                    />

                    <Select
                        label="Pilih Flock"
                        name="flock_id"
                        value={form.flock_id}
                        onChange={handleChange}
                        options={flockOptions}
                        placeholder="-- Pilih Flock --"
                        required
                    />

                    <Select
                        label="Pilih Kandang"
                        name="coop_id"
                        value={form.coop_id}
                        onChange={handleChange}
                        options={coopOptions}
                        placeholder="-- Pilih Kandang --"
                        required
                    />

                    <Input
                        type="number"
                        label="Pakan Kg"
                        name="feed_kg"
                        value={form.feed_kg}
                        onChange={handleChange}
                        placeholder="Contoh: 50.20"
                        required
                    />

                    <Input
                        type="number"
                        label="Minum L"
                        name="water_l"
                        value={form.water_l}
                        onChange={handleChange}
                        placeholder="Contoh: 50.20"
                        required
                    />

                    <Input
                        type="number"
                        label="Bobot Ayam Kg"
                        name="avg_body_weight_kg"
                        value={form.avg_body_weight_kg}
                        onChange={handleChange}
                        placeholder="Contoh: 2.500"
                        required
                    />

                    <Input
                        type="number"
                        label="Kematian"
                        name="mortality_count"
                        value={form.mortality_count}
                        onChange={handleChange}
                        placeholder="Contoh: 0"
                        required
                    />

                    <Input
                        type="number"
                        label="Afkir"
                        name="culling_count"
                        value={form.culling_count}
                        onChange={handleChange}
                        placeholder="Contoh: 0"
                        required
                    />
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