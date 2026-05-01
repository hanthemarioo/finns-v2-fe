// types/coop.ts

import { Flock } from "./flock";

export type Coop = {
    id: number;
    flock_id: number;
    name: string;
    initial_population: number;
    created_at: string;
    updated_at: string;
    flock: Flock;
};