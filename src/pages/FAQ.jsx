import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by visiting the 'Track Order' page and entering your Order ID. You will also receive tracking updates via email."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, Net Banking, and Cash on Delivery (COD) for eligible pincodes."
    },
    {
      question: "Can I change my shipping address after placing an order?",
      answer: "You can change your shipping address within 2 hours of placing the order by contacting our customer support team."
    },
    {
      question: "How do I initiate a return?",
      answer: "To initiate a return, go to your Profile > Order History, select the order, and click on 'Return Item'. Follow the instructions to schedule a pickup."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <button 
              className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-bold text-gray-900">{faq.question}</span>
              {openIndex === index ? <ChevronUp className="h-5 w-5 text-orange-500" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
