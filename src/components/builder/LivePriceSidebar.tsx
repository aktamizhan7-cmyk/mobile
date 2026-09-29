import React, { useState } from 'react';
import {
  DollarSign,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  BookmarkPlus,
  Share2,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { useUserAccount } from '../../context/UserAccountContext';
import { formatINR, formatUSD } from '../../utils/formatters';

interface LivePriceSidebarProps {
  onOpenQuote: () => void;
  onOpenShare: () => void;
}

export const LivePriceSidebar: React.FC<LivePriceSidebarProps> = ({
  onOpenQuote,
  onOpenShare,
}) => {
  const { config, priceBreakdown, scores, isOverBudget, userBudgetINR, optimizeToBudget } =
    usePhoneBuilder();
  const { saveCurrentConfiguration } = useUserAccount();

  const [isBOMOpen, setIsBOMOpen] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = () => {
    saveCurrentConfiguration(config.name || 'Custom Phone', config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
      <div>
        {/* Header Price display */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3 mb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Estimated Total Price
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-0.5">
              {formatINR(priceBreakdown.totalEstimatedPriceINR)}
            </div>
            <div className="text-xs text-zinc-400 font-mono mt-0.5">
              ≈ {formatUSD(priceBreakdown.totalEstimatedPriceUSD)} (USD)
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">
              Target Budget
            </span>
            <span className="text-xs font-mono font-semibold text-zinc-300">
              {formatINR(userBudgetINR)}
            </span>
            {isOverBudget ? (
              <div className="text-[10px] text-amber-400 font-mono font-bold mt-1">
                Over Budget
              </div>
            ) : (
              <div className="text-[10px] text-emerald-400 font-mono font-bold mt-1">
                Within Budget
              </div>
            )}
          </div>
        </div>

        {/* Demo Estimate Disclaimer */}
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-tight flex items-start gap-2 mb-4">
          <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <span>
            <strong>Demo Estimate:</strong> Component prices represent provisional ODM bill-of-materials estimates. Final quotation subject to batch quantities.
          </span>
        </div>

        {/* Category Scores Mini Bar */}
        <div className="space-y-1.5 mb-4 pb-3 border-b border-zinc-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Overall Build Score:</span>
            <span className="text-cyan-400 font-bold">{scores.overallScore}/100</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${scores.overallScore}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
            <div className="bg-zinc-950 p-1 rounded border border-zinc-800">
              <span className="text-zinc-500 block">Gaming</span>
              <span className="text-zinc-200 font-bold">{scores.gaming}/100</span>
            </div>
            <div className="bg-zinc-950 p-1 rounded border border-zinc-800">
              <span className="text-zinc-500 block">Camera</span>
              <span className="text-zinc-200 font-bold">{scores.camera}/100</span>
            </div>
            <div className="bg-zinc-950 p-1 rounded border border-zinc-800">
              <span className="text-zinc-500 block">Battery</span>
              <span className="text-zinc-200 font-bold">{scores.battery}/100</span>
            </div>
          </div>
        </div>

        {/* Collapsible Detailed BOM Breakdown */}
        <div className="mb-4">
          <button
            onClick={() => setIsBOMOpen(!isBOMOpen)}
            className="w-full flex items-center justify-between text-xs font-mono font-semibold text-zinc-300 hover:text-white py-1 transition-colors"
          >
            <span>Bill of Materials (BOM) Breakdown</span>
            {isBOMOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isBOMOpen && (
            <div className="space-y-1.5 pt-2 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Processor ({config.processor?.name.slice(0, 16)}...)</span>
                <span className="text-zinc-200">{formatINR(config.processor?.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Display ({config.display?.type})</span>
                <span className="text-zinc-200">{formatINR(config.display?.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>RAM ({config.ram?.capacity})</span>
                <span className="text-zinc-200">{formatINR(config.ram?.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Storage ({config.storage?.capacity})</span>
                <span className="text-zinc-200">{formatINR(config.storage?.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Camera Module</span>
                <span className="text-zinc-200">{formatINR(config.camera?.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Battery &amp; Thermal</span>
                <span className="text-zinc-200">
                  {formatINR((config.battery?.price || 0) + (config.cooling?.price || 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Chassis &amp; Materials</span>
                <span className="text-zinc-200">{formatINR(config.design?.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Charging &amp; Audio</span>
                <span className="text-zinc-200">
                  {formatINR((config.charging?.price || 0) + (config.audioHaptics?.price || 0))}
                </span>
              </div>

              <div className="border-t border-zinc-800 pt-1.5 flex justify-between font-semibold text-zinc-300">
                <span>Component Subtotal (BOM):</span>
                <span>{formatINR(priceBreakdown.bomSubtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>SMT Line Assembly &amp; RF:</span>
                <span>{formatINR(priceBreakdown.assemblyFee + priceBreakdown.testingAndRfFee)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Packaging &amp; Logistics:</span>
                <span>{formatINR(priceBreakdown.packagingAndAccessories + priceBreakdown.logisticsInsurance)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Warranty &amp; Margin:</span>
                <span>{formatINR(priceBreakdown.warrantyReserve + priceBreakdown.businessMargin)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Applicable Taxes (GST 18%):</span>
                <span>{formatINR(priceBreakdown.taxesGST)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-3 border-t border-zinc-800">
        {isOverBudget && (
          <button
            onClick={optimizeToBudget}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Optimize to ₹{userBudgetINR.toLocaleString('en-IN')}</span>
          </button>
        )}

        <button
          onClick={onOpenQuote}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-black" />
          <span>REQUEST FORMAL QUOTATION</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSave}
            className="py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>{saveSuccess ? 'Saved!' : 'Save Phone'}</span>
          </button>
          <button
            onClick={onOpenShare}
            className="py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Share Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
