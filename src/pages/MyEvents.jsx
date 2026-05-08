import { useState } from 'react';
import { useStore } from '../store/useStore';
import EventCard from '../components/EventCard';
import CreateEvent from './CreateEvent';

export default function MyEvents() {
    const { user } = useStore();

    return (
        <>
            <div className="max-w-6xl mx-auto mb-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#e35424] to-violet-600 px-8 py-6 text-white text-center">
                        <h1 className="text-3xl font-bold mb-2">My Events</h1>
                    </div>

                    <div className="p-8 space-y-6 bg-gradient-to-b to-[#fdccbc] from-violet-100">

                    </div>
                </div>
            </div>

            {user?.isAdmin && <CreateEvent />}
        </>
    );
}
