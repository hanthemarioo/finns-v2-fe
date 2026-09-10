// types/flock.ts

import { Coop } from "./coop";
import { Farm } from "./farm";

export type Flock = {
    id: number;
    farm_id: number;
    name: string;
    house_code: string;
    age_in_day: number;
    strain: string;
    status: string;
    start_date: string;
    closed_at: string | null;
    closing_reason: string | null;
    closing_note?: string | null;
    created_at: string;
    can_delete?: boolean;
    production_coops_count?: number;
    coops: Coop[];
    farm: Farm;
};
