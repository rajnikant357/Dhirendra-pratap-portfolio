import React, { useState } from 'react';
import type { Artwork } from '../../types/database';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
}

export const MakeOfferModal: React.FC<Props> = ({ artwork, isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const amt = parseFloat(offerAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMessage('Please provide a valid offer amount in INR.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artwork_id: artwork.id,
          artwork_title: artwork.title,
          name,
          email,
          phone,
          offer_amount: amt,
          message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit offer. Please try again or contact the studio directly.');
      }
    } catch (err: any) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141311]/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#FBFBF9] border border-[#E8E5DC] rounded-sm p-6 sm:p-8 shadow-2xl transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8A857D] hover:text-[#141311] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9B4722]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF5E9] text-[#B68B35] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-display text-2xl text-[#141311] font-semibold">
              Offer Received by Studio
            </h3>
            <p className="text-sm text-[#57544E] leading-relaxed">
              Thank you, <strong className="text-[#141311]">{name}</strong>. Your offer of{' '}
              <strong className="text-[#141311]">₹{Number(offerAmount).toLocaleString('en-IN')}</strong> for{' '}
              <em>"{artwork.title}"</em> has been transmitted directly to Dhirendra’s curatorial desk.
            </p>
            <p className="text-xs text-[#8A857D]">
              We review offers within 24 to 48 hours. A written response and confirmation will be sent to{' '}
              <span className="font-medium text-[#141311]">{email}</span>.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[#141311] text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#2C2A26] transition-colors"
              >
                Return to Artwork
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#E8E5DC] pb-4 mb-6">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#B68B35] font-semibold block">
                Acquisition Proposal
              </span>
              <h2 id="modal-title" className="font-serif-display text-2xl sm:text-3xl text-[#141311] font-medium mt-1">
                Make an Offer
              </h2>
              <p className="text-xs text-[#57544E] mt-1 italic font-serif">
                For "{artwork.title}" ({artwork.year}) &bull; {artwork.medium}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 rounded-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#57544E] mb-1 font-medium">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Roy"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#57544E] mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#57544E] mb-1 font-medium">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#57544E] mb-1 font-medium">
                    Offer Amount (₹ INR) *
                  </label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    required
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="e.g. 75000"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#57544E] mb-1 font-medium">
                  Message / Curatorial Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share any special installation requirements, collector location, or notes for the artist..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Offer...
                    </>
                  ) : (
                    'Submit Acquisition Offer'
                  )}
                </button>
              </div>

              <p className="text-[11px] text-[#8A857D] text-center italic">
                Submitting an offer connects you directly with the studio. No commitment is final until the artist accepts.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
