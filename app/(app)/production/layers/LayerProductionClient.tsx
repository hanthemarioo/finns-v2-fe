// app/production/layers/LayerProductionClient.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { createLayerProductionTableColumns } from "./tableColumns";
import { LayerProduction } from "@/types/layer-production";
import Button from "@/components/form/Button";
import { LayerProductionModal } from "./LayerProductionModal";
import { PaginationType } from "@/types/pagination";

interface LayerProductionClientProps {
    initialData: LayerProduction[];
    pagination: PaginationType<LayerProduction>;
}

export function LayerProductionClient({ initialData, pagination }: LayerProductionClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLayerProduction, setEditingLayerProduction] = useState<LayerProduction | null>(null);

    const openModal = (layerProduction: LayerProduction | null = null) => {
        setEditingLayerProduction(layerProduction);
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

    const columns = useMemo(() => createLayerProductionTableColumns(openModal), []);

    return (
        <>
            <div className="text-end">
                <Button text="+ add layer production" onClick={() => openModal(null)} />
            </div>

            <DataTable
                data={initialData}
                columns={columns}
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            {isModalOpen && (
                <LayerProductionModal
                    layerProduction={editingLayerProduction}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}