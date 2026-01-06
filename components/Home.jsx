"use client";

import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "recruiter") {
      router.push("/admin/companies");
    }
  }, [user, router]);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  );
};

export default Home;