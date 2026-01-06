import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);
   return (
  <div className="w-full bg-white p-3 sm:p-4 rounded-md shadow-sm">
    {/* Title */}
    <h1 className="font-bold text-base sm:text-lg">Filter Jobs</h1>
    <hr className="mt-3" />

    {/* Filters */}
    <RadioGroup value={selectedValue} onValueChange={changeHandler}>
      {fitlerData.map((data, index) => (
        <div key={index} className="mt-4">
          {/* Filter Type Heading */}
          <h1 className="font-semibold text-sm sm:text-base">{data.fitlerType}</h1>

          {/* Filter Options */}
          <div className="max-h-40 overflow-y-auto pr-1 mt-2">
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div
                  key={itemId}
                  className="flex items-center space-x-2 my-2 text-sm sm:text-base"
                >
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId} className="cursor-pointer">{item}</Label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </RadioGroup>
  </div>
);
}

export default FilterCard