"use client";

import { useState, useEffect } from "react";
import { LayerProduction } from "@/types/layer-production";
import { Input } from "@/components/form/Input";
import { Option, Select } from "@/components/form/Select";
import { Farm } from "@/types/farm";
import { Flock } from "@/types/flock";
import { Coop } from "@/types/coop";
import {
    firstProductionError,
    type ProductionFieldErrors,
    type ProductionFieldRule,
    validateProductionFields,
} from "../productionValidation";

interface LayerProductionModalProps {
    layerProduction: LayerProduction | null;
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
    marketable_eggs_count: string;
    marketable_eggs_weight_kg: string;
    sorted_eggs_count: string;
    sorted_eggs_weight_kg: string;
    spoiled_eggs_count: string;
    spoiled_eggs_weight_kg: string;
    broken_eggs_count: string;
    broken_eggs_weight_kg: string;
};

type SelectField = "farm_id" | "flock_id" | "coop_id";
type FormField = keyof FormState & string;

function fieldValue(value: string | number | null | undefined) {
    return value === null || value === undefined ? "" : String(value);
}

const layerProductionRules: ProductionFieldRule<FormField>[] = [
    { name: "farm_id", label: "Farm", integer: true },
    { name: "flock_id", label: "Flock", integer: true },
    { name: "coop_id", label: "Kandang", integer: true },
    { name: "marketable_eggs_count", label: "Jumlah Butir Utuh", integer: true, allowZero: true },
    { name: "marketable_eggs_weight_kg", label: "Jumlah Berat Utuh Kg", allowZero: true },
    { name: "sorted_eggs_count", label: "Jumlah Butir Sortir", integer: true, allowZero: true },
    { name: "sorted_eggs_weight_kg", label: "Jumlah Berat Sortir Kg", allowZero: true },
    { name: "spoiled_eggs_count", label: "Jumlah Butir Busuk", integer: true, allowZero: true },
    { name: "spoiled_eggs_weight_kg", label: "Jumlah Berat Busuk Kg", allowZero: true },
    { name: "broken_eggs_count", label: "Jumlah Butir Rusak", integer: true, allowZero: true },
    { name: "broken_eggs_weight_kg", label: "Jumlah Berat Rusak Kg", allowZero: true },
    { name: "feed_kg", label: "Pakan Kg" },
    { name: "water_l", label: "Minum L" },
    { name: "avg_body_weight_kg", label: "Bobot Ayam Kg" },
    { name: "mortality_count", label: "Kematian", integer: true, allowZero: true },
    { name: "culling_count", label: "Afkir", integer: true, allowZero: true },
];

