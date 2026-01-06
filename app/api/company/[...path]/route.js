import connectDB from "@/lib/db";
import { Company } from "@/lib/models/company.model";
import { NextResponse } from "next/server";
import { getAuthUser, verifyAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import getDataUri from "@/lib/datauri";

export async function GET(request, { params }) {
    const { path } = await params;
    const action = path?.[0];

    await connectDB();

    const userId = await getAuthUser();
    const authCheck = verifyAuth(userId);
    if (authCheck.error) return authCheck.response;

    if (action === "get") {
        const companyId = path?.[1];
        if (companyId) {
            return getCompanyById(companyId);
        }
        return getCompanies(userId);
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

    if (action === "register") {
        return handleRegisterCompany(request, userId);
    }

    return NextResponse.json({ message: "Not found", success: false }, { status: 404 });
}

export async function PUT(request, { params }) {
    const { path } = await params;
    const action = path?.[0];

    await connectDB();

    const userId = await getAuthUser();
    const authCheck = verifyAuth(userId);
    if (authCheck.error) return authCheck.response;

    if (action === "update") {
        const companyId = path?.[1];
        return handleUpdateCompany(request, companyId);
    }

    return NextResponse.json({ message: "Not found", success: false }, { status: 404 });
}

async function handleRegisterCompany(request, userId) {
    try {
        const body = await request.json();
        const { companyName } = body;

        if (!companyName) {
            return NextResponse.json(
                { message: "Company name is required.", success: false },
                { status: 400 }
            );
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return NextResponse.json(
                { message: "You can't register same company.", success: false },
                { status: 400 }
            );
        }

        company = await Company.create({
            name: companyName,
            userId,
        });

        return NextResponse.json(
            { message: "Company registered successfully.", company, success: true },
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

async function getCompanies(userId) {
    try {
        const companies = await Company.find({ userId });
        return NextResponse.json({ companies, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

async function getCompanyById(companyId) {
    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return NextResponse.json(
                { message: "Company not found.", success: false },
                { status: 404 }
            );
        }
        return NextResponse.json({ company, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

async function handleUpdateCompany(request, companyId) {
    try {
        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const website = formData.get("website");
        const location = formData.get("location");
        const file = formData.get("file");

        let logo = "";
        if (file && file.size > 0) {
            const buffer = await file.arrayBuffer();
            const fileData = { name: file.name, buffer };
            const fileUri = getDataUri(fileData);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description, website, location };
        if (logo) updateData.logo = logo;

        const company = await Company.findByIdAndUpdate(companyId, updateData, {
            new: true,
        });

        if (!company) {
            return NextResponse.json(
                { message: "Company not found.", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Company information updated.",
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
