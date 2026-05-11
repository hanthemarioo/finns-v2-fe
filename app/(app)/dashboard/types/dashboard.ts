export type DashboardFilters = {
    type: string;
    start_date: string;
    end_date: string;
    farm_id?: string;
    flock_id?: string;
    coop_id?: string;
};

export type ChartPoint = {
    date?: string;
    label?: string;
    total_feed?: number;
    total_mortality?: number;
    total_egg?: number;
    total_eggs?: number;
    egg_total?: number;
    value?: number;
};

export type SelectOption = {
    id: number;
    name: string;
};

export type DashboardData = {
    summary: Record<string, unknown> | null;
    feedChart: ChartPoint[];
    mortalityChart: ChartPoint[];
    eggChart: ChartPoint[];
    farms: SelectOption[];
    flocks: SelectOption[];
    coops: SelectOption[];
};
