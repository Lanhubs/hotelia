import React, { useState } from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface ForgotCredentialsModalProps {
  isOpen: boolean;
  defaultEmail: string;
  onClose: () => void;
}

export const ForgotCredentialsModal: React.FC<ForgotCredentialsModalProps> = ({
  isOpen,
  defaultEmail,
  onClose,
}) => {
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Reset Staff Credentials</h3>
            <p className="text-xs text-zinc-500 font-medium">Send emergency PIN unlock code to your email</p>
          </div>
        </div>

        {resetSent ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Temporary PIN Sent!</span>
            </div>
            <p className="text-emerald-800">
              A 4-digit temporary passcode (<strong className="text-emerald-950 font-mono">1234</strong>) has been dispatched to your management address.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                setResetSent(false);
              }}
              className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer transition-colors"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 font-normal leading-relaxed">
              Enter your registered staff email or employee badge ID to receive an instant authentication unlock token.
            </p>
            <input
              type="email"
              value={resetEmail || defaultEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="name@keoexperience.com"
              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-900 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setResetSent(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                Send Recovery Token
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
