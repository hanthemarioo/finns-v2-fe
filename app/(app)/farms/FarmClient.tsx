// app/farms/FarmClient.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { createFarmTableColumns } from "./tableColumns";
import { Farm } from "@/types/farm";
import { FarmModal } from "./FarmModal";
import Button from "@/components/form/Button";

interface FarmClientProps {
    initialData: Farm[];
    pagination: any;
}

export function FarmClient({ initialData, pagination }: FarmClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

    const openModal = (farm: Farm | null = null) => {
        setEditingFarm(farm);
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

    const columns = useMemo(() => createFarmTableColumns(openModal), []);

    return (
        <>
            <div className="text-end">
                <Button text="+ add farm" onClick={() => openModal(null)} />
            </div>

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