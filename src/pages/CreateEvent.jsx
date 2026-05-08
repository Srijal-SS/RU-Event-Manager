import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Calendar, Tag, MapPin, AlignLeft, List, UserCheck, Mic2, Wrench } from 'lucide-react';

export default function CreateEvent() {
  const { addEvent, user } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    tags: '',
    programs: '',
    attendeeRoles: '',
    participantRoles: '',
    managementRoles: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    let tagsArray = [];
    let splitTags = formData.tags.split(',');
    for (let i = 0; i < splitTags.length; i++) {
        let tag = splitTags[i].trim();
        if (tag !== "") {
            tagsArray.push(tag);
        }
    }

    let programsArray = [];
    let splitPrograms = formData.programs.split('\n');
    for (let i = 0; i < splitPrograms.length; i++) {
        let prog = splitPrograms[i].trim();
        if (prog !== "") {
            programsArray.push(prog);
        }
    }

    let attendeeRolesArray = [];
    let splitAttendee = formData.attendeeRoles.split(',');
    for (let i = 0; i < splitAttendee.length; i++) {
        let role = splitAttendee[i].trim();
        if (role !== "") {
            attendeeRolesArray.push(role);
        }
    }

    let participantRolesArray = [];
    let splitParticipant = formData.participantRoles.split(',');
    for (let i = 0; i < splitParticipant.length; i++) {
        let role = splitParticipant[i].trim();
        if (role !== "") {
            participantRolesArray.push(role);
        }
    }

    let managementRolesArray = [];
    let splitManagement = formData.managementRoles.split(',');
    for (let i = 0; i < splitManagement.length; i++) {
        let role = splitManagement[i].trim();
        if (role !== "") {
            managementRolesArray.push(role);
        }
    }


    const newEvent = {
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      category: formData.category,
      tags: tagsArray,
      programs: programsArray,
      attendeeRoles: attendeeRolesArray,
      participantRoles: participantRolesArray,
      managementRoles: managementRolesArray,
      responses: [],
      organizer: user.name ?? '',
      userID: user.id ?? null
    };
    addEvent(newEvent);
    navigate('/');
  }; 

  const inputClass = "w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e35424] focus:border-[#e35424] transition-all outline-none text-sm";
  const iconClass = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#e35424] to-violet-600 px-8 py-6 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
          <p className="text-indigo-100">Host an event, plan programs, and invite the community.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-gradient-to-b to-[#fdccbc] from-violet-100">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input
              required name="title" value={formData.title} onChange={handleChange}
              type="text" placeholder="E.g., Global Hackathon 2026"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e35424] focus:border-[#e35424] transition-all outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="relative">
              <div className="absolute top-3.5 left-4 text-gray-400"><AlignLeft size={18} /></div>
              <textarea required name="description" value={formData.description} onChange={handleChange}
                rows="3" placeholder="What is this event about?"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e35424] focus:border-[#e35424] transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
              <div className="relative">
                <div className={iconClass}><Calendar size={18} /></div>
                <input required name="date" value={formData.date} onChange={handleChange}
                  type="datetime-local" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="relative">
                <div className={iconClass}><MapPin size={18} /></div>
                <select required name="category" value={formData.category} onChange={handleChange}
                  className={`${inputClass} appearance-none`}>
                  <option value="" disabled>Select Category</option>
                  <option value="Hackathons">Hackathons</option>
                  <option value="Meetup">Meetup</option>
                  <option value="Dance">Dance</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <div className="relative">
              <div className={iconClass}><Tag size={18} /></div>
              <input name="tags" value={formData.tags} onChange={handleChange}
                type="text" placeholder="React, AI, Blockchain..."
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Programs / Agenda (one per line)</label>
            <div className="relative">
              <div className="absolute top-3.5 left-4 text-gray-400"><List size={18} /></div>
              <textarea name="programs" value={formData.programs} onChange={handleChange}
                rows="3" placeholder="10:00 AM - Opening Ceremony&#10;11:00 AM - Workshop"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e35424] focus:border-[#e35424] transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-1">Event Roles by Category</h3>
            <p className="text-sm text-gray-500 mb-5">
              Add comma-separated roles for each participation category. Leave a section empty if that category is not open for this event.
            </p>

            <div className="space-y-4">

              <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-indigo-800 mb-1">
                  <UserCheck size={17} /> Attendee Roles
                </label>
                <p className="text-xs text-indigo-600 mb-3">People who join to watch/listen. Leave empty to allow open attendance.</p>
                <input name="attendeeRoles" value={formData.attendeeRoles} onChange={handleChange}
                  type="text" placeholder="e.g., General Audience, Press, Alumni..."
                  className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-[#e35424] transition-all outline-none text-sm"
                />
              </div>

              <div className="p-5 bg-violet-50 rounded-2xl border border-violet-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-violet-800 mb-1">
                  <Mic2 size={17} /> Participant Roles
                </label>
                <p className="text-xs text-violet-600 mb-3">People who actively compete, perform, or present. Leave empty if no active participation.</p>
                <input name="participantRoles" value={formData.participantRoles} onChange={handleChange}
                  type="text" placeholder="e.g., Frontend Developer, Solo Dancer, Speaker..."
                  className="w-full px-4 py-2.5 bg-white border border-violet-200 rounded-xl focus:ring-2 focus:ring-[#e35424] transition-all outline-none text-sm"
                />
              </div>

              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-1">
                  <Wrench size={17} /> Management / Volunteer Roles
                </label>
                <p className="text-xs text-amber-600 mb-3">People who help organise or manage the event. Leave empty if no volunteer work is needed.</p>
                <input name="managementRoles" value={formData.managementRoles} onChange={handleChange}
                  type="text" placeholder="e.g., Stage Manager, Registration Desk, Judge..."
                  className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit"
              className="w-full bg-[#e35424] text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:bg-[#d54617] hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e35424]"
            >
              Publish Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
