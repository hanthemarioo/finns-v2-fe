export function formatDate(isoString: string | null | undefined): string {
    if (!isoString) return "-";

    const date = new Date(isoString);
    // Validasi invalid date
    if (isNaN(date.getTime())) return String(isoString);

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
    }).format(date);
}