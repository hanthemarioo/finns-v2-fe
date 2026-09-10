export type PageSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

export function pageFromSearchParams(searchParams: PageSearchParams) {
    const page = Number(first(searchParams.page));

    return Number.isInteger(page) && page > 0 ? page : 1;
}

export function paginationQuery(searchParams: PageSearchParams) {
    const params = new URLSearchParams();
    params.set("page", pageFromSearchParams(searchParams).toString());

    return params.toString();
}
