import React from 'react';
import { ArrowLeftRight, Download, CheckCircle2 } from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TX-901', folio: 'GH-89214', guest: 'Alexander Hayes', room: '301', description: 'Room Rate (5 Nights)', category: 'Room Revenue', amount: 3250.00, method: 'Visa •••• 9102', time: '11:30 AM', status: 'Settled' },
  { id: 'TX-902', folio: 'GH-89214', guest: 'Alexander Hayes', room: '301', description: 'Ayurvedic Spa Package', category: 'Spa & Wellness', amount: 450.00, method: 'Room Charge', time: '10:15 AM', status: 'Settled' },
  { id: 'TX-903', folio: 'GH-89252', guest: 'Sir Arthur Stirling', room: '303', description: 'Helipad Transfer & Champagne', category: 'Concierge', amount: 1800.00, method: 'Amex •••• 0045', time: '09:40 AM', status: 'Settled' },
  { id: 'TX-904', folio: 'GH-89221', guest: 'Sophia Loren', room: '104', description: 'Horizon Rooftop Dining', category: 'F&B', amount: 185.50, method: 'Mastercard •••• 3341', time: '08:20 AM', status: 'Settled' },
  { id: 'TX-905', folio: 'GH-89244', guest: 'Claire Bennett', room: '304', description: 'Advance Deposit 50%', category: 'Deposit', amount: 1050.00, method: 'Visa •••• 7712', time: '07:50 AM', status: 'Pending Auth' },
];

export const TransactionsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Financial Transactions</h2>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">
            Real-time payment gateway postings, room charges, and merchant transactions.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-semibold border border-zinc-200 shadow-2xs transition-colors">
            <Download className="w-3.5 h-3.5 text-zinc-500" /> Export Statement
          </button>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[#05C168]" />
            <h3 className="text-sm font-bold text-zinc-900">Merchant & Folio Postings</h3>
          </div>
          <span className="text-xs font-semibold text-[#05C168]">Total today: $6,735.50</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-[#FAFBFD] text-zinc-400 border-b border-zinc-100 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-5">TX ID</th>
                <th className="py-3.5 px-5">Guest & Room</th>
                <th className="py-3.5 px-5">Description</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Payment Method</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-4 px-5 font-mono text-zinc-400 font-semibold">{tx.id}</td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-zinc-900">{tx.guest}</div>
                    <div className="text-[11px] text-zinc-400 font-medium">Room #{tx.room}</div>
                  </td>
                  <td className="py-4 px-5 font-semibold text-zinc-800">{tx.description}</td>
                  <td className="py-4 px-5 text-zinc-500">{tx.category}</td>
                  <td className="py-4 px-5 text-zinc-600 font-medium">{tx.method}</td>
                  <td className="py-4 px-5 font-bold text-zinc-900">${tx.amount.toFixed(2)}</td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-[#05C168]">
                      <CheckCircle2 className="w-3 h-3" />
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
