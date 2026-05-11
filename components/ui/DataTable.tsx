// components/ui/DataTable.tsx

import React, { useCallback, useMemo } from "react";
import { Pagination } from "./Pagination";

type CellRenderer<T> = {
    render(value: never, row: T): React.ReactNode;
}["render"];

export type TableColumn<T> = {
    key: keyof T | string;
    label: string;
    render?: CellRenderer<T>;
};

type PaginationLink = {
    url: string | null;
    label: string;
    page: number | string | null;
    active: boolean;
};

type DataTableProps<T> = {
    data: T[];
    columns: TableColumn<T>[];
    loading?: boolean;
    error?: string | null;
    pagination?: {
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
    } | null;
    onPageChange?: (page: number) => void;
};

export function DataTable<T extends object>({
    data,
    columns,
    loading = false,
    error = null,
    pagination,
    onPageChange,
}: DataTableProps<T>) {

    // Helper safe get (support nested object strings e.g., 'owner.name')
    const getNestedValue = useCallback((obj: T, path: string): unknown => {
        return path.split(".").reduce<unknown>((acc, part) => {
            if (!acc || typeof acc !== "object") return undefined;
            return (acc as Record<string, unknown>)[part];
        }, obj);
    }, []);

    // Helper safe render (handling objects/arrays without breaking React)
    const renderCell = useCallback((row: T, col: TableColumn<T>) => {
        const rawValue = getNestedValue(row, col.key as string);

        if (col.render) {
            return col.render(rawValue as never, row);
        }

        if (rawValue === null || rawValue === undefined) return <span className="text-gray-400">-</span>;
        if (typeof rawValue === "object") return JSON.stringify(rawValue);
        if (typeof rawValue === "boolean") return rawValue ? "Yes" : "No";
        if (typeof rawValue === "string" || typeof rawValue === "number") return rawValue;

        return String(rawValue);
    }, [getNestedValue]);

    const paginationLinks = pagination?.links.map((link) => ({
        ...link,
        page: typeof link.page === "string" ? Number(link.page) || null : link.page,
    }));

    const TableContent = useMemo(() => {
        if (loading) {
            return Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="border-b border-gray-100">
                    {columns.map((col, colIndex) => (
                        <td key={`skeleton-col-${colIndex}`} className="p-4">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </td>
                    ))}
                </tr>
            ));
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={columns.length} className="p-8 text-center text-red-500 bg-red-50">
                        <p className="font-medium">Error fetching data</p>
                        <p className="text-sm mt-1">{error}</p>
                    </td>
                </tr>
            );
        }

        if (!data.length) {
            return (
                <tr>
                    <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                        No data available.
                    </td>
                </tr>
            );
        }

        return data.map((row, rowIndex) => (
            <tr
                key={getNestedValue(row, "id")?.toString() || rowIndex}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            >
                <td key={`col-index`} className="p-4 text-sm text-gray-700 whitespace-nowrap">
                    {++rowIndex}
                </td>
                {columns.map((col, colIndex) => (
                    <td key={`col-${colIndex}`} className="p-4 text-sm text-gray-700 whitespace-nowrap">
                        {renderCell(row, col)}
                    </td>
                ))}
            </tr>
        ));
    }, [data, columns, loading, error, getNestedValue, renderCell]);

    return (
        <div className="w-full flex flex-col space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th
                                    key={`header-index`}
                                    className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                                >
                                    No
                                </th>
                                {columns.map((col, idx) => (
                                    <th
                                        key={`header-${idx}`}
                                        className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {TableContent}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagination && onPageChange && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-2 text-sm text-gray-600">
                    <div>
                        Showing <span className="font-semibold text-gray-900">{data.length}</span> items
                        (Total: <span className="font-semibold text-gray-900">{pagination.total}</span>)
                    </div>
                    <Pagination links={paginationLinks ?? []} onPageChange={onPageChange} />
                </div>
            )}
        </div>
    );
}
