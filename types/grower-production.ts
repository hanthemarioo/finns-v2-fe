// types/grower-prduction.ts

import { Coop } from "./coop";

export type GrowerProduction = {
    id: number;
    farm_id: number;
    flock_id: number;
    coop_id: number;
    feed_kg: string;
    water_l: string;
    avg_body_weight_kg: string;
    mortality_count: string;
    culling_count: string;
    coop: Coop;
};