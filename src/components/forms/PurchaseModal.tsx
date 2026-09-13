import React, { useState } from 'react';
import type { Artwork } from '../../types/database';
import { X, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

interface Props {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseModal: React.FC<Props> = ({ artwork, isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const formattedPrice = artwork.price
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(artwork.price)
    : 'Fixed Valuation';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artwork_id: artwork.id,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          amount: artwork.price || 0,
          shipping_address: address,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.order_number) {
        setOrderNumber(data.order_number);
      } else {
        setErrorMessage(data.error || 'Unable to finalize order reservation. Please contact the studio.');
      }
    } catch (err: any) {
      setErrorMessage('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141311]/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="purchase-modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#FBFBF9] border border-[#E8E5DC] rounded-sm p-6 sm:p-8 shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8A857D] hover:text-[#141311] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9B4722]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {orderNumber ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF5E9] text-[#B68B35] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-display text-2xl text-[#141311] font-semibold">
              Acquisition Order Reserved
            </h3>
            <div className="p-3 bg-[#F4F1EA] border border-[#E8E5DC] rounded-sm inline-block">
              <span className="text-xs uppercase tracking-wider text-[#6B6864] block">Your Order ID</span>
              <strong className="text-lg font-mono text-[#141311] tracking-widest">{orderNumber}</strong>
            </div>
            <p className="text-sm text-[#57544E] leading-relaxed">
              Thank you, <strong className="text-[#141311]">{name}</strong>. <em>"{artwork.title}"</em> has been reserved for your collection.
            </p>
            <p className="text-xs text-[#8A857D]">
              Payment details and escrow logistics instructions have been dispatched to <strong className="text-[#141311]">{email}</strong>.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={`/order-tracking?orderId=${orderNumber}&contact=${encodeURIComponent(email)}`}
                className="flex-1 py-3 bg-[#141311] text-[#FBFBF9] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#2C2A26] transition-colors text-center inline-block"
              >
                Track Consignment Status &rarr;
              </a>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 border border-[#141311] text-[#141311] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#F0ECE3] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#E8E5DC] pb-4 mb-6">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#9B4722] font-semibold block">
                Direct Studio Acquisition
              </span>
              <h2 id="purchase-modal-title" className="font-serif-display text-2xl sm:text-3xl text-[#141311] font-medium mt-1">
                Acquire Artwork
              </h2>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xs text-[#57544E] italic font-serif">
                  "{artwork.title}" &bull; {artwork.width} &times; {artwork.height}
                </span>
                <span className="font-serif text-xl font-bold text-[#141311]">
                  {formattedPrice}
                </span>
              </div>
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
                    Collector Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
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
                    placeholder="vikram@example.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#57544E] mb-1 font-medium">
                  Contact Phone / WhatsApp *
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
                  Delivery / Shipping Address *
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, City, State, PIN code, Country"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
                />
              </div>

              <div className="p-3 bg-[#FAF5E9] border border-[#E8E5DC] rounded-sm flex items-start gap-2 text-xs text-[#57544E]">
                <ShieldCheck className="w-4 h-4 text-[#B68B35] flex-shrink-0 mt-0.5" />
                <span>
                  Includes hand-signed physical <strong>Certificate of Authenticity</strong> and custom climate-protective fine art crate packaging.
                </span>
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
                      Creating Acquisition Order...
                    </>
                  ) : (
                    `Proceed to Reserve Artwork (${formattedPrice})`
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
