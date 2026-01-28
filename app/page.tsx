import HeroSection from "@/components/layout/Hero-section";
import HowItWorksSection from "@/components/layout/HowItWorks";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
    </>
  );
}
