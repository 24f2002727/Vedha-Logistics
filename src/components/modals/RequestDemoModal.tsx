import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Mail, User, ArrowRight } from 'lucide-react';

interface RequestDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestDemoModal: React.FC<RequestDemoModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    annualVolume: '1,500,000 MT/Year',
    targetPorts: 'Paradip, Dhamra & Haldia'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer text-xs font-bold"
        >
          ✕
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-wider text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Enterprise Platform Access</span>
            </div>

            <h3 className="text-2xl font-display font-extrabold text-slate-900">
              Request Enterprise Access
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6 leading-relaxed">
              Discover how to transition from spot volatility to structured COA contracts.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Logistics Director / Chartering Head"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Business Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@steel-minerals.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Annual Volume</label>
                  <input
                    type="text"
                    value={formData.annualVolume}
                    onChange={(e) => setFormData({ ...formData, annualVolume: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:border-orange-500 focus:bg-white focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discharge Ports</label>
                  <input
                    type="text"
                    value={formData.targetPorts}
                    onChange={(e) => setFormData({ ...formData, targetPorts: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:border-orange-500 focus:bg-white focus:outline-none text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-display font-bold text-slate-900">
              Request Received!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{formData.name || 'Partner'}</strong>. Our team will contact you at <strong className="text-orange-600">{formData.email}</strong> within 4 hours.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
