// types/flock.ts

import { Farm } from "./farm";

export type Flock = {
    id: number;
    farm: Farm;
    name: string;
    house_code: string;
    age_in_day: number;
    strain: string;
    status: string;
    closed_at: string | null;
    closing_reason: string | null;
    created_at: string;
    coops: any[];
};