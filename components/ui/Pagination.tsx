// component/ui/Pagination.tsx

import React from "react";

type Link = {
    url: string | null;
    page?: number | string | null;
    label: string;
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
        if (label.includes("Previous") || label.includes("&laquo;")) return "Prev";
        if (label.includes("Next") || label.includes("&raquo;")) return "Next";
        return label.replace(/<[^>]*>/g, "");
    };

    const pageFromUrl = (url: string | null) => {
        if (!url) return null;

        try {
            const parsedUrl = new URL(url);
            const page = Number(parsedUrl.searchParams.get("page"));
            return Number.isInteger(page) && page > 0 ? page : null;
        } catch {
            const page = Number(new URLSearchParams(url.split("?")[1] ?? "").get("page"));
            return Number.isInteger(page) && page > 0 ? page : null;
        }
    };

    const resolvePage = (link: Link) => {
        const explicitPage = Number(link.page);

        if (Number.isInteger(explicitPage) && explicitPage > 0) {
            return explicitPage;
        }

        const urlPage = pageFromUrl(link.url);

        if (urlPage) {
            return urlPage;
        }

        const labelPage = Number(cleanLabel(link.label));
        return Number.isInteger(labelPage) && labelPage > 0 ? labelPage : null;
    };

    return (
        <div className="flex items-center justify-center space-x-1 mt-4 text-sm">
            {links.map((link, idx) => {
                const disabled = !link.url && !link.active;
                const label = cleanLabel(link.label);
                const targetPage = resolvePage(link);
                const isNumber = !Number.isNaN(Number(label));

                return (
                    <button
                        key={idx}
                        disabled={disabled || link.active || !targetPage}
                        onClick={() => {
                            if (!targetPage) return;
                            onPageChange(targetPage);
                        }}
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
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
});

Pagination.displayName = "Pagination";
