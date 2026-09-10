// app/farms/FarmClient.tsx

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { createFarmTableColumns } from "./tableColumns";
import { Farm } from "@/types/farm";
import { FarmModal } from "./FarmModal";
import Button from "@/components/form/Button";
import { PaginationType } from "@/types/pagination";
import { User } from "@/types/user";

interface FarmClientProps {
    initialData: Farm[];
    pagination: PaginationType<Farm>;
}

export function FarmClient({ initialData, pagination }: FarmClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const openModal = (farm: Farm | null = null) => {
        setEditingFarm(farm);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        router.refresh(); // Refresh halaman (Memicu SSR fetch ulang secara transparan di background)
    };

    const handleDelete = useCallback(async (farm: Farm) => {
        const confirmed = window.confirm(`Hapus farm ${farm.name}? Farm hanya dapat dihapus jika belum memiliki flock dan user terkait.`);
        if (!confirmed) return;

        setError(null);

        try {
            const res = await fetch(`/api/proxy/farms/${farm.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.message || "Gagal menghapus farm.");
            }

            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, [router]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // const columns = useMemo(() => createFarmTableColumns(openModal, user), []);
    const columns = useMemo(() => {
        return createFarmTableColumns(openModal, handleDelete, user);
    }, [handleDelete, user]);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            setUser(JSON.parse(data));
        }
    }, [])

    return (
        <>
            {user?.role === 'super_admin' && (
                <div className="text-end">
                    <Button text="+ add farm" onClick={() => openModal(null)} />
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <DataTable
                data={initialData}
                columns={columns}
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            {isModalOpen && (
                <FarmModal
                    farm={editingFarm}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}
