"use client";

import React from 'react';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiClock, 
  FiLink, 
  FiPlus, 
  FiTrash2, 
  FiLoader,
  FiShield
} from 'react-icons/fi';
import { ImageUpload } from '../image-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface EventFormProps {
  eventFormMode: 'create' | 'edit';
  eventForm: any;
  setEventForm: React.Dispatch<React.SetStateAction<any>>;
  registrationFields: any[];
  setRegistrationFields: React.Dispatch<React.SetStateAction<any[]>>;
  participantFields: any[];
  setParticipantFields: React.Dispatch<React.SetStateAction<any[]>>;
  resources: { label: string; url: string }[];
  setResources: React.Dispatch<React.SetStateAction<{ label: string; url: string }[]>>;
  dataLoading: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EventForm({
  eventFormMode,
  eventForm,
  setEventForm,
  registrationFields,
  setRegistrationFields,
  participantFields,
  setParticipantFields,
  resources,
  setResources,
  dataLoading,
  onCancel,
  onSubmit,
}: EventFormProps) {

  const addRegistrationField = () => {
    setRegistrationFields([
      ...registrationFields,
      { name: '', label: '', type: 'text', required: false, placeholder: '', description: '', validation: '', options: [] }
    ]);
  };

  const removeRegistrationField = (index: number) => {
    setRegistrationFields(registrationFields.filter((_, i) => i !== index));
  };

  const updateRegistrationField = (index: number, field: string, value: any) => {
    const updated = [...registrationFields];
    updated[index] = { ...updated[index], [field]: value };
    setRegistrationFields(updated);
  };

  const addParticipantField = () => {
    setParticipantFields([
      ...participantFields,
      { name: '', label: '', type: 'text', required: false, placeholder: '', description: '', validation: '', options: [] }
    ]);
  };

  const removeParticipantField = (index: number) => {
    setParticipantFields(participantFields.filter((_, i) => i !== index));
  };

  const updateParticipantField = (index: number, field: string, value: any) => {
    const updated = [...participantFields];
    updated[index] = { ...updated[index], [field]: value };
    setParticipantFields(updated);
  };

  const addResource = () => {
    setResources([...resources, { label: '', url: '' }]);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const updateResource = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...resources];
    updated[index][field] = value;
    setResources(updated);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <FiArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white">
              {eventFormMode === 'create' ? 'Create New Event' : 'Edit Event'}
            </h1>
            <p className="text-xs text-white/50">Fill in the event details below with dynamic registration controls.</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 font-sans">
        {/* Basic Information Section */}
        <div className="p-6 border border-white/10 rounded-2xl bg-[#141414] space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-white border-b border-white/10 pb-2.5 flex items-center gap-2">
            <FiShield className="size-4 text-[#FF355E]" /> Basic Information
          </h3>

          <div className="space-y-1.5">
            <Label>Event Title *</Label>
            <Input
              type="text"
              value={eventForm.title}
              onChange={e => setEventForm((prev: any) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description *</Label>
            <Textarea
              value={eventForm.description}
              onChange={e => setEventForm((prev: any) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter event description"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <FiCalendar className="size-4 text-white/60" /> Event Date *
              </Label>
              <Input
                type="date"
                value={eventForm.date}
                onChange={e => setEventForm((prev: any) => ({ ...prev, date: e.target.value }))}
                className="cursor-pointer [color-scheme:dark]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <FiClock className="size-4 text-white/60" /> Event Time
              </Label>
              <Input
                type="text"
                value={eventForm.time}
                onChange={e => setEventForm((prev: any) => ({ ...prev, time: e.target.value }))}
                placeholder="e.g. 5:00 PM IST"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <FiLink className="size-4 text-white/60" /> Rule Book URL
            </Label>
            <Input
              type="url"
              value={eventForm.ruleBookUrl}
              onChange={e => setEventForm((prev: any) => ({ ...prev, ruleBookUrl: e.target.value }))}
              placeholder="https://... (PDF or page with rules)"
            />
            <p className="text-[11px] font-mono text-white/40">Optional: provide a link to the event rules or guidelines.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <select
              value={eventForm.status}
              onChange={e => setEventForm((prev: any) => ({ ...prev, status: e.target.value }))}
              className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white transition-all outline-none focus:border-[#FF355E] focus:ring-1 focus:ring-[#FF355E]/50 font-sans [color-scheme:dark]"
            >
              <option value="upcoming">upcoming</option>
              <option value="ongoing">ongoing</option>
              <option value="past">past</option>
            </select>
          </div>
        </div>

        {/* Registration Settings Section */}
        <div className="p-6 border border-white/10 rounded-2xl bg-[#141414] space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-white border-b border-white/10 pb-2.5 flex items-center gap-2">
            <FiClock className="size-4 text-amber-400" /> Registration Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="block mb-1.5">Registration Type</Label>
              <select
                value={eventForm.registrationType}
                onChange={e => setEventForm((prev: any) => ({ ...prev, registrationType: e.target.value as 'individual' | 'team' }))}
                className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white transition-all outline-none focus:border-[#FF355E] focus:ring-1 focus:ring-[#FF355E]/50 font-sans [color-scheme:dark]"
              >
                <option value="individual">Individual</option>
                <option value="team">Team</option>
              </select>
            </div>

            {eventForm.registrationType === 'team' && (
              <>
                <div>
                  <Label className="block mb-1.5">Min Team Size</Label>
                  <Input
                    type="number"
                    min={1}
                    value={eventForm.teamMinSize}
                    onChange={e => setEventForm((prev: any) => ({ ...prev, teamMinSize: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label className="block mb-1.5">Max Team Size</Label>
                  <Input
                    type="number"
                    min={eventForm.teamMinSize || 1}
                    value={eventForm.teamMaxSize}
                    onChange={e => setEventForm((prev: any) => ({ ...prev, teamMaxSize: Number(e.target.value) }))}
                  />
                </div>
              </>
            )}
          </div>

          {/* Registration Deadline */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5">
                <FiClock className="size-4 text-white/60" /> Registration Deadline
              </Label>
              {eventForm.registrationDeadline && (
                <button
                  type="button"
                  onClick={() => setEventForm((prev: any) => ({ ...prev, registrationDeadline: '' }))}
                  className="text-[11px] font-mono text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Clear Deadline
                </button>
              )}
            </div>
            <Input
              type="datetime-local"
              value={eventForm.registrationDeadline || ''}
              onChange={e => setEventForm((prev: any) => ({ ...prev, registrationDeadline: e.target.value }))}
              className="cursor-pointer [color-scheme:dark]"
            />
            <p className="text-[11px] font-mono text-white/40">
              Optional: Once this date &amp; time passes, registrations will automatically lock and reject new entries.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              WhatsApp Group Link
            </Label>
            <Input
              type="url"
              value={eventForm.whatsappGroupLink}
              onChange={e => setEventForm((prev: any) => ({ ...prev, whatsappGroupLink: e.target.value }))}
              placeholder="https://chat.whatsapp.com/..."
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-1.5">
            <Label>Event Cover / Poster</Label>
            <ImageUpload
              value={eventForm.coverImageUrl}
              onChange={(url) => setEventForm((prev: any) => ({ ...prev, coverImageUrl: url }))}
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eventForm.useCustomForm}
                onChange={e => setEventForm((prev: any) => ({ ...prev, useCustomForm: e.target.checked }))}
                className="rounded border-white/10 bg-[#0f0f0f] accent-[#FF355E] size-4 cursor-pointer"
              />
              <span className="text-xs md:text-sm text-white/90">Use custom registration form</span>
            </label>
            <p className="text-[11px] font-mono text-white/40 mt-1 ml-6">Enable this to create custom questions & dynamic form fields.</p>
          </div>

          {!eventForm.useCustomForm && (
            <div className="space-y-1.5 pt-2">
              <Label className="flex items-center gap-1.5">
                <FiLink className="size-4 text-white/60" /> Google Form Link *
              </Label>
              <Input
                type="url"
                value={eventForm.googleFormLink}
                onChange={e => setEventForm((prev: any) => ({ ...prev, googleFormLink: e.target.value }))}
                placeholder="https://forms.google.com/..."
                required={!eventForm.useCustomForm}
              />
            </div>
          )}

          {eventForm.useCustomForm && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <p className="text-xs text-white/70 font-mono">
                  {eventForm.registrationType === 'team' ? 'Team details fields (applied once per team)' : 'Additional fields (applied per registrant)'}
                </p>
                <button
                  type="button"
                  onClick={addRegistrationField}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <FiPlus className="size-3.5" /> Add Field
                </button>
              </div>

              {registrationFields.map((field, index) => (
                <div key={`reg-${index}`} className="p-4 border border-white/10 rounded-xl bg-[#0f0f0f] space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-white/90">Field {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeRegistrationField(index)}
                      className="text-white/40 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <FiTrash2 className="size-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] block mb-1">Field Name *</Label>
                      <Input
                        type="text"
                        value={field.name}
                        onChange={e => updateRegistrationField(index, 'name', e.target.value)}
                        placeholder="e.g. teamName"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] block mb-1">Field Label *</Label>
                      <Input
                        type="text"
                        value={field.label}
                        onChange={e => updateRegistrationField(index, 'label', e.target.value)}
                        placeholder="e.g. Team Name"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] block mb-1">Field Type</Label>
                      <select
                        value={field.type}
                        onChange={e => updateRegistrationField(index, 'type', e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-2.5 text-xs text-white transition-all outline-none focus:border-[#FF355E] focus:ring-1 focus:ring-[#FF355E]/50 font-sans [color-scheme:dark]"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="number">Number</option>
                        <option value="tel">Phone</option>
                        <option value="textarea">Text Area</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-[11px] block mb-1">Placeholder</Label>
                      <Input
                        type="text"
                        value={field.placeholder}
                        onChange={e => updateRegistrationField(index, 'placeholder', e.target.value)}
                        placeholder="Placeholder text"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {eventForm.registrationType === 'team' && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-white/70 font-mono">Participant details fields (applied to leader &amp; members)</p>
                    <button
                      type="button"
                      onClick={addParticipantField}
                      className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <FiPlus className="size-3.5" /> Add Participant Field
                    </button>
                  </div>

                  {participantFields.map((field, index) => (
                    <div key={`part-${index}`} className="p-4 border border-white/10 rounded-xl bg-[#0f0f0f] space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-semibold text-white/90">Participant Field {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeParticipantField(index)}
                          className="text-white/40 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <FiTrash2 className="size-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-[11px] block mb-1">Field Name *</Label>
                          <Input
                            type="text"
                            value={field.name}
                            onChange={e => updateParticipantField(index, 'name', e.target.value)}
                            placeholder="e.g. github"
                          />
                        </div>

                        <div>
                          <Label className="text-[11px] block mb-1">Field Label *</Label>
                          <Input
                            type="text"
                            value={field.label}
                            onChange={e => updateParticipantField(index, 'label', e.target.value)}
                            placeholder="e.g. GitHub Profile"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eventForm.forceGoogleForm}
                onChange={e => setEventForm((prev: any) => ({ ...prev, forceGoogleForm: e.target.checked }))}
                className="rounded border-white/10 bg-[#0f0f0f] accent-[#FF355E] size-4 cursor-pointer"
              />
              <span className="text-xs md:text-sm text-white/90">Force Google Form (fallback)</span>
            </label>
            <p className="text-[11px] font-mono text-white/40 mt-1 ml-6">When enabled, users will be directed to the Google Form instead of the in-app form.</p>
          </div>
        </div>

        {/* Resources Section */}
        <div className="p-6 border border-white/10 rounded-2xl bg-[#141414] space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
            <div>
              <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-white">Resources</h3>
              <p className="text-[11px] font-mono text-white/40 mt-0.5">Add helpful links (tutorials, problem sets, rulebooks).</p>
            </div>
            <button
              type="button"
              onClick={addResource}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <FiPlus className="size-3.5" /> Add Resource
            </button>
          </div>

          <div className="space-y-3">
            {resources.map((res, idx) => (
              <div key={idx} className="p-4 border border-white/10 rounded-xl bg-[#0f0f0f] space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-white/90">Resource {idx + 1}</h4>
                  {resources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResource(idx)}
                      className="text-white/40 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <FiTrash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] block mb-1">Label *</Label>
                    <Input
                      type="text"
                      value={res.label}
                      onChange={e => updateResource(idx, 'label', e.target.value)}
                      placeholder="e.g. Problem Set, Tutorial"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] block mb-1">URL *</Label>
                    <Input
                      type="url"
                      value={res.url}
                      onChange={e => updateResource(idx, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit / Cancel Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-mono transition-all cursor-pointer"
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant="sleek"
            size="default"
            disabled={dataLoading}
            className="gap-2"
          >
            {dataLoading && <FiLoader className="size-4 animate-spin" />}
            {eventFormMode === 'create' ? 'Create Event' : 'Save Event'}
          </Button>
        </div>
      </form>
    </div>
  );
}
