// types/layer-production.ts

import { Coop } from "./coop";

export type LayerProduction = {
    id: number;
    farm_id: number;
    flock_id: number;
    coop_id: number;
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
    coop: Coop;
};