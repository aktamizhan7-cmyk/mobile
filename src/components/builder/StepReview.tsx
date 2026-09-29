import React, { useState } from 'react';
import {
  CheckCircle2,
  BookmarkPlus,
  Share2,
  Columns,
  FileSpreadsheet,
  Edit3,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { useUserAccount } from '../../context/UserAccountContext';
import { formatINR, formatUSD } from '../../utils/formatters';

interface StepReviewProps {
  onOpenQuote: () => void;
  onOpenShare: () => void;
  onOpenCompare: () => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  onOpenQuote,
  onOpenShare,
  onOpenCompare,
}) => {
  const { config, priceBreakdown, scores, setActiveStep, updateComponent } = usePhoneBuilder();
  const { saveCurrentConfiguration, addToCompare } = useUserAccount();

  const [phoneName, setPhoneName] = useState<string>(config.name || 'CUSTOM X1');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [compareSuccess, setCompareSuccess] = useState<boolean>(false);

  const handleSaveName = () => {
    updateComponent('design', {
      ...config.design,
    });
    config.name = phoneName;
    setIsEditingName(false);
  };

  const handleSave = () => {
    saveCurrentConfiguration(phoneName, config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCompare = () => {
    const added = addToCompare(config);
    if (added) {
      setCompareSuccess(true);
      setTimeout(() => setCompareSuccess(false), 2000);
    } else {
      onOpenCompare();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Editable Phone Name */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
            Configuration Complete
          </span>
          <div className="flex items-center gap-2 mt-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={phoneName}
                  onChange={(e) => setPhoneName(e.target.value)}
                  className="px-3 py-1 rounded-lg bg-zinc-900 border border-cyan-400 text-lg font-bold text-white font-mono focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1 rounded-lg bg-cyan-500 text-black text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {phoneName}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  title="Rename Phone"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="text-xs text-zinc-400 mt-0.5">
            Architecture Version {config.version || '1.0'} • Created {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Estimated Price Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-4 text-right">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block">
            Estimated Selling Price
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
            {formatINR(priceBreakdown.totalEstimatedPriceINR)}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            ≈ {formatUSD(priceBreakdown.totalEstimatedPriceUSD)} (Provisional BOM)
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Processor</span>
          <div className="text-sm font-bold text-zinc-100">{config.processor?.name}</div>
          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
            {config.processor?.cores}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Display</span>
          <div className="text-sm font-bold text-zinc-100">
            {config.display?.size} {config.display?.type}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
            {config.display?.resolution} • {config.display?.refreshRate}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">RAM &amp; Storage</span>
          <div className="text-sm font-bold text-zinc-100">
            {config.ram?.capacity} RAM + {config.storage?.capacity} Storage
          </div>
          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
            {config.ram?.type} • {config.storage?.type}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Camera Array</span>
          <div className="text-sm font-bold text-zinc-100">{config.camera?.name}</div>
          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
            Front: {config.camera?.frontMP}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Battery &amp; Charging</span>
          <div className="text-sm font-bold text-zinc-100">
            {config.battery?.capacity} + {config.charging?.wattage} Flash
          </div>
          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
            {config.battery?.tech}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Chassis &amp; Materials</span>
          <div className="text-sm font-bold text-zinc-100">
            {config.design?.colorName} ({config.design?.cameraModuleLayout})
          </div>
          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
            {config.design?.frameMaterial}
          </div>
        </div>
      </div>

      {/* Category Scores Radar Breakdown */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold">
              Hardware Category Rating Index
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Estimated scores based on BOM specs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Performance', val: scores.performance },
            { label: 'Gaming', val: scores.gaming },
            { label: 'Camera', val: scores.camera },
            { label: 'Battery', val: scores.battery },
            { label: 'Display', val: scores.display },
            { label: 'Value Index', val: scores.value },
          ].map((item) => (
            <div key={item.label} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
              <span className="text-[10px] font-mono text-zinc-400 block">{item.label}</span>
              <span className="text-lg font-bold font-mono text-cyan-300 block my-0.5">
                {item.val}
              </span>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step / Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveStep(0)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>EDIT HARDWARE</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>{saveSuccess ? 'SAVED TO ACCOUNT!' : 'SAVE PHONE'}</span>
          </button>

          <button
            onClick={handleCompare}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Columns className="w-3.5 h-3.5 text-blue-400" />
            <span>{compareSuccess ? 'ADDED TO COMPARE!' : 'COMPARE'}</span>
          </button>

          <button
            onClick={onOpenShare}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>SHARE</span>
          </button>
        </div>

        <button
          onClick={onOpenQuote}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-black" />
          <span>REQUEST MANUFACTURING QUOTATION</span>
        </button>
      </div>
    </div>
  );
};
