// app/production/growers/GrowerProductionClient.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { createGrowerProductionTableColumns } from "./tableColumns";
import { GrowerProduction } from "@/types/grower-production";
import Button from "@/components/form/Button";
import { GrowerProductionModal } from "./GrowerProductionModal";
import { PaginationType } from "@/types/pagination";

interface GrowerProductionClientProps {
    initialData: GrowerProduction[];
    pagination: PaginationType<GrowerProduction>;
}

export function GrowerProductionClient({ initialData, pagination }: GrowerProductionClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGrowerProduction, setEditingGrowerProduction] = useState<GrowerProduction | null>(null);

    const openModal = (growerProduction: GrowerProduction | null = null) => {
        setEditingGrowerProduction(growerProduction);
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

    const columns = useMemo(() => createGrowerProductionTableColumns(openModal), []);

    return (
        <>
            <div className="text-end">
                <Button text="+ add grower production" onClick={() => openModal(null)} />
            </div>

            <DataTable
                data={initialData}
                columns={columns}
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            {isModalOpen && (
                <GrowerProductionModal
                    growerProduction={editingGrowerProduction}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}