"use client";

import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'next/navigation';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/lib/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    return (
    <div className='max-w-7xl mx-auto my-6 sm:my-10 px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6'>
            <div className="flex-1 min-w-0">
                <h1 className='font-bold text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 break-words'>
                    {singleJob?.title}
                </h1>
                <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                    <Badge className='text-blue-700 font-bold text-xs sm:text-sm px-2 py-1' variant="ghost">
                        {singleJob?.postion} Positions
                    </Badge>
                    <Badge className='text-[#F83002] font-bold text-xs sm:text-sm px-2 py-1' variant="ghost">
                        {singleJob?.jobType}
                    </Badge>
                    <Badge className='text-[#7209b7] font-bold text-xs sm:text-sm px-2 py-1' variant="ghost">
                        {singleJob?.salary}LPA
                    </Badge>
                </div>
            </div>
            
            {/* Apply Button */}
            <div className="flex-shrink-0 w-full lg:w-auto">
                <Button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`w-full lg:w-auto rounded-lg px-6 py-2 text-sm sm:text-base ${
                        isApplied 
                        ? 'bg-gray-600 cursor-not-allowed hover:bg-gray-600' 
                        : 'bg-[#7209b7] hover:bg-[#5f32ad]'
                    }`}
                >
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>
        </div>
        
        {/* Job Description Section */}
        <div className="mt-6 sm:mt-8">
            <h2 className='border-b-2 border-b-gray-300 font-medium text-base sm:text-lg py-3 sm:py-4'>
                Job Description
            </h2>
            
            {/* Job Details */}
            <div className='mt-4 sm:mt-6 space-y-3 sm:space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-start'>
                    <span className='font-bold text-sm sm:text-base min-w-0 sm:min-w-[140px] mb-1 sm:mb-0'>
                        Role:
                    </span>
                    <span className='font-normal text-gray-800 text-sm sm:text-base break-words sm:ml-4'>
                        {singleJob?.title}
                    </span>
                </div>
                
                <div className='flex flex-col sm:flex-row sm:items-start'>
                    <span className='font-bold text-sm sm:text-base min-w-0 sm:min-w-[140px] mb-1 sm:mb-0'>
                        Location:
                    </span>
                    <span className='font-normal text-gray-800 text-sm sm:text-base break-words sm:ml-4'>
                        {singleJob?.location}
                    </span>
                </div>
                
                <div className='flex flex-col sm:flex-row sm:items-start'>
                    <span className='font-bold text-sm sm:text-base min-w-0 sm:min-w-[140px] mb-1 sm:mb-0'>
                        Description:
                    </span>
                    <span className='font-normal text-gray-800 text-sm sm:text-base leading-relaxed break-words sm:ml-4'>
                        {singleJob?.description}
                    </span>
                </div>
                
                <div className='flex flex-col sm:flex-row sm:items-start'>
                    <span className='font-bold text-sm sm:text-base min-w-0 sm:min-w-[140px] mb-1 sm:mb-0'>
                        Experience:
                    </span>
                    <span className='font-normal text-gray-800 text-sm sm:text-base sm:ml-4'>
                        {singleJob?.experience} yrs
                    </span>
                </div>
                
                <div className='flex flex-col sm:flex-row sm:items-start'>
                    <span className='font-bold text-sm sm:text-base min-w-0 sm:min-w-[140px] mb-1 sm:mb-0'>
                        Salary:
                    </span>
                    <span className='font-normal text-gray-800 text-sm sm:text-base sm:ml-4'>
                        {singleJob?.salary}LPA
                    </span>
                </div>
                
                <div className='flex flex-col sm:flex-row sm:items-start'>
                    <span className='font-bold text-sm sm:text-base min-w-0 sm:min-w-[140px] mb-1 sm:mb-0'>
                        Total Applicants:
                    </span>
                    <span className='font-normal text-gray-800 text-sm sm:text-base sm:ml-4'>
                        {singleJob?.applications?.length}
                    </span>
                </div>
                
                <div className='flex flex-col sm:flex-row sm:items-start'>
                    <span className='font-bold text-sm sm:text-base min-w-0 sm:min-w-[140px] mb-1 sm:mb-0'>
                        Posted Date:
                    </span>
                    <span className='font-normal text-gray-800 text-sm sm:text-base sm:ml-4'>
                        {singleJob?.createdAt.split("T")[0]}
                    </span>
                </div>
            </div>
        </div>
    </div>
)
}

export default JobDescription