import React from 'react';
import { X, Package, MapPin, CreditCard, User, Hash } from 'lucide-react';
import type { IOrder } from '../../../store/adminOrderSlice';

const BASE_URL = 'http://localhost:3000';

interface Props { order: IOrder; onClose: () => void; }

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className='flex flex-col gap-0.5'>
    <span className='text-[10px] font-semibold text-gray-500 uppercase tracking-widest'>{label}</span>
    <span className='text-sm text-gray-200'>{value}</span>
  </div>
);

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className='flex items-center gap-2 mb-3'>
    <span className='text-amber-500'>{icon}</span>
    <h4 className='text-xs font-bold text-gray-300 uppercase tracking-widest'>{title}</h4>
  </div>
);

const psc = (s?: string) => s === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-yellow-500/15 text-yellow-400';
const osc = (s: string) => ({Delivered:'bg-emerald-500/15 text-emerald-400',Cancelled:'bg-red-500/15 text-red-400',Pending:'bg-yellow-500/15 text-yellow-400',Preparation:'bg-blue-500/15 text-blue-400',Ontheway:'bg-violet-500/15 text-violet-400'}[s] ?? 'bg-gray-500/15 text-gray-400');

const OrderDetailsModal: React.FC<Props> = ({ order, onClose }) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm' onClick={onClose}>
    <div className='bg-gray-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl' onClick={(e) => e.stopPropagation()}>
      <div className='flex items-center justify-between px-6 py-4 border-b border-white/[0.08] shrink-0'>
        <div>
          <h3 className='text-lg font-extrabold text-gray-100'>Order <span className='text-amber-500'>#{order.id.slice(-8).toUpperCase()}</span></h3>
          <p className='text-xs text-gray-500 mt-0.5'>Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <button onClick={onClose} className='w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 cursor-pointer border-none'><X size={18} /></button>
      </div>
      <div className='overflow-y-auto flex-1 px-6 py-5 space-y-6'>
        <div className='flex flex-wrap gap-2'>
          <span className={'text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ' + osc(order.orderStatus)}>{order.orderStatus}</span>
          <span className={'text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ' + psc(order.Payment?.paymentstatus)}>{order.Payment?.paymentstatus || 'Unpaid'}</span>
          <span className='text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-white/5 text-gray-400'>{order.Payment?.paymentMethod || 'COD'}</span>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='bg-gray-800/60 rounded-2xl border border-white/[0.07] p-4'>
            <SectionTitle icon={<User size={14} />} title='Customer' />
            <div className='space-y-3'>
              <InfoRow label='Full Name' value={order.firstName + ' ' + order.lastName} />
              <InfoRow label='Email' value={order.email} />
              <InfoRow label='Phone' value={order.phoneNumber} />
            </div>
          </div>
          <div className='bg-gray-800/60 rounded-2xl border border-white/[0.07] p-4'>
            <SectionTitle icon={<MapPin size={14} />} title='Shipping Details' />
            <div className='space-y-3'>
              <InfoRow label='Address' value={order.addressline} />
              <InfoRow label='City / State' value={order.city + ', ' + order.state} />
              <InfoRow label='ZIP Code' value={order.zipCode} />
            </div>
          </div>
          <div className='bg-gray-800/60 rounded-2xl border border-white/[0.07] p-4'>
            <SectionTitle icon={<Hash size={14} />} title='Order Info' />
            <div className='space-y-3'>
              <InfoRow label='Order ID' value={<span className='font-mono text-xs break-all'>{order.id}</span>} />
              <InfoRow label='Date Placed' value={new Date(order.createdAt).toLocaleString()} />
            </div>
          </div>
          <div className='bg-gray-800/60 rounded-2xl border border-white/[0.07] p-4'>
            <SectionTitle icon={<CreditCard size={14} />} title='Payment' />
            <div className='space-y-3'>
              <InfoRow label='Method' value={order.Payment?.paymentMethod || 'COD'} />
              <InfoRow label='Status' value={<span className={'text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ' + psc(order.Payment?.paymentstatus)}>{order.Payment?.paymentstatus || 'Unpaid'}</span>} />
            </div>
          </div>
        </div>
        <div className='bg-gray-800/60 rounded-2xl border border-white/[0.07] p-4'>
          <SectionTitle icon={<Package size={14} />} title='Items Ordered' />
          {!order.OrderDetail || order.OrderDetail.length === 0 ? (
            <p className='text-sm text-gray-500 italic'>No item details available.</p>
          ) : (
            <div className='space-y-3'>
              {order.OrderDetail.map((detail) => {
                const price = detail.Product?.productPrice || 0;
                const lineTotal = price * detail.quantity;
                const imgUrl = detail.Product?.productImageUrl ? BASE_URL + '/uploads/' + detail.Product.productImageUrl : null;
                return (
                  <div key={detail.id} className='flex items-center gap-3 bg-gray-900/50 rounded-xl border border-white/5 p-3'>
                    <div className='w-14 h-14 rounded-lg overflow-hidden bg-gray-700 shrink-0 flex items-center justify-center'>
                      {imgUrl ? <img src={imgUrl} alt={detail.Product?.productName} className='w-full h-full object-cover' /> : <Package size={22} className='text-gray-500' />}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-gray-100 text-sm truncate'>{detail.Product?.productName || 'Unknown Product'}</p>
                      <p className='text-[11px] text-gray-400 mt-0.5'>Qty: {detail.quantity} x Rs. {price.toLocaleString()}</p>
                    </div>
                    <p className='text-amber-400 font-bold text-sm shrink-0'>Rs. {lineTotal.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          )}
          <div className='mt-4 pt-4 border-t border-white/[0.07] flex justify-between items-center'>
            <span className='text-sm text-gray-400 font-semibold'>Total Amount</span>
            <span className='text-lg font-extrabold text-white'>Rs. {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className='px-6 py-4 border-t border-white/[0.08] shrink-0 flex justify-end'>
        <button onClick={onClose} className='inline-flex items-center justify-center font-bold rounded-xl cursor-pointer text-sm px-5 py-2.5 bg-white/5 text-gray-100 border border-white/10 hover:bg-white/10'>Close</button>
      </div>
    </div>
  </div>
);

export default OrderDetailsModal;