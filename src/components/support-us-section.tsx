"use client";

import { useState } from "react";
import {
  FiHeart,
  FiShield,
  FiCopy,
  FiCheck,
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
  FiUsers,
  FiArrowUpRight,
  FiFileText,
} from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";

export type DonorRecord = {
  id: string;
  name: string;
  badge: string;
  amount: string;
  date: string;
  purpose: string;
};

export type SpendRecord = {
  id: string;
  category: string;
  details: string;
  amount: string;
  date: string;
  invoiceRef: string;
};

export const RECENT_DONORS: DonorRecord[] = [
  {
    id: "donor-1",
    name: "Akash Singh",
    badge: "Alumni Batch '24 (SDE @ Google)",
    amount: "₹15,000",
    date: "Jul 24, 2026",
    purpose: "CodeStorm '26 Prize Pool",
  },
  {
    id: "donor-2",
    name: "Priya Sharma",
    badge: "Alumni Batch '23 (SDE II @ Amazon)",
    amount: "₹20,000",
    date: "Jul 18, 2026",
    purpose: "Server & GPU Infrastructure",
  },
  {
    id: "donor-3",
    name: "Anonymous Supporter",
    badge: "Well-wisher",
    amount: "₹5,000",
    date: "Jul 12, 2026",
    purpose: "Workshops & Mentorship",
  },
  {
    id: "donor-4",
    name: "Rahul Verma",
    badge: "Alumni Batch '24 (SDE @ Uber)",
    amount: "₹10,000",
    date: "Jul 05, 2026",
    purpose: "PTSCTF Bounty Pool",
  },
  {
    id: "donor-5",
    name: "Abhay Pratap",
    badge: "Student Lead Batch '25",
    amount: "₹2,500",
    date: "Jun 28, 2026",
    purpose: "Domain & SSL Renewals",
  },
];

export const SPEND_HISTORY: SpendRecord[] = [
  {
    id: "spend-1",
    category: "Hackathon Prizes",
    details: "CodeStorm '26 Winner Cash Prizes & Trophies",
    amount: "₹45,000",
    date: "Jul 20, 2026",
    invoiceRef: "INV-2026-091",
  },
  {
    id: "spend-2",
    category: "Cloud & Infrastructure",
    details: "AWS Cloud Server Hosting & GPU Compute Credits",
    amount: "₹18,500",
    date: "Jul 10, 2026",
    invoiceRef: "INV-2026-084",
  },
  {
    id: "spend-3",
    category: "Event Catering & Merch",
    details: "Swag Kits, Stickers & Refreshments for Participants",
    amount: "₹32,000",
    date: "Jun 25, 2026",
    invoiceRef: "INV-2026-072",
  },
  {
    id: "spend-4",
    category: "Domain & Subscriptions",
    details: "ptsc.knit.ac.in domain, Vercel Pro & GitHub Team Pro",
    amount: "₹9,000",
    date: "Jun 15, 2026",
    invoiceRef: "INV-2026-060",
  },
  {
    id: "spend-5",
    category: "PTSCTF Bounties",
    details: "Capture The Flag contest track rewards for top solvers",
    amount: "₹20,000",
    date: "Jun 02, 2026",
    invoiceRef: "INV-2026-048",
  },
];

