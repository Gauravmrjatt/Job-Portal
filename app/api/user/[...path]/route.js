import connectDB from "@/lib/db";
import { User } from "@/lib/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthUser, verifyAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import getDataUri from "@/lib/datauri";

export async function GET(request, { params }) {
    const { path } = await params;
    const action = path?.[0];

    await connectDB();

    if (action === "logout") {
        const cookieStore = await cookies();
        cookieStore.set("token", "", { maxAge: 0 });
        return NextResponse.json({
            message: "Logged out successfully.",
            success: true,
        });
    }

    return NextResponse.json({ message: "Not found", success: false }, { status: 404 });
}

export async function POST(request, { params }) {
    const { path } = await params;
    const action = path?.[0];

    await connectDB();

    if (action === "register") {
        return handleRegister(request);
    }

    if (action === "login") {
        return handleLogin(request);
    }

    if (action === "profile") {
        const subAction = path?.[1];
        if (subAction === "update") {
            return handleUpdateProfile(request);
        }
    }

    return NextResponse.json({ message: "Not found", success: false }, { status: 404 });
}

async function handleRegister(request) {
    try {
        const formData = await request.formData();
        const fullname = formData.get("fullname");
        const email = formData.get("email");
        const phoneNumber = formData.get("phoneNumber");
        const password = formData.get("password");
        const role = formData.get("role");
        const file = formData.get("file");

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return NextResponse.json(
                { message: "Something is missing", success: false },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists with this email.", success: false },
                { status: 400 }
            );
        }

        let profilePhoto = "";
        if (file && file.size > 0) {
            const buffer = await file.arrayBuffer();
            const fileData = { name: file.name, buffer };
            const fileUri = getDataUri(fileData);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhoto = cloudResponse.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto,
            },
        });

        return NextResponse.json(
            { message: "Account created successfully.", success: true },
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

async function handleLogin(request) {
    try {
        const body = await request.json();
        const { email, password, role } = body;

        if (!email || !password || !role) {
            return NextResponse.json(
                { message: "Something is missing", success: false },
                { status: 400 }
            );
        }

        let user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: "Incorrect email or password.", success: false },
                { status: 400 }
            );
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json(
                { message: "Incorrect email or password.", success: false },
                { status: 400 }
            );
        }

        if (role !== user.role) {
            return NextResponse.json(
                { message: "Account doesn't exist with current role.", success: false },
                { status: 400 }
            );
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            maxAge: 24 * 60 * 60,
            httpOnly: true,
            sameSite: "strict",
        });

        return NextResponse.json({
            message: `Welcome back ${user.fullname}`,
            user: userData,
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

async function handleUpdateProfile(request) {
    try {
        const userId = await getAuthUser();
        const authCheck = verifyAuth(userId);
        if (authCheck.error) return authCheck.response;

        const formData = await request.formData();
        const fullname = formData.get("fullname");
        const email = formData.get("email");
        const phoneNumber = formData.get("phoneNumber");
        const bio = formData.get("bio");
        const skills = formData.get("skills");
        const file = formData.get("file");

        let user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found.", success: false },
                { status: 400 }
            );
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");

        if (file && file.size > 0) {
            const buffer = await file.arrayBuffer();
            const fileData = { name: file.name, buffer };
            const fileUri = getDataUri(fileData);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.name;
        }

        await user.save();

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return NextResponse.json({
            message: "Profile updated successfully.",
            user: userData,
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
