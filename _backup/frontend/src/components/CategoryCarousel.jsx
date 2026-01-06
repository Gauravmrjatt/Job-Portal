import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
  <div className="w-full px-4">
    <Carousel className="w-full max-w-6xl mx-auto my-10 sm:my-20">
      <CarouselContent className="flex items-center">
        {category.map((cat, index) => (
          <CarouselItem 
            key={index} 
            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 px-2"
          >
            <Button
              onClick={() => searchJobHandler(cat)}
              variant="outline"
              className="rounded-full text-sm sm:text-base px-4 py-2 w-full"
            >
              {cat}
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation buttons */}
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  </div>
);

}

export default CategoryCarousel