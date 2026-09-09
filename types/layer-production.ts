// types/layer-production.ts

import { Coop } from "./coop";

export type LayerEggProduction = {
    marketable_eggs_count: string | number;
    marketable_eggs_weight_kg: string | number;
    sorted_eggs_count: string | number;
    sorted_eggs_weight_kg: string | number;
    spoiled_eggs_count: string | number;
    spoiled_eggs_weight_kg: string | number;
    broken_eggs_count: string | number;
    broken_eggs_weight_kg: string | number;
};

export type LayerProduction = {
    id: number;
    farm_id: number;
    flock_id: number;
    coop_id: number;
    feed_kg: string | number;
    water_l: string | number;
    avg_body_weight_kg: string | number;
    mortality_count: string | number;
    culling_count: string | number;
    marketable_eggs_count?: string | number;
    marketable_eggs_weight_kg?: string | number;
    sorted_eggs_count?: string | number;
    sorted_eggs_weight_kg?: string | number;
    spoiled_eggs_count?: string | number;
    spoiled_eggs_weight_kg?: string | number;
    broken_eggs_count?: string | number;
    broken_eggs_weight_kg?: string | number;
    daily_egg_production?: LayerEggProduction | null;
    coop: Coop;
};
