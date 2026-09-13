import React, { useState } from 'react';
import type { Artwork } from '../../types/database';
import { MakeOfferModal } from '../forms/MakeOfferModal';
import { PurchaseModal } from '../forms/PurchaseModal';
import { Tag, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';

interface Props {
  artwork: Artwork;
}

export const ArtworkActionButtons: React.FC<Props> = ({ artwork }) => {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const formattedPrice = artwork.price
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(artwork.price)
    : null;

  return (
    <div className="space-y-6">
      {/* Price / Offer Status Card */}
      <div className="p-6 bg-[#F4F1EA] border border-[#E8E5DC] rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#6B6864] font-medium">
            Acquisition Availability
          </span>
          {artwork.availability === 'AVAILABLE' ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-green-800 bg-green-100 px-2.5 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Available for Collection
            </span>
          ) : (
            <span className="text-xs text-[#8A857D] bg-[#E8E5DC] px-2.5 py-0.5 rounded-full font-medium">
              Acquired / Private Collection
            </span>
          )}
        </div>

        {artwork.availability === 'AVAILABLE' && (
          <div className="pt-2">
            {artwork.sale_type === 'FIXED_PRICE' && formattedPrice && (
              <div>
                <span className="text-xs text-[#8A857D] block">Studio Valuation</span>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#141311]">
                  {formattedPrice}
                </span>
                <span className="text-xs text-[#6B6864] block mt-1">
                  Inclusive of domestic art transit insurance & packaging
                </span>
              </div>
            )}

            {artwork.sale_type === 'OFFER' && (
              <div>
                <div className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#B68B35] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Designated Masterwork
                </div>
                <h4 className="font-serif text-2xl text-[#141311] font-medium">
                  Accepting Direct Collector Offers
                </h4>
                <p className="text-xs text-[#57544E] mt-1">
                  You are invited to propose your acquisition offer directly to the artist.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-3">
          {artwork.availability === 'AVAILABLE' && artwork.sale_type === 'FIXED_PRICE' && (
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="w-full py-4 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm"
            >
              Acquire Artwork Now &rarr;
            </button>
          )}

          {artwork.availability === 'AVAILABLE' && artwork.sale_type === 'OFFER' && (
            <button
              onClick={() => setShowOfferModal(true)}
              className="w-full py-4 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4 text-[#B68B35]" />
              Make Your Offer Directly to Artist
            </button>
          )}

          <a
            href={`/contact?subject=${encodeURIComponent('Inquiry: ' + artwork.title)}`}
            className="w-full py-3 border border-[#141311] text-[#141311] hover:bg-white text-xs uppercase tracking-[0.2em] font-medium transition-colors text-center flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Inquire About This Work
          </a>
        </div>
      </div>

      {/* Assurance Note */}
      <div className="p-4 bg-white border border-[#E8E5DC] rounded-sm space-y-2 text-xs text-[#57544E]">
        <div className="flex items-center gap-2 font-medium text-[#141311]">
          <ShieldCheck className="w-4 h-4 text-[#B68B35]" />
          <span>Certificate of Authenticity Guaranteed</span>
        </div>
        <p className="text-[11px] text-[#8A857D] leading-relaxed">
          Every artwork acquired comes with an original wax-sealed certificate signed by Dhirendra, recording provenance, material specifications, and physical signature verification.
        </p>
      </div>

      {/* Modals */}
      {showOfferModal && (
        <MakeOfferModal
          artwork={artwork}
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
        />
      )}

      {showPurchaseModal && (
        <PurchaseModal
          artwork={artwork}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
    </div>
  );
};
