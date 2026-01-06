"use client";

import JobDescription from "@/components/JobDescription";
import { useParams } from "next/navigation";

export default function JobDescriptionPage() {
    const params = useParams();
    return <JobDescription jobId={params.id} />;
}
