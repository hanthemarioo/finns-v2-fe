// component/ui/Pagination.tsx

import React from "react";

type Link = {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
};

type PaginationProps = {
    links: Link[];
    onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = React.memo(({ links, onPageChange }) => {
    if (!links || links.length <= 3) return null; // Sembunyikan jika hanya prev, 1, next

    // Helper untuk membersihkan label HTML entity dari Laravel
    const cleanLabel = (label: string) => {
        if (label.includes("Previous")) return "Prev";
        if (label.includes("Next")) return "Next";
        return label;
    };

    return (
        <div className="flex items-center justify-center space-x-1 mt-4 text-sm">
            {links.map((link, idx) => {
                const disabled = !link.url && !link.active;
                const isNumber = !isNaN(Number(link.label));

                return (
                    <button
                        key={idx}
                        disabled={disabled}
                        onClick={() => link.page && onPageChange(link.page)}
                        className={`
              px-3 py-1.5 rounded-md transition-colors font-medium border
              ${link.active
                                ? "bg-blue-600 text-white border-blue-600 cursor-default"
                                : disabled
                                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-blue-600"
                            }
              ${!isNumber ? "px-4" : ""}
            `}
                        dangerouslySetInnerHTML={{ __html: cleanLabel(link.label) }}
                    />
                );
            })}
        </div>
    );
});

Pagination.displayName = "Pagination";