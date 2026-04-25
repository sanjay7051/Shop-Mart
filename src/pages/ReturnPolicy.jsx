import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight text-center">Return & Exchange</h1>
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7-Day Return Policy</h2>
          <p>We offer a hassle-free 7-day return and exchange policy. If you are not completely satisfied with your purchase, you can return it within 7 days of delivery for a full refund or exchange.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conditions for Return</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Items must be unused, unwashed, and in their original condition.</li>
            <li>All original tags and packaging must be intact.</li>
            <li>Certain categories like innerwear, swimwear, and customized items are non-returnable.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
          <p>Once we receive and inspect your returned item, we will initiate the refund to your original payment method. Please allow 5-7 business days for the amount to reflect in your account.</p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;