export function LayerProductionModal({ layerProduction, onClose, onSuccess }: LayerProductionModalProps) {
    const isEditing = !!layerProduction;
    const eggProduction = layerProduction?.daily_egg_production;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<ProductionFieldErrors<FormField>>({});

    // State untuk opsi farm yang didapat dari API
    const [farmOptions, setFarmOptions] = useState<Option[]>([]);
    const [flockOptions, setFlockOptions] = useState<Option[]>([]);
    const [coopOptions, setCoopOptions] = useState<Option[]>([]);

    // State untuk form utama
    const [form, setForm] = useState<FormState>({
        farm_id: layerProduction?.coop?.flock?.farm?.id.toString() || "",
        flock_id: layerProduction?.coop?.flock?.id.toString() || "",
        coop_id: layerProduction?.coop_id?.toString() || "",
        feed_kg: fieldValue(layerProduction?.feed_kg),
        water_l: fieldValue(layerProduction?.water_l),
        avg_body_weight_kg: fieldValue(layerProduction?.avg_body_weight_kg),
        mortality_count: fieldValue(layerProduction?.mortality_count),
        culling_count: fieldValue(layerProduction?.culling_count),
        marketable_eggs_count: fieldValue(eggProduction?.marketable_eggs_count ?? layerProduction?.marketable_eggs_count),
        marketable_eggs_weight_kg: fieldValue(eggProduction?.marketable_eggs_weight_kg ?? layerProduction?.marketable_eggs_weight_kg),
        sorted_eggs_count: fieldValue(eggProduction?.sorted_eggs_count ?? layerProduction?.sorted_eggs_count),
        sorted_eggs_weight_kg: fieldValue(eggProduction?.sorted_eggs_weight_kg ?? layerProduction?.sorted_eggs_weight_kg),
        spoiled_eggs_count: fieldValue(eggProduction?.spoiled_eggs_count ?? layerProduction?.spoiled_eggs_count),
        spoiled_eggs_weight_kg: fieldValue(eggProduction?.spoiled_eggs_weight_kg ?? layerProduction?.spoiled_eggs_weight_kg),
        broken_eggs_count: fieldValue(eggProduction?.broken_eggs_count ?? layerProduction?.broken_eggs_count),
        broken_eggs_weight_kg: fieldValue(eggProduction?.broken_eggs_weight_kg ?? layerProduction?.broken_eggs_weight_kg),
    });

    const fieldDependencies: Partial<Record<SelectField, SelectField[]>> = {
        farm_id: ["flock_id", "coop_id"],
        flock_id: ["coop_id"],
    };

    // Fetch data farm saat komponen dimuat
    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const res = await fetch("/api/proxy/farms?type=layer");

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
                const res = await fetch(`/api/proxy/flocks?farm_id=${form.farm_id}&status=active`);

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
                [fieldName]: value,
            };

            if (fieldName in fieldDependencies) {
                const dependencies = fieldDependencies[fieldName as SelectField];

                dependencies?.forEach((dep) => {
                    updated[dep] = "";
                });
            }

            return updated;
        });

        setFieldErrors((prev) => {
            const updated = { ...prev };
            delete updated[fieldName];
            return updated;
        });
        setError(null);

        if (fieldName === "farm_id") {
            setFlockOptions([]);
            setCoopOptions([]);
        }

        if (fieldName === "flock_id") {
            setCoopOptions([]);
        }
    };

    const handleSubmit = async () => {
        const validationErrors = validateProductionFields(form, layerProductionRules);

        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            setError(firstProductionError(validationErrors) ?? "Periksa kembali field produksi.");
            return;
        }

        setSubmitting(true);
        setError(null);
        setFieldErrors({});

        // Susun payload sesuai dengan struktur JSON yang diminta
        const payload = {
            ...form,
            coop_id: Number(form.coop_id),
            feed_kg: Number(form.feed_kg),
            water_l: Number(form.water_l),
            avg_body_weight_kg: Number(form.avg_body_weight_kg),
            mortality_count: Number(form.mortality_count),
            culling_count: Number(form.culling_count),
            marketable_eggs_count: Number(form.marketable_eggs_count),
            marketable_eggs_weight_kg: Number(form.marketable_eggs_weight_kg),
            sorted_eggs_count: Number(form.sorted_eggs_count),
            sorted_eggs_weight_kg: Number(form.sorted_eggs_weight_kg),
            spoiled_eggs_count: Number(form.spoiled_eggs_count),
            spoiled_eggs_weight_kg: Number(form.spoiled_eggs_weight_kg),
            broken_eggs_count: Number(form.broken_eggs_count),
            broken_eggs_weight_kg: Number(form.broken_eggs_weight_kg),
        };

        const url = isEditing ? `/api/proxy/layer-phases/${layerProduction.id}` : "/api/proxy/layer-phases";

        try {
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                setError(errData?.message);
                throw new Error(errData?.message || "Gagal menyimpan Layer Production.");
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
                        {isEditing ? "Edit Produksi Layer" : "Tambah Produksi Layer"}
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
                        error={fieldErrors.farm_id}
                        required
                    />

                    <Select
                        label="Pilih Flock"
                        name="flock_id"
                        value={form.flock_id}
                        onChange={handleChange}
                        options={flockOptions}
                        placeholder="-- Pilih Flock --"
                        error={fieldErrors.flock_id}
                        required
                    />

                    <Select
                        label="Pilih Kandang"
                        name="coop_id"
                        value={form.coop_id}
                        onChange={handleChange}
                        options={coopOptions}
                        placeholder="-- Pilih Kandang --"
                        error={fieldErrors.coop_id}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label="Jumlah Butir Utuh"
                            name="marketable_eggs_count"
                            value={form.marketable_eggs_count}
                            onChange={handleChange}
                            placeholder="Contoh: 100"
                            min={0}
                            step={1}
                            error={fieldErrors.marketable_eggs_count}
                            required
                        />
                        <Input
                            type="number"
                            label="Jumlah Berat Utuh Kg"
                            name="marketable_eggs_weight_kg"
                            value={form.marketable_eggs_weight_kg}
                            onChange={handleChange}
                            placeholder="Contoh: 5.50"
                            min={0}
                            step="any"
                            error={fieldErrors.marketable_eggs_weight_kg}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label="Jumlah Butir Sortir (Putih/Lainnya)"
                            name="sorted_eggs_count"
                            value={form.sorted_eggs_count}
                            onChange={handleChange}
                            placeholder="Contoh: 5"
                            min={0}
                            step={1}
                            error={fieldErrors.sorted_eggs_count}
                            required
                        />
                        <Input
                            type="number"
                            label="Jumlah Berat Sortir (Putih/Lainnya) Kg"
                            name="sorted_eggs_weight_kg"
                            value={form.sorted_eggs_weight_kg}
                            onChange={handleChange}
                            placeholder="Contoh: 0.50"
                            min={0}
                            step="any"
                            error={fieldErrors.sorted_eggs_weight_kg}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label="Jumlah Butir Busuk"
                            name="spoiled_eggs_count"
                            value={form.spoiled_eggs_count}
                            onChange={handleChange}
                            placeholder="Contoh: 5"
                            min={0}
                            step={1}
                            error={fieldErrors.spoiled_eggs_count}
                            required
                        />
                        <Input
                            type="number"
                            label="Jumlah Berat Busuk Kg"
                            name="spoiled_eggs_weight_kg"
                            value={form.spoiled_eggs_weight_kg}
                            onChange={handleChange}
                            placeholder="Contoh: 0.50"
                            min={0}
                            step="any"
                            error={fieldErrors.spoiled_eggs_weight_kg}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label="Jumlah Butir Rusak"
                            name="broken_eggs_count"
                            value={form.broken_eggs_count}
                            onChange={handleChange}
                            placeholder="Contoh: 5"
                            min={0}
                            step={1}
                            error={fieldErrors.broken_eggs_count}
                            required
                        />
                        <Input
                            type="number"
                            label="Jumlah Berat Rusak Kg"
                            name="broken_eggs_weight_kg"
                            value={form.broken_eggs_weight_kg}
                            onChange={handleChange}
                            placeholder="Contoh: 0.50"
                            min={0}
                            step="any"
                            error={fieldErrors.broken_eggs_weight_kg}
                            required
                        />
                    </div>

                    <Input
                        type="number"
                        label="Pakan Kg"
                        name="feed_kg"
                        value={form.feed_kg}
                        onChange={handleChange}
                        placeholder="Contoh: 50.20"
                        min={0.01}
                        step="any"
                        error={fieldErrors.feed_kg}
                        required
                    />

                    <Input
                        type="number"
                        label="Minum L"
                        name="water_l"
                        value={form.water_l}
                        onChange={handleChange}
                        placeholder="Contoh: 50.20"
                        min={0.01}
                        step="any"
                        error={fieldErrors.water_l}
                        required
                    />

                    <Input
                        type="number"
                        label="Bobot Ayam Kg"
                        name="avg_body_weight_kg"
                        value={form.avg_body_weight_kg}
                        onChange={handleChange}
                        placeholder="Contoh: 2.500"
                        min={0.01}
                        step="any"
                        error={fieldErrors.avg_body_weight_kg}
                        required
                    />

                    <Input
                        type="number"
                        label="Kematian"
                        name="mortality_count"
                        value={form.mortality_count}
                        onChange={handleChange}
                        placeholder="Contoh: 0"
                        min={0}
                        step={1}
                        error={fieldErrors.mortality_count}
                        required
                    />

                    <Input
                        type="number"
                        label="Afkir"
                        name="culling_count"
                        value={form.culling_count}
                        onChange={handleChange}
                        placeholder="Contoh: 0"
                        min={0}
                        step={1}
                        error={fieldErrors.culling_count}
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
