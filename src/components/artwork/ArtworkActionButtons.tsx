import React from 'react';
import type { Artwork } from '../../types/database';
import { Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';

interface Props {
  artwork: Artwork;
}

export const ArtworkActionButtons: React.FC<Props> = ({ artwork }) => {
  return (
    <div className="space-y-6">
      {/* Studio Inquiry Card */}
      <div className="p-6 bg-[#F4F1EA] border border-[#E8E5DC] rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#6B6864] font-medium">
            Artwork Status
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-green-800 bg-green-100 px-2.5 py-0.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
            Verified Studio Original
          </span>
        </div>

        <div className="pt-1 space-y-1">
          <h4 className="font-serif text-2xl text-[#141311] font-medium">
            Available for Collection &amp; Exhibition
          </h4>
          <p className="text-xs text-[#57544E] leading-relaxed">
            Interested in acquiring this original masterwork, featuring it in an exhibition, or commissioning a bespoke piece in a similar medium and dimensions? Inquire directly with the artist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-3">
          <a
            href={`/contact?subject=${encodeURIComponent('Artwork Inquiry: ' + artwork.title)}`}
            className="w-full py-4 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm text-center flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#B68B35]" />
            Inquire About This Work
          </a>

          <a
            href={`/contact?subject=${encodeURIComponent('Commission Request related to: ' + artwork.title)}`}
            className="w-full py-3 border border-[#141311] text-[#141311] hover:bg-white text-xs uppercase tracking-[0.2em] font-medium transition-colors text-center flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#9B4722]" />
            Commission Similar Custom Work
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
    </div>
  );
};
