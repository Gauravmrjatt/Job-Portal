import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
  <div className="w-full px-2 sm:px-4">
    <div className="overflow-x-auto rounded-md shadow-sm">
      <Table className="min-w-full">
        <TableCaption className="text-sm sm:text-base">
          A list of your applied jobs
        </TableCaption>
        
        {/* Table Header */}
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Date</TableHead>
            <TableHead className="text-xs sm:text-sm">Job Role</TableHead>
            <TableHead className="text-xs sm:text-sm">Company</TableHead>
            <TableHead className="text-xs sm:text-sm text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-gray-500 py-4 text-xs sm:text-sm"
              >
                You haven't applied for any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell className="text-xs sm:text-sm">
                  {appliedJob?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {appliedJob.job?.title}
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {appliedJob.job?.company?.name}
                </TableCell>
                <TableCell className="text-right text-xs sm:text-sm">
                  <Badge
                    className={`${
                      appliedJob?.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  </div>
);

}

export default AppliedJobTable