import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import EventCard from '../components/EventCard';
import { Search } from 'lucide-react';

export default function Home() {

    const { events = [], user, fetchEvents } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchEvents();
    }, []);


    let categories = ['All'];
    for (let i = 0; i < events.length; i++) {
        let cat = events[i].category;
        let exists = false;
        for (let j = 0; j < categories.length; j++) {
            if (categories[j] === cat) {
                exists = true;
                break;
            }
        }
        if (exists === false) {
            categories.push(cat);
        }
    }

    let filteredEvents = [];
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        
        let matchesSearch = false;
        let lowerSearchTerm = searchTerm.toLowerCase();
        
        let titleMatch = event.title.toLowerCase().includes(lowerSearchTerm);
        if (titleMatch === true) {
            matchesSearch = true;
        } else {
            if (event.tags) {
                for (let j = 0; j < event.tags.length; j++) {
                    let tag = event.tags[j];
                    if (tag.toLowerCase().includes(lowerSearchTerm)) {
                        matchesSearch = true;
                        break;
                    }
                }
            }
        }
        
        let matchesCategory = false;
        if (filter === 'All') {
            matchesCategory = true;
        } else if (event.category === filter) {
            matchesCategory = true;
        }
        
        if (matchesSearch === true && matchesCategory === true) {
            filteredEvents.push(event);
        }
    }

    return (

        <div className="space-y-8">

            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffe0d2] to-violet-100 opacity-50"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl text-[#e35221] font-extrabold tracking-tight mb-4">
                        Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Events</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Find the best hackathons, competitions, and other events which matches your interests, {user.name}.
                    </p>


                    <div className="relative max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by event name or tags..."
                            className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl leading-5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e35221] focus:border-[#e35221] transition-all shadow-sm text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>


            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === cat
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>


            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setFilter('All'); }}
                        className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}

