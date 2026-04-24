'use client';

import React, { ReactNode, useState } from 'react';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
}

interface TableProps {
    columns: Column[];
    data: any[];
    searchable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    pagination?: boolean;
    export?: 'excel' | 'pdf' | ('excel' | 'pdf')[];
    actions?: 'edit' | 'show' | 'delete' | ('edit' | 'show' | 'delete')[];
    selectable?: boolean;
    rightElement?: ReactNode;
    onRowClick?: (row: any) => void;
    onEdit?: (row: any) => void;
    onShow?: (row: any) => void;
    onDelete?: (row: any) => void;
}

const Table: React.FC<TableProps> = ({
    columns,
    data,
    searchable,
    sortable,
    filterable,
    pagination,
    export: exportOptions,
    actions: actionOptions,
    selectable,
    rightElement,
    onRowClick,
    onEdit,
    onShow,
    onDelete,
}) => {
    const pageSizeOptions = [5, 10, 25, 50, 100];
    let i = 1;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]); // State untuk pageSize

    const filteredData = data.filter((row) =>
        columns.some((column) =>
            row[column.key].toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedData = sortConfig
        ? [...filteredData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        })
        : filteredData;

    const paginatedData = pagination
        ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : sortedData;

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectRow = (row: any) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter((selectedRow) => selectedRow !== row));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    const handleSelectAll = () => {
        if (selectedRows.length === paginatedData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows([...paginatedData]);
        }
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.target.value, 10);
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset ke halaman pertama saat pageSize berubah
    };

    const renderExportButtons = () => {
        if (!exportOptions) return null;

        const exportArray = Array.isArray(exportOptions) ? exportOptions : [exportOptions];

        return (
            <div className="mt-4">
                {exportArray.includes('excel') && (
                    <button className="p-2 bg-green-500 text-white rounded">Export to Excel</button>
                )}
                {exportArray.includes('pdf') && (
                    <button className="p-2 bg-red-500 text-white rounded ml-2">Export to PDF</button>
                )}
            </div>
        );
    };

    const renderActionButtons = (row: any) => {
        if (!actionOptions) return null;

        const actionArray = Array.isArray(actionOptions) ? actionOptions : [actionOptions];

        return (
            <div className="flex space-x-2">
                {actionArray.includes('edit') && (
                    <button
                        onClick={() => onEdit && onEdit(row)}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        Edit
                    </button>
                )}
                {actionArray.includes('show') && (
                    <button
                        onClick={() => onShow && onShow(row)}
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        Show
                    </button>
                )}
                {actionArray.includes('delete') && (
                    <button
                        onClick={() => onDelete && onDelete(row)}
                        className="p-2 bg-red-500 text-white rounded"
                    >
                        Delete
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="overflow-x-auto shadow-2xl">
            <div className='flex justify-between text-[#fd7d14c0] p-4'>
                {pagination && (
                    <div className="flex items-center space-x-2">
                        <span>Show</span>
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="p-1 text-black bg-gray-200 rounded"
                        >
                            {pageSizeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <span>entries</span>
                    </div>
                )}
                {searchable && (
                    <div className="flex items-center space-x-2">
                        <span>Search:</span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-1 bg-gray-200 rounded text-black"
                        />
                    </div>
                )}
            </div>

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        {selectable && (
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.length === paginatedData.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        )}
                        <th className="px-4 py-2">No</th>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-4 py-2 cursor-pointer"
                                onClick={() => sortable && column.sortable && handleSort(column.key)}
                            >
                                {column.label}
                                {sortConfig && sortConfig.key === column.key && (
                                    <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                )}
                            </th>
                        ))}
                        {actionOptions && <th className="px-4 py-2">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`hover:bg-gray-100 ${onRowClick ? 'cursor-pointer' : ''}`}
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            <td className="px-4 py-2">{i++}</td>
                            {selectable && (
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(row)}
                                        onChange={() => handleSelectRow(row)}
                                    />
                                </td>
                            )}
                            {columns.map((column) => (
                                <td key={column.key} className="px-4 py-2">
                                    {row[column.key]}
                                </td>
                            ))}
                            {actionOptions && (
                                <td className="px-4 py-2">
                                    {renderActionButtons(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {pagination && (
                <div className="flex justify-between items-center mt-4 p-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {renderExportButtons()}
        </div>
    );
};

export default Table;