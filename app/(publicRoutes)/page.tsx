"use client"
import FeaturedTeachersSection from "@/components/layout/FeaturedTeacher";
import EarningCalculator from "@/components/layout/EarningCalculator";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/layout/Hero-section";
import FindMatchQuiz from "@/components/layout/FindMatchQuiz";
import HowItWorksSection from "@/components/layout/HowItWorks";
import LearningPathsSection from "@/components/layout/LearningPathsSection";
import TrendingDisciplines from "@/components/layout/TrendingDisciplines";
import PlatformStatsSection from "@/components/layout/PlatformStatsSection";
import QualityShieldSection from "@/components/layout/QualityShieldSection";
import SuccessStoriesSection from "@/components/layout/SuccessStoriesSection";
import WhySkillbrideSection from "@/components/layout/WhySkillBridge";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FindMatchQuiz />
      <HowItWorksSection />
      <PlatformStatsSection />
      <TrendingDisciplines />
      <FeaturedTeachersSection />
      <QualityShieldSection />
      <SuccessStoriesSection />
      <LearningPathsSection />
      <WhySkillbrideSection />
      <EarningCalculator />
      <Footer />
    </>
  );
}
