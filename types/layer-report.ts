export type ReportPeriodType = "7_days" | "14_days" | "30_days" | "custom";

export type ReportSelectOption = {
    id: number;
    name: string;
};

export type LayerReportFilters = {
    farm_id: string;
    flock_id?: string;
    coop_id?: string;
    period_type: ReportPeriodType;
    start_date?: string;
    end_date?: string;
};

export type LayerReportRow = {
    date: string;
    age_week: number | null;
    age_day: number | null;
    population: number;
    mortality: number;
    current_population: number;
    feed_total_kg: number;
    feed_gram_per_bird: number;
    water_total_l: number;
    water_ml_per_bird: number;
    normal_egg_count: number;
    normal_egg_weight_kg: number;
    sorted_egg_count: number;
    sorted_egg_weight_kg: number;
    broken_egg_count: number;
    broken_egg_weight_kg: number;
    spoiled_egg_count: number;
    spoiled_egg_weight_kg: number;
    avg_egg_weight_g: number;
    egg_weight_per_1000_birds: number;
    hen_day_production: number;
    fcr: number;
    feed_name: string | null;
    medicine_vitamin: string | null;
    vaccine: string | null;
    notes: string | null;
};

export type LayerReportResponse = {
    filters: LayerReportFilters;
    columns: string[];
    data: LayerReportRow[];
    unavailable_fields: Record<string, string>;
};
