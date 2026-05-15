import { Farm } from "./farm";

export type UserRole = "super_admin" | "admin" | "user_input";

export type User = {
    id: number;
    name: string;
    email: string;
    phone_number: string | null;
    role: UserRole;
    created_by: number | null;
    farm_id: number | null;
    created_at: string;
    farm?: Farm | null;
};
