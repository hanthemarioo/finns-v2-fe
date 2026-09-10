// types/farm.ts

import { Coop } from "./coop";

export type Farm = {
    id: number;
    name: string;
    type: string;
    location: string;
    capacity: number;
    owner_id: number;
    created_at: string;
    coops: Coop[];
    can_delete?: boolean;
    flocks_count?: number;
    users_count?: number;
};
