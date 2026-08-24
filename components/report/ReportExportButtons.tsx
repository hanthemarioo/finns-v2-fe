"use client";

import { useState } from "react";
import FeatherIcon from "feather-icons-react";

type ExportFormat = "pdf" | "xlsx";

type ReportExportFilters = {
    farm_id: string;
    flock_id?: string;
    coop_id?: string;
    period_type: string;
    start_date?: string;
    end_date?: string;
};

type ReportExportButtonsProps = {
    reportType: "layer" | "grower";
    filters: ReportExportFilters;
    disabled?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function buildExportParams(filters: ReportExportFilters, format: ExportFormat) {
    const params = new URLSearchParams({
        farm_id: filters.farm_id,
        period_type: filters.period_type,
        format,
    });

    if (filters.flock_id) params.set("flock_id", filters.flock_id);
    if (filters.coop_id) params.set("coop_id", filters.coop_id);

    if (filters.period_type === "custom") {
        if (filters.start_date) params.set("start_date", filters.start_date);
        if (filters.end_date) params.set("end_date", filters.end_date);
    }

    return params;
}

async function getErrorMessage(response: Response): Promise<string> {
    if (response.headers.get("content-type")?.includes("application/json")) {
        const body: unknown = await response.json();

        if (isRecord(body) && typeof body.message === "string") {
            return body.message;
        }
    }

    return "Laporan gagal diunduh. Silakan coba lagi.";
}

function fileNameFromHeader(header: string | null, fallback: string) {
    const utf8Name = header?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];

    if (utf8Name) {
        try {
            return decodeURIComponent(utf8Name);
        } catch {
            return fallback;
        }
    }

    return header?.match(/filename="?([^";]+)"?/i)?.[1] ?? fallback;
}

export function ReportExportButtons({
    reportType,
    filters,
    disabled = false,
}: ReportExportButtonsProps) {
    const [exporting, setExporting] = useState<ExportFormat | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async (format: ExportFormat) => {
        setError(null);
        setExporting(format);

        try {
            const params = buildExportParams(filters, format);
            const response = await fetch(
                `/api/proxy/reports/${reportType}/export?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error(await getErrorMessage(response));
            }

            const blob = await response.blob();
            const fallbackName = `${reportType}-report.${format}`;
            const fileName = fileNameFromHeader(
                response.headers.get("content-disposition"),
                fallbackName
            );
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(downloadUrl);
        } catch (exportError) {
            setError(
                exportError instanceof Error
                    ? exportError.message
                    : "Laporan gagal diunduh. Silakan coba lagi."
            );
        } finally {
            setExporting(null);
        }
    };

    const isDisabled = disabled || exporting !== null;

    return (
        <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => handleExport("pdf")}
                    disabled={isDisabled}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FeatherIcon
                        icon={exporting === "pdf" ? "loader" : "file-text"}
                        size={17}
                        className={exporting === "pdf" ? "animate-spin" : ""}
                    />
                    {exporting === "pdf" ? "Mengunduh..." : "Export PDF"}
                </button>

                <button
                    type="button"
                    onClick={() => handleExport("xlsx")}
                    disabled={isDisabled}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FeatherIcon
                        icon={exporting === "xlsx" ? "loader" : "download"}
                        size={17}
                        className={exporting === "xlsx" ? "animate-spin" : ""}
                    />
                    {exporting === "xlsx" ? "Mengunduh..." : "Export Excel"}
                </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
