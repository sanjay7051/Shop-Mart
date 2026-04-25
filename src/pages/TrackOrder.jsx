import React from 'react';

const TrackOrder = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Track Your Order</h1>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
        <p className="text-gray-500 mb-6 font-medium">Enter your Order ID to see the current status of your shipment.</p>
        <input 
          type="text" 
          placeholder="e.g. ORD-123456" 
          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-black placeholder-gray-500 shadow-sm mb-4"
        />
        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white h-14 rounded-xl font-bold text-lg hover:scale-[1.03] transition-all shadow-md active:scale-95">
          Track Status
        </button>
      </div>
    </div>
  );
};

export default TrackOrder;
