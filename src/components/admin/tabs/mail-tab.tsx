"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiCheck, FiMail, FiSend, FiLoader } from 'react-icons/fi';
import { EventType } from '../types';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const mailSchema = z.object({
  selectedEventId: z.string().min(1, "Target event is required"),
  mailSubject: z.string().min(1, "Email subject is required"),
  mailBody: z.string().min(1, "Email body is required"),
});

type MailFormValues = z.infer<typeof mailSchema>;

interface MailTabProps {
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  mailSubject: string;
  setMailSubject: (subj: string) => void;
  mailBody: string;
  setMailBody: (body: string) => void;
  mailSending: boolean;
  mailMessage: string | null;
  onSendMail: (e: React.FormEvent) => void;
}

export function MailTab({
  events,
  selectedEventId,
  setSelectedEventId,
  mailSubject,
  setMailSubject,
  mailBody,
  setMailBody,
  mailSending,
  mailMessage,
  onSendMail,
}: MailTabProps) {
  const form = useForm<MailFormValues>({
    resolver: zodResolver(mailSchema),
    defaultValues: {
      selectedEventId: selectedEventId || "",
      mailSubject: mailSubject || "",
      mailBody: mailBody || "",
    },
  });

  useEffect(() => {
    form.setValue("selectedEventId", selectedEventId);
  }, [selectedEventId, form]);

  useEffect(() => {
    form.setValue("mailSubject", mailSubject);
  }, [mailSubject, form]);

  useEffect(() => {
    form.setValue("mailBody", mailBody);
  }, [mailBody, form]);

  const onSubmit = (values: MailFormValues) => {
    setSelectedEventId(values.selectedEventId);
    setMailSubject(values.mailSubject);
    setMailBody(values.mailBody);

    // Trigger parent send mail logic
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    onSendMail(fakeEvent);
  };

  return (
    <div className="space-y-5 max-w-3xl font-sans">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <FiMail className="size-5 text-[#FF355E]" /> Mail Manager
        </h1>
        <p className="text-xs text-white/50 mt-0.5">Send notification emails directly to registered event participants.</p>
      </div>

      <div className="p-6 border border-white/10 rounded-2xl bg-[#141414] shadow-sm">
        {mailMessage && (
          <div className="mb-5 p-3.5 border border-emerald-500/30 bg-emerald-500/10 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
            <FiCheck className="size-4 shrink-0" /> {mailMessage}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 font-sans">
            <FormField
              control={form.control}
              name="selectedEventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Event *</FormLabel>
                  <FormControl>
                    <select
                      disabled={mailSending}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white transition-all outline-none focus:border-[#FF355E] focus:ring-1 focus:ring-[#FF355E]/50 font-sans [color-scheme:dark]"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedEventId(e.target.value);
                      }}
                    >
                      <option value="">Select Event...</option>
                      {events.map((ev) => (
                        <option key={ev._id} value={ev._id}>
                          {ev.title}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mailSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Subject *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Update regarding PTSC Code Odyssey"
                      disabled={mailSending}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setMailSubject(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mailBody"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Body *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write broadcast message contents..."
                      rows={6}
                      disabled={mailSending}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setMailBody(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="sleek"
                size="default"
                disabled={mailSending}
                className="gap-2"
              >
                {mailSending ? (
                  <>
                    <FiLoader className="size-4 animate-spin" /> Sending Broadcast...
                  </>
                ) : (
                  <>
                    <FiSend className="size-4" /> Send Broadcast Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
