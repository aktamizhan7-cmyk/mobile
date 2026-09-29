import React from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
  FileSpreadsheet,
  BookmarkPlus,
  Info,
} from 'lucide-react';
import {
  SajaseRecommendationResponse,
  SajaseRecommendationItem,
  PhoneConfiguration,
} from '../../types/phone';
import { formatINR } from '../../utils/formatters';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { useUserAccount } from '../../context/UserAccountContext';

interface SajaseResultsProps {
  data: SajaseRecommendationResponse;
  onSelectAndBuild: (config: PhoneConfiguration) => void;
  onRequestQuote: (config: PhoneConfiguration) => void;
  onClose: () => void;
}

export const SajaseResults: React.FC<SajaseResultsProps> = ({
  data,
  onSelectAndBuild,
  onRequestQuote,
  onClose,
}) => {
  const { loadConfiguration } = usePhoneBuilder();
  const { saveCurrentConfiguration } = useUserAccount();

  const { bestMatch, balanced, value } = data.recommendations;

  const handleApplyConfig = (item: SajaseRecommendationItem) => {
    loadConfiguration(item.config, data.budgetINR);
    onSelectAndBuild(item.config);
  };

  const handleSave = (item: SajaseRecommendationItem) => {
    saveCurrentConfiguration(item.title, item.config);
    alert(`Saved "${item.title}" to your Saved Phones!`);
  };

  const renderCard = (
    item: SajaseRecommendationItem,
    themeColor: 'cyan' | 'blue' | 'emerald',
    badgeText: string,
    isPopular?: boolean
  ) => {
    const isCyan = themeColor === 'cyan';
    const isEmerald = themeColor === 'emerald';

    return (
      <div
        className={`relative flex flex-col justify-between rounded-2xl p-5 md:p-6 transition-all ${
          isPopular
            ? 'bg-zinc-900 border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
            : 'bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700'
        }`}
      >
        {isPopular && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
            <span>Recommended Match</span>
          </div>
        )}

        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                isCyan
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  : isEmerald
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-blue-950 text-blue-400 border border-blue-800'
              }`}
            >
              {badgeText}
            </span>
            {item.savingsOrDeltaINR ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded">
                <TrendingDown className="w-3 h-3" />
                Saves {formatINR(item.savingsOrDeltaINR)}
              </span>
            ) : null}
          </div>

          <h3 className="text-lg font-bold text-zinc-100">{item.title}</h3>
          <p className="text-xs text-zinc-400 mb-4">{item.subtitle}</p>

          {/* Estimated Price Tag */}
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 mb-4 flex items-baseline justify-between">
            <span className="text-xs text-zinc-400">Estimated Price:</span>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-cyan-300">
                {formatINR(item.estimatedPriceINR)}
              </span>
              <div className="text-[10px] text-zinc-500 font-mono">
                {item.estimatedPriceINR <= data.budgetINR ? (
                  <span className="text-emerald-400">Within Budget</span>
                ) : (
                  <span className="text-amber-400">
                    +{formatINR(item.estimatedPriceINR - data.budgetINR)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key Specs Highlights */}
          <div className="space-y-1.5 mb-4">
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              Selected Hardware:
            </div>
            {item.keyHighlights.map((hl, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{hl}</span>
              </div>
            ))}
          </div>

          {/* Why this configuration? */}
          <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/80 mb-5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Why This Configuration?</span>
            </div>
            <ul className="space-y-1 text-xs text-zinc-300">
              {item.reasoning.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card Actions */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <button
            onClick={() => handleApplyConfig(item)}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              isPopular
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md'
                : 'bg-zinc-800 hover:bg-zinc-700 text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Customize in Builder</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onRequestQuote(item.config)}
              className="py-1.5 px-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quote</span>
            </button>
            <button
              onClick={() => handleSave(item)}
              className="py-1.5 px-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-center gap-1.5"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-zinc-400" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              SAJASE Intelligence Engine
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-zinc-100">
            Smart Recommendations for {formatINR(data.budgetINR)}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {data.overallExplanation}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 font-mono">PRIORITIES</div>
            <div className="text-xs font-semibold text-zinc-200">
              {data.priorities.join(' • ') || 'General Performance'}
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Cards: Best Match, Balanced, Value */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {renderCard(bestMatch, 'cyan', 'Best Match', true)}
        {renderCard(balanced, 'blue', 'Balanced All-Rounder', false)}
        {renderCard(value, 'emerald', 'Value Champion', false)}
      </div>

      {/* Bottom Note */}
      <div className="text-center text-xs text-zinc-500 font-mono">
        💡 None of these configurations are rigid. Tap &quot;Customize in Builder&quot; on any option to adjust components, swap colors, or inspect compatibility warnings.
      </div>
    </div>
  );
};
