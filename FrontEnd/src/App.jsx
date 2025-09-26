import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
// This file now contains all the code in a single file, with a mock MySQL API.
// Helper function to generate mock time-series data
const generateMockData = (days, base, volatility) => {
  const data = [];
  let currentValue = base;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    currentValue += (Math.random() - 0.5) * volatility;
    data.push({ date: date.toISOString().split('T')[0], value: Math.max(0, Math.round(currentValue)) });
  }
  return data;
};

// Mock data that would be fetched from a MySQL database
const mockDashboardMetrics = {
  sales: 15200,
  traffic: 345,
  conversion: 2.5,
  avgTransaction: 45.75,
  inventoryTurnover: 6.8,
};

const mockSalesAnalyticsData = {
  sales: generateMockData(90, 1500, 100),
  traffic: generateMockData(90, 300, 20),
  inventoryTurnover: generateMockData(90, 5, 0.5),
  salesByCategory: [
    { category: 'Electronics', sales: 45000 },
    { category: 'Apparel', sales: 32000 },
    { category: 'Home Goods', sales: 25000 },
    { category: 'Books', sales: 18000 },
    { category: 'Toys', sales: 15000 },
  ],
  topProducts: [
    { name: 'Wireless Headphones', sales: 12500, quantity: 250 },
    { name: 'Smart Watch', sales: 9800, quantity: 180 },
    { name: 'Portable Speaker', sales: 7500, quantity: 150 },
    { name: 'E-reader', sales: 6200, quantity: 120 },
    { name: 'Gaming Mouse', sales: 4800, quantity: 100 },
  ],
  salesByLocation: [
    { location: 'Store A', sales: 55000 },
    { location: 'Store B', sales: 42000 },
    { location: 'Store C', sales: 38000 },
    { location: 'Online', sales: 25000 },
  ],
};

const mockInventoryData = {
  products: [
    { id: 1, name: 'Wireless Headphones', sku: 'ELEC-WH-001', quantity: 25, reorderStatus: 'Low', category: 'Electronics' },
    { id: 2, name: 'Smart Watch', sku: 'ELEC-SW-002', quantity: 150, reorderStatus: 'In Stock', category: 'Electronics' },
    { id: 3, name: 'Designer T-Shirt', sku: 'APPA-TS-003', quantity: 5, reorderStatus: 'Low', category: 'Apparel' },
    { id: 4, name: 'Cookware Set', sku: 'HOME-CS-004', quantity: 75, reorderStatus: 'In Stock', category: 'Home Goods' },
    { id: 5, name: 'Classic Novel', sku: 'BOOK-CN-005', quantity: 250, reorderStatus: 'In Stock', category: 'Books' },
    { id: 6, name: 'Wooden Toy Blocks', sku: 'TOYS-WTB-006', quantity: 10, reorderStatus: 'Low', category: 'Toys' },
    { id: 7, name: 'Running Shoes', sku: 'APPA-RS-007', quantity: 2, reorderStatus: 'Out of Stock', category: 'Apparel' },
    { id: 8, name: 'Smart Light Bulb', sku: 'ELEC-SLB-008', quantity: 100, reorderStatus: 'In Stock', category: 'Electronics' },
    { id: 9, name: 'Yoga Mat', sku: 'HOME-YM-009', quantity: 1, reorderStatus: 'Out of Stock', category: 'Home Goods' },
    { id: 10, name: 'Fantasy Series Book', sku: 'BOOK-FSB-010', quantity: 80, reorderStatus: 'In Stock', category: 'Books' },
  ],
  lowStockThreshold: 20,
  expiredItems: [
    { id: 11, name: 'Snack Bar', sku: 'FOOD-SB-011', expiryDate: '2025-09-30' },
    { id: 12, name: 'Protein Shake Mix', sku: 'FOOD-PSM-012', expiryDate: '2025-10-15' },
  ],
  slowMovingItems: [
    { id: 13, name: 'Vintage Radio', sku: 'ELEC-VR-013', sales: 2, lastSold: '2025-04-10' },
    { id: 14, name: 'Jumbo Playing Cards', sku: 'TOYS-JPC-014', sales: 5, lastSold: '2025-06-21' },
  ],
};

// Functions to simulate API calls to a MySQL backend
const fetchDashboardMetrics = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDashboardMetrics;
};

const fetchSalesAnalyticsData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSalesAnalyticsData;
};

const fetchInventoryData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockInventoryData;
};

// Icon components (using inline SVG for single-file mandate)
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
);
const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
);
const InventoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8L12 3 3 8l9 5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 18l9 5 9-5"/></svg>
);
const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L15 2z"/><path d="M15 2v5.5a.5.5 0 0 0 .5.5H20"/><path d="M8 12h8"/><path d="M8 16h8"/><path d="M10 20h4"/></svg>
);
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucude-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.39a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.73v.5a2 2 0 0 1-1 1.73l-.15.08a2 2 0 0 0-.73 2.73l.22.39a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.73v-.5a2 2 0 0 1 1-1.73l.15-.08a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const TrackerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="12"/><polygon points="17.5 15 22 15 22 10 17.5 5 17.5 15"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>
);
const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="16" y="16" width="32" height="32" rx="4" ry="4" stroke="currentColor" fill="none"/>
    
    {/* AI text */}
    <text x="24" y="38" fontSize="16" fontFamily="Arial, sans-serif" fill="currentColor">AI</text>

    {/* Top lines */}
    <line x1="32" y1="4" x2="32" y2="16"/>
    <circle cx="32" cy="4" r="2"/>

    <line x1="24" y1="4" x2="24" y2="16"/>
    <circle cx="24" cy="4" r="2"/>

    <line x1="40" y1="4" x2="40" y2="16"/>
    <circle cx="40" cy="4" r="2"/>

    {/* Bottom lines */}
    <line x1="32" y1="48" x2="32" y2="60"/>
    <circle cx="32" cy="60" r="2"/>

    <line x1="24" y1="48" x2="24" y2="60"/>
    <circle cx="24" cy="60" r="2"/>

    <line x1="40" y1="48" x2="40" y2="60"/>
    <circle cx="40" cy="60" r="2"/>

    {/* Left lines */}
    <line x1="4" y1="32" x2="16" y2="32"/>
    <circle cx="4" cy="32" r="2"/>

    <line x1="4" y1="24" x2="16" y2="24"/>
    <circle cx="4" cy="24" r="2"/>

    <line x1="4" y1="40" x2="16" y2="40"/>
    <circle cx="4" cy="40" r="2"/>

    {/* Right lines */}
    <line x1="48" y1="32" x2="60" y2="32"/>
    <circle cx="60" cy="32" r="2"/>

    <line x1="48" y1="24" x2="60" y2="24"/>
    <circle cx="60" cy="24" r="2"/>

    <line x1="48" y1="40" x2="60" y2="40"/>
    <circle cx="60" cy="40" r="2"/>
  </svg>
)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

