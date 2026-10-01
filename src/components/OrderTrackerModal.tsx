import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Sparkles,
  RotateCw,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderTrackerModal: React.FC = () => {
  const { 
    isTrackOrderOpen, 
    setIsTrackOrderOpen, 
    trackOrderId, 
    setTrackOrderId,
    getOrderById,
    orders 
  } = useShop();

  const [inputQuery, setInputQuery] = useState(trackOrderId || 'KA-84920');
  const [searchedOrder, setSearchedOrder] = useState(() => getOrderById(trackOrderId || 'KA-84920') || orders[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isTrackOrderOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const found = getOrderById(inputQuery);
    if (found) {
      setSearchedOrder(found);
      setTrackOrderId(found.id);
    } else {
      setErrorMessage(`No active parcel found matching "${inputQuery}". Try checking the order number sent via SMS (e.g. KA-84920).`);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsTrackOrderOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-800" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-rose-800 font-semibold block">
                Live Courier Radar
              </span>
              <h3 className="font-serif text-lg font-medium text-stone-900">
                Real-Time Order Tracking
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsTrackOrderOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Search Lookup Bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-medium text-stone-700">
              Enter Order ID (e.g. KA-84920) or Customer Phone:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="e.g. KA-84920 or 0302-8472910"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Track
              </button>
            </div>

            {/* Quick Demo Order Link */}
            <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
              <span>Try test orders:</span>
              {orders.map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => {
                    setInputQuery(o.id);
                    setSearchedOrder(o);
                    setTrackOrderId(o.id);
                    setErrorMessage('');
                  }}
                  className="font-mono text-rose-700 hover:underline font-semibold"
                >
                  {o.id}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          {/* Searched Order Details */}
          {searchedOrder && (
            <div className="space-y-6 pt-2">
              
              {/* Order Overview Header Card */}
              <div className="bg-[#FAF9F6] border border-stone-200 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                      Order Reference
                    </span>
                    <h4 className="font-mono text-lg font-bold text-stone-900">
                      {searchedOrder.id}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRefresh}
                      className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors"
                      title="Refresh live status"
                    >
                      <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-700' : ''}`} />
                    </button>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      searchedOrder.orderStatus === 'out_for_delivery'
                        ? 'bg-amber-100 text-amber-900'
                        : searchedOrder.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-rose-100 text-rose-900'
                    }`}>
                      {searchedOrder.orderStatus === 'out_for_delivery' 
                        ? '⚡ Out for Delivery' 
                        : searchedOrder.orderStatus === 'placed'
                        ? '📦 Preparing Shipment'
                        : 'Shipped'}
                    </span>
                  </div>
                </div>

                {/* Logistics Key-Values */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Courier Partner</span>
                    <span className="font-medium text-stone-800">{searchedOrder.courierName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Waybill / Tracking</span>
                    <span className="font-mono font-medium text-stone-800">{searchedOrder.trackingNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Destination</span>
                    <span className="font-medium text-stone-800">{searchedOrder.city}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Estimated Arrival</span>
                    <span className="font-medium text-emerald-800">{searchedOrder.estimatedDelivery}</span>
                  </div>
                </div>

                {/* Customer recipient callout */}
                <div className="pt-2 text-xs text-stone-600 flex items-start gap-2 border-t border-stone-200/60">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>
                    Delivering to <strong>{searchedOrder.customerName}</strong>: {searchedOrder.address}
                  </span>
                </div>
              </div>

              {/* Visual Vertical Timeline */}
              <div className="space-y-4">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Live Dispatch Milestone Log
                </h5>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {searchedOrder.timeline.map((event, idx) => {
                    return (
                      <div key={idx} className="relative group">
                        {/* Milestone dot */}
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                          event.completed 
                            ? 'bg-emerald-600 text-white' 
                            : event.current
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-stone-200 text-stone-400'
                        }`}>
                          {event.completed ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                        </div>

                        {/* Event text */}
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${
                              event.completed || event.current ? 'text-stone-900' : 'text-stone-400'
                            }`}>
                              {event.label}
                            </span>
                            <span className="text-[11px] font-mono text-stone-400">
                              {event.timestamp}
                            </span>
                          </div>
                          <p className={`text-xs ${
                            event.current ? 'text-amber-900 font-medium' : 'text-stone-500'
                          }`}>
                            {event.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items included in this parcel */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Parcel Contents ({searchedOrder.items.length} items)
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {searchedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2 bg-stone-50 rounded-lg border border-stone-200/60 text-xs">
                      <img 
                        src={item.product.images[0]} 
                        alt="" 
                        className="w-9 h-9 object-cover rounded shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-stone-900 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-stone-500">
                          {item.selectedColor} · Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-stone-600">
                  <span>Payable at Delivery ({searchedOrder.paymentMethod.toUpperCase()})</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    Rs. {searchedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Rider / Support Assistance */}
              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl flex items-center justify-between text-xs text-rose-900">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-rose-700" />
                  <span>Need urgent delivery rescheduling?</span>
                </div>
                <a 
                  href="https://wa.me/923001234567" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-semibold underline hover:text-rose-950"
                >
                  WhatsApp Care
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
