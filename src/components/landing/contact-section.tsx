"use client";

import { Highlighter } from "@/components/ui/highlighter";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="relative bg-transparent py-32 selection:bg-[#FF355E]/30 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#00F0FF]/15 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#FF355E]/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs font-mono font-bold text-[#FF355E] uppercase tracking-widest mb-3">
                Mission Control
              </p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans leading-tight">
                Get in{" "}
                <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
                  <span className="text-white">Touch</span>
                </Highlighter>
              </h2>
              <p className="mt-4 text-base text-[#8C93B0] leading-relaxed">
                Have questions, projects, or partnership proposals? Drop us a line and let's build something epic together.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-[#140D26] border border-white/10 flex items-center justify-center text-[#FF355E]">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider">Email Us</h4>
                  <a href="mailto:contact@ptsc.knit.ac.in" className="text-sm font-bold text-white hover:text-[#FF355E] transition-colors mt-0.5 block">
                    contact@ptsc.knit.ac.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-[#140D26] border border-white/10 flex items-center justify-center text-[#00F0FF]">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider">Join Discord</h4>
                  <a href="#" className="text-sm font-bold text-white hover:text-[#00F0FF] transition-colors mt-0.5 block">
                    discord.gg/ptsc-knit
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-[#140D26] border border-white/10 flex items-center justify-center text-[#FFB800]">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider">Location</h4>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    KNIT Sultanpur, UP, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6 p-8 sm:p-10 rounded-[2.5rem] bg-[#140D26]/60 border-2 border-white/10 backdrop-blur-md relative z-10 shadow-2xl">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ken Kaneki"
                    className="w-full rounded-2xl bg-[#090A14] border border-white/10 px-4 py-3.5 text-sm font-semibold text-white placeholder-white/35 outline-none focus:border-[#FF355E] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="ken@anteiku.com"
                    className="w-full rounded-2xl bg-[#090A14] border border-white/10 px-4 py-3.5 text-sm font-semibold text-white placeholder-white/35 outline-none focus:border-[#FF355E] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Collaboration proposal"
                  className="w-full rounded-2xl bg-[#090A14] border border-white/10 px-4 py-3.5 text-sm font-semibold text-white placeholder-white/35 outline-none focus:border-[#FF355E] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hey PTSC squad, we would love to build..."
                  className="w-full rounded-2xl bg-[#090A14] border border-white/10 px-4 py-3.5 text-sm font-semibold text-white placeholder-white/35 outline-none focus:border-[#FF355E] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl text-center font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#FF355E] to-[#FF4D70] hover:shadow-[0_0_25px_rgba(255,53,94,0.4)] hover:scale-[1.01] transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
