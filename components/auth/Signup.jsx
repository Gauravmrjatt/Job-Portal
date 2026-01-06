"use client";

"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { USER_API_END_POINT } from "@/lib/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: "",
    });
    const { loading, user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                router.push("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="w-full max-w-md mx-auto">
                    <form
                        onSubmit={submitHandler}
                        className="w-full border border-gray-200 rounded-md p-6 shadow-lg bg-white"
                    >
                        <h1 className="font-bold text-xl mb-6 text-center">Sign Up</h1>

                        <div className="mb-4">
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                value={input.fullname}
                                name="fullname"
                                onChange={changeEventHandler}
                                placeholder="Enter your full name"
                                className="mt-1"
                            />
                        </div>

                        <div className="mb-4">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="Enter your email"
                                className="mt-1"
                            />
                        </div>

                        <div className="mb-4">
                            <Label>Phone Number</Label>
                            <Input
                                type="text"
                                value={input.phoneNumber}
                                name="phoneNumber"
                                onChange={changeEventHandler}
                                placeholder="Enter phone number"
                                className="mt-1"
                            />
                        </div>

                        <div className="mb-4">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Enter your password"
                                className="mt-1"
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="mb-4">
                            <Label className="block mb-2">Role</Label>
                            <RadioGroup className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === "student"}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer w-4 h-4"
                                        id="student"
                                    />
                                    <Label htmlFor="student" className="cursor-pointer">
                                        Student
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === "recruiter"}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer w-4 h-4"
                                        id="recruiter"
                                    />
                                    <Label htmlFor="recruiter" className="cursor-pointer">
                                        Recruiter
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Profile Upload */}
                        <div className="mb-6">
                            <Label className="block mb-2">Profile Picture</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer w-full"
                            />
                        </div>

                        {/* Submit Button */}
                        {loading ? (
                            <Button disabled className="w-full mb-4 py-2">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full mb-4 py-2">
                                Sign Up
                            </Button>
                        )}

                        {/* Login Link */}
                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Login
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;