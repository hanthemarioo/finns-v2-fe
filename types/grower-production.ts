// types/grower-prduction.ts

import { Coop } from "./coop";

export type GrowerProduction = {
    id: number;
    farm_id: number;
    flock_id: number;
    coop_id: number;
    feed_kg: string | number;
    water_l: string | number;
    avg_body_weight_kg: string | number;
    mortality_count: string | number;
    culling_count: string | number;
    coop: Coop;
};
