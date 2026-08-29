"use client";

import React, { useState } from 'react';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiClock, 
  FiLink, 
  FiPlus, 
  FiTrash2, 
  FiLoader,
  FiMapPin,
  FiVideo,
  FiGlobe,
  FiChevronDown,
  FiX
} from 'react-icons/fi';
import { ImageUpload } from '../image-upload';

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

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'tel', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'file', label: 'File Upload' },
];

const DEFAULT_PLATFORMS = [
  'Google Meet',
  'Zoom',
  'Microsoft Teams',
  'Discord',
  'YouTube Live',
  'Unstop',
  'HackerRank',
  'LeetCode',
  'Codeforces',
];

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
  const [formError, setFormError] = useState<string | null>(null);

  // Platform Dropdown & Modal State
  const [platforms, setPlatforms] = useState<string[]>(() => {
    if (eventForm.platform && !DEFAULT_PLATFORMS.includes(eventForm.platform)) {
      return [...DEFAULT_PLATFORMS, eventForm.platform];
    }
    return DEFAULT_PLATFORMS;
  });
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [platformModalError, setPlatformModalError] = useState<string | null>(null);

  const handleAddNewPlatform = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPlatformName.trim();
    if (!trimmed) {
      setPlatformModalError('Platform name cannot be empty.');
      return;
    }

    if (!platforms.includes(trimmed)) {
      setPlatforms(prev => [...prev, trimmed]);
    }

    setEventForm((prev: any) => ({ ...prev, platform: trimmed }));
    setNewPlatformName('');
    setPlatformModalError(null);
    setIsPlatformModalOpen(false);
  };

  // Registration Fields Handlers
  const addRegistrationField = () => {
    setRegistrationFields([
      ...registrationFields,
      {
        name: '',
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        description: '',
        validation: '',
        options: [],
        allowedTypes: [],
        allowedTypesRaw: '',
      }
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

  const addFieldOption = (fieldIndex: number) => {
    const updated = [...registrationFields];
    if (!updated[fieldIndex].options) {
      updated[fieldIndex].options = [];
    }
    updated[fieldIndex].options.push('');
    setRegistrationFields(updated);
  };

  const updateFieldOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const updated = [...registrationFields];
    updated[fieldIndex].options[optionIndex] = value;
    setRegistrationFields(updated);
  };

  const removeFieldOption = (fieldIndex: number, optionIndex: number) => {
    const updated = [...registrationFields];
    updated[fieldIndex].options.splice(optionIndex, 1);
    setRegistrationFields(updated);
  };

  // Participant Fields Handlers (for team events)
  const addParticipantField = () => {
    setParticipantFields([
      ...participantFields,
      {
        name: '',
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        description: '',
        validation: '',
        options: [],
        allowedTypes: [],
        allowedTypesRaw: '',
      }
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

  const addParticipantFieldOption = (fieldIndex: number) => {
    const updated = [...participantFields];
    if (!updated[fieldIndex].options) {
      updated[fieldIndex].options = [];
    }
    updated[fieldIndex].options.push('');
    setParticipantFields(updated);
  };

  const updateParticipantFieldOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const updated = [...participantFields];
    updated[fieldIndex].options[optionIndex] = value;
    setParticipantFields(updated);
  };

  const removeParticipantFieldOption = (fieldIndex: number, optionIndex: number) => {
    const updated = [...participantFields];
    updated[fieldIndex].options.splice(optionIndex, 1);
    setParticipantFields(updated);
  };

  // Resources Handlers
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

  // Form Validation matching old PTSC-website rules
  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!eventForm.title?.trim()) {
      setFormError('Event title is required.');
      return;
    }
    if (!eventForm.description?.trim()) {
      setFormError('Event description is required.');
      return;
    }
    if (!eventForm.date) {
      setFormError('Event date is required.');
      return;
    }

    if (eventForm.useCustomForm) {
      for (const field of registrationFields) {
        if (!field.name?.trim() || !field.label?.trim()) {
          setFormError('All custom fields must have both a field name (key) and a display label.');
          return;
        }
        if (field.type === 'select' && (!field.options || field.options.length === 0)) {
          setFormError(`Dropdown field "${field.label}" must have at least one option.`);
          return;
        }
      }
      if (eventForm.registrationType === 'team') {
        for (const field of participantFields) {
          if (!field.name?.trim() || !field.label?.trim()) {
            setFormError('All participant fields must have both a field name and a display label.');
            return;
          }
          if (field.type === 'select' && (!field.options || field.options.length === 0)) {
            setFormError(`Participant dropdown field "${field.label}" must have at least one option.`);
            return;
          }
        }
      }
    } else if (!eventForm.googleFormLink?.trim() && !eventForm.forceGoogleForm) {
      setFormError('Please provide a Google Form link or enable the custom registration form.');
      return;
    }

    if (eventForm.registrationType === 'team') {
      const min = Number(eventForm.teamMinSize);
      const max = Number(eventForm.teamMaxSize);
      if (!Number.isFinite(min) || !Number.isFinite(max) || min < 1 || max < min) {
        setFormError('Please provide valid team size constraints (Min >= 1 and Max >= Min).');
        return;
      }
    }

    onSubmit(e);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-md border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {eventFormMode === 'create' ? 'Create New Event' : 'Edit Event Details'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Configure schedules, forms, and participation rules.</p>
          </div>
        </div>
      </div>

      {formError && (
        <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-md text-xs font-medium">
          {formError}
        </div>
      )}

      <form onSubmit={handleValidateAndSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="p-5 border border-white/10 rounded-lg bg-[#121626] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2.5">
            General Information
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Event Title *</label>
            <input
              type="text"
              value={eventForm.title}
              onChange={e => setEventForm((prev: any) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. PTSC Code Odyssey 2026"
              className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Description *</label>
            <textarea
              value={eventForm.description}
              onChange={e => setEventForm((prev: any) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide event details, round information, prizes..."
              rows={4}
              className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30 resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FiCalendar className="size-3.5 text-slate-400" /> Event Date *
              </label>
              <input
                type="date"
                value={eventForm.date}
                onChange={e => setEventForm((prev: any) => ({ ...prev, date: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white focus:outline-none focus:border-white/30"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FiClock className="size-3.5 text-slate-400" /> Event Time
              </label>
              <input
                type="text"
                value={eventForm.time}
                onChange={e => setEventForm((prev: any) => ({ ...prev, time: e.target.value }))}
                placeholder="e.g. 5:00 PM IST"
                className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Event Mode (Offline vs Online) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Event Mode / Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEventForm((prev: any) => ({ ...prev, eventType: 'offline' }))}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md border text-xs font-semibold transition-all ${
                  (eventForm.eventType || 'offline') === 'offline'
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 bg-[#090B14] text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <FiMapPin className="size-3.5" /> Offline (In-Person)
              </button>
              <button
                type="button"
                onClick={() => setEventForm((prev: any) => ({ ...prev, eventType: 'online' }))}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md border text-xs font-semibold transition-all ${
                  eventForm.eventType === 'online'
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 bg-[#090B14] text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <FiGlobe className="size-3.5" /> Online (Virtual)
              </button>
            </div>
          </div>

          {/* Conditional: Offline Venue vs Online Details */}
          {(eventForm.eventType || 'offline') === 'offline' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FiMapPin className="size-3.5 text-slate-400" /> Physical Venue / Hall *
              </label>
              <input
                type="text"
                value={eventForm.venue || ''}
                onChange={e => setEventForm((prev: any) => ({ ...prev, venue: e.target.value }))}
                placeholder="e.g. CS Lab Block A, Room 204 or Main Auditorium"
                className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md border border-white/10 bg-[#090B14]/80">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FiGlobe className="size-3.5 text-slate-400" /> Online Platform
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPlatformName('');
                      setPlatformModalError(null);
                      setIsPlatformModalOpen(true);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <FiPlus className="size-3" /> Add Platform
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={eventForm.platform || ''}
                    onChange={e => {
                      if (e.target.value === '__add_new__') {
                        setNewPlatformName('');
                        setPlatformModalError(null);
                        setIsPlatformModalOpen(true);
                      } else {
                        setEventForm((prev: any) => ({ ...prev, platform: e.target.value }));
                      }
                    }}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#121626] border border-white/15 rounded-md text-sm text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
                  >
                    <option value="">Select Platform</option>
                    {platforms.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                    <option disabled className="text-slate-600">──────────</option>
                    <option value="__add_new__" className="text-emerald-400 font-medium">+ Add New Platform...</option>
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FiVideo className="size-3.5 text-slate-400" /> Meeting / Stream Link
                </label>
                <input
                  type="url"
                  value={eventForm.meetLink || ''}
                  onChange={e => setEventForm((prev: any) => ({ ...prev, meetLink: e.target.value }))}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#121626] border border-white/15 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FiLink className="size-3.5 text-slate-400" /> Rule Book URL
            </label>
            <input
              type="url"
              value={eventForm.ruleBookUrl}
              onChange={e => setEventForm((prev: any) => ({ ...prev, ruleBookUrl: e.target.value }))}
              placeholder="https://... (PDF or document with contest rules)"
              className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Publication Status</label>
            <div className="relative">
              <select
                value={eventForm.status}
                onChange={e => setEventForm((prev: any) => ({ ...prev, status: e.target.value }))}
                className="w-full pl-3.5 pr-10 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
              >
                <option value="upcoming">upcoming</option>
                <option value="ongoing">ongoing</option>
                <option value="past">past</option>
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-4" />
            </div>
          </div>
        </div>

        {/* Registration Settings Section */}
        <div className="p-5 border border-white/10 rounded-lg bg-[#121626] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2.5">
            Registration & Team Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Registration Type</label>
              <div className="relative">
                <select
                  value={eventForm.registrationType}
                  onChange={e => setEventForm((prev: any) => ({ ...prev, registrationType: e.target.value as 'individual' | 'team' }))}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
                >
                  <option value="individual">Individual Participation</option>
                  <option value="team">Team Participation</option>
                </select>
                <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-4" />
              </div>
            </div>

            {eventForm.registrationType === 'team' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Min Team Size</label>
                  <input
                    type="number"
                    min={1}
                    value={eventForm.teamMinSize}
                    onChange={e => setEventForm((prev: any) => ({ ...prev, teamMinSize: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Max Team Size</label>
                  <input
                    type="number"
                    min={eventForm.teamMinSize || 1}
                    value={eventForm.teamMaxSize}
                    onChange={e => setEventForm((prev: any) => ({ ...prev, teamMaxSize: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FiClock className="size-3.5 text-slate-400" /> Registration Deadline
            </label>
            <input
              type="datetime-local"
              value={eventForm.registrationDeadline || ''}
              onChange={e => setEventForm((prev: any) => ({ ...prev, registrationDeadline: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white focus:outline-none focus:border-white/30"
            />
            <p className="text-[11px] text-slate-500">Optional. If not set, registration remains open until the event date.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              WhatsApp Group Link
            </label>
            <input
              type="url"
              value={eventForm.whatsappGroupLink}
              onChange={e => setEventForm((prev: any) => ({ ...prev, whatsappGroupLink: e.target.value }))}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Event Poster / Cover Image</label>
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
                className="rounded border-white/10 bg-[#090B14] accent-white size-4"
              />
              <span className="text-sm text-white">Enable custom in-app registration form</span>
            </label>
            <p className="text-xs text-slate-400 mt-1 ml-6">Create dynamic custom questions for participants instead of an external Google Form.</p>
          </div>

          {!eventForm.useCustomForm && (
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FiLink className="size-3.5 text-slate-400" /> Google Form Link *
              </label>
              <input
                type="url"
                value={eventForm.googleFormLink}
                onChange={e => setEventForm((prev: any) => ({ ...prev, googleFormLink: e.target.value }))}
                placeholder="https://forms.google.com/..."
                className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
              />
            </div>
          )}

          {/* Custom Form Fields */}
          {eventForm.useCustomForm && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-300 font-medium">
                  {eventForm.registrationType === 'team' ? 'Team details fields (applied once per team)' : 'Additional custom fields'}
                </p>
                <button
                  type="button"
                  onClick={addRegistrationField}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-md text-xs font-medium flex items-center gap-1.5"
                >
                  <FiPlus className="size-3.5" /> Add Field
                </button>
              </div>

              {registrationFields.map((field, index) => (
                <div key={`reg-${index}`} className="p-4 border border-white/10 rounded-md bg-[#090B14] space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-white">Field {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeRegistrationField(index)}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <FiTrash2 className="size-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Field Name (Key) *</label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={e => updateRegistrationField(index, 'name', e.target.value)}
                        placeholder="e.g. githubRepo"
                        className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Display Label *</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={e => updateRegistrationField(index, 'label', e.target.value)}
                        placeholder="e.g. GitHub Repository Link"
                        className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Field Type</label>
                      <div className="relative">
                        <select
                          value={field.type}
                          onChange={e => updateRegistrationField(index, 'type', e.target.value)}
                          className="w-full pl-3 pr-8 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-white/30"
                        >
                          {FIELD_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Placeholder</label>
                      <input
                        type="text"
                        value={field.placeholder}
                        onChange={e => updateRegistrationField(index, 'placeholder', e.target.value)}
                        placeholder="Placeholder text..."
                        className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Description / Helper Text</label>
                    <input
                      type="text"
                      value={field.description || ''}
                      onChange={e => updateRegistrationField(index, 'description', e.target.value)}
                      placeholder="Helper text displayed below input..."
                      className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Validation Regex (optional)</label>
                    <input
                      type="text"
                      value={field.validation || ''}
                      onChange={e => updateRegistrationField(index, 'validation', e.target.value)}
                      placeholder="e.g. ^[A-Za-z]+$"
                      className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white font-mono text-[11px]"
                    />
                  </div>

                  {/* Dropdown Options */}
                  {field.type === 'select' && (
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] text-slate-400">Dropdown Options</label>
                        <button
                          type="button"
                          onClick={() => addFieldOption(index)}
                          className="text-xs text-slate-300 hover:text-white font-medium"
                        >
                          + Add Option
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(field.options || []).map((option: string, optIdx: number) => (
                          <div key={optIdx} className="flex gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={e => updateFieldOption(index, optIdx, e.target.value)}
                              placeholder={`Option ${optIdx + 1}`}
                              className="flex-1 px-3 py-1.5 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => removeFieldOption(index, optIdx)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                            >
                              <FiX className="size-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File allowed types */}
                  {field.type === 'file' && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Allowed File Types (comma separated)</label>
                      <input
                        type="text"
                        value={field.allowedTypesRaw !== undefined ? field.allowedTypesRaw : (field.allowedTypes ? field.allowedTypes.join(', ') : '')}
                        onChange={(e) => {
                          const raw = e.target.value;
                          updateRegistrationField(index, 'allowedTypesRaw', raw);
                          const types = raw.split(',').map(t => t.trim()).filter(Boolean);
                          updateRegistrationField(index, 'allowedTypes', types);
                        }}
                        placeholder=".pdf, .jpg, .png"
                        className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white font-mono text-[11px]"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Leave empty to allow any file type.</p>
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={e => updateRegistrationField(index, 'required', e.target.checked)}
                      className="rounded border-white/10 bg-[#121626] accent-white size-3.5"
                    />
                    <span className="text-xs text-slate-300">Required field</span>
                  </label>
                </div>
              ))}

              {/* Participant Fields (for team events) */}
              {eventForm.registrationType === 'team' && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-300 font-medium">Per-participant details fields (applied to each member)</p>
                    <button
                      type="button"
                      onClick={addParticipantField}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-md text-xs font-medium flex items-center gap-1.5"
                    >
                      <FiPlus className="size-3.5" /> Add Member Field
                    </button>
                  </div>

                  {participantFields.map((field, index) => (
                    <div key={`part-${index}`} className="p-4 border border-white/10 rounded-md bg-[#090B14] space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-semibold text-white">Member Field {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeParticipantField(index)}
                          className="text-slate-400 hover:text-red-400 p-1"
                        >
                          <FiTrash2 className="size-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Field Name (Key) *</label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={e => updateParticipantField(index, 'name', e.target.value)}
                            placeholder="e.g. linkedin"
                            className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Display Label *</label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={e => updateParticipantField(index, 'label', e.target.value)}
                            placeholder="e.g. LinkedIn Profile"
                            className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Field Type</label>
                          <div className="relative">
                            <select
                              value={field.type}
                              onChange={e => updateParticipantField(index, 'type', e.target.value)}
                              className="w-full pl-3 pr-8 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-white/30"
                            >
                              {FIELD_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3.5" />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Placeholder</label>
                          <input
                            type="text"
                            value={field.placeholder}
                            onChange={e => updateParticipantField(index, 'placeholder', e.target.value)}
                            placeholder="Placeholder text..."
                            className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Description / Helper Text</label>
                        <input
                          type="text"
                          value={field.description || ''}
                          onChange={e => updateParticipantField(index, 'description', e.target.value)}
                          placeholder="Helper text displayed below input..."
                          className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Validation Regex (optional)</label>
                        <input
                          type="text"
                          value={field.validation || ''}
                          onChange={e => updateParticipantField(index, 'validation', e.target.value)}
                          placeholder="e.g. ^[A-Za-z]+$"
                          className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white font-mono text-[11px]"
                        />
                      </div>

                      {/* Dropdown Options */}
                      {field.type === 'select' && (
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[11px] text-slate-400">Dropdown Options</label>
                            <button
                              type="button"
                              onClick={() => addParticipantFieldOption(index)}
                              className="text-xs text-slate-300 hover:text-white font-medium"
                            >
                              + Add Option
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(field.options || []).map((option: string, optIdx: number) => (
                              <div key={optIdx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={e => updateParticipantFieldOption(index, optIdx, e.target.value)}
                                  placeholder={`Option ${optIdx + 1}`}
                                  className="flex-1 px-3 py-1.5 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeParticipantFieldOption(index, optIdx)}
                                  className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                                >
                                  <FiX className="size-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* File allowed types */}
                      {field.type === 'file' && (
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Allowed File Types (comma separated)</label>
                          <input
                            type="text"
                            value={field.allowedTypesRaw !== undefined ? field.allowedTypesRaw : (field.allowedTypes ? field.allowedTypes.join(', ') : '')}
                            onChange={(e) => {
                              const raw = e.target.value;
                              updateParticipantField(index, 'allowedTypesRaw', raw);
                              const types = raw.split(',').map(t => t.trim()).filter(Boolean);
                              updateParticipantField(index, 'allowedTypes', types);
                            }}
                            placeholder=".pdf, .jpg, .png"
                            className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white font-mono text-[11px]"
                          />
                        </div>
                      )}

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={e => updateParticipantField(index, 'required', e.target.checked)}
                          className="rounded border-white/10 bg-[#121626] accent-white size-3.5"
                        />
                        <span className="text-xs text-slate-300">Required field</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Force Google Form fallback */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eventForm.forceGoogleForm}
                onChange={e => setEventForm((prev: any) => ({ ...prev, forceGoogleForm: e.target.checked }))}
                className="rounded border-white/10 bg-[#090B14] accent-white size-4"
              />
              <span className="text-sm text-white">Force Google Form link redirect as fallback</span>
            </label>
            <p className="text-xs text-slate-400 mt-1 ml-6">When enabled, users will be directed to the Google Form even if custom in-app form is configured.</p>
          </div>
        </div>

        {/* Resources Section */}
        <div className="p-5 border border-white/10 rounded-lg bg-[#121626] space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Resources & Documentation</h3>
              <p className="text-xs text-slate-400 mt-0.5">Attach helpful links (tutorials, question sets, starter code).</p>
            </div>
            <button
              type="button"
              onClick={addResource}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-md text-xs font-medium flex items-center gap-1.5 shrink-0"
            >
              <FiPlus className="size-3.5" /> Add Resource
            </button>
          </div>

          <div className="space-y-3">
            {resources.map((res, idx) => (
              <div key={idx} className="p-3.5 border border-white/10 rounded-md bg-[#090B14] space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-white">Resource {idx + 1}</h4>
                  {resources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResource(idx)}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <FiTrash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Resource Label *</label>
                    <input
                      type="text"
                      value={res.label}
                      onChange={e => updateResource(idx, 'label', e.target.value)}
                      placeholder="e.g. Starter Code GitHub"
                      className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Target URL *</label>
                    <input
                      type="url"
                      value={res.url}
                      onChange={e => updateResource(idx, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-[#121626] border border-white/15 rounded-md text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit / Cancel Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 rounded-md text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={dataLoading}
            className="px-6 py-2 bg-white text-black font-semibold rounded-md text-xs hover:bg-slate-200 transition-all flex items-center gap-2 shadow-sm"
          >
            {dataLoading ? <FiLoader className="size-3.5 animate-spin" /> : null}
            {eventFormMode === 'create' ? 'Publish Event' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Modal: Add Custom Online Platform */}
      {isPlatformModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121626] border border-white/15 rounded-lg max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white">
                <FiGlobe className="size-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Add Custom Online Platform</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPlatformModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FiX className="size-4" />
              </button>
            </div>

            {platformModalError && (
              <div className="p-2.5 bg-red-950/40 border border-red-500/20 text-red-400 rounded-md text-xs">
                {platformModalError}
              </div>
            )}

            <form onSubmit={handleAddNewPlatform} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Platform Name *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newPlatformName}
                  onChange={e => setNewPlatformName(e.target.value)}
                  placeholder="e.g. Twitch, Webex, Kaggle, TopCoder..."
                  className="w-full px-3.5 py-2.5 bg-[#090B14] border border-white/15 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  This platform will be added to the dropdown options and pre-selected for this event.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPlatformModalOpen(false)}
                  className="px-3.5 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 rounded-md text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black hover:bg-slate-200 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <FiPlus className="size-3.5" /> Add & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
