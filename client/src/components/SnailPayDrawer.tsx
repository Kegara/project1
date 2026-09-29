import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

export const SnailPayDrawer: React.FC = () => {
  const { isSnailPayOpen, setIsSnailPayOpen, user, deposit } = useAuth();
  const { showAlert } = useAlert();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [fullName, setFullName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [amount, setAmount] = useState('50');

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isSnailPayOpen || !user) return null;

  const quickAmounts = [10, 25, 50, 100, 250];

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow integer digits
    const val = e.target.value.replace(/\D/g, '');
    setAmount(val);
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseInt(amount, 10);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      showAlert('error', 'Please enter a valid amount greater than $0 USD. Only whole numbers are accepted.');
      return;
    }

    if (numericAmount > 999) {
      showAlert('warning', 'The maximum top-up amount per transaction is $999 USD. Please enter a lower amount.');
      return;
    }

    if (!Number.isInteger(numericAmount)) {
      showAlert('error', 'Only whole dollar amounts are allowed (no decimals). For example: $50, $100, $500.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      showAlert('error', 'Card number must be exactly 16 digits. Please check and try again.');
      return;
    }

    if (!expiry || expiry.length < 5) {
      showAlert('error', 'Please enter a valid expiration date in MM/YY format.');
      return;
    }

    if (!cvv || cvv.length < 3) {
      showAlert('error', 'CVV must be exactly 3 digits. Please check the back of your card.');
      return;
    }

    if (!fullName.trim()) {
      showAlert('error', 'Full name is required. Enter the name exactly as it appears on the card.');
      return;
    }

    setIsProcessing(true);

    // 3-second processing delay
    setTimeout(async () => {
      const result = await deposit({
        cardNumber,
        expiry,
        cvv,
        fullName: fullName.trim(),
        amount: numericAmount,
      });

      setIsProcessing(false);

      if (result.success) {
        showAlert('success', result.message);
        // Reset form
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setAmount('50');
      } else {
        showAlert('error', result.message);
      }
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Backdrop trigger close */}
      <div className="absolute inset-0" onClick={() => setIsSnailPayOpen(false)} />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-y-auto border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-black shadow-md shadow-emerald-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                SnailPay Payment Gateway
              </h2>
              <p className="text-xs text-slate-500 font-medium">Top up your account balance</p>
            </div>
          </div>

          <button
            onClick={() => setIsSnailPayOpen(false)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">

          {/* Current Balance Display */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Balance</span>
              <div className="text-2xl font-black font-mono text-emerald-600 mt-0.5">
                ${user.balance.toFixed(2)} USD
              </div>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p className="font-bold">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleTransaction} className="space-y-4">
            
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100">
              Credit Card Payment Information
            </div>

            {/* 1. Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name (as it appears on the card)</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full clean-input rounded-xl py-2.5 px-3.5 text-xs font-medium focus:outline-none"
                required
              />
            </div>

            {/* 2. Card Number */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4532 1234 5678 9010"
                  className="w-full clean-input rounded-xl py-2.5 px-3.5 text-xs font-mono font-medium focus:outline-none"
                  required
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. Expiration Date & CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Expiration Date</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full clean-input rounded-xl py-2.5 px-3.5 text-xs font-mono font-medium text-center focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">CVV</label>
                <input
                  type="password"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  className="w-full clean-input rounded-xl py-2.5 px-3.5 text-xs font-mono font-medium text-center focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* 4. Top-Up Amount */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-2">Top-Up Amount ($ USD) — Max $999, whole numbers only:</label>
              
              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q.toString())}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                      amount === q.toString()
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    +${q}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold font-mono text-emerald-600">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Amount"
                  className="w-full clean-input rounded-xl py-2.5 pl-8 pr-4 font-mono font-bold text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing payment…</span>
                </>
              ) : (
                <span>Top Up ${parseInt(amount || '0', 10) || 0} USD</span>
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};
