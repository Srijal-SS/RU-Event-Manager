import { create } from 'zustand';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection, query, getDocs, doc, getDoc, setDoc, addDoc,
  updateDoc, arrayUnion, arrayRemove
} from 'firebase/firestore';

export const useStore = create((set, get) => ({
  user: undefined,
  events: [],
  allUsers: [],
  notifications: [
    { id: 'n1', message: 'Smart India Hackathon has your favourite roles 🎯', read: false },
    { id: 'n2', message: 'Your friend is also joining Web3 Builders Meetup 👥', read: false },
    { id: 'n3', message: 'This event has Dance competition 🎉', read: true }
  ],


  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null });
        return;
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        set({ user: { id: userSnap.id, ...userSnap.data() } });
      } else {
        const newUser = {
          name: firebaseUser.displayName ?? '',
          email: firebaseUser.email ?? '',
          photoURL: firebaseUser.photoURL ?? '',
          isAdmin: false,
          interests: [],
          friends: [],
          enrollmentNumber: '',
          collegeEmail: '',
          phone: '',
        };
        await setDoc(userRef, newUser);
        set({ user: { id: firebaseUser.uid, ...newUser } });
      }
    });
  },


  login: (userData) => set({ user: userData }),

  logout: async () => {
    await signOut(auth || undefined);
    set({ user: null });
    const navigate = useNavigate();
    navigate('/login');
  },

  updateAccountDetails: async (fields) => {
    const { user } = get();
    if (!user?.id) return;
    try {
      await updateDoc(doc(db, 'users', user.id), fields);
      set({ user: { ...user, ...fields } });
    } catch (error) {
      console.error('Error updating account details:', error);
    }
  },


  addFriend: async (friendId) => {
    const { user } = get();
    if (!user?.id) return;
    try {
      await updateDoc(doc(db, 'users', user.id), { friends: arrayUnion(friendId) });
      set({ user: { ...user, friends: [...(user.friends ?? []), friendId] } });
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  },

  removeFriend: async (friendId) => {
    const { user } = get();
    if (!user?.id) return;
    try {
      await updateDoc(doc(db, 'users', user.id), { friends: arrayRemove(friendId) });
      set({ user: { ...user, friends: (user.friends ?? []).filter(id => id !== friendId) } });
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  },

  
  fetchAllUsers: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ allUsers: users });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },

  responseToEvent: (eventId) => set((state) => ({
    events: state.events.map(ev => 
      ev.id === eventId 
        ? { ...ev, responses: ev.responses.includes(state.user?.id) 
            ? ev.responses.filter(id => id !== state.user?.id)
            : [...ev.responses, state.user?.id] 
          }
        : ev
    )
  })),

  
  fetchEvents: async () => {
    try {
      const q = query(collection(db, 'events'));
      const snapshot = await getDocs(q);
      const eventData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      set({ events: eventData });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  },

  addEvent: async (event) => {
    try {
      const docRef = await addDoc(collection(db, 'events'), event);
      set((state) => ({ events: [...state.events, { id: docRef.id, ...event }] }));
    } catch (error) {
      console.error('Error adding event:', error);
    }
  },
}));
