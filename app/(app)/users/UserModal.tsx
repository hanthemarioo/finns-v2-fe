"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/form/Input";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Option, Select } from "@/components/form/Select";
import { Farm } from "@/types/farm";
import { User } from "@/types/user";

interface UserModalProps {
    user: User | null;
    onClose: () => void;
    onSuccess: () => void;
}

const ROLE_OPTIONS: Option[] = [
    { label: "Admin", value: "admin" },
    { label: "User Input", value: "user_input" },
];

export function UserModal({ user, onClose, onSuccess }: UserModalProps) {
    const isEditing = !!user;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [farmOptions, setFarmOptions] = useState<Option[]>([]);

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        role: user?.role === "user_input" ? "user_input" : "admin",
        password: "",
        farm_id: user?.farm_id?.toString() || "",
    });

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const res = await fetch("/api/proxy/farms");

                if (res.ok) {
                    const data = (await res.json()).data;
                    const options = data.map((farm: Farm) => ({
                        label: `${farm.name} - (${farm.type})`,
                        value: farm.id.toString(),
                    }));
                    setFarmOptions(options);
                }
            } catch (err) {
                console.error("Gagal mengambil data farm:", err);
            }
        };

        fetchFarms();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.role) {
            return setError("Nama, email, dan role wajib diisi.");
        }

        if (!isEditing && !form.password) {
            return setError("Password wajib diisi.");
        }

        setSubmitting(true);
        setError(null);

        const payload = {
            name: form.name,
            email: form.email,
            phone_number: form.phone_number || null,
            role: form.role,
            farm_id: form.farm_id ? Number(form.farm_id) : null,
            ...(form.password ? { password: form.password } : {}),
        };

        const url = isEditing ? `/api/proxy/users/${user.id}` : "/api/proxy/users";

        try {
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.message || "Gagal menyimpan user.");
            }

            onSuccess();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isEditing ? "Edit User" : "Tambah User"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    <Input
                        label="Nama"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nama lengkap"
                        required
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="user@email.com"
                        required
                    />

                    <Input
                        label="Nomor Telepon"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                    />

                    <Select
                        label="Role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        options={ROLE_OPTIONS}
                        placeholder="-- Pilih Role --"
                        required
                    />

                    <Select
                        label="Farm"
                        name="farm_id"
                        value={form.farm_id}
                        onChange={handleChange}
                        options={farmOptions}
                        placeholder="-- Pilih Farm --"
                    />

                    <PasswordInput
                        label={isEditing ? "Password Baru" : "Password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        placeholder={isEditing ? "Kosongkan jika tidak diganti" : "Minimal 8 karakter"}
                        required={!isEditing}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {submitting ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
