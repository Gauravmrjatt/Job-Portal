"use client";

import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    return (
    <div className="px-4 sm:px-6 lg:px-8">
        <Navbar />
        
        {/* Profile Card */}
        <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-4 sm:p-6 lg:p-8'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
                {/* Profile Info */}
                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1'>
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0">
                        <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                    </Avatar>
                    <div className="text-center sm:text-left flex-1 min-w-0">
                        <h1 className='font-medium text-lg sm:text-xl break-words'>{user?.fullname}</h1>
                        <p className="text-gray-600 text-sm sm:text-base mt-1 break-words">{user?.profile?.bio}</p>
                    </div>
                </div>
                
                {/* Edit Button */}
                <Button 
                    onClick={() => setOpen(true)} 
                    className="self-center sm:self-start flex-shrink-0" 
                    variant="outline"
                    size="sm"
                >
                    <Pen className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Edit</span>
                </Button>
            </div>
            
            {/* Contact Info */}
            <div className='my-5 space-y-3'>
                <div className='flex items-center gap-3'>
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-500" />
                    <span className="text-sm sm:text-base break-all">{user?.email}</span>
                </div>
                <div className='flex items-center gap-3'>
                    <Contact className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-500" />
                    <span className="text-sm sm:text-base">{user?.phoneNumber}</span>
                </div>
            </div>
            
            {/* Skills */}
            <div className='my-5'>
                <h2 className="font-semibold text-base sm:text-lg mb-3">Skills</h2>
                <div className='flex flex-wrap items-center gap-2'>
                    {
                        user?.profile?.skills.length !== 0 ? 
                        user?.profile?.skills.map((item, index) => (
                            <Badge key={index} className="text-xs sm:text-sm">{item}</Badge>
                        )) : 
                        <span className="text-gray-500 text-sm">No skills added</span>
                    }
                </div>
            </div>
            
            {/* Resume */}
            <div className='my-5'>
                <Label className="text-base sm:text-lg font-semibold block mb-2">Resume</Label>
                {
                    isResume ? (
                        <a 
                            target='_blank' 
                            href={user?.profile?.resume} 
                            className='text-blue-500 hover:text-blue-600 hover:underline cursor-pointer text-sm sm:text-base break-all inline-block'
                        >
                            {user?.profile?.resumeOriginalName}
                        </a>
                    ) : (
                        <span className="text-gray-500 text-sm">No resume uploaded</span>
                    )
                }
            </div>
        </div>
        
        {/* Applied Jobs Section */}
        <div className='max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200'>
            <h1 className='font-bold text-lg sm:text-xl mb-5'>Applied Jobs</h1>
            
            {/* Applied Job Table - Make it horizontally scrollable on mobile */}
            <div className="overflow-x-auto">
                <AppliedJobTable />
            </div>
        </div>
        
        <UpdateProfileDialog open={open} setOpen={setOpen}/>
    </div>
)
}

export default Profile