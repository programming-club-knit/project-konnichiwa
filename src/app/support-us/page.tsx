import { SupportUsSection } from "@/components/support-us-section";

export const metadata = {
  title: "Support Us & Financial Transparency | PTSC KNIT Sultanpur",
  description: "Support PTSC KNIT Sultanpur. 100% transparent financial ledger displaying verified donor contributions and itemized spend history.",
};

export default function SupportUsPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0D19] text-white pt-12">
      <SupportUsSection />
    </div>
  );
}
