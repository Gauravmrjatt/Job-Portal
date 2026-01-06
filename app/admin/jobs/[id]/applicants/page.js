"use client";

import Applicants from "@/components/admin/Applicants";
import { useParams } from "next/navigation";

export default function ApplicantsPage() {
    const params = useParams();
    return <Applicants jobId={params.id} />;
}
