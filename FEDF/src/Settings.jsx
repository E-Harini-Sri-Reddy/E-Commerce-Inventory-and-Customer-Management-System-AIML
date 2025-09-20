// Settings.jsx 
import React, { useState } from 'react';

const Settings = () => {
  const [storeName, setStoreName] = useState('My Awesome Store');
  const [storeAddress, setStoreAddress] = useState('123 Main St, Anytown, USA');
  const [operatingHours, setOperatingHours] = useState('9 AM - 6 PM');
  const [salesAlerts, setSalesAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(false);
  const [kpiAlerts, setKpiAlerts] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('60');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [layoutView, setLayoutView] = useState('grid');

  const sections = [
    {
      title: 'Store Configuration',
      description: 'Update your store details and contact information.',
      content: (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Operating Hours</label>
            <input type="text" value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        </form>
      ),
    },
    // More sections like User Management, Notification Preferences...
  ];

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h2>
          <p className="text-gray-600 text-sm mb-4">{section.description}</p>
          {section.content}
        </div>
      ))}
    </div>
  );
};

export default Settings;