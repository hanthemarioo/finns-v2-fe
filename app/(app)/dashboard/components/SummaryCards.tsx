type SummaryCardsProps = {
    data: Record<string, unknown> | null;
};

function titleOf(key: string) {
    return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function valueOf(value: unknown) {
    if (typeof value === "number") return value.toLocaleString("id-ID");
    if (typeof value === "string") return value;
    return "-";
}

export default function SummaryCards({ data }: SummaryCardsProps) {
    const source = Array.isArray(data) ? data[0] : data;
    const items = Object.entries(source ?? {}).filter(([, value]) => ["number", "string"].includes(typeof value));

    if (!items.length) {
        return (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-500">
                Summary data belum tersedia.
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(([key, value]) => (
                <div key={key} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">{titleOf(key)}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{valueOf(value)}</p>
                </div>
            ))}
        </div>
    );
}
