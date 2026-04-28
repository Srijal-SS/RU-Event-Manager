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

export const useStore = create((set) => ({
  user: MOCK_USER,
  notifications: [
    { id: 'n1', message: 'Smart India Hackathon has your favourite roles 🎯', read: false },
    { id: 'n2', message: 'Your friend is also joining Web3 Builders Meetup 👥', read: false },
    { id: 'n3', message: 'This event has Dance competition 🎉', read: true }
  ],

}));