export function SupportUsSection() {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeLedgerTab, setActiveLedgerTab] = useState<"donations" | "spend">("donations");
  const [customAmount, setCustomAmount] = useState("1000");

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("ptsc.knit@upi");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <section className="relative bg-[#0f0f0f] py-20 border-b border-white/5">
      {/* Vertical Dashed Guidelines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Main Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-sans leading-tight">
            Support{" "}
            <Highlighter action="underline" color="#F47174" strokeWidth={4}>
              <span className="text-[#F47174]">PTSC</span>
            </Highlighter>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#8C93B0] max-w-2xl mx-auto font-sans leading-relaxed">
            Powering student technical excellence at KNIT Sultanpur. Every
            single rupee donated directly funds hackathon prize pools, cloud
            servers, and open-source workshops.
          </p>
        </div>

        {/* Financial Transparency Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="rounded-2xl bg-zinc-950 border border-white/10 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8C93B0] uppercase tracking-wider mb-1">
              <FiTrendingUp className="size-4 text-[#00E5FF]" /> Total Raised
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              ₹1,85,000
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-950 border border-white/10 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8C93B0] uppercase tracking-wider mb-1">
              <FiPieChart className="size-4 text-[#F47174]" /> Total Spent
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              ₹1,24,500
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-950 border border-white/10 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8C93B0] uppercase tracking-wider mb-1">
              <FiDollarSign className="size-4 text-[#FFB800]" /> Fund Balance
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              ₹60,500
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-950 border border-white/10 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8C93B0] uppercase tracking-wider mb-1">
              <FiUsers className="size-4 text-[#00E5FF]" /> Alumni & Donors
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              48+
            </div>
          </div>
        </div>

        {/* Two-Column Main Content: Left Donation Form, Right Bank/UPI Details */}
        <div className="grid gap-8 lg:grid-cols-12 mb-20">
          {/* Left Column: Direct Donation Box */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="grid size-10 place-items-center rounded-xl bg-zinc-950 text-[#F47174] border border-[#F47174]/30">
                  <FiHeart className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    Make a Contribution
                  </h3>
                  <p className="text-xs text-[#8C93B0]">
                    Select an amount or enter your custom support contribution
                  </p>
                </div>
              </div>

              {/* Amount Selector Pills */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {["500", "1000", "2500", "5000"].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomAmount(amt)}
                    className={`rounded-xl py-3 text-sm font-extrabold font-mono transition-all ${
                      customAmount === amt
                        ? "bg-[#F47174] text-white shadow-none"
                        : "bg-zinc-950 text-[#8C93B0] border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#8C93B0] uppercase tracking-wider mb-2">
                  Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-white">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-4 py-3 text-sm font-mono font-bold text-white outline-none focus:border-[#F47174] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Direct Pay Action Button */}
            <a
              href={`upi://pay?pa=9198347345@ptsbi&pn=Ishaan&am=${customAmount}&cu=INR`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#F47174] py-4 text-sm font-black uppercase tracking-wider text-white shadow-none hover:bg-[#FF4D70] active:scale-[0.98] transition-all"
            >
              Donate ₹{customAmount} via UPI{" "}
              <FiArrowUpRight className="size-4" />
            </a>
          </div>

          {/* Right Column: Bank & UPI Verification Details */}
          <div className="lg:col-span-5 rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight mb-4">
                JS Account Details
              </h3>

              {/* UPI Box */}
              <div className="rounded-2xl bg-zinc-950 border border-white/10 p-4 mb-4">
                <div className="text-xs font-semibold text-[#8C93B0] uppercase tracking-wider mb-1">
                  JS UPI ID
                </div>
                <div className="flex items-center justify-between font-mono font-bold text-white text-base">
                  <span>9198347345@ptsbi</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="grid size-8 place-items-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <FiCheck className="size-4 text-[#00E5FF]" />
                    ) : (
                      <FiCopy className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bank Transfer Box */}
              <div className="rounded-2xl bg-zinc-950 border border-white/10 p-4 space-y-2 font-sans text-xs text-[#8C93B0]">
                <div className="text-xs font-semibold text-[#8C93B0] uppercase tracking-wider mb-2">
                  Direct Bank Transfer
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>Account Name:</span>
                  <span className="font-bold text-white">Ishaan Pandey</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>Account No:</span>
                  <span className="font-mono font-bold text-white">
                    45858100009948
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>IFSC Code:</span>
                  <span className="font-mono font-bold text-white">
                    BARB0KNISUL
                  </span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span>Bank Branch:</span>
                  <span className="font-semibold text-white">
                    KNIT Campus, Uttar Pradesh
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-[#8C93B0] leading-relaxed">
              * Note: All donations are logged automatically in our public
              ledger below upon verification.
            </p>
          </div>
        </div>

        {/* 100% TRANSPARENT FINANCIAL LEDGER SECTION */}
        <div className="mt-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Transparent Financial Ledger
              </h2>
              <p className="text-xs sm:text-sm text-[#8C93B0] mt-1">
                Real-time tracking of all community contributions and expense
                receipts
              </p>
            </div>

            {/* Switcher Tabs */}
            <div className="inline-flex rounded-full bg-zinc-950 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveLedgerTab("donations")}
                className={`rounded-full px-5 py-2 text-xs font-extrabold uppercase tracking-wider transition-all ${
                  activeLedgerTab === "donations"
                    ? "bg-[#F47174] text-white shadow-none"
                    : "text-[#8C93B0] hover:text-white bg-transparent"
                }`}
              >
                Recent Donors ({RECENT_DONORS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveLedgerTab("spend")}
                className={`rounded-full px-5 py-2 text-xs font-extrabold uppercase tracking-wider transition-all ${
                  activeLedgerTab === "spend"
                    ? "bg-[#F47174] text-white shadow-none"
                    : "text-[#8C93B0] hover:text-white bg-transparent"
                }`}
              >
                Spend History ({SPEND_HISTORY.length})
              </button>
            </div>
          </div>

          {/* Ledger Table Container */}
          <div className="overflow-x-auto rounded-3xl bg-zinc-950 border border-white/10">
            {activeLedgerTab === "donations" ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-black uppercase tracking-wider text-[#8C93B0] bg-[#0B0D19]/50">
                    <th className="p-4 sm:p-5">Contributor</th>
                    <th className="p-4 sm:p-5">Affiliation / Role</th>
                    <th className="p-4 sm:p-5">Purpose / Allocation</th>
                    <th className="p-4 sm:p-5">Date</th>
                    <th className="p-4 sm:p-5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-sans">
                  {RECENT_DONORS.map((donor) => (
                    <tr
                      key={donor.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 sm:p-5 font-bold text-white">
                        {donor.name}
                      </td>
                      <td className="p-4 sm:p-5 text-[#8C93B0]">
                        {donor.badge}
                      </td>
                      <td className="p-4 sm:p-5 text-[#00E5FF] font-semibold">
                        {donor.purpose}
                      </td>
                      <td className="p-4 sm:p-5 text-[#8C93B0] font-mono text-xs">
                        {donor.date}
                      </td>
                      <td className="p-4 sm:p-5 text-right font-mono font-black text-white text-base">
                        {donor.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-black uppercase tracking-wider text-[#8C93B0] bg-[#0B0D19]/50">
                    <th className="p-4 sm:p-5">Category</th>
                    <th className="p-4 sm:p-5">Expense Details</th>
                    <th className="p-4 sm:p-5">Invoice Reference</th>
                    <th className="p-4 sm:p-5">Date</th>
                    <th className="p-4 sm:p-5 text-right">Amount Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-sans">
                  {SPEND_HISTORY.map((spend) => (
                    <tr
                      key={spend.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-2">
                        <FiFileText className="size-4 text-[#F47174]" />
                        {spend.category}
                      </td>
                      <td className="p-4 sm:p-5 text-[#8C93B0]">
                        {spend.details}
                      </td>
                      <td className="p-4 sm:p-5 font-mono text-xs text-[#FFB800]">
                        {spend.invoiceRef}
                      </td>
                      <td className="p-4 sm:p-5 text-[#8C93B0] font-mono text-xs">
                        {spend.date}
                      </td>
                      <td className="p-4 sm:p-5 text-right font-mono font-black text-[#F47174] text-base">
                        {spend.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
