import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
    <div 
        onClick={() => navigate(`/description/${job._id}`)} 
        className='p-4 sm:p-5 lg:p-6 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition-shadow duration-200 w-full h-full flex flex-col'
    >
        {/* Company Info */}
        <div className="mb-3 sm:mb-4">
            <h2 className='font-medium text-base sm:text-lg truncate'>{job?.company?.name}</h2>
            <p className='text-xs sm:text-sm text-gray-500 mt-1'>India</p>
        </div>
        
        {/* Job Details */}
        <div className="flex-1">
            <h1 className='font-bold text-base sm:text-lg mb-2 line-clamp-2 leading-tight'>
                {job?.title}
            </h1>
            <p className='text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3'>
                {job?.description}
            </p>
        </div>
        
        {/* Badges */}
        <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 pt-2 border-t border-gray-100'>
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
    </div>
)
}

export default LatestJobCards