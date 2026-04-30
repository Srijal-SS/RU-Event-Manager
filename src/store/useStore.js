import { create } from 'zustand';

const MOCK_USER = {
  id: 'u1',
  name: 'Srijal',
  email: 'srijal@example.com',
  isAdmin: true,
  interests: ['React', 'Web3', 'Dance', 'Hackathons'],
  friends: ['u2', 'u3'],
  enrollmentNumber: '',
  collegeEmail: '',
  phone: ''
};


const MOCK_EVENTS = [
  {
    id: 'e1',
    title: 'Smart India Hackathon 2026',
    description: '36-hour coding marathon to solve real-world problems.',
    date: new Date(Date.now() + 86400000 * 5).toISOString(),
    category: 'Hackathons',
    tags: ['React', 'Node.js', 'AI'],
    attendeeRoles: [],
    participantRoles: ['Frontend Developer', 'Backend Developer', 'ML Engineer'],
    managementRoles: ['Mentor', 'Judge'],
    programs: ['10:00 AM - Opening Ceremony', '11:00 AM - Keynote Speech'],
    rsvps: ['u1', 'u2'],
    organizer: 'MoE Innovation Cell'
  },
  {
    id: 'e2',
    title: 'Inter-College Dance Competition',
    description: 'Showcase your dancing skills in our annual fest!',
    date: new Date(Date.now() + 86400000 * 12).toISOString(),
    category: 'Dance',
    tags: ['Dance', 'Cultural'],
    attendeeRoles: [],
    participantRoles: ['Solo Dancer', 'Group Dancer'],
    managementRoles: ['Stage Manager', 'Sound Engineer'],
    programs: [],
    rsvps: ['u3'],
    organizer: 'Cultural Committee'
  },
  {
    id: 'e3',
    title: 'Web3 Builders Meetup',
    description: 'Connect with local Web3 developers and founders.',
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    category: 'Meetup',
    tags: ['Web3', 'Blockchain', 'Networking'],
    attendeeRoles: [],
    participantRoles: [],
    managementRoles: [],
    programs: [],
    rsvps: ['u4'],
    organizer: 'Web3 India'
  }
];

export const useStore = create((set) => ({
  user: MOCK_USER,
  events: MOCK_EVENTS,
  notifications: [
    { id: 'n1', message: 'Smart India Hackathon has your favourite roles 🎯', read: false },
    { id: 'n2', message: 'Your friend is also joining Web3 Builders Meetup 👥', read: false },
    { id: 'n3', message: 'This event has Dance competition 🎉', read: true }
  ],

  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  
}));
