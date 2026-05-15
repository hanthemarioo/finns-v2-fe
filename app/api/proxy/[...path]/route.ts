import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_BASE_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : "http://localhost:8000/api/v1";

async function getHeaders(): Promise<HeadersInit> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const pathString = resolvedParams.path.join("/");
        const searchParams = request.nextUrl.searchParams.toString();
        const query = searchParams ? `?${searchParams}` : "";
        const targetUrl = `${LARAVEL_BASE_URL}/${pathString}${query}`;

        const response = await fetch(targetUrl, {
            method: "GET",
            headers: await getHeaders(),
        });

        const data = await response.json();
        return NextResponse.json(data, {
            status: response.status,
            statusText: response.statusText,
        });
    } catch (error) {
        console.error("[PROXY_GET_ERROR]", error);
        return NextResponse.json(
            { message: "Internal Server Error Proxying Request" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const pathString = resolvedParams.path.join("/");
        const targetUrl = `${LARAVEL_BASE_URL}/${pathString}`;

        const body = await request.json();

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: await getHeaders(),
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, {
            status: response.status,
            statusText: response.statusText,
        });
    } catch (error) {
        console.error("[PROXY_POST_ERROR]", error);
        return NextResponse.json(
            { message: "Internal Server Error Proxying Request" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const pathString = resolvedParams.path.join("/");
        const targetUrl = `${LARAVEL_BASE_URL}/${pathString}`;

        const body = await request.json();

        const response = await fetch(targetUrl, {
            method: "PUT",
            headers: await getHeaders(),
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, {
            status: response.status,
            statusText: response.statusText,
        });
    } catch (error) {
        console.error("[PROXY_POST_ERROR]", error);
        return NextResponse.json(
            { message: "Internal Server Error Proxying Request" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const pathString = resolvedParams.path.join("/");
        const targetUrl = `${LARAVEL_BASE_URL}/${pathString}`;

        const response = await fetch(targetUrl, {
            method: "DELETE",
            headers: await getHeaders(),
        });

        const data = await response.json();
        return NextResponse.json(data, {
            status: response.status,
            statusText: response.statusText,
        });
    } catch (error) {
        console.error("[PROXY_DELETE_ERROR]", error);
        return NextResponse.json(
            { message: "Internal Server Error Proxying Request" },
            { status: 500 }
        );
    }
}
