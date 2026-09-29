import React, { useState } from 'react';
import { X, Share2, Copy, Check, QrCode, Smartphone } from 'lucide-react';
import { PhoneConfiguration } from '../../types/phone';
import { formatINR } from '../../utils/formatters';
import { calculatePriceBreakdown } from '../../utils/pricingEngine';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PhoneConfiguration;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, config }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const shareCode = `CP-${Math.abs(config.name.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(36).toUpperCase().slice(0, 8)}`;
  const shareUrl = `${window.location.origin}/#custom-phone-${shareCode}`;
  const price = calculatePriceBreakdown(config).totalEstimatedPriceINR;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-mono">
              SHARE PHONE SPECIFICATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Phone Mini Card Preview */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
            <div
              className="w-14 h-20 rounded-xl border-2 border-zinc-700 shadow-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: config.design?.hexColor || '#18181b' }}
            >
              <Smartphone className="w-6 h-6 text-white/70" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Hardware Spec ID: {shareCode}
              </span>
              <h3 className="text-base font-bold text-white font-mono">{config.name}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {config.processor?.name} • {config.ram?.capacity} • {config.storage?.capacity}
              </p>
              <div className="text-sm font-bold font-mono text-cyan-300 mt-1">
                {formatINR(price)}
              </div>
            </div>
          </div>

          {/* Share Link Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
              Direct Configuration Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Visual */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center flex flex-col items-center justify-center">
            <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
              <QrCode className="w-24 h-24 text-black" />
            </div>
            <span className="text-[11px] font-mono text-zinc-400 mt-2">
              Scan with camera to view live 3D phone model on mobile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
