import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight text-center">Privacy Policy</h1>
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Usage</h2>
          <p>We collect personal information such as your name, email address, shipping address, and payment details to process your orders and provide a personalized shopping experience. We do not sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Security</h2>
          <p>Your security is our priority. We use industry-standard encryption protocols to protect your personal and financial information during transmission and storage. Our payment gateways are PCI-DSS compliant.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Rights</h2>
          <p>You have the right to access, modify, or delete your personal information stored with us. You can manage your data through your account settings or by contacting our privacy team at privacy@shopmart.com.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
