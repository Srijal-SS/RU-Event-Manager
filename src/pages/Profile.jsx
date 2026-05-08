import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import {
  User as UserIcon, Mail, Heart, Settings, ShieldCheck,
  Search, Plus, UserMinus, IdCard, Phone, BookUser, GraduationCap
} from 'lucide-react';

export default function Profile() {
  const { user, allUsers, addFriend, removeFriend, updateAccountDetails, fetchAllUsers } = useStore();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const [interests, setInterests] = useState((user.interests ?? []).join(', '));
  const [prefSaved, setPrefSaved] = useState(false);

  const [accountForm, setAccountForm] = useState({
    name: user.name || '',
    enrollmentNumber: user.enrollmentNumber || '',
    collegeEmail: user.collegeEmail || '',
    phone: user.phone || '',
  });
  const [accountSaved, setAccountSaved] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const handlePrefSave = async (e) => {
    e.preventDefault();
    let updatedInterests = [];
    let splitInterests = interests.split(',');
    for (let i = 0; i < splitInterests.length; i++) {
        let trimmed = splitInterests[i].trim();
        if (trimmed !== "") {
            updatedInterests.push(trimmed);
        }
    }
    await updateAccountDetails({ interests: updatedInterests });
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const handleAccountSave = (e) => {
    e.preventDefault();
    updateAccountDetails(accountForm);
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 3000);
  };

  const handleAccountChange = (e) =>
    setAccountForm({ ...accountForm, [e.target.name]: e.target.value });

  let friends = [];
  if (user.friends) {
    friends = user.friends;
  }

  let searchResults = [];
  if (searchQuery !== '') {
    for (let i = 0; i < allUsers.length; i++) {
      let u = allUsers[i];
      if (u.id !== user.id) {
        let isFriend = false;
        for (let j = 0; j < friends.length; j++) {
          if (friends[j] === u.id) {
            isFriend = true;
            break;
          }
        }
        
        if (isFriend === false) {
          let lowerName = u.name.toLowerCase();
          let lowerEmail = u.email.toLowerCase();
          let lowerSearch = searchQuery.toLowerCase();
          
          if (lowerName.includes(lowerSearch) || lowerEmail.includes(lowerSearch)) {
            searchResults.push(u);
          }
        }
      }
    }
  }

  let firstChar = '?';
  if (user.name) {
      firstChar = user.name.charAt(0);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover shadow-lg shrink-0 border-4 border-white ring-2 ring-indigo-100"
          />
        ) : (
          <div className="w-32 h-32 bg-gradient-to-br from-[#e35424] to-violet-500 rounded-full flex items-center justify-center shadow-lg text-white text-4xl font-bold shrink-0">
            {firstChar}
          </div>
        )}
        <div className="text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            {user.isAdmin && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md">ADMIN</span>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-500">
              <Mail size={16} /> {user.email}
            </span>
            {user.enrollmentNumber && (
              <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-500">
                <IdCard size={16} /> {user.enrollmentNumber}
              </span>
            )}
            <span className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
              <ShieldCheck size={16} /> Verified Account
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="md:col-span-2 space-y-8">

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="p-2 bg-[#FFF1EB] text-[#e35424] rounded-lg">
                <BookUser size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
            </div>

            <form onSubmit={handleAccountSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <UserIcon size={17} />
                    </div>
                    <input
                      name="name"
                      value={accountForm.name}
                      onChange={handleAccountChange}
                      type="text"
                      placeholder="Your full name"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e35424] focus:border-[#e35424] transition-all outline-none text-sm"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <IdCard size={17} />
                    </div>
                    <input
                      name="enrollmentNumber"
                      value={accountForm.enrollmentNumber}
                      onChange={handleAccountChange}
                      type="text"
                      placeholder="e.g. 22BTECH1001"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e35424] focus:border-[#e35424] transition-all outline-none text-sm"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <GraduationCap size={17} />
                    </div>
                    <input
                      name="collegeEmail"
                      value={accountForm.collegeEmail}
                      onChange={handleAccountChange}
                      type="email"
                      placeholder="you@university.edu.in"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e35424] focus:border-[#e35424] transition-all outline-none text-sm"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Phone size={17} />
                    </div>
                    <input
                      name="phone"
                      value={accountForm.phone}
                      onChange={handleAccountChange}
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e35424] focus:border-[#e35424] transition-all outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-[#e35424] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#dd3f0a] transition-all"
                >
                  Save Account Details
                </button>
                {accountSaved && (
                  <span className="text-emerald-600 font-medium text-sm">✓ Details saved</span>
                )}
              </div>
            </form>
          </div>


          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="p-2 bg-[#FFF1EB] text-[#e35424] rounded-lg">
                <Settings size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
            </div>

            <form onSubmit={handlePrefSave}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Interests & Favorite Roles
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  We'll use these to send you smart notifications when relevant events are posted!
                </p>
                <div className="relative">
                  <div className="absolute top-3.5 left-4 text-gray-400">
                    <Heart size={18} />
                  </div>
                  <textarea
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    rows="3"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="React, Dance, Web3, Organizer..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="bg-[#e35424] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#dd3f0a] transition-all"
                >
                  Save Preferences
                </button>
                {prefSaved && <span className="text-emerald-600 font-medium text-sm">✓ Saved successfully</span>}
              </div>
            </form>
          </div>
        </div>


        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="p-2 bg-[#FFF1EB] text-[#e35424] rounded-lg">
                <UserIcon size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Connections</h2>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Total Friends</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-900">
                {friends.length}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              When your friends response to events, you'll be notified so you can join them!
            </p>
          </div>


          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Friends</h3>
            {friends.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {friends.map(friendId => {
                  const friend = allUsers.find(u => u.id === friendId);
                  if (!friend) return null;
                  return (
                    <div key={friend.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-gray-900 truncate">{friend.name}</p>
                        <p className="text-xs text-gray-500 truncate">{friend.email}</p>
                      </div>
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="p-1.5 text-gray-400 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors"
                        title="Remove friend"
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-center text-gray-500 py-2">You haven't added any friends yet.</p>
            )}
          </div>


          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Friend</label>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
              />
            </div>

            {searchQuery && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {searchResults.length > 0 ? (
                  searchResults.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                      <button
                        onClick={() => { addFriend(u.id); setSearchQuery(''); }}
                        className="p-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                        title="Add friend"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-gray-500 py-2">No users found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
