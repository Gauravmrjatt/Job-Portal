"use client";

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/lib/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        file: user?.profile?.resume || ""
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
        setOpen(false);
        console.log(input);
    }



    return (
    <div>
        <Dialog open={open}>
            <DialogContent 
                className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-0"
                onInteractOutside={() => setOpen(false)}
            >
                <div className="p-4 sm:p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-lg sm:text-xl">Update Profile</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={submitHandler} className="space-y-4">
                        {/* Name Field */}
                        <div className='space-y-2'>
                            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                placeholder="Enter your full name"
                                className="w-full"
                            />
                        </div>
                        
                        {/* Email Field */}
                        <div className='space-y-2'>
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="Enter your email address"
                                className="w-full"
                            />
                        </div>
                        
                        {/* Phone Number Field */}
                        <div className='space-y-2'>
                            <Label htmlFor="number" className="text-sm font-medium">Phone Number</Label>
                            <Input
                                id="number"
                                name="number"
                                type="tel"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                placeholder="Enter your phone number"
                                className="w-full"
                            />
                        </div>
                        
                        {/* Bio Field */}
                        <div className='space-y-2'>
                            <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={input.bio}
                                onChange={changeEventHandler}
                                placeholder="Tell us about yourself..."
                                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                rows="3"
                            />
                        </div>
                        
                        {/* Skills Field */}
                        <div className='space-y-2'>
                            <Label htmlFor="skills" className="text-sm font-medium">Skills</Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                placeholder="e.g., JavaScript, React, Node.js (comma separated)"
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500">Separate skills with commas</p>
                        </div>
                        
                        {/* Resume Upload Field */}
                        <div className='space-y-2'>
                            <Label htmlFor="file" className="text-sm font-medium">Resume</Label>
                            <div className="relative">
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={fileChangeHandler}
                                    className="w-full cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                                </p>
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <DialogFooter className="pt-4 mt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="w-full sm:w-auto order-2 sm:order-1"
                                >
                                    Cancel
                                </Button>
                                {loading ? (
                                    <Button 
                                        disabled 
                                        className="w-full sm:w-auto order-1 sm:order-2"
                                    >
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                        Updating...
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        className="w-full sm:w-auto order-1 sm:order-2"
                                    >
                                        Update Profile
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    </div>
)
}

export default UpdateProfileDialog