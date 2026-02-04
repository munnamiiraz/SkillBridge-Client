"use client"
import FeaturedTeachersSection from "@/components/layout/FeaturedTeacher";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/layout/Hero-section";
import HowItWorksSection from "@/components/layout/HowItWorks";
import WhySkillbrideSection from "@/components/layout/WhySkillBridge";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedTeachersSection />
      <WhySkillbrideSection />
      <Footer />
    </>
  );
}
