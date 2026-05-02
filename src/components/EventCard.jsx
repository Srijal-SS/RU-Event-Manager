import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar as CalendarIcon, Users, Tag, ClipboardList, Eye, UserCheck, Mic2, Wrench, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import Modal from './Modal';


export default function EventCard({ event }) {
    const { user, rsvpToEvent } = useStore();

    const [showDetails, setShowDetails] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinMode, setJoinMode] = useState(null);
    const [selectedParticipantRole, setSelectedParticipantRole] = useState(null);
    const [selectedVolunteerRole, setSelectedVolunteerRole] = useState(null);
    const [joinConfirmed, setJoinConfirmed] = useState(false);

    const isAttending = event.rsvps.includes(user?.id);
    const friendsAttending = event.rsvps.filter(id => user?.friends.includes(id));

    const hasParticipants = (event.participantRoles || []).length > 0;
    const hasVolunteers = (event.managementRoles || []).length > 0;


    const resetJoinModal = () => {
        setJoinMode(null);
        setSelectedParticipantRole(null);
        setSelectedVolunteerRole(null);
        setJoinConfirmed(false);
    };

    const canConfirm = () => {
        if (!joinMode) return false;
        if (joinMode === 'participant') return !hasParticipants || !!selectedParticipantRole;
        if (joinMode === 'volunteer') return !!selectedVolunteerRole;
        return true;
    };

    const confirmLabel = () => {
        if (joinMode === 'attendee') return 'Confirm — Join as Attendee';
        if (joinMode === 'participant') return selectedParticipantRole
            ? `Confirm — Join as ${selectedParticipantRole}`
            : 'Confirm — Join as Participant';
        if (joinMode === 'volunteer') return `Confirm — Apply as ${selectedVolunteerRole}`;
        return 'Confirm';
    };

    const handleConfirmJoin = () => {
        rsvpToEvent(event.id);
        setJoinConfirmed(true);
        setTimeout(() => { setShowJoinModal(false); resetJoinModal(); }, 1800);
    };

    const JoinButton = ({ onClick }) => (
        <button
            onClick={onClick}
            className="px-6 py-2 rounded-lg font-medium bg-[#e65220] text-white hover:bg-[#CA4317] shadow-sm hover:shadow transition-all"
        >
            Join Event
        </button>
    );

    const CancelButton = () => (
        <button
            onClick={() => rsvpToEvent(event.id)}
            className="px-6 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
        >
            Cancel RSVP
        </button>
    );


    return (
        <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-[#FFF1EB] text-[#CA4317] text-xs font-semibold rounded-full mb-3">
                        {event.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">by {event.organizer}</p>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed mb-6">{event.description}</p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <CalendarIcon size={16} className="text-gray-400 shrink-0" />
                            <span>{format(new Date(event.date), 'PPP p')}</span>
                        </div>

                        {(hasParticipants || hasVolunteers) && (
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <Tag size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <div className="flex flex-wrap gap-2">
                                    {hasParticipants && (
                                        <span className="bg-violet-50 text-violet-600 px-2 py-0.5 rounded text-xs font-medium">Participants open</span>
                                    )}
                                    {hasVolunteers && (
                                        <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-xs font-medium">Volunteers needed</span>
                                    )}
                                </div>
                            </div>
                        )}
                        {friendsAttending.length > 0 && (
                            <div className="flex items-center gap-3 text-sm font-medium text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                                <Users size={16} className="shrink-0" />
                                <span>{friendsAttending.length} friend{friendsAttending.length > 1 ? 's' : ''} joining</span>
                            </div>
                        )}
                    </div>
                </div>



                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => setShowDetails(true)}
                        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors py-2.5 rounded-xl"
                    >
                        <Eye size={16} /> Show Details
                    </button>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">{event.rsvps.length} attending</span>
                        {isAttending
                            ? <CancelButton />
                            : <JoinButton onClick={() => { resetJoinModal(); setShowJoinModal(true); }} />
                        }
                    </div>
                </div>
            </div>




            <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title={event.title}>
                <div className="space-y-3 mb-8">
                    <p className="text-gray-500 text-sm">Organised by <span className="font-semibold text-gray-700">{event.organizer}</span></p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Date & Time</p>
                            <p className="text-sm font-semibold text-gray-900">{format(new Date(event.date), 'PPP')}</p>
                            <p className="text-xs text-gray-500">{format(new Date(event.date), 'p')}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Category</p>
                            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full">{event.category}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">About</h3>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>


                {(hasParticipants || hasVolunteers) && (
                    <div className="mb-8 space-y-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Participation Options</h3>

                        <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-xl">
                            <UserCheck size={18} className="text-indigo-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-indigo-800 mb-1">Attendee</p>
                                <p className="text-xs text-indigo-600">Join and watch the event. Open to everyone.</p>
                            </div>
                        </div>

                        {hasParticipants && (
                            <div className="bg-violet-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Mic2 size={18} className="text-violet-500 shrink-0" />
                                    <p className="text-sm font-semibold text-violet-800">Participant</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {event.participantRoles.map(r => (
                                        <span key={r} className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg text-sm font-medium">{r}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasVolunteers && (
                            <div className="bg-amber-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Wrench size={18} className="text-amber-500 shrink-0" />
                                    <p className="text-sm font-semibold text-amber-800">Management / Volunteer</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {event.managementRoles.map(r => (
                                        <span key={r} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-sm font-medium">{r}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {event.programs && event.programs.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <ClipboardList size={15} /> Event Agenda
                        </h3>
                        <ul className="space-y-2">
                            {event.programs.map((prog, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="mt-0.5 w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                                    <span className="text-gray-600 text-sm">{prog}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {event.tags && event.tags.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {event.tags.map(tag => (
                                <span key={tag} className="bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-sm font-medium">#{tag}</span>
                            ))}
                        </div>
                    </div>
                )}

                {friendsAttending.length > 0 && (
                    <div className="mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <p className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                            <Users size={16} /> {friendsAttending.length} of your friend{friendsAttending.length > 1 ? 's are' : ' is'} also joining!
                        </p>
                    </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">{event.rsvps.length} people attending</span>
                    {isAttending
                        ? <CancelButton />
                        : <JoinButton onClick={() => { setShowDetails(false); resetJoinModal(); setShowJoinModal(true); }} />
                    }
                </div>
            </Modal>




            <Modal
                isOpen={showJoinModal}
                onClose={() => { setShowJoinModal(false); resetJoinModal(); }}
                title="How would you like to join?"
            >
                {joinConfirmed ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-3xl">✓</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">You're in!</h3>
                        <p className="text-gray-500">
                            {joinMode === 'attendee' && 'Registered as Attendee.'}
                            {joinMode === 'participant' && `Registered as Participant${selectedParticipantRole ? ` — ${selectedParticipantRole}` : ''}.`}
                            {joinMode === 'volunteer' && `Application submitted for — ${selectedVolunteerRole}.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-500 text-sm mb-6">
                            Select how you want to participate in <span className="font-semibold text-gray-800">{event.title}</span>.
                        </p>


                        <button
                            onClick={() => setJoinMode('attendee')}
                            className={clsx(
                                'w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between',
                                joinMode === 'attendee' ? 'border-[#CA4317] bg-[#FFF1EB]' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={clsx('p-2.5 rounded-xl', joinMode === 'attendee' ? 'bg-[#FFF1EB]' : 'bg-gray-100')}>
                                    <UserCheck size={22} className={joinMode === 'attendee' ? 'text-[#CA4317]' : 'text-gray-500'} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Attendee</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Join to watch and be part of the event experience</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className={joinMode === 'attendee' ? 'text-indigo-500' : 'text-gray-300'} />
                        </button>


                        {hasParticipants && (
                            <button
                                onClick={() => { setJoinMode('participant'); setSelectedParticipantRole(null); }}
                                className={clsx(
                                    'w-full text-left p-5 rounded-2xl border-2 transition-all',
                                    joinMode === 'participant' ? 'border-[#CA4317] bg-[#FFF1EB]' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx('p-2.5 rounded-xl', joinMode === 'participant' ? 'bg-[#FFF1EB]' : 'bg-gray-100')}>
                                            <Mic2 size={22} className={joinMode === 'participant' ? 'text-[#CA4317]' : 'text-gray-500'} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Participant</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Actively compete or perform at the event</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className={joinMode === 'participant' ? 'text-violet-500' : 'text-gray-300'} />
                                </div>

                                {joinMode === 'participant' && (
                                    <div className="mt-4 pt-4 border-t border-violet-100" onClick={e => e.stopPropagation()}>
                                        <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-3">Select your participant role</p>
                                        <div className="flex flex-wrap gap-2">
                                            {event.participantRoles.map(role => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => setSelectedParticipantRole(role === selectedParticipantRole ? null : role)}
                                                    className={clsx(
                                                        'px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all',
                                                        selectedParticipantRole === role
                                                            ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                                                            : 'bg-violet-50 hover:bg-violet-200 text-violet-700 border-violet-500 hover:border-violet-700'
                                                    )}
                                                >
                                                    {selectedParticipantRole === role ? '✓ ' : ''}{role}
                                                </button>
                                            ))}
                                        </div>
                                        {!selectedParticipantRole && (
                                            <p className="text-xs text-violet-500 mt-2">↑ Pick a role to continue</p>
                                        )}
                                    </div>
                                )}
                            </button>
                        )}


                        {hasVolunteers && (
                            <button
                                onClick={() => { setJoinMode('volunteer'); setSelectedVolunteerRole(null); }}
                                className={clsx(
                                    'w-full text-left p-5 rounded-2xl border-2 transition-all',
                                    joinMode === 'volunteer' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx('p-2.5 rounded-xl', joinMode === 'volunteer' ? 'bg-amber-100' : 'bg-gray-100')}>
                                            <Wrench size={22} className={joinMode === 'volunteer' ? 'text-amber-600' : 'text-gray-500'} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Management / Volunteer</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Help organise and manage this event</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className={joinMode === 'volunteer' ? 'text-amber-500' : 'text-gray-300'} />
                                </div>

                                {joinMode === 'volunteer' && (
                                    <div className="mt-4 pt-4 border-t border-amber-100" onClick={e => e.stopPropagation()}>
                                        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3">Select your volunteer role</p>
                                        <div className="flex flex-wrap gap-2">
                                            {event.managementRoles.map(role => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => setSelectedVolunteerRole(role === selectedVolunteerRole ? null : role)}
                                                    className={clsx(
                                                        'px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all',
                                                        selectedVolunteerRole === role
                                                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400'
                                                    )}
                                                >
                                                    {selectedVolunteerRole === role ? '✓ ' : ''}{role}
                                                </button>
                                            ))}
                                        </div>
                                        {!selectedVolunteerRole && (
                                            <p className="text-xs text-amber-500 mt-2">↑ Pick a role to continue</p>
                                        )}
                                    </div>
                                )}
                            </button>
                        )}


                        <div className="pt-4 border-t border-gray-100">
                            <button
                                disabled={!canConfirm()}
                                onClick={handleConfirmJoin}
                                className={clsx(
                                    'w-full py-3.5 rounded-xl text-sm font-semibold transition-all',
                                    canConfirm()
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                )}
                            >
                                {canConfirm() ? confirmLabel() : 'Select an option above to continue'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>

    );
}