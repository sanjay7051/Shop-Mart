import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight text-center">Shipping Policy</h1>
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Timelines</h2>
          <p>We strive to process and dispatch all orders within 24-48 hours. Standard delivery usually takes 3-5 business days depending on your location. Expedited shipping options are available at checkout.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Charges</h2>
          <p>We offer free standard shipping on all orders above ₹1000. For orders below this amount, a flat rate of ₹150 applies. Shipping costs are calculated and displayed at checkout.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coverage Areas</h2>
          <p>We currently ship to all major cities and towns across the country. If your pincode is not serviceable by our courier partners, we will notify you during the checkout process.</p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