const Profile = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen px-2 sm:px-4 lg:px-4">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Profile Information</h2>
        <p className="text-slate-400 text-sm mb-4">View and manage your personal profile information.</p>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xl font-semibold">
              JD
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">John Doe</h3>
              <p className="text-sm text-slate-400">johndoe@example.com</p>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <form className="space-y-4 mt-6">
          <h4 className="text-md font-semibold text-slate-100">Change Password</h4>
          <div>
            <label className="block text-sm font-medium text-slate-200">New Password</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200">Confirm New Password</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

// Settings
const Settings = () => {
  const [storeName, setStoreName] = useState('My Awesome Store');
  const [storeAddress, setStoreAddress] = useState('123 Main St, Anytown, USA');
  const [operatingHours, setOperatingHours] = useState('9 AM - 6 PM');
  const [salesAlerts, setSalesAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(false);
  const [kpiAlerts, setKpiAlerts] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('60');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [layoutView, setLayoutView] = useState('grid');
  const [showAlert, setShowAlert] = useState(false);

  const handleSaveChanges = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const inputClass =
    "mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400";

  const sections = [
    {
      title: 'Store Configuration',
      description: 'Update your store details and contact information.',
      content: (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200">Address</label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200">Operating Hours</label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className={inputClass}
            />
          </div>
        </form>
      ),
    },
    {
      title: 'Notification Preferences',
      description: 'Configure the alerts and notifications you receive.',
      content: (
        <div className="space-y-4">
          {[
            { label: 'Sales Alerts', value: salesAlerts, setValue: setSalesAlerts },
            { label: 'Low Stock Alerts', value: lowStockAlerts, setValue: setLowStockAlerts },
            { label: 'KPI Alerts', value: kpiAlerts, setValue: setKpiAlerts },
          ].map(({ label, value, setValue }, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">{label}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setValue(e.target.checked)}
                className="h-4 w-4 text-blue-400 border-slate-600 bg-slate-700 rounded focus:ring-blue-400"
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Display Settings',
      description: 'Customize the appearance and layout of your dashboard.',
      content: (
        <div className="space-y-4">
          <div>
            <label htmlFor="refreshInterval" className="block text-sm font-medium text-slate-200">
              Dashboard Refresh Interval (seconds)
            </label>
            <input
              id="refreshInterval"
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">Dark Mode</span>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={(e) => setIsDarkMode(e.target.checked)}
              className="h-4 w-4 text-blue-400 border-slate-600 bg-slate-700 rounded focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="layoutView" className="block text-sm font-medium text-slate-200">
              Default Layout View
            </label>
            <select
              id="layoutView"
              value={layoutView}
              onChange={(e) => setLayoutView(e.target.value)}
              className={inputClass}
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
            </select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-slate-900 text-white min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="space-y-8 pb-12">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-slate-100 mb-2">{section.title}</h2>
            <p className="text-slate-400 text-sm mb-4">{section.description}</p>
            {section.content}
          </div>
        ))}
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-center pb-6">
        <button
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Save Changes
        </button>
      </div>

      {/* Alert rendered with React Portal */}
      {showAlert &&
        ReactDOM.createPortal(
          <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-blue-600 text-white py-4 px-6 rounded-lg shadow-lg text-lg font-semibold">
              Settings Saved!
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

const inboundOutbound = {
  inbound: [
    { id: 1, product: 'Laptop Pro', qty: 50, status: 'In Transit', eta: '2025-08-05' },
    { id: 2, product: 'Ergo Chair', qty: 20, status: 'Delivered', eta: '2025-07-29' },
    { id: 3, product: 'Mechanical Keyboard', qty: 75, status: 'In Transit', eta: '2025-08-07' },
    { id: 4, product: '4K Monitor', qty: 30, status: 'In Transit', eta: '2025-08-10' },
    { id: 5, product: 'Wireless Mouse', qty: 150, status: 'Delivered', eta: '2025-08-01' },
    { id: 6, product: 'USB-C Hub', qty: 100, status: 'In Transit', eta: '2025-08-08' },
    { id: 7, product: 'LED Desk Lamp', qty: 40, status: 'Delivered', eta: '2025-08-02' },
    { id: 8, product: 'Webcam', qty: 60, status: 'In Transit', eta: '2025-08-12' },
    { id: 9, product: 'Portable SSD', qty: 25, status: 'Delivered', eta: '2025-07-31' },
    { id: 10, product: 'Gaming Headset', qty: 35, status: 'In Transit', eta: '2025-08-09' },
    { id: 11, product: 'Power Bank', qty: 90, status: 'Delivered', eta: '2025-08-03' },
    { id: 12, product: 'Smart Speaker', qty: 20, status: 'In Transit', eta: '2025-08-15' },
  ],
  outbound: [
    { id: 1, product: 'Organic Coffee', qty: 10, status: 'Shipped', customer: 'Alice' },
    { id: 2, product: 'Noise Cancelling Headphones', qty: 2, status: 'Processing', customer: 'Bob' },
    { id: 3, product: 'Laptop Pro', qty: 1, status: 'Shipped', customer: 'Charlie' },
    { id: 4, product: 'Ergo Chair', qty: 1, status: 'Delivered', customer: 'Diana' },
    { id: 5, product: 'Mechanical Keyboard', qty: 3, status: 'Shipped', customer: 'Eve' },
    { id: 6, product: 'Wireless Mouse', qty: 5, status: 'Shipped', customer: 'Grace' },
    { id: 7, product: 'USB-C Hub', qty: 2, status: 'Delivered', customer: 'Heidi' },
    { id: 8, product: 'LED Desk Lamp', qty: 1, status: 'Shipped', customer: 'Ivan' },
    { id: 9, product: 'Webcam', qty: 1, status: 'Processing', customer: 'Judy' },
    { id: 10, product: 'Gaming Headset', qty: 1, status: 'Delivered', customer: 'Liam' },
  ],
};

const Tracker = () => {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Inbound/Outbound Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Inbound Shipments</h2>
          <ul className="space-y-3">
            {inboundOutbound.inbound.map((shipment) => (
              <li key={shipment.id} className="p-3 bg-gray-700 rounded-lg flex justify-between items-center text-white">
                <div>
                  <p className="font-medium text-white">{shipment.product} (<span className="text-pink-400">{shipment.qty} units</span>)</p>
                  <p className="text-sm text-gray-400">Status: <span className="font-semibold">{shipment.status}</span></p>
                </div>
                <p className="text-sm text-gray-400">ETA: {shipment.eta}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Outbound Shipments</h2>
          <ul className="space-y-3">
            {inboundOutbound.outbound.map((shipment) => (
              <li key={shipment.id} className="p-3 bg-gray-700 rounded-lg flex justify-between items-center text-white">
                <div>
                  <p className="font-medium text-white">{shipment.product} (<span className="text-pink-400">{shipment.qty} units</span>)</p>
                  <p className="text-sm text-gray-400">Status: <span className="font-semibold">{shipment.status}</span></p>
                </div>
                <p className="text-sm text-gray-400">Customer: {shipment.customer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const AI_Suggestions = ({
  mockInventoryData,
  mockSalesAnalyticsData,
}) => {
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  // Helpers
  const lowStockProducts = mockInventoryData.products.filter(
    (p) => p.quantity <= mockInventoryData.lowStockThreshold
  );

  const slowMovingItems = mockInventoryData.slowMovingItems;
  const expiredItems = mockInventoryData.expiredItems;
  const salesByCategory = mockSalesAnalyticsData.salesByCategory;

  // Find the top trending category
  const topCategory = salesByCategory.length
    ? salesByCategory.reduce((max, curr) => (curr.sales > max.sales ? curr : max))
    : null;

  const suggestions = [
    {
      key: 'reorder',
      title: 'Suggested Re-order Quantity',
      summary: `${lowStockProducts.length} item${lowStockProducts.length !== 1 ? 's' : ''} low in stock`,
      details: (
        <>
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-300">All products have sufficient stock.</p>
          ) : (
            <ul className="list-disc list-inside text-gray-300 space-y-1 max-h-48 overflow-auto">
              {lowStockProducts.map((item) => (
                <li key={item.id}>
                  <span className="font-semibold">{item.name}</span> (SKU: {item.sku}) — Qty: {item.quantity}, Status: {item.reorderStatus}
                </li>
              ))}
            </ul>
          )}
        </>
      ),
      bgColor: 'bg-blue-700',
    },
    {
      key: 'futureDemand',
      title: 'Future Demand Predictions',
      summary: topCategory
        ? `Growth expected in "${topCategory.category}"`
        : 'No trend data available',
      details: (
        <>
          <p className="text-gray-300 mb-2">
            Based on recent sales trends, here are your top categories with predicted growth:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1 max-h-48 overflow-auto">
            {salesByCategory.map(({ category, sales }) => (
              <li key={category}>
                <span className="font-semibold">{category}</span>: approximately {sales.toLocaleString()} sales
              </li>
            ))}
          </ul>
          <p className="text-gray-300 mt-2 italic">
            Consider increasing stock in categories with steady or increasing sales.
          </p>
        </>
      ),
      bgColor: 'bg-green-700',
    },
    {
      key: 'slowMovers',
      title: 'Slow Movers & Action Plans',
      summary: `${slowMovingItems.length} slow mover${slowMovingItems.length !== 1 ? 's' : ''}, ${expiredItems.length} expired`,
      details: (
        <>
          {slowMovingItems.length === 0 ? (
            <p className="text-gray-300">No slow-moving items detected.</p>
          ) : (
            <>
              <ul className="list-disc list-inside text-gray-300 space-y-1 max-h-48 overflow-auto">
                {slowMovingItems.map(({ id, name, sku, sales, lastSold }) => (
                  <li key={id}>
                    <span className="font-semibold">{name}</span> (SKU: {sku}) — Sales: {sales}, Last Sold: {lastSold}
                  </li>
                ))}
              </ul>
              <p className="text-gray-300 mt-2 italic">
                Consider promotions or bundles to improve sales on these items.
              </p>
            </>
          )}
          {expiredItems.length > 0 && (
            <>
              <p className="text-gray-300 mt-4 font-semibold">Expired or Near Expiry Items:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 max-h-32 overflow-auto">
                {expiredItems.map(({ id, name, sku, expiryDate }) => (
                  <li key={id}>
                    <span className="font-semibold">{name}</span> (SKU: {sku}) — Expiry: {expiryDate}
                  </li>
                ))}
              </ul>
              <p className="text-gray-300 mt-2 italic">
                Consider clearance or removal to avoid waste.
              </p>
            </>
          )}
        </>
      ),
      bgColor: 'bg-red-700',
    },
    {
      key: 'summary',
      title: 'Overall AI Inventory Summary',
      summary: `${lowStockProducts.length} low stock, ${topCategory?.category || 'N/A'} trending, ${slowMovingItems.length} slow, ${expiredItems.length} expired`,
      details: (
        <>
          <p className="text-gray-300 mb-2">
            • <strong>{lowStockProducts.length}</strong> product{lowStockProducts.length !== 1 ? 's' : ''} need reordering.
          </p>
          {topCategory && (
            <p className="text-gray-300 mb-2">
              • <strong>{topCategory.category}</strong> is the top trending category with {topCategory.sales.toLocaleString()} sales.
            </p>
          )}
          <p className="text-gray-300 mb-2">
            • <strong>{slowMovingItems.length}</strong> slow-moving item{slowMovingItems.length !== 1 ? 's' : ''} identified.
          </p>
          <p className="text-gray-300 mb-2">
            • <strong>{expiredItems.length}</strong> expired or near-expiry item{expiredItems.length !== 1 ? 's' : ''}.
          </p>
          <p className="text-gray-300 mt-4 italic">
            This summary aggregates insights from all AI suggestions to give a quick overview of your inventory priorities.
          </p>
        </>
      ),
      bgColor: 'bg-gray-700',
    },
  ];

  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-6 ml-0 text-left">AI Suggestions</h2>
      <div className="bg-gray-900 pt-4 pl-0 pr-0 pb-6 rounded-xl shadow-lg max-w-full ml-0">
        <div className="bg-gray-800 p-8 rounded-xl ml-0 max-w-full">
          <p className="text-gray-300 mb-6 text-left">Click to view content:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 mb-6">
            {suggestions.map(({ key, title, summary, bgColor }) => (
              <button
                key={key}
                onClick={() => setActiveSuggestion(key === activeSuggestion ? null : key)}
                className={`p-6 rounded-xl ${bgColor} text-left transition-all duration-200 hover:scale-[1.02] ${activeSuggestion === key ? 'border-2 border-white' : ''}`}
              >
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-gray-300 mt-1">{summary}</p>
              </button>
            ))}
          </div>

          {activeSuggestion && (
            <div className="bg-gray-800 p-6 rounded-lg max-h-96 overflow-auto border border-blue-500 mt-6">
              {suggestions.find((s) => s.key === activeSuggestion)?.details}
            </div>
          )}
        </div>
      </div>
    </>
  );
};


const Dashboard = () => {
  const salesData = [
    { name: 'Electronics', sales: 45000 },
    { name: 'Apparel', sales: 30000 },
    { name: 'Home Goods', sales: 25000 },
    { name: 'Online', sales: 15000 },
    { name: 'Store A', sales: 55000 },
    { name: 'Store B', sales: 40000 },
    { name: 'Store C', sales: 35000 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 min-h-screen text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Retail Dashboard</h1>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings text-slate-300 h-6 w-6"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.23.39a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.74v.17a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.23-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-slate-300 h-6 w-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales by Category Chart */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Sales by Category</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData.slice(0, 3)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip cursor={{ fill: '#334155' }} />
                  <Bar dataKey="sales" fill="#10b981" barSize={40} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Sales by Location Chart */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Sales by Location</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData.slice(4, 7)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip cursor={{ fill: '#334155' }} />
                  <Bar dataKey="sales" fill="#ec4899" barSize={40} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App component that contains the entire dashboard layout and logic.
export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    sales: 15200,
    traffic: 345,
    conversion: 2.5,
    avgTransaction: 45.75,
    inventoryTurnover: 6.8,
  });
  const [salesData, setSalesData] = useState({});
  const [inventoryData, setInventoryData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMessage, setModalMessage] = useState(null);

  // Fetch data from the mock MySQL API on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const dashboard = await fetchDashboardMetrics();
        const sales = await fetchSalesAnalyticsData();
        const inventory = await fetchInventoryData();
        setDashboardData(dashboard);
        setSalesData(sales);
        setInventoryData(inventory);
      } catch (error) {
        console.error("Failed to fetch data from mock MySQL API:", error);
      }
    }
    fetchData();

    // Set up an interval to simulate real-time data updates
    const interval = setInterval(() => {
      setDashboardData({
        sales: Math.round(15000 + (Math.random() * 2000)),
        traffic: Math.round(300 + (Math.random() * 100)),
        conversion: Math.round((2.0 + (Math.random() * 1.0)) * 100) / 100,
        avgTransaction: Math.round((40.0 + (Math.random() * 10.0)) * 100) / 100,
        inventoryTurnover: Math.round((6.0 + (Math.random() * 1.0)) * 100) / 100,
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);
  
  // Modal component to display messages
  const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold mb-4 text-white">Notification</h3>
        <p className="text-gray-300">{message}</p>
        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-blue-600 text-sm font-semibold hover:bg-blue-700 transition-colors">
            OK
          </button>
        </div>
      </div>
    </div>
  );
  
  const handleExport = (reportType, format, dataToExport) => {
    // Show a modal with the export action
    let message = '';
    if (format === 'email') {
      message = `Report "${reportType}" has been emailed to the specified recipients.`;
    } else {
      message = `Downloading ${reportType} report as a ${format.toUpperCase()} file. Please check the console for data.`;
    }
    setModalMessage(message);
    
    // Log the data to the console to simulate a download
    console.log(`--- Exporting ${reportType} Report as ${format.toUpperCase()} ---`);
    console.log(dataToExport);
    console.log(`-----------------------------------------------------`);
  };

  const pages = [
    { name: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
    { name: 'Sales Analytics', icon: <AnalyticsIcon />, key: 'sales' },
    { name: 'Inventory', icon: <InventoryIcon />, key: 'inventory' },
    { name: 'Reports', icon: <ReportsIcon />, key: 'reports' },
    { name: 'Tracker', icon: <TrackerIcon />, key: 'tracker' },
    { name: 'AI Suggestions', icon: <AIIcon />, key: 'ai' },
    { name: 'Settings', icon: <SettingsIcon />, key: 'settings' },
  ];

  const MetricCard = ({ title, value, unit, tooltipText, isNegative }) => (
    <div className="relative bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-500 ease-in-out group">
      <h3 className="text-sm font-semibold text-gray-400">{title}</h3>
      <p className={`text-3xl font-bold mt-2 transition-all duration-500 ease-in-out ${isNegative ? 'text-red-500' : 'text-white'}`}>{value}{unit}</p>
      
      {/* Tooltip on hover */}
      <div className="absolute top-0 right-0 p-2 m-2 hidden group-hover:block transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <div className="bg-gray-700 text-xs text-white rounded-md p-2 shadow-lg">
          {tooltipText}
        </div>
      </div>
    </div>
  );

  const LineChart = ({ title, data, color, yUnit }) => {
    const [period, setPeriod] = useState(7);

    // UseMemo for filtered data to optimize rendering
    const filteredData = useMemo(() => {
      if (!data || data.length === 0) return [];
      // Sort data by date and filter by the selected period
      const sortedData = data
        .slice(data.length - period)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return sortedData.length > 0 ? sortedData : [];
    }, [data, period]);

    // Early return if no data is available
    if (!filteredData || filteredData.length === 0) {
      return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center justify-center h-48">
          <p className="text-gray-400">No data available for this period.</p>
        </div>
      );
    }

    const width = 600;
    const height = 200;
    const margin = { top: 20, right: 40, bottom: 30, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const values = filteredData.map(d => d.value);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    const range = maxVal - minVal;
    const paddingY = range === 0 ? maxVal * 0.1 : range * 0.1;
    const adjustedMin = minVal - paddingY;
    const adjustedMax = maxVal + paddingY;

    // Symmetric left+right padding for X axis
    const xPadding = 20;

    // Scales
    const xScale = (index) => {
      if (filteredData.length <= 1) return 0;
      return (
        xPadding + (index / (filteredData.length - 1)) * (chartWidth - 2 * xPadding)
      );
    };
    
    const yScale = (value) =>
      chartHeight - ((value - adjustedMin) / (adjustedMax - adjustedMin)) * chartHeight;

    // Memoized line path
    const linePath = useMemo(() => {
      return filteredData
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)},${yScale(d.value)}`)
        .join(' ');
    }, [filteredData, xScale, yScale]);

    const lastDataPoint = filteredData[filteredData.length - 1];

    // Y-axis Labels (min and max)
    const yLabels = [
      { value: adjustedMin, text: `${minVal}${yUnit}` },
      { value: adjustedMax, text: `${maxVal}${yUnit}` }
    ];

    // X-axis Labels (First and Last Dates)
    const xLabels = [
      { position: xPadding, date: filteredData[0]?.date },
      { position: chartWidth - xPadding, date: filteredData[filteredData.length - 1]?.date }
    ];

    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <div className="flex space-x-2">
            {[7, 30, 90].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${period === p ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
              >
                {p} Days
              </button>
            ))}
          </div>
        </div>

        <svg width={width} height={height}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Y-axis grid lines (aligned with xPadding) */}
            <line x1={xPadding} y1={yScale(adjustedMin)} x2={chartWidth - xPadding} y2={yScale(adjustedMin)} stroke="#4b5563" strokeDasharray="4 2" />
            <line x1={xPadding} y1={yScale(adjustedMax)} x2={chartWidth - xPadding} y2={yScale(adjustedMax)} stroke="#4b5563" strokeDasharray="4 2" />

            {/* Line path */}
            <path d={linePath} fill="none" stroke={color} strokeWidth="2" />

            {/* Current value dot */}
            {lastDataPoint && (
              <circle
                cx={xScale(filteredData.length - 1)}
                cy={yScale(lastDataPoint.value)}
                r="4"
                fill={color}
              />
            )}

            {/* X-axis labels */}
            {xLabels.map((label, i) => (
              <text
                key={i}
                x={label.position}
                y={chartHeight + 20}
                fill="#9ca3af"
                textAnchor={i === 0 ? 'start' : 'end'}
                fontSize="12"
              >
                {label.date}
              </text>
            ))}

            {/* Y-axis labels */}
            {yLabels.map((label, i) => (
              <text
                key={i}
                x={xPadding - 10}
                y={yScale(label.value)}
                fill="#9ca3af"
                textAnchor="end"
                alignmentBaseline="middle"
                fontSize="12"
              >
                {label.text}
              </text>
            ))}
          </g>
        </svg>
      </div>
    );
  };

  
  // Bar Chart Component (New)
  const BarChart = ({ title, data, xKey, yKey, color }) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center justify-center h-64">
          <p className="text-gray-400">No data available.</p>
        </div>
      );
    }

    const width = 400; // shrink default width (can be made responsive later)
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const maxVal = Math.max(...data.map(d => d[yKey]));
    const barWidth = Math.min((chartWidth / data.length) * 0.7, 60); // cap max width to avoid overflow

    // Scales
    const xScale = (index) =>
      index * (chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2;
    const yScale = (value) => chartHeight - (value / maxVal) * chartHeight;

    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg overflow-hidden">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Bars and X-axis labels */}
            {data.map((d, i) => {
              const xPosition = xScale(i);
              const yPosition = yScale(d[yKey]);
              const barHeight = chartHeight - yPosition;

              return (
                <React.Fragment key={d[xKey]}>
                  {/* Bar */}
                  <rect
                    x={xPosition}
                    y={yPosition}
                    width={barWidth}
                    height={barHeight}
                    fill={color}
                    className="transition-all duration-500 ease-in-out"
                    rx="4"
                  />
                  {/* X-axis Label */}
                  <text
                    x={xPosition + barWidth / 2}
                    y={chartHeight + 20}
                    fill="#9ca3af"
                    textAnchor="middle"
                    fontSize="12"
                  >
                    {d[xKey]}
                  </text>
                </React.Fragment>
              );
            })}

            {/* Y-axis label (max only for now) */}
            <text
              x="-10"
              y={yScale(maxVal)}
              fill="#9ca3af"
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize="12"
            >
              {title.includes("Sales") ? "$" : ""}
              {maxVal.toLocaleString()}
            </text>
          </g>
        </svg>
      </div>
    );
  };
  
  // Pie Chart Component (New)
  const PieChart = ({ title, data, valueKey, labelKey }) => {
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Check for valid data
    if (!data || data.length === 0 || data.reduce((sum, d) => sum + d[valueKey], 0) === 0) {
      return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center justify-center h-64">
          <p className="text-gray-400">No data available.</p>
        </div>
      );
    }
    
    const total = data.reduce((sum, d) => sum + d[valueKey], 0);
    let startAngle = 0;
    
    // Adjusted color palette for better contrast
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

    const pathData = data.map((d, i) => {
      const endAngle = startAngle + (d[valueKey] / total) * 2 * Math.PI;
      const startX = centerX + radius * Math.sin(startAngle);
      const startY = centerY - radius * Math.cos(startAngle);
      const endX = centerX + radius * Math.sin(endAngle);
      const endY = centerY - radius * Math.cos(endAngle);
      const largeArcFlag = (endAngle - startAngle) > Math.PI ? 1 : 0;
      const path = `M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
      startAngle = endAngle;
      return { path, color: colors[i % colors.length] };
    });

    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-6">
          <svg width={width} height={height}>
            {pathData.map((d, i) => (
              <path key={i} d={d.path} fill={d.color} />
            ))}
          </svg>
          <div className="flex flex-col space-y-2 mt-4 md:mt-0">
            {data.map((d, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></span>
                <span className="text-sm text-gray-300">{d[labelKey]} ({(d[valueKey] / total * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Sales Analytics Page Component
  const SalesAnalyticsPage = () => {
    // Check if salesData is available before rendering
    if (!salesData || !salesData.sales) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-lg">Loading sales analytics data...</p>
        </div>
      );
    }
    
    const totalSales = salesData.sales.reduce((sum, d) => sum + d.value, 0);
    const salesGrowth = ((salesData.sales[salesData.sales.length - 1].value - salesData.sales[salesData.sales.length - 2].value) / salesData.sales[salesData.sales.length - 2].value * 100).toFixed(2);
    const salesForecastData = useMemo(() => {
        const historical = salesData.sales.slice(-30);
        const lastValue = historical[historical.length-1].value;
        const forecast = [];
        for (let i = 1; i <= 7; i++) {
            forecast.push({ date: `Day ${i}`, value: lastValue + (Math.random() - 0.5) * 50 });
        }
        return { historical, forecast };
    }, [salesData]);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Sales Analytics</h1>
        <p className="text-lg text-gray-300">Dive deeper into sales performance and trends.</p>

        {/* Sales Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-white">Sales Overview</h3>
            <div className="mt-4 space-y-2 text-gray-300">
              <p>Total Sales (YTD): <span className="text-white font-semibold">${totalSales.toLocaleString()}</span></p>
              <p>Sales Growth (MoM): <span className={`font-semibold ${salesGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>{salesGrowth}%</span></p>
              <p>Best-Selling Product: <span className="text-white font-semibold">{salesData.topProducts[0].name}</span></p>
            </div>
          </div>
          <BarChart
            title="Sales by Category"
            data={salesData.salesByCategory}
            xKey="category"
            yKey="sales"
            color="#22c55e"
          />
          <BarChart
            title="Sales by Location"
            data={salesData.salesByLocation}
            xKey="location"
            yKey="sales"
            color="#ec4899"
          />
        </div>
{/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart
            title="Sales Trends"
            data={salesData.sales}
            color="#3b82f6"
            yUnit="$"
          />
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Top 5 Products</h3>
            <ul className="space-y-4">
              {salesData.topProducts.map((product, index) => (
                <li key={product.name} className="flex justify-between items-center py-2 px-4 rounded-lg bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{index + 1}.</span>
                    <span className="font-medium text-white">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white font-semibold">${product.sales.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{product.quantity} units</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-4">Sales Forecasting</h3>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <svg width="600" height="200">
                <g transform="translate(50, 20)">
                  {/* Historical data */}
                  <path
                    d={salesForecastData.historical.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / (salesForecastData.historical.length - 1)) * 530},${180 - (d.value / 150000) * 160}`).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  {/* Forecast data */}
                  <path
                    d={`M ${530},${180 - (salesForecastData.historical[salesForecastData.historical.length - 1].value / 150000) * 160} ` + salesForecastData.forecast.map((d, i) => `L ${530 + (i / salesForecastData.forecast.length) * 50},${180 - (d.value / 150000) * 160}`).join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Inventory Page Component (New)
  const InventoryPage = () => {
    // Check if inventoryData is available before rendering
    if (!inventoryData || !inventoryData.products) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-lg">Loading inventory data...</p>
        </div>
      );
    }

    const lowStockItems = inventoryData.products.filter(p => p.quantity < inventoryData.lowStockThreshold);
    const inventoryByCategory = Object.values(inventoryData.products.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.quantity;
      return acc;
    }, {})).map((value, index) => ({
      category: Object.keys(inventoryData.products.reduce((acc, curr) => { acc[curr.category] = (acc[curr.category] || 0) + curr.quantity; return acc; }, {}))[index],
      count: value
    }));

    // AI Restocking Recommendations
    const restockingRecommendations = useMemo(() => {
      const lowStock = inventoryData.products.filter(p => p.quantity < inventoryData.lowStockThreshold);
      const expiredItems = inventoryData.expiredItems;
      // Combine low stock and expired items
      const combinedRecommendations = [...lowStock, ...expiredItems];
      // Mock logic: recommend based on sales from mock data
      const salesMap = new Map(salesData.topProducts.map(p => [p.name, p.sales]));
      return combinedRecommendations.sort((a, b) => (salesMap.get(b.name) || 0) - (salesMap.get(a.name) || 0));
    }, [inventoryData, salesData]);

    // Mock Inventory Movement Data
    const mockMovementData = [
      { type: 'Sales', count: 500, date: '2025-08-20' },
      { type: 'Restocks', count: 650, date: '2025-08-20' },
      { type: 'Returns', count: 50, date: '2025-08-20' },
      { type: 'Sales', count: 480, date: '2025-08-21' },
      { type: 'Restocks', count: 580, date: '2025-08-21' },
      { type: 'Returns', count: 45, date: '2025-08-21' },
    ];
    
    // Grouping movement data by type for the bar chart
    const inventoryMovementByType = mockMovementData.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.count;
      return acc;
    }, {});
    
    // Formatting the movement data for the BarChart component
    const formattedMovementData = Object.keys(inventoryMovementByType).map(key => ({
      label: key,
      value: inventoryMovementByType[key],
    }));

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-lg text-gray-300">Monitor and manage your product stock levels.</p>

        {/* Low Stock Alerts */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 text-red-400 mb-4">
            <AlertIcon />
            <h3 className="text-xl font-semibold">Low Stock Alerts</h3>
          </div>
          {lowStockItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left">Product Name</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Reorder Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map(item => (
                    <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-2 font-medium text-white">{item.name}</td>
                      <td className="px-4 py-2">{item.sku}</td>
                      <td className="px-4 py-2 text-red-400 font-semibold">{item.quantity}</td>
                      <td className="px-4 py-2">{item.reorderStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No low stock items at the moment.</p>
          )}
        </div>

        {/* Current Inventory & Restocking Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg lg:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-4">Current Inventory</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left">Product Name</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Reorder Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.products.map(item => (
                    <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-2 font-medium text-white">{item.name}</td>
                      <td className="px-4 py-2">{item.sku}</td>
                      <td className="px-4 py-2">
                        <span className={`font-semibold ${item.quantity < inventoryData.lowStockThreshold ? 'text-red-400' : 'text-white'}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          item.reorderStatus === 'Low' ? 'bg-yellow-800 text-yellow-300' :
                          item.reorderStatus === 'Out of Stock' ? 'bg-red-800 text-red-300' :
                          'bg-green-800 text-green-300'
                        }`}>
                          {item.reorderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Restocking Recommendations</h3>
            <ul className="space-y-3">
              {restockingRecommendations.map((product) => (
                <li key={product.id} className="flex justify-between items-center py-2 px-4 rounded-lg bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{product.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.quantity !== undefined ? `Current stock: ${product.quantity}` : "Expired"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Expired or Slow-Moving Items</h3>
            <ul className="space-y-3">
              {inventoryData.expiredItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-2 px-4 rounded-lg bg-red-900 text-red-200">
                  <span className="font-medium">{item.name} (Expired)</span>
                  <span className="text-sm">Exp: {item.expiryDate}</span>
                </li>
              ))}
              {inventoryData.slowMovingItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-2 px-4 rounded-lg bg-yellow-900 text-yellow-200">
                  <span className="font-medium">{item.name} (Slow Moving)</span>
                  <span className="text-sm">Last sold: {item.lastSold}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            title="Inventory Movement"
            data={formattedMovementData}
            xKey="label"
            yKey="value"
            color="#ec4899"
          />
          <PieChart
            title="Inventory by Category"
            data={inventoryByCategory}
            valueKey="count"
            labelKey="category"
          />
        </div>
      </div>
    );
  };
// Re-usable Report Section component
  const ReportSection = ({ title, children, active, onActivate }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-transparent hover:border-blue-600 transition-colors cursor-pointer" onClick={onActivate}>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {active && children}
    </div>
  );

// const ReportSection = ({ title, children, onActivate }) => (
//   <div
//     className="bg-gray-800 p-6 rounded-xl shadow-lg border border-transparent hover:border-blue-600 transition-colors cursor-pointer"
//     onClick={onActivate}
//   >
//     <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
//     {children} {/* Show children always */}
//   </div>
// );

  const SalesReportForm = ({ filters, onChange, onExport, reportData }) => (
    <div className="mt-4 space-y-4">
      <p className="text-gray-400">Generate downloadable PDF or CSV reports on sales performance.</p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <select name="dateRange" value={filters.dateRange} onChange={onChange} className="bg-gray-700 text-white p-2 rounded-lg">
          <option value="90">Last 90 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="7">Last 7 Days</option>
        </select>
        <select name="location" value={filters.location} onChange={onChange} className="bg-gray-700 text-white p-2 rounded-lg">
          <option value="All">All Locations</option>
          <option value="Store A">Store A</option>
          <option value="Store B">Store B</option>
        </select>
        <select name="category" value={filters.category} onChange={onChange} className="bg-gray-700 text-white p-2 rounded-lg">
          {salesData && salesData.salesByCategory && salesData.salesByCategory.length > 0 && <option value="All">All Categories</option>}
          {salesData && salesData.salesByCategory && salesData.salesByCategory.map(d => <option key={d.category} value={d.category}>{d.category}</option>)}
        </select>
      </div>
      <div className="flex space-x-2 mt-4">
          <button onClick={() => onExport('Sales', 'pdf', reportData)} className="px-4 py-2 rounded-full bg-red-600 text-sm font-semibold hover:bg-red-700 transition-colors">
              Download PDF
          </button>
          <button onClick={() => onExport('Sales', 'csv', reportData)} className="px-4 py-2 rounded-full bg-green-600 text-sm font-semibold hover:bg-green-700 transition-colors">
              Download CSV
          </button>
          <button onClick={() => onExport('Sales', 'excel', reportData)} className="px-4 py-2 rounded-full bg-gray-600 text-sm font-semibold hover:bg-gray-700 transition-colors">
              Download Excel
          </button>
          <button onClick={() => onExport('Sales', 'email', reportData)} className="px-4 py-2 rounded-full bg-purple-600 text-sm font-semibold hover:bg-purple-700 transition-colors">
              Email Report
          </button>
      </div>
    </div>
  );
  
  const InventoryReportSection = ({ onExport, reportData }) => (
      <div className="mt-4 space-y-4">
          <p className="text-gray-400">Download detailed inventory reports on stock levels and movements.</p>
          <div className="flex space-x-2 mt-4">
              <button onClick={() => onExport('Inventory', 'pdf', reportData)} className="px-4 py-2 rounded-full bg-red-600 text-sm font-semibold hover:bg-red-700 transition-colors">
                  Download PDF
              </button>
              <button onClick={() => onExport('Inventory', 'csv', reportData)} className="px-4 py-2 rounded-full bg-green-600 text-sm font-semibold hover:bg-green-700 transition-colors">
                  Download CSV
              </button>
              <button onClick={() => onExport('Inventory', 'excel', reportData)} className="px-4 py-2 rounded-full bg-gray-600 text-sm font-semibold hover:bg-gray-700 transition-colors">
                  Download Excel
              </button>
              <button onClick={() => onExport('Inventory', 'email', reportData)} className="px-4 py-2 rounded-full bg-purple-600 text-sm font-semibold hover:bg-purple-700 transition-colors">
                  Email Report
              </button>
          </div>
      </div>
  );

  const PerformanceReportSection = ({ onExport, reportData }) => (
      <div className="mt-4 space-y-4">
          <p className="text-gray-400">Get customizable reports on key performance metrics.</p>
          <div className="flex space-x-2 mt-4">
              <button onClick={() => onExport('Performance Metrics', 'pdf', reportData)} className="px-4 py-2 rounded-full bg-red-600 text-sm font-semibold hover:bg-red-700 transition-colors">
                  Download PDF
              </button>
              <button onClick={() => onExport('Performance Metrics', 'csv', reportData)} className="px-4 py-2 rounded-full bg-green-600 text-sm font-semibold hover:bg-green-700 transition-colors">
                  Download CSV
              </button>
              <button onClick={() => onExport('Performance Metrics', 'excel', reportData)} className="px-4 py-2 rounded-full bg-gray-600 text-sm font-semibold hover:bg-gray-700 transition-colors">
                  Download Excel
              </button>
              <button onClick={() => onExport('Performance Metrics', 'email', reportData)} className="px-4 py-2 rounded-full bg-purple-600 text-sm font-semibold hover:bg-purple-700 transition-colors">
                  Email Report
              </button>
          </div>
      </div>
  );

  const CustomReportForm = ({ metrics, selectedMetrics, onMetricChange, onExport, reportData }) => (
      <div className="mt-4 space-y-4">
          <p className="text-gray-400">Create a custom report by selecting your desired filters and metrics.</p>
          <div className="space-y-2">
              <label className="text-gray-300">Select Metrics:</label>
              <div className="flex flex-wrap gap-2">
                  {metrics.map(metric => (
                      <label key={metric} className="flex items-center space-x-2 cursor-pointer">
                          <input
                              type="checkbox"
                              value={metric}
                              checked={selectedMetrics.includes(metric)}
                              onChange={onMetricChange}
                              className="form-checkbox text-blue-600 rounded-md bg-gray-700 border-gray-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 text-sm">{metric}</span>
                      </label>
                  ))}
              </div>
          </div>
          <div className="flex space-x-2 mt-4">
              <button onClick={() => onExport('Custom', 'pdf', reportData)} className="px-4 py-2 rounded-full bg-red-600 text-sm font-semibold hover:bg-red-700 transition-colors">
                  Download PDF
              </button>
              <button onClick={() => onExport('Custom', 'csv', reportData)} className="px-4 py-2 rounded-full bg-green-600 text-sm font-semibold hover:bg-green-700 transition-colors">
                  Download CSV
              </button>
              <button onClick={() => onExport('Custom', 'excel', reportData)} className="px-4 py-2 rounded-full bg-gray-600 text-sm font-semibold hover:bg-gray-700 transition-colors">
                  Download Excel
              </button>
              <button onClick={() => onExport('Custom', 'email', reportData)} className="px-4 py-2 rounded-full bg-purple-600 text-sm font-semibold hover:bg-purple-700 transition-colors">
                  Email Report
              </button>
          </div>
      </div>
  );

  // New Reports Page Component
  const ReportsPage = () => {
    const [activeReport, setActiveReport] = useState('sales');
    const [salesFilters, setSalesFilters] = useState({ dateRange: '90', location: 'All', category: 'All' });
    const [customFilters, setCustomFilters] = useState({ timePeriod: '90', filters: [], product: 'All' });
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const availableMetrics = ['Sales', 'Traffic', 'Conversion Rate', 'Average Transaction Value'];

    // Handle form input changes for sales reports
    const handleSalesFilterChange = (e) => {
      const { name, value } = e.target;
      setSalesFilters(prev => ({ ...prev, [name]: value }));
    };
    
    // Mock data for the sales report based on filters
    const getSalesReportData = () => {
        let reportData = salesData.sales;
        if (salesFilters.category !== 'All' && salesData && salesData.salesByCategory) {
             reportData = salesData.salesByCategory.filter(d => d.category === salesFilters.category);
        }
        if (salesFilters.location !== 'All' && salesData && salesData.salesByLocation) {
             reportData = salesData.salesByLocation.filter(d => d.location === salesFilters.location);
        }
        return reportData;
    };
    
    // Handle change for custom report metrics
    const handleMetricChange = (e) => {
        const value = e.target.value;
        setSelectedMetrics(prev => 
            prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
        );
    };
    
    // Get the data for the custom report based on selected metrics
    const getCustomReportData = () => {
        return selectedMetrics.map(metric => ({
            metric,
            value: dashboardData[metric.toLowerCase().replace(/\s/g, '')] || 'N/A'
        }));
    };
    
    // Data for the mock sales report based on filters
    const salesReportData = useMemo(() => {
        return {
            title: `Sales Report for ${salesFilters.dateRange} days`,
            filters: salesFilters,
            data: getSalesReportData()
        }
    }, [salesFilters, salesData]);
    
    // Data for the mock inventory report
    const inventoryReportData = useMemo(() => {
        return {
            title: 'Inventory Report',
            data: inventoryData.products
        }
    }, [inventoryData]);
    
    // Data for the mock performance metrics report
    const performanceReportData = useMemo(() => {
        return {
            title: 'Performance Metrics Report',
            data: [
                { metric: 'Conversion Rate', value: dashboardData.conversion },
                { metric: 'Average Transaction Value', value: dashboardData.avgTransaction },
                { metric: 'Foot Traffic', value: dashboardData.traffic },
            ]
        }
    }, [dashboardData]);
    
    // Data for the custom report
    const customReportData = useMemo(() => {
        return {
            title: 'Custom Report',
            filters: customFilters,
            metrics: getCustomReportData(),
        }
    }, [customFilters, selectedMetrics, dashboardData]);
    
    const reportComponents = {
        'sales': <SalesReportForm
          filters={salesFilters}
          onChange={handleSalesFilterChange}
          onExport={handleExport}
          reportData={salesReportData}
        />,
        'inventory': <InventoryReportSection onExport={handleExport} reportData={inventoryReportData} />,
        'performance': <PerformanceReportSection onExport={handleExport} reportData={performanceReportData} />,
        'custom': <CustomReportForm
          metrics={availableMetrics}
          selectedMetrics={selectedMetrics}
          onMetricChange={handleMetricChange}
          onExport={handleExport}
          reportData={customReportData}
        />,
    };
      
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-lg text-gray-300">Generate and download detailed reports on various store metrics.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportSection 
                title="Sales Reports"
                active={activeReport === 'sales'}
                onActivate={() => setActiveReport('sales')}
            >
                {reportComponents['sales']}
            </ReportSection>
            
            <ReportSection 
                title="Inventory Reports"
                active={activeReport === 'inventory'}
                onActivate={() => setActiveReport('inventory')}
            >
                {reportComponents['inventory']}
            </ReportSection>
            
            <ReportSection 
                title="Performance Metrics"
                active={activeReport === 'performance'}
                onActivate={() => setActiveReport('performance')}
            >
                {reportComponents['performance']}
            </ReportSection>
            
            <ReportSection 
                title="Custom Reports"
                active={activeReport === 'custom'}
                onActivate={() => setActiveReport('custom')}
            >
                {reportComponents['custom']}
            </ReportSection>
        </div>
      </div>
    );
  };


  const salesChange = ((dashboardData.sales - 15000) / 15000 * 100).toFixed(2);
  const trafficChange = ((dashboardData.traffic - 300) / 300 * 100).toFixed(2);
  const conversionChange = ((dashboardData.conversion - 2.0) / 2.0 * 100).toFixed(2);
  const avgTransactionChange = ((dashboardData.avgTransaction - 40.0) / 40.0 * 100).toFixed(2);
  const inventoryChange = ((dashboardData.inventoryTurnover - 6.0) / 6.0 * 100).toFixed(2);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-inter">
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}

      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between p-4 md:px-6 border-b border-gray-700 bg-gray-800 flex-wrap gap-4">
        <div className="flex-grow flex items-center space-x-4">
          <span className="text-xl font-bold tracking-tight text-white">Retail Dashboard</span>
          <div className="relative flex-grow max-w-sm">
            <input
              type="text"
              placeholder="Search products, categories, or sales data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <SearchIcon />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 hidden md:block">
            Status: Connected to Mock Database
          </span>
          <button className="px-4 py-2 rounded-full bg-blue-600 text-sm font-semibold hover:bg-blue-700 transition-colors" onClick={() => setActivePage('Profile')}>
            Profile
        </button>
        </div>
      </header>

      {/* Main Layout: Sidebar & Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-gray-800 p-4 border-r border-gray-700">
          <nav className="flex flex-col space-y-2 mt-4">
            {pages.map((page) => (
              <button
                key={page.key}
                onClick={() => setActivePage(page.key)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activePage === page.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {page.icon}
                <span className="font-medium">{page.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          {activePage === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <p className="text-lg text-gray-300">A quick glance at your store's performance metrics.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MetricCard 
                  title="Total Sales" 
                  value={`$${dashboardData.sales.toLocaleString()}`}
                  tooltipText={`Daily average: $${(dashboardData.sales / 7).toFixed(2)}. Change: ${salesChange}%`}
                  isNegative={dashboardData.sales < 15000}
                />
                <MetricCard 
                  title="Foot Traffic" 
                  value={dashboardData.traffic.toLocaleString()} 
                  unit=" visits"
                  tooltipText={`Change: ${trafficChange}% from previous day`}
                  isNegative={dashboardData.traffic < 300}
                />
                <MetricCard 
                  title="Conversion Rate" 
                  value={dashboardData.conversion} 
                  unit="%"
                  tooltipText={`Change: ${conversionChange}% vs. 30 days ago`}
                  isNegative={dashboardData.conversion < 1.0}
                />
                <MetricCard 
                  title="Avg. Transaction Value" 
                  value={`$${dashboardData.avgTransaction}`}
                  tooltipText={`Daily average: $${dashboardData.avgTransaction}. Change: ${avgTransactionChange}%`}
                  isNegative={dashboardData.avgTransaction < 40}
                />
                <MetricCard 
                  title="Inventory Turnover" 
                  value={dashboardData.inventoryTurnover} 
                  unit="x"
                  tooltipText={`Change: ${inventoryChange}% vs. last period`}
                  isNegative={dashboardData.inventoryTurnover < 5}
                />
              </div>

              {/* Charts section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChart
                  title="Sales Trends"
                  data={salesData.sales}
                  color="#3b82f6"
                  yUnit="$"
                />
                <LineChart
                  title="Foot Traffic"
                  data={salesData.traffic}
                  color="#22c55e"
                  yUnit=" visits"
                />
                <div className="lg:col-span-2">
                  <LineChart
                    title="Inventory Turnover History"
                    data={mockSalesAnalyticsData.inventoryTurnover}  // This is an array, not a number
                    color="#f59e0b"
                    yUnit="x"
                  />
                </div>
              </div>
            </div>
          )}

          {activePage === 'sales' && <SalesAnalyticsPage />}
          {activePage === 'inventory' && <InventoryPage />}
          {activePage === 'reports' && <ReportsPage />}
          {activePage === 'Profile' && <Profile />}
          {activePage === 'tracker' && <Tracker />}
          {activePage === 'ai' && <AI_Suggestions mockInventoryData={mockInventoryData}
          mockSalesAnalyticsData={mockSalesAnalyticsData}
          mockDashboardMetrics={mockDashboardMetrics} />}
          {activePage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}