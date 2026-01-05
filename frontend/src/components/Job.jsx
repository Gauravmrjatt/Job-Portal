import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
    const navigate = useNavigate();
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
    <div className='p-4 sm:p-5 lg:p-6 rounded-md shadow-xl bg-white border border-gray-100 w-full'>
        {/* Header with date and bookmark */}
        <div className='flex items-center justify-between mb-3'>
            <p className='text-xs sm:text-sm text-gray-500'>
                {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
            </p>
            <Button variant="outline" className="rounded-full h-8 w-8 sm:h-9 sm:w-9" size="icon">
                <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
        </div>

        {/* Company info */}
        <div className='flex items-center gap-3 mb-4'>
            <div className="flex-shrink-0">
                <Button className="p-2 sm:p-3 h-12 w-12 sm:h-16 sm:w-16" variant="outline" size="icon">
                    <Avatar className="h-8 w-8 sm:h-12 sm:w-12">
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
            </div>
            <div className="flex-1 min-w-0">
                <h2 className='font-medium text-base sm:text-lg truncate'>{job?.company?.name}</h2>
                <p className='text-xs sm:text-sm text-gray-500'>India</p>
            </div>
        </div>

        {/* Job details */}
        <div className="mb-4">
            <h1 className='font-bold text-base sm:text-lg mb-2 line-clamp-2'>{job?.title}</h1>
            <p className='text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed'>
                {job?.description}
            </p>
        </div>

        {/* Job badges */}
        <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4'>
            <Badge className='text-blue-700 font-bold text-xs px-2 py-1' variant="ghost">
                {job?.position} Positions
            </Badge>
            <Badge className='text-[#F83002] font-bold text-xs px-2 py-1' variant="ghost">
                {job?.jobType}
            </Badge>
            <Badge className='text-[#7209b7] font-bold text-xs px-2 py-1' variant="ghost">
                {job?.salary}LPA
            </Badge>
        </div>

        {/* Action buttons */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4'>
            <Button 
                onClick={() => navigate(`/description/${job?._id}`)} 
                variant="outline"
                className="flex-1 sm:flex-none text-sm py-2"
            >
                Details
            </Button>
            <Button 
                className="bg-[#7209b7] hover:bg-[#5f0894] flex-1 sm:flex-none text-sm py-2"
            >
                Save For Later
            </Button>
        </div>
    </div>
)
}

export default Job