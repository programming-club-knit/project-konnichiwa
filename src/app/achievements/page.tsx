import { AchievementsSection } from "@/components/landing/achievements-section";

export const metadata = {
  title: "Achievements | PTSC KNIT Sultanpur",
  description: "A showcase of national hackathon wins, GSoC scholars, LFX mentorships, and competitive programming achievements by PTSC members.",
};

export default function AchievementsPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0D19] text-white pt-12">
      <AchievementsSection />
    </div>
  );
}
