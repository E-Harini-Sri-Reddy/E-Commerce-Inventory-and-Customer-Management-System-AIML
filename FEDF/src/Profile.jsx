// Profile.jsx 
import React from 'react';

const Profile = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Information</h2>
      <p className="text-gray-600 text-sm mb-4">View and manage your personal profile information.</p>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xl font-semibold">
            JD
          </div>
          <div>
            <h3 className="text-lg font-bold">John Doe</h3>
            <p className="text-sm text-gray-500">johndoe@example.com</p>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <form className="space-y-4">
        <h4 className="text-md font-semibold text-gray-800">Change Password</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Profile;