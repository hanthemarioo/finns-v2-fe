export type GrowerReportPeriodType = "7_days" | "14_days" | "30_days" | "custom";

export type GrowerReportSelectOption = {
    id: number;
    name: string;
};

export type GrowerReportFilters = {
    farm_id: string;
    flock_id?: string;
    coop_id?: string;
    period_type: GrowerReportPeriodType;
    start_date?: string;
    end_date?: string;
};

export type GrowerReportRow = {
    date: string;
    age_week: number | null;
    population: number;
    mortality: number;
    culling: number;
    mortality_percent: number;
    feed_total_kg: number;
    feed_gram_per_bird: number;
    feed_standard_gram_per_bird: number | null;
    water_total_l: number;
    water_ml_per_bird: number;
    actual_body_weight_g: number;
    standard_body_weight_g: number | null;
    actual_uniformity_percent: number | null;
    standard_uniformity_percent: number | null;
    feed_name: string | null;
    medicine_vitamin: string | null;
    notes: string | null;
};

export type GrowerReportResponse = {
    filters: GrowerReportFilters;
    columns: string[];
    data: GrowerReportRow[];
    unavailable_fields: Record<string, string>;
};
