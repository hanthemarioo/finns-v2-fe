// app/users/UserClient.tsx

"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/form/Button";
import { DataTable } from "@/components/ui/DataTable";
import { PaginationType } from "@/types/pagination";
import { User } from "@/types/user";
import { UserModal } from "./UserModal";
import { createUserTableColumns } from "./tableColumns";

interface UserClientProps {
    initialData: User[];
    pagination: PaginationType<User> | null;
}

export function UserClient({ initialData, pagination }: UserClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const openModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
        setError(null);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        router.refresh();
    };

    const handleDelete = useCallback(async (user: User) => {
        const confirmed = window.confirm(`Hapus user ${user.name}?`);
        if (!confirmed) return;

        setError(null);

        try {
            const res = await fetch(`/api/proxy/users/${user.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.message || "Gagal menghapus user.");
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
        () => createUserTableColumns(openModal, handleDelete),
        [handleDelete]
    );

    return (
        <>
            <div className="flex justify-end">
                <Button text="+ add user" onClick={() => openModal(null)} />
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
                <UserModal
                    user={editingUser}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}
