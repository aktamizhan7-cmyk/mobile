import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { SajaseChat } from './SajaseChat';
import { PhoneConfiguration } from '../../types/phone';

interface SajaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndBuild: (config: PhoneConfiguration) => void;
  onRequestQuote: (config: PhoneConfiguration) => void;
}

export const SajaseModal: React.FC<SajaseModalProps> = ({
  isOpen,
  onClose,
  onSelectAndBuild,
  onRequestQuote,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-mono">
              SAJASE AI ARCHITECT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <SajaseChat
            onSelectAndBuild={(cfg) => {
              onSelectAndBuild(cfg);
              onClose();
            }}
            onRequestQuote={(cfg) => {
              onRequestQuote(cfg);
              onClose();
            }}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
