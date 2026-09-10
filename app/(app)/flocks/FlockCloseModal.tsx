"use client";

import { useState } from "react";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { Flock } from "@/types/flock";

type FlockCloseModalProps = {
    flock: Flock;
    onClose: () => void;
    onSuccess: () => void;
};

const CLOSING_REASON_OPTIONS = [
    { label: "Harvested", value: "harvested" },
    { label: "Depopulated", value: "depopulated" },
    { label: "Disease", value: "disease" },
    { label: "Sold", value: "sold" },
    { label: "Terminated", value: "terminated" },
    { label: "Other", value: "other" },
];

function today() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function FlockCloseModal({ flock, onClose, onSuccess }: FlockCloseModalProps) {
    const [closedAt, setClosedAt] = useState(today());
    const [closingReason, setClosingReason] = useState("");
    const [closingNote, setClosingNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!closedAt || !closingReason) {
            setError("Tanggal tutup dan alasan wajib diisi.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/proxy/flocks/${flock.id}/close`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    closed_at: closedAt,
                    closing_reason: closingReason,
                    closing_note: closingNote || null,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.message || "Gagal menutup flock.");
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Close Flock</h2>
                        <p className="text-sm text-gray-500 mt-1">{flock.name}</p>
                    </div>
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
                        type="date"
                        label="Tanggal Tutup"
                        name="closed_at"
                        value={closedAt}
                        max={today()}
                        onChange={(event) => setClosedAt(event.target.value)}
                        required
                    />

                    <Select
                        label="Alasan Penutupan"
                        name="closing_reason"
                        value={closingReason}
                        onChange={(event) => setClosingReason(event.target.value)}
                        options={CLOSING_REASON_OPTIONS}
                        placeholder="-- Pilih alasan --"
                        required
                    />

                    <label className="block text-sm font-medium text-gray-700">
                        Catatan
                        <textarea
                            name="closing_note"
                            value={closingNote}
                            onChange={(event) => setClosingNote(event.target.value)}
                            rows={4}
                            maxLength={1000}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tambahkan catatan penutupan jika diperlukan."
                        />
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
                    >
                        {submitting ? "Menutup..." : "Tutup Flock"}
                    </button>
                </div>
            </div>
        </div>
    );
}
