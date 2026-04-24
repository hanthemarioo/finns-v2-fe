// types/farm.ts

export type Farm = {
    id: number;
    name: string;
    type: string;
    location: string;
    capacity: number;
    owner_id: number;
    created_at: string;
    coops: any[]; // Contoh handling array
};