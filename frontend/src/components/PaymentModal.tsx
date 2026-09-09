import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Smartphone, 
  Landmark, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Receipt
} from 'lucide-react';
import { LoanApplication } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  application: LoanApplication | null;
  onClose: () => void;
  onPaymentSuccess: (appId: string, txId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  application,
  onClose,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  if (!isOpen || !application) return null;

  const feeAmount = 500; // ₹500 Government Stamp Duty / Processing fee

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const hash = `UPI-TXN-${Date.now().toString().slice(-8)}`;
      setTxHash(hash);
      setIsSuccess(true);

      setTimeout(() => {
        onPaymentSuccess(application.id, hash);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="payment-modal"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <CreditCard className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Government Duty & Processing Fee</h3>
              <p className="text-[11px] text-blue-100 flex items-center gap-1 font-mono">
                Ref: {application.trackingId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Payment Completed Successfully!
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                Transaction ID: {txHash}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Stamp duty receipt generated and attached to loan file.
              </p>
            </div>
          ) : (
            <>
              {/* Fee Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>State E-Stamp Duty:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹400.00</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Digital Signature Verification:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹100.00</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total Amount Payable:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">₹{feeAmount}.00</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Payment Method:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('upi')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      method === 'upi'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 font-bold text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-xs">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      method === 'card'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 font-bold text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                    <span className="text-xs">RuPay / Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('netbanking')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      method === 'netbanking'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 font-bold text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Landmark className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span className="text-xs">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* QR Code Demo */}
              {method === 'upi' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Scan with BHIM, PhonePe, Google Pay, or Paytm
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <button
                id="execute-payment-btn"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{feeAmount} & Complete Sanction</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
