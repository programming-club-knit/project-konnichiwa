import { PeopleSection } from "@/components/landing/people-section";

export const metadata = {
  title: "Our People | PTSC KNIT Sultanpur",
  description: "Spotlighting cracked members, seniors, and alumni driving software engineering excellence across top global tech organizations.",
};

export default function PeoplePage() {
  return (
    <div className="relative min-h-screen bg-[#0f0f0f] text-white pt-12">
      <PeopleSection />
    </div>
  );
}
