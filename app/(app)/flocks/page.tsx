// app/flocks/page.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { useDataTable } from "@/hooks/useDataTable";
import { DataTable } from "@/components/ui/DataTable";
import { createFlockTableColumns } from "./tableColumns";
import Button from "@/components/form/Button";
import FeatherIcon from "feather-icons-react";
import { Flock } from "@/types/flock";
import { Farm } from "@/types/farm";

interface FlockForm {
    farm_id: number | null;
    name: string;
    house_code: string;
    age_in_day: number | null;
    strain: string;
}

export default function FlockPage() {
    const { data, loading, error, pagination, setPage, refetch } =
        useDataTable<Flock>("/api/proxy/flocks");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFlock, setEditingFlock] = useState<Flock | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [form, setForm] = useState<FlockForm>({
        farm_id: null,
        name: "",
        house_code: "",
        age_in_day: null,
        strain: "",
    });
    const [farms, setFarms] = useState<Farm[] | null>(null);

    const openModal = () => {
        setEditingFlock(null);
        setForm({
            farm_id: null,
            name: "",
            house_code: "",
            age_in_day: null,
            strain: "",
        });
        setFormError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (flock: Flock) => {
        setEditingFlock(flock);
        setForm({
            farm_id: flock.farm.id,
            name: flock.name,
            house_code: flock.house_code,
            age_in_day: flock.age_in_day,
            strain: flock.strain,
        });
        setFormError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFlock(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (
            !form.farm_id ||
            !form.name ||
            !form.house_code ||
            !form.age_in_day ||
            !form.strain
        ) {
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

        const isEditing = editingFlock !== null;
        const url = isEditing
            ? `/api/proxy/flocks/${editingFlock.id}`
            : "/api/proxy/flocks";
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    farm_id: form.farm_id,
                    name: form.name,
                    house_code: form.house_code,
                    age_in_day: form.age_in_day,
                    strain: form.strain,
                }),
            });

            console.log(await res.json());

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(
                    errData?.message ||
                    (isEditing ? "Gagal memperbarui flock." : "Gagal menambahkan flock.")
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

    const fetchFarmData = async () => {
        const res = await fetch("/api/proxy/farms", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData?.message);
        }

        const data = (await res.json()).data;
        setFarms(data)
    }

    useEffect(() => {
        fetchFarmData()
    }, [])

    // Recreate columns only when openEditModal reference changes (stable via useCallback if needed)
    const columns = useMemo(() => createFlockTableColumns(openEditModal), []);

    return (
        <div className="min-h-screen p-6 sm:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-lg">
                        <FeatherIcon icon="layers" className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Flock Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your poultry flock locations.
                        </p>
                    </div>
                </div>

                <div className="text-end">
                    <Button text="+ add flock" onClick={openModal} />
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
                                {editingFlock ? "Edit Flock" : "Tambah Flock"}
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
                                    Nama Flock
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Contoh: Flock Alpha"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipe Farm
                                </label>
                                <select
                                    name="farm_id"
                                    value={form.farm_id ?? ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">-- Pilih Tipe --</option>
                                    {farms?.map((value) => (
                                        <option key={value.id} value={value.id}>{value.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kode Kandang
                                </label>
                                <input
                                    type="text"
                                    name="house_code"
                                    value={form.house_code}
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
                                    : editingFlock
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