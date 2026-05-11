// app/flocks/FlockClient.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { createFlockTableColumns } from "./tableColumns";
import { Flock } from "@/types/flock";
import { FlockModal } from "./FlockModal";
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
    const [editingFlock, setEditingFlock] = useState<Flock | null>(null);

    const openModal = (flock: Flock | null = null) => {
        setEditingFlock(flock);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        router.refresh(); // Refresh halaman (Memicu SSR fetch ulang secara transparan di background)
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const columns = useMemo(() => createFlockTableColumns(openModal), []);

    return (
        <>
            <div className="text-end">
                <Button text="+ add flock" onClick={() => openModal(null)} />
            </div>

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
        </>
    );
}