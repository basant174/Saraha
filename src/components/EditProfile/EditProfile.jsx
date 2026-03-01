// EditProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EditProfile({ onUpdate, isFrozen }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/v1/user/getUser', {
        headers: { Authorization: `USER ${token}` },
      });
      const user = res.data?.data?.userData;
      setFirstName(user?.firstName || '');
      setLastName(user?.lastName || '');
    } catch {
      toast.error('Failed to load profile data');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFrozen) return; // منع أي تعديل لو الحساب مجمد

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:3000/api/v1/user/update-profile',
        { firstName, lastName },
        { headers: { Authorization: `USER ${token}` } }
      );

      toast.success('Profile updated successfully!');
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);

      if (onUpdate) onUpdate();
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData)
    return (
      <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow animate-pulse"></div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-10"
    >
      <h1 className="text-2xl font-bold mb-8 text-[#0d4369]">Edit Profile</h1>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isFrozen}
          className={`w-full p-3 border border-gray-300 rounded focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df] ${
            isFrozen ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isFrozen}
          className={`w-full p-3 border border-gray-300 rounded focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df] ${
            isFrozen ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || isFrozen}
          className={`bg-gray-200 text-gray-700 py-2 px-6 font-medium ${
            !isFrozen ? 'hover:bg-[#5b9ac7] hover:text-white' : ''
          } transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}