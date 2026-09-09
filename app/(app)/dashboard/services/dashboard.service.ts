import { cookies } from "next/headers";
import type { ChartPoint, DashboardData, DashboardFilters, SelectOption } from "../types/dashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type QueryValue = string | number | undefined | null;

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

function dataOf<T>(result: T[] | { data?: T[] } | null): T[] {
    if (Array.isArray(result)) return result;
    return result?.data ?? [];
}

function objectOf(result: Record<string, unknown> | { data?: Record<string, unknown> } | null) {
    if (!result) return null;
    if ("data" in result && result.data && typeof result.data === "object" && !Array.isArray(result.data)) {
        return result.data as Record<string, unknown>;
    }

    return result as Record<string, unknown>;
}

function dashboardQuery(filters: DashboardFilters): Record<string, QueryValue> {
    return {
        type: filters.type,
        start_date: filters.start_date,
        end_date: filters.end_date,
        farm_id: filters.farm_id,
        flock_id: filters.flock_id,
        coop_id: filters.coop_id,
    };
}

export async function getDashboardData(filters: DashboardFilters): Promise<DashboardData> {
    const query = dashboardQuery(filters);

    const [summary, feed, mortality, egg, farms, flocks, coops] = await Promise.all([
        fetchJson<Record<string, unknown> | { data?: Record<string, unknown> }>("dashboard/summary", query),
        fetchJson<ChartPoint[] | { data?: ChartPoint[] }>("dashboard/feed-chart", query),
        fetchJson<ChartPoint[] | { data?: ChartPoint[] }>("dashboard/mortality-chart", query),
        fetchJson<ChartPoint[] | { data?: ChartPoint[] }>("dashboard/egg-chart", query),
        fetchJson<SelectOption[] | { data?: SelectOption[] }>("farms", { type: filters.type }),
        filters.farm_id
            ? fetchJson<SelectOption[] | { data?: SelectOption[] }>("flocks", { farm_id: filters.farm_id })
            : Promise.resolve(null),
        filters.flock_id
            ? fetchJson<SelectOption[] | { data?: SelectOption[] }>("coops", { flock_id: filters.flock_id })
            : Promise.resolve(null),
    ]);

    return {
        summary: objectOf(summary),
        feedChart: dataOf(feed),
        mortalityChart: dataOf(mortality),
        eggChart: dataOf(egg),
        farms: dataOf(farms),
        flocks: dataOf(flocks),
        coops: dataOf(coops),
    };
}
