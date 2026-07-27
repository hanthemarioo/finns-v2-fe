import FeatherIcon from "feather-icons-react";
import { GrowerReportClient } from "./GrowerReportClient";
import { getGrowerReportPageData } from "./growerReport.service";

type GrowerReportPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GrowerReportPage({ searchParams }: GrowerReportPageProps) {
    const pageData = await getGrowerReportPageData(await searchParams);

    return (
        <div className="min-h-screen p-6 sm:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-lg">
                        <FeatherIcon icon="file-text" className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Grower Production Report
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Monitor body weight, feed, water, population, mortality, and culling.
                        </p>
                    </div>
                </div>

                <GrowerReportClient
                    filters={pageData.filters}
                    farms={pageData.farms}
                    flocks={pageData.flocks}
                    coops={pageData.coops}
                    rows={pageData.report?.data ?? []}
                    unavailableFields={pageData.report?.unavailable_fields ?? {}}
                    error={pageData.error}
                />
            </div>
        </div>
    );
}
