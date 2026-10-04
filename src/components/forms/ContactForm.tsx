import React, { useState } from 'react';
import type { EnquiryType } from '../../types/database';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

const ENQUIRY_TYPES: EnquiryType[] = [
  'Artwork Purchase',
  'Artwork Commission',
  'Graphics Design',
  'Exhibition',
  'Collaboration',
  'Commercial Project',
  'General Enquiry',
];

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<EnquiryType>('Artwork Purchase');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          type,
          message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#FAF5E9] border border-[#E8E5DC] p-8 sm:p-12 text-center rounded-sm space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-white text-[#B68B35] flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif-display text-3xl text-[#141311] font-semibold">
          Message Received
        </h3>
        <p className="text-sm text-[#57544E] max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-[#141311]">{name}</strong>. Your inquiry regarding{' '}
          <strong className="text-[#141311]">{type}</strong> has reached the studio.
        </p>
        <p className="text-xs text-[#8A857D]">
          We typically review and respond to inquiries within 24–48 business hours via{' '}
          <span className="font-medium text-[#141311]">{email}</span>.
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setMessage('');
            }}
            className="px-6 py-2.5 bg-[#141311] text-[#FBFBF9] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#2C2A26] transition-colors"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 rounded-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-[#57544E] mb-2 font-medium">
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-3 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-[#57544E] mb-2 font-medium">
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            className="w-full px-4 py-3 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-phone" className="block text-xs uppercase tracking-wider text-[#57544E] mb-2 font-medium">
            Phone / WhatsApp (with country code) *
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91..."
            className="w-full px-4 py-3 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contact-type" className="block text-xs uppercase tracking-wider text-[#57544E] mb-2 font-medium">
            Enquiry Type *
          </label>
          <select
            id="contact-type"
            value={type}
            onChange={(e) => setType(e.target.value as EnquiryType)}
            className="w-full px-4 py-3 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722] transition-colors"
          >
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-[#57544E] mb-2 font-medium">
          Message & Project Details *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe the artwork, custom commission, exhibition concept, or graphic design project you would like to discuss..."
          className="w-full px-4 py-3 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722] transition-colors"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-4 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending to Studio...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Dispatch Inquiry
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-[#8A857D] italic">
        All acquisition discussions and private commissions are treated with curatorial discretion and privacy.
      </p>
    </form>
  );
};
