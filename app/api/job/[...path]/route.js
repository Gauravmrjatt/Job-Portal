import connectDB from "@/lib/db";
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

    if (action === "get") {
        const jobId = path?.[1];
        if (jobId) {
            return getJobById(jobId);
        }
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get("keyword") || "";
        return getAllJobs(keyword);
    }

    if (action === "getadminjobs") {
        return getAdminJobs(userId);
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

    if (action === "post") {
        return handlePostJob(request, userId);
    }

    return NextResponse.json({ message: "Not found", success: false }, { status: 404 });
}

async function handlePostJob(request, userId) {
    try {
        const body = await request.json();
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId,
        } = body;

        if (
            !title ||
            !description ||
            !requirements ||
            !salary ||
            !location ||
            !jobType ||
            !experience ||
            !position ||
            !companyId
        ) {
            return NextResponse.json(
                { message: "Something is missing.", success: false },
                { status: 400 }
            );
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId,
        });

        return NextResponse.json(
            { message: "New job created successfully.", job, success: true },
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

async function getAllJobs(keyword) {
    try {
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        };

        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        return NextResponse.json({ jobs, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

async function getJobById(jobId) {
    try {
        const job = await Job.findById(jobId).populate({ path: "applications" });

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

async function getAdminJobs(userId) {
    try {
        const jobs = await Job.find({ created_by: userId }).populate({
            path: "company",
        }).sort({ createdAt: -1 });

        return NextResponse.json({ jobs, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
