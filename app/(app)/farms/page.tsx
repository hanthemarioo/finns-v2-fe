// app/farms/page.tsx

import { cookies } from "next/headers";
import { FarmClient } from "./FarmClient";
import FeatherIcon from "feather-icons-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


export default async function FarmPage() {

    const res = await fetch(`${API_BASE_URL}/api/v1/farms`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${(await cookies()).get('token')?.value}`
        },
        cache: "no-store"
    });

    const result = res.ok ? await res.json() : null;
    const data = result?.data || [];

    return (
        <div className="min-h-screen p-6 sm:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-lg">
                        <FeatherIcon icon="home" className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Farm Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your poultry farm locations.
                        </p>
                    </div>
                </div>

                {/* Lempar data ke Client Component */}
                <FarmClient initialData={data} pagination={result} />
            </div>
        </div>
    );
}