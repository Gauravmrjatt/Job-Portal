"use client";

import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
  <div>
    <Navbar />
    <div className="max-w-7xl mx-auto my-10 px-4">
      {/* Heading */}
      <h1 className="font-bold text-lg sm:text-xl my-6 sm:my-10 text-center sm:text-left">
        Search Results ({allJobs.length})
      </h1>

      {/* Job Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allJobs.length > 0 ? (
          allJobs.map((job) => <Job key={job._id} job={job} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No jobs found. Try adjusting your search.
          </p>
        )}
      </div>
    </div>
  </div>
);

}

export default Browse