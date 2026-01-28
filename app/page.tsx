import FeaturedTeachersSection from "@/components/layout/FeaturedTeacher";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/layout/Hero-section";
import HowItWorksSection from "@/components/layout/HowItWorks";
import Navbar from "@/components/layout/Navbar";
import WhySkillbrideSection from "@/components/layout/WhySkillBridge";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturedTeachersSection />
      <WhySkillbrideSection />
      <Footer />
    </>
  );
}
