// app/users/page.tsx

import { Suspense } from "react";
import { cookies } from "next/headers";
import FeatherIcon from "feather-icons-react";
import { UserClient } from "./UserClient";
import { type PageSearchParams, paginationQuery } from "@/lib/pagination";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type UserPageProps = {
    searchParams: Promise<PageSearchParams>;
};

export default async function UserPage({ searchParams }: UserPageProps) {
    const query = paginationQuery(await searchParams);

    const res = await fetch(`${API_BASE_URL}/api/v1/users?${query}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
        },
        cache: "no-store",
    });

    const result = res.ok ? await res.json() : null;
    const data = result?.data || [];

    return (
        <div className="min-h-screen p-6 sm:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-lg">
                        <FeatherIcon icon="users" className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            User Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage admin and user input accounts.
                        </p>
                    </div>
                </div>

                {!res.ok && res.status === 403 ? (
                    <div className="bg-white border border-red-100 rounded-xl p-6 text-sm text-red-600">
                        Kamu tidak memiliki akses ke halaman ini.
                    </div>
                ) : (
                    <Suspense fallback={<div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Loading...</div>}>
                        <UserClient initialData={data} pagination={result} />
                    </Suspense>
                )}
            </div>
        </div>
    );
}
