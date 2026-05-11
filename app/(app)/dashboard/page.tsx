import FeedChart from "./components/FeedChart";
import MortalityChart from "./components/MortalityChart";
import DashboardFilters from "./components/DashboardFilters";
import EggChart from "./components/EggChart";
import SummaryCards from "./components/SummaryCards";
import { getDashboardData } from "./services/dashboard.service";
import type { DashboardFilters as DashboardFilterValues } from "./types/dashboard";

type DashboardPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

function firstDayOfMonth(date: string) {
    return `${date.slice(0, 8)}01`;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const params = await searchParams;
    const endDate = first(params.end_date) || today();
    const filters: DashboardFilterValues = {
        type: first(params.type) || "layer",
        start_date: first(params.start_date) || firstDayOfMonth(endDate),
        end_date: endDate,
        farm_id: first(params.farm_id),
        flock_id: first(params.flock_id),
        coop_id: first(params.coop_id),
    };

    const dashboard = await getDashboardData(filters);

    return (
        <div className="min-h-screen p-6 sm:p-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor summary, feed, mortality, and egg production.</p>
                </div>

                <DashboardFilters
                    filters={filters}
                    farms={dashboard.farms}
                    flocks={dashboard.flocks}
                    coops={dashboard.coops}
                />

                <SummaryCards data={dashboard.summary} />

                <div className="grid gap-6 xl:grid-cols-2">
                    <FeedChart data={dashboard.feedChart} />
                    <MortalityChart data={dashboard.mortalityChart} />
                    <div className="xl:col-span-2">
                        <EggChart data={dashboard.eggChart} />
                    </div>
                </div>
            </div>
        </div>
    );
}
