"use client";

import CompanySetup from "@/components/admin/CompanySetup";
import { useParams } from "next/navigation";

export default function CompanySetupPage() {
    const params = useParams();
    return <CompanySetup companyId={params.id} />;
}
