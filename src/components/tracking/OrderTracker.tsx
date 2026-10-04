import React, { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '../../types/database';
import { Search, Package, CheckCircle2, Clock, ShieldCheck, Truck, MapPin, AlertCircle, Loader2 } from 'lucide-react';

const TRACKING_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'OFFER_ACCEPTED', label: 'Offer Accepted', description: 'Acquisition terms agreed with artist' },
  { status: 'PAYMENT_RECEIVED', label: 'Payment Verified', description: 'Escrow or bank clearance finalized' },
  { status: 'PREPARING_ARTWORK', label: 'Archival Preparation', description: 'Varnish curing & Certificate of Authenticity signing' },
  { status: 'PACKED', label: 'Museum Crated', description: 'Acid-free packing & reinforced timber casing' },
  { status: 'SHIPPED', label: 'In Transit', description: 'Dispatched via insured Fine Art carrier' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Safely received and installed by collector' },
];

export const OrderTracker: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  // Check URL query parameters for auto-lookup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qOrderId = params.get('orderId');
      const qContact = params.get('contact');
      if (qOrderId) {
        setOrderId(qOrderId);
        if (qContact) setContact(qContact);
        fetchOrder(qOrderId, qContact || '');
      }
    }
  }, []);

  const fetchOrder = async (queryNum: string, queryContact: string) => {
    if (!queryNum.trim()) {
      setError('Please enter a valid Order ID (e.g. DAG-2026-0012).');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/orders?orderNumber=${encodeURIComponent(queryNum.trim())}&contact=${encodeURIComponent(queryContact.trim())}`
      );
      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'No consignment found matching this Order ID and contact details.');
        setOrder(null);
      }
    } catch (err) {
      setError('Connection failed. Please verify your internet connection.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId, contact);
  };

  const getStepIndex = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'OFFER_ACCEPTED':
        return 0;
      case 'PAYMENT_PENDING':
        return 0;
      case 'PAYMENT_RECEIVED':
        return 1;
      case 'PREPARING_ARTWORK':
        return 2;
      case 'PACKED':
        return 3;
      case 'SHIPPED':
        return 4;
      case 'DELIVERED':
        return 5;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.order_status) : -1;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      {/* Search Console */}
      <div className="bg-white border border-[#E8E5DC] p-6 sm:p-8 rounded-sm shadow-sm">
        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#B68B35] font-semibold block">
            Provenance & Consignment Tracking
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#141311] font-medium mt-1">
            Track Your Artwork Consignment
          </h2>
          <p className="text-xs text-[#57544E] mt-1">
            Enter the consignment reference code issued upon artwork acquisition or offer acceptance.
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs uppercase tracking-wider text-[#57544E] mb-1 font-medium">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Consignment / Order ID"
                className="w-full px-4 py-2.5 text-sm font-mono uppercase bg-[#FBFBF9] border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-xs uppercase tracking-wider text-[#57544E] mb-1 font-medium">
                Email or Phone *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or phone used during acquisition"
                className="w-full px-4 py-2.5 text-sm bg-[#FBFBF9] border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-[0.18em] font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Locating Consignment...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Consignment
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 rounded-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* Header Card */}
          <div className="bg-[#FAF5E9] border border-[#E8E5DC] p-6 sm:p-8 rounded-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E5DC]">
              <div>
                <span className="text-xs uppercase tracking-[0.18em] text-[#B68B35] font-semibold">
                  Consignment #{order.order_number}
                </span>
                <h3 className="font-serif-display text-2xl sm:text-3xl text-[#141311] font-medium mt-0.5">
                  {order.artwork ? order.artwork.title : 'Selected Artwork Acquisition'}
                </h3>
                <p className="text-xs text-[#57544E] italic font-serif">
                  Collector: {order.customer_name} &bull; Destination: {order.shipping_address?.split(',').slice(-2).join(', ')}
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-xs uppercase tracking-wider text-[#8A857D]">Acquisition Amount</span>
                <span className="font-serif text-2xl font-bold text-[#141311]">
                  ₹{order.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-green-800 font-medium bg-green-100 px-2 py-0.5 rounded-[2px] mt-1">
                  Payment Status: {order.payment_status}
                </span>
              </div>
            </div>

            {/* Carrier Logistics */}
            {order.tracking_courier && (
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-[#57544E]">
                  <Truck className="w-4 h-4 text-[#B68B35]" />
                  <span>Art Courier: <strong>{order.tracking_courier}</strong></span>
                </div>
                {order.tracking_number && (
                  <div className="text-[#57544E]">
                    Waybill Reference: <strong className="font-mono text-[#141311]">{order.tracking_number}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stepper Timeline */}
          <div className="bg-white border border-[#E8E5DC] p-6 sm:p-10 rounded-sm">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#141311] font-semibold mb-8">
              Consignment Progress
            </h4>

            <div className="relative">
              {/* Horizontal Line for Desktop */}
              <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-[#E8E5DC]" />

              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
                {TRACKING_STEPS.map((step, idx) => {
                  const isCompleted = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;

                  return (
                    <div key={step.status} className="flex md:flex-col items-start md:items-center gap-4 md:gap-2">
                      {/* Step Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors z-10 ${
                          isCompleted
                            ? 'bg-[#141311] text-[#FBFBF9]'
                            : isCurrent
                            ? 'bg-[#9B4722] text-white ring-4 ring-[#FAF5E9]'
                            : 'bg-[#F4F1EA] text-[#8A857D] border border-[#D3CEBF]'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isCurrent ? (
                          <Clock className="w-5 h-5 animate-pulse" />
                        ) : (
                          <span className="text-xs font-mono">{idx + 1}</span>
                        )}
                      </div>

                      {/* Text */}
                      <div className="md:text-center">
                        <span
                          className={`text-xs uppercase tracking-wider block font-semibold ${
                            isCompleted || isCurrent ? 'text-[#141311]' : 'text-[#8A857D]'
                          }`}
                        >
                          {step.label}
                        </span>
                        <p className="text-[11px] text-[#8A857D] mt-0.5 leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event Audit Log */}
            {order.events && order.events.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#F0ECE3]">
                <h5 className="text-xs uppercase tracking-[0.16em] text-[#6B6864] font-medium mb-4">
                  Curatorial Event History
                </h5>
                <ul className="space-y-3">
                  {order.events.map((ev) => (
                    <li key={ev.id} className="text-xs flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#FBFBF9] border border-[#E8E5DC] rounded-sm gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B68B35]"></span>
                        <span className="font-semibold text-[#141311] uppercase tracking-wider text-[11px]">{ev.status.replace('_', ' ')}:</span>
                        <span className="text-[#57544E]">{ev.note}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8A857D]">
                        {new Date(ev.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Authenticity Certificate Note */}
          <div className="p-4 bg-[#FAF5E9] border border-[#E8E5DC] rounded-sm flex items-start gap-3 text-xs text-[#57544E]">
            <ShieldCheck className="w-5 h-5 text-[#B68B35] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#141311]">Archival Care & Inspection:</strong> All consignments are sealed with tamper-evident security tape and contain an official wax-sealed Certificate of Authenticity signed by Dhirendra. For white-glove uncrating assistance, please contact the studio curatorial team.
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
