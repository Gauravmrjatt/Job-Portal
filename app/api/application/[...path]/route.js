import connectDB from "@/lib/db";
import { Application } from "@/lib/models/application.model";
import { Job } from "@/lib/models/job.model";
import { NextResponse } from "next/server";
import { getAuthUser, verifyAuth } from "@/lib/auth";

export async function GET(request, { params }) {
    const { path } = await params;
    const action = path?.[0];

    await connectDB();

    const userId = await getAuthUser();
    const authCheck = verifyAuth(userId);
    if (authCheck.error) return authCheck.response;

    // /api/application/apply/:id
    if (action === "apply") {
        const jobId = path?.[1];
        return handleApplyJob(jobId, userId);
    }

    // /api/application/get
    if (action === "get") {
        return getAppliedJobs(userId);
    }

    // /api/application/:id/applicants
    if (path?.[1] === "applicants") {
        const jobId = action;
        return getApplicants(jobId);
    }

    return NextResponse.json({ message: "Not found", success: false }, { status: 404 });
}

export async function POST(request, { params }) {
    const { path } = await params;
    const action = path?.[0];

    await connectDB();

    const userId = await getAuthUser();
    const authCheck = verifyAuth(userId);
    if (authCheck.error) return authCheck.response;

    // /api/application/status/:id/update
    if (action === "status") {
        const applicationId = path?.[1];
        if (path?.[2] === "update") {
            return handleUpdateStatus(request, applicationId);
        }
    }

    return NextResponse.json({ message: "Not found", success: false }, { status: 404 });
}

async function handleApplyJob(jobId, userId) {
    try {
        if (!jobId) {
            return NextResponse.json(
                { message: "Job id is required.", success: false },
                { status: 400 }
            );
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId,
        });

        if (existingApplication) {
            return NextResponse.json(
                { message: "You have already applied for this job", success: false },
                { status: 400 }
            );
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return NextResponse.json(
                { message: "Job not found", success: false },
                { status: 404 }
            );
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        return NextResponse.json(
            { message: "Job applied successfully.", success: true },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

async function getAppliedJobs(userId) {
    try {
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "company",
                    options: { sort: { createdAt: -1 } },
                },
            });

        return NextResponse.json({ application: applications, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

async function getApplicants(jobId) {
    try {
        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
            },
        });

        if (!job) {
            return NextResponse.json(
                { message: "Job not found.", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json({ job, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

async function handleUpdateStatus(request, applicationId) {
    try {
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { message: "Status is required", success: false },
                { status: 400 }
            );
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return NextResponse.json(
                { message: "Application not found.", success: false },
                { status: 404 }
            );
        }

        application.status = status.toLowerCase();
        await application.save();

        return NextResponse.json({
            message: "Status updated successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
