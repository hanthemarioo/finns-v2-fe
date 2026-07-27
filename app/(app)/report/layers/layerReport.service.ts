import { cookies } from "next/headers";
import type {
    LayerReportFilters,
    LayerReportResponse,
    ReportPeriodType,
    ReportSelectOption,
} from "@/types/layer-report";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type QueryValue = string | number | undefined | null;

export type LayerReportPageData = {
    filters: LayerReportFilters;
    farms: ReportSelectOption[];
    flocks: ReportSelectOption[];
    coops: ReportSelectOption[];
    report: LayerReportResponse | null;
    error: string | null;
};

function buildUrl(path: string, query: Record<string, QueryValue> = {}) {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.set(key, String(value));
        }
    });

    const qs = params.toString();
    return `${API_BASE_URL}/api/v1/${path}${qs ? `?${qs}` : ""}`;
}

async function getAuthHeaders(): Promise<HeadersInit> {
    const token = (await cookies()).get("token")?.value;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJson<T>(path: string, query?: Record<string, QueryValue>): Promise<T | null> {
    const res = await fetch(buildUrl(path, query), {
        headers: await getAuthHeaders(),
        cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function normalizeOptions(result: unknown): ReportSelectOption[] {
    const rows = Array.isArray(result)
        ? result
        : isRecord(result) && Array.isArray(result.data)
            ? result.data
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

function first(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function periodTypeOf(value: string | undefined): ReportPeriodType {
    return value === "7_days" || value === "14_days" || value === "custom"
        ? value
        : "30_days";
}

export async function getLayerReportPageData(
    searchParams: Record<string, string | string[] | undefined>
): Promise<LayerReportPageData> {
    const farms = normalizeOptions(await fetchJson<unknown>("farms", { type: "layer" }));
    const selectedFarmId = first(searchParams.farm_id) || farms[0]?.id.toString() || "";
    const selectedFlockId = first(searchParams.flock_id) || "";
    const selectedCoopId = first(searchParams.coop_id) || "";
    const periodType = periodTypeOf(first(searchParams.period_type));

    const filters: LayerReportFilters = {
        farm_id: selectedFarmId,
        flock_id: selectedFlockId,
        coop_id: selectedCoopId,
        period_type: periodType,
        start_date: first(searchParams.start_date),
        end_date: first(searchParams.end_date),
    };

    const [flocks, coops] = await Promise.all([
        selectedFarmId
            ? fetchJson<unknown>("flocks", { farm_id: selectedFarmId })
            : Promise.resolve(null),
        selectedFlockId
            ? fetchJson<unknown>("coops", { flock_id: selectedFlockId })
            : Promise.resolve(null),
    ]);

    if (!selectedFarmId) {
        return {
            filters,
            farms,
            flocks: normalizeOptions(flocks),
            coops: normalizeOptions(coops),
            report: null,
            error: "Pilih farm layer terlebih dahulu untuk menampilkan laporan.",
        };
    }

    const report = await fetchJson<LayerReportResponse>("reports/layer", {
        farm_id: selectedFarmId,
        flock_id: selectedFlockId,
        coop_id: selectedCoopId,
        period_type: periodType,
        start_date: periodType === "custom" ? filters.start_date : undefined,
        end_date: periodType === "custom" ? filters.end_date : undefined,
    });

    return {
        filters,
        farms,
        flocks: normalizeOptions(flocks),
        coops: normalizeOptions(coops),
        report,
        error: report ? null : "Laporan belum bisa dimuat. Periksa filter atau koneksi API.",
    };
}
