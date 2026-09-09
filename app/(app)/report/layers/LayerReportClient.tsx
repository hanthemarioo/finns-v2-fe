"use client";

import { useMemo, useState, useTransition } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ReportExportButtons } from "@/components/report/ReportExportButtons";
import { DataTable } from "@/components/ui/DataTable";
import type {
    LayerReportFilters,
    LayerReportRow,
    ReportPeriodType,
    ReportSelectOption,
} from "@/types/layer-report";
import { createLayerReportTableColumns } from "./tableColumns";

type LayerReportClientProps = {
    filters: LayerReportFilters;
    farms: ReportSelectOption[];
    flocks: ReportSelectOption[];
    coops: ReportSelectOption[];
    rows: LayerReportRow[];
    unavailableFields: Record<string, string>;
    error: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function normalizeOptions(value: unknown): ReportSelectOption[] {
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
            name: String(row.name ?? row.house_code ?? id),
        }];
    });
}

async function fetchOptions(path: string, query: Record<string, string>) {
    const params = new URLSearchParams(query);
    const res = await fetch(`/api/proxy/${path}?${params.toString()}`);

    if (!res.ok) return [];
    return normalizeOptions((await res.json()).data);
}

function hasUnavailableFields(fields: Record<string, string>) {
    return Object.keys(fields).length > 0;
}

export function LayerReportClient({
    filters,
    farms,
    flocks,
    coops,
    rows,
    unavailableFields,
    error,
}: LayerReportClientProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [farmId, setFarmId] = useState(filters.farm_id);
    const [flockId, setFlockId] = useState(filters.flock_id ?? "");
    const [coopId, setCoopId] = useState(filters.coop_id ?? "");
    const [periodType, setPeriodType] = useState<ReportPeriodType>(filters.period_type);
    const [startDate, setStartDate] = useState(filters.start_date ?? "");
    const [endDate, setEndDate] = useState(filters.end_date ?? "");
    const [flockOptions, setFlockOptions] = useState(flocks);
    const [coopOptions, setCoopOptions] = useState(coops);
    const [loadingKey, setLoadingKey] = useState<"flock" | "coop" | null>(null);
    const [filterError, setFilterError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const columns = useMemo(() => createLayerReportTableColumns(), []);
    const hasInvalidDateRange = periodType === "custom" && startDate !== "" && endDate !== "" && startDate > endDate;

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

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        const nextFarmId = String(formData.get("farm_id") ?? "");
        const nextPeriodType = String(formData.get("period_type") ?? "30_days") as ReportPeriodType;

        setFilterError(null);

        if (nextFarmId) params.set("farm_id", nextFarmId);
        params.set("period_type", nextPeriodType);

        const nextFlockId = String(formData.get("flock_id") ?? "");
        const nextCoopId = String(formData.get("coop_id") ?? "");

        if (nextFlockId) params.set("flock_id", nextFlockId);
        if (nextCoopId) params.set("coop_id", nextCoopId);

        if (nextPeriodType === "custom") {
            const startDate = String(formData.get("start_date") ?? "");
            const endDate = String(formData.get("end_date") ?? "");

            if (!startDate || !endDate) {
                setFilterError("Start Date dan End Date wajib diisi untuk periode custom.");
                return;
            }

            if (startDate > endDate) {
                setFilterError("Start Date tidak boleh lebih besar dari End Date.");
                return;
            }

            if (startDate) params.set("start_date", startDate);
            if (endDate) params.set("end_date", endDate);
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
            router.refresh();
        });
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-6"
            >
                <label className="space-y-1 text-sm font-medium text-gray-700">
                    Farm
                    <select
                        name="farm_id"
                        value={farmId}
                        onChange={handleFarmChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Select farm</option>
                        {farms.map((farm) => (
                            <option key={farm.id} value={farm.id}>{farm.name}</option>
                        ))}
                    </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                    Flock
                    <select
                        name="flock_id"
                        value={flockId}
                        onChange={handleFlockChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">{loadingKey === "flock" ? "Loading flocks..." : "All flocks"}</option>
                        {flockOptions.map((flock) => (
                            <option key={flock.id} value={flock.id}>{flock.name}</option>
                        ))}
                    </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                    Coop
                    <select
                        name="coop_id"
                        value={coopId}
                        onChange={(event) => setCoopId(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">{loadingKey === "coop" ? "Loading coops..." : "All coops"}</option>
                        {coopOptions.map((coop) => (
                            <option key={coop.id} value={coop.id}>{coop.name}</option>
                        ))}
                    </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                    Period
                    <select
                        name="period_type"
                        value={periodType}
                        onChange={(event) => {
                            setPeriodType(event.target.value as ReportPeriodType);
                            setFilterError(null);
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="7_days">Last 7 days</option>
                        <option value="14_days">Last 14 days</option>
                        <option value="30_days">Last 30 days</option>
                        <option value="custom">Custom</option>
                    </select>
                </label>

                {periodType === "custom" && (
                    <>
                        <label className="space-y-1 text-sm font-medium text-gray-700">
                            Start Date
                            <input
                                name="start_date"
                                type="date"
                                value={startDate}
                                max={endDate || undefined}
                                aria-invalid={hasInvalidDateRange}
                                onChange={(event) => {
                                    setStartDate(event.target.value);
                                    setFilterError(null);
                                }}
                                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                                    hasInvalidDateRange ? "border-red-400 bg-red-50" : "border-gray-300"
                                }`}
                            />
                        </label>

                        <label className="space-y-1 text-sm font-medium text-gray-700">
                            End Date
                            <input
                                name="end_date"
                                type="date"
                                value={endDate}
                                min={startDate || undefined}
                                aria-invalid={hasInvalidDateRange}
                                onChange={(event) => {
                                    setEndDate(event.target.value);
                                    setFilterError(null);
                                }}
                                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                                    hasInvalidDateRange ? "border-red-400 bg-red-50" : "border-gray-300"
                                }`}
                            />
                        </label>
                    </>
                )}

                <div className="flex items-end gap-2 md:col-span-6">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending ? "Loading..." : "Apply Filter"}
                    </button>
                    <a
                        href="/report/layers"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Reset
                    </a>
                </div>
            </form>

            {filterError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {filterError}
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {hasUnavailableFields(unavailableFields) && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Some requested report fields are not available in the current database schema.
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                    {rows.length} data laporan sesuai filter aktif
                </p>
                <ReportExportButtons
                    reportType="layer"
                    filters={filters}
                    disabled={isPending || !filters.farm_id || rows.length === 0}
                />
            </div>

            <DataTable
                data={rows}
                columns={columns}
                error={error && rows.length === 0 ? error : null}
            />
        </>
    );
}
