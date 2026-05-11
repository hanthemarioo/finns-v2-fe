// hooks/useDataTable.ts
'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export type PaginatedResponse<T> = {
    current_page: number;
    data: T[];
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
    }[];
};

export function useDataTable<T>(apiEndpoint: string) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Omit<PaginatedResponse<T>, "data"> | null>(null);

    // Ambil page dari URL, fallback ke 1
    const currentPage = searchParams.get("page") || "1";

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Pertahankan query params lain (seperti search, filter, dll)
            const currentParams = new URLSearchParams(searchParams.toString());
            const queryString = currentParams.toString();
            const url = `${apiEndpoint}${queryString ? `?${queryString}` : ""}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    // Catatan: Jika API di beda domain, handle token di sini.
                    // Jika pakai Next.js route handler, cookies() bisa diurus di server.
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const result: PaginatedResponse<T> = await response.json();

            setData(result.data);
            setPagination({
                current_page: result.current_page,
                last_page: result.last_page,
                per_page: result.per_page,
                total: result.total,
                links: result.links,
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint, searchParams]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Fungsi untuk update URL (memicu re-fetch via useEffect)
    const setPage = useCallback(
        (pageNumber: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", pageNumber.toString());
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    return { data, loading, error, pagination, setPage, refetch: fetchData };
}