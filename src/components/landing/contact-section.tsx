"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Highlighter } from "@/components/ui/highlighter";
import { Mail, MessageSquare, MapPin, CheckCircle2, Send, Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required").min(3, "Subject must be at least 3 characters"),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (_values: ContactFormValues) => {
    // Simulate brief network submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    form.reset();
  };

  const loading = form.formState.isSubmitting;

  return (
    <section id="contact" className="relative bg-transparent py-32 selection:bg-[#F47174]/30 overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#00F0FF]/15 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#F47174]/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs font-mono font-bold text-[#F47174] uppercase tracking-widest mb-3">
                Mission Control
              </p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans leading-tight">
                Get in{" "}
                <Highlighter action="underline" color="#F47174" strokeWidth={4}>
                  <span className="text-white">Touch</span>
                </Highlighter>
              </h2>
              <p className="mt-4 text-base text-[#8C93B0] leading-relaxed">
                Have questions, projects, or partnership proposals? Drop us a line and let&apos;s build something epic together.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-[#140D26] border border-white/10 flex items-center justify-center text-[#F47174]">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider">Email Us</h4>
                  <a href="mailto:contact@ptsc.knit.ac.in" className="text-sm font-bold text-white hover:text-[#F47174] transition-colors mt-0.5 block">
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
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#140D26]/60 border-2 border-white/10 backdrop-blur-md relative z-10 shadow-2xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">Message Dispatched!</h3>
                  <p className="text-sm text-[#8C93B0] max-w-sm mx-auto">
                    Thanks for reaching out. The PTSC team has received your message and will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ken Kaneki"
                                disabled={loading}
                                className="bg-[#090A14] border-white/10 focus:border-[#F47174]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="ken@anteiku.com"
                                disabled={loading}
                                className="bg-[#090A14] border-white/10 focus:border-[#F47174]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Collaboration proposal"
                              disabled={loading}
                              className="bg-[#090A14] border-white/10 focus:border-[#F47174]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Hey PTSC squad, we would love to build..."
                              disabled={loading}
                              className="bg-[#090A14] border-white/10 focus:border-[#F47174]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-2xl text-center font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#F47174] to-[#FF4D70] hover:shadow-[0_0_25px_rgba(244,113,116,0.4)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Dispatching...
                        </>
                      ) : (
                        <>
                          <Send className="size-4" /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </Form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
