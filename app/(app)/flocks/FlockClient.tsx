// app/flocks/FlockClient.tsx

"use client";

import { useCallback, useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { createFlockTableColumns } from "./tableColumns";
import { Flock } from "@/types/flock";
import { FlockModal } from "./FlockModal";
import { FlockCloseModal } from "./FlockCloseModal";
import Button from "@/components/form/Button";
import { PaginationType } from "@/types/pagination";

interface FlockClientProps {
    initialData: Flock[];
    pagination: PaginationType<Flock>;
}

export function FlockClient({ initialData, pagination }: FlockClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [editingFlock, setEditingFlock] = useState<Flock | null>(null);
    const [closingFlock, setClosingFlock] = useState<Flock | null>(null);
    const [error, setError] = useState<string | null>(null);

    const openModal = (flock: Flock | null = null) => {
        setEditingFlock(flock);
        setError(null);
        setIsModalOpen(true);
    };

    const openCloseModal = (flock: Flock) => {
        setClosingFlock(flock);
        setError(null);
        setIsCloseModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        setIsCloseModalOpen(false);
        router.refresh(); // Refresh halaman (Memicu SSR fetch ulang secara transparan di background)
    };

    const handleDelete = useCallback(async (flock: Flock) => {
        const confirmed = window.confirm(`Hapus flock ${flock.name}? Flock hanya dapat dihapus jika belum memiliki data produksi.`);
        if (!confirmed) return;

        setError(null);

        try {
            const res = await fetch(`/api/proxy/flocks/${flock.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.message || "Gagal menghapus flock.");
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

    const columns = useMemo(
        () => createFlockTableColumns(openModal, openCloseModal, handleDelete),
        [handleDelete]
    );

    return (
        <>
            <div className="text-end">
                <Button text="+ add flock" onClick={() => openModal(null)} />
            </div>

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
                <FlockModal
                    flock={editingFlock}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}

            {isCloseModalOpen && closingFlock && (
                <FlockCloseModal
                    flock={closingFlock}
                    onClose={() => setIsCloseModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}
