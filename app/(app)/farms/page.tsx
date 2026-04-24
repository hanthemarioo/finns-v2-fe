// app/farms/page.tsx

"use client";

import { useState, useMemo } from "react";
import { useDataTable } from "@/hooks/useDataTable";
import { DataTable } from "@/components/ui/DataTable";
import { createFarmTableColumns } from "./tableColumns";
import { Farm } from "@/types/farm";
import Button from "@/components/form/Button";
import FeatherIcon from "feather-icons-react";

interface FarmForm {
    name: string;
    type: "layer" | "grower" | "";
    location: string;
}

export default function FarmPage() {
    const { data, loading, error, pagination, setPage, refetch } =
        useDataTable<Farm>("/api/proxy/farms");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [form, setForm] = useState<FarmForm>({
        name: "",
        type: "",
        location: "",
    });

    const openModal = () => {
        setEditingFarm(null);
        setForm({ name: "", type: "", location: "", });
        setFormError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (farm: Farm) => {
        setEditingFarm(farm);
        setForm({
            name: farm.name,
            type: farm.type as "layer" | "grower",
            location: farm.location,
        });
        setFormError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFarm(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.type || !form.location) {
            setFormError("Semua field wajib diisi.");
            return;
        }

        const userRaw = localStorage.getItem("user");
        const user = userRaw ? JSON.parse(userRaw) : null;
        if (!user?.id) {
            setFormError("User tidak ditemukan. Silakan login kembali.");
            return;
        }

        setSubmitting(true);
        setFormError(null);

        const isEditing = editingFarm !== null;
        const url = isEditing
            ? `/api/proxy/farms/${editingFarm.id}`
            : "/api/proxy/farms";
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    type: form.type,
                    location: form.location,
                }),
            });

            console.log(await res.json());


            if (!res.ok) {
                const errData = await res.json();
                throw new Error(
                    errData?.message ||
                    (isEditing ? "Gagal memperbarui farm." : "Gagal menambahkan farm.")
                );
            }

            closeModal();
            refetch?.();
        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Recreate columns only when openEditModal reference changes (stable via useCallback if needed)
    const columns = useMemo(() => createFarmTableColumns(openEditModal), []);

    return (
        <div className="min-h-screen p-6 sm:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-lg">
                        <FeatherIcon icon="home" className="text-white"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Farm Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your poultry farm locations.
                        </p>
                    </div>
                </div>

                <div className="text-end">
                    <Button text="+ add farm" onClick={openModal} />
                </div>

                <DataTable
                    data={data}
                    columns={columns}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    onPageChange={setPage}
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editingFarm ? "Edit Farm" : "Tambah Farm"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {formError && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {formError}
                            </p>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Farm
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Contoh: Farm Alpha"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipe Farm
                                </label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">-- Pilih Tipe --</option>
                                    <option value="layer">Layer</option>
                                    <option value="grower">Grower</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lokasi
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Contoh: Jawa Barat"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting
                                    ? "Menyimpan..."
                                    : editingFarm
                                        ? "Perbarui"
                                        : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}