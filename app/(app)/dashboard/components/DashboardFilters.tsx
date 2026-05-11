"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import type { DashboardFilters, SelectOption } from "../types/dashboard";

type DashboardFiltersProps = {
    filters: DashboardFilters;
    farms: SelectOption[];
    flocks: SelectOption[];
    coops: SelectOption[];
};

function optionLabel(item: SelectOption) {
    return item.name || `#${item.id}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function normalizeOptions(value: unknown): SelectOption[] {
    const rows = Array.isArray(value)
        ? value
        : isRecord(value) && Array.isArray(value.data)
            ? value.data
            : [];

    return rows.flatMap((row) => {
        if (!isRecord(row)) return [];

        const id = Number(row.id);
        if (!Number.isFinite(id)) return [];

        return [{
            id,
            name: String(row.name ?? row.house_code ?? row.code ?? id),
        }];
    });
}

async function fetchOptions(path: string, query: Record<string, string>) {
    const params = new URLSearchParams(query);
    const res = await fetch(`/api/proxy/${path}?${params.toString()}`);

    if (!res.ok) return [];
    return normalizeOptions((await res.json()).data);
}

export default function DashboardFilters({ filters, farms, flocks, coops }: DashboardFiltersProps) {
    const [type, setType] = useState(filters.type);
    const [farmId, setFarmId] = useState(filters.farm_id ?? "");
    const [flockId, setFlockId] = useState(filters.flock_id ?? "");
    const [coopId, setCoopId] = useState(filters.coop_id ?? "");
    const [farmOptions, setFarmOptions] = useState(farms);
    const [flockOptions, setFlockOptions] = useState(flocks);
    const [coopOptions, setCoopOptions] = useState(coops);
    const [loadingKey, setLoadingKey] = useState<"farm" | "flock" | "coop" | null>(null);

    const handleTypeChange = async (event: ChangeEvent<HTMLSelectElement>) => {
        const nextType = event.target.value;

        setType(nextType);
        setFarmId("");
        setFlockId("");
        setCoopId("");
        setFlockOptions([]);
        setCoopOptions([]);
        setLoadingKey("farm");
        setFarmOptions(await fetchOptions("farms", { type: nextType }));
        setLoadingKey(null);
    };

    const handleFarmChange = async (event: ChangeEvent<HTMLSelectElement>) => {
        const nextFarmId = event.target.value;

        setFarmId(nextFarmId);
        setFlockId("");
        setCoopId("");
        setCoopOptions([]);

        if (!nextFarmId) {
            setFlockOptions([]);
            return;
        }

        setLoadingKey("flock");
        setFlockOptions(await fetchOptions("flocks", { farm_id: nextFarmId }));
        setLoadingKey(null);
    };

    const handleFlockChange = async (event: ChangeEvent<HTMLSelectElement>) => {
        const nextFlockId = event.target.value;

        setFlockId(nextFlockId);
        setCoopId("");

        if (!nextFlockId) {
            setCoopOptions([]);
            return;
        }

        setLoadingKey("coop");
        setCoopOptions(await fetchOptions("coops", { flock_id: nextFlockId }));
        setLoadingKey(null);
    };

    return (
        <form className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-6">
            <label className="space-y-1 text-sm font-medium text-gray-700">
                Type
                <select name="type" value={type} onChange={handleTypeChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                    <option value="layer">Layer</option>
                    <option value="grower">Grower</option>
                </select>
            </label>

            <label className="space-y-1 text-sm font-medium text-gray-700">
                Start Date
                <input name="start_date" type="date" defaultValue={filters.start_date} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>

            <label className="space-y-1 text-sm font-medium text-gray-700">
                End Date
                <input name="end_date" type="date" defaultValue={filters.end_date} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>

            <label className="space-y-1 text-sm font-medium text-gray-700">
                Farm
                <select name="farm_id" value={farmId} onChange={handleFarmChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                    <option value="">{loadingKey === "farm" ? "Loading farms..." : "All farms"}</option>
                    {farmOptions.map((farm) => (
                        <option key={farm.id} value={farm.id}>{optionLabel(farm)}</option>
                    ))}
                </select>
            </label>

            <label className="space-y-1 text-sm font-medium text-gray-700">
                Flock
                <select name="flock_id" value={flockId} onChange={handleFlockChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                    <option value="">{loadingKey === "flock" ? "Loading flocks..." : "All flocks"}</option>
                    {flockOptions.map((flock) => (
                        <option key={flock.id} value={flock.id}>{optionLabel(flock)}</option>
                    ))}
                </select>
            </label>

            <label className="space-y-1 text-sm font-medium text-gray-700">
                Coop
                <select name="coop_id" value={coopId} onChange={(event) => setCoopId(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                    <option value="">{loadingKey === "coop" ? "Loading coops..." : "All coops"}</option>
                    {coopOptions.map((coop) => (
                        <option key={coop.id} value={coop.id}>{optionLabel(coop)}</option>
                    ))}
                </select>
            </label>

            <div className="flex items-end gap-2 md:col-span-6">
                <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                    Apply Filter
                </button>
                <a href="/dashboard" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    Reset
                </a>
            </div>
        </form>
    );
}
