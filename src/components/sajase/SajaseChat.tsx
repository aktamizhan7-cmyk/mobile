import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Gamepad2,
  Camera,
  Film,
  Share2,
  Briefcase,
  BatteryCharging,
  Smartphone,
  RotateCcw,
} from 'lucide-react';
import {
  UsageOption,
  PriorityOption,
  SajaseRecommendationResponse,
  PhoneConfiguration,
} from '../../types/phone';
import { requestSajaseRecommendations } from '../../services/sajaseService';
import { SajaseResults } from './SajaseResults';

const USAGE_OPTIONS: { label: UsageOption; icon: any }[] = [
  { label: 'Gaming', icon: Gamepad2 },
  { label: 'Camera', icon: Camera },
  { label: 'Video editing', icon: Film },
  { label: 'Social media', icon: Share2 },
  { label: 'Work', icon: Briefcase },
  { label: 'Battery', icon: BatteryCharging },
  { label: 'Everyday use', icon: Smartphone },
];

const PRIORITY_OPTIONS: PriorityOption[] = [
  'Performance',
  'Gaming',
  'Camera',
  'Battery',
  'Display',
  'Storage',
  'Design',
  'Charging',
  'Speakers',
];

const QUICK_BUDGETS = [18000, 25000, 30000, 40000, 55000, 75000];

const SAMPLE_PROMPTS = [
  'I have ₹30,000. I mainly play Free Fire and BGMI, watch YouTube and use Instagram. I want good battery and a decent camera.',
  'Budget ₹45,000. Need top quality 4K video recording for vlogging, 512GB storage, and vibrant screen.',
  'Under ₹22,000. Longest possible battery life, durable build, and smooth daily social media.',
];

interface SajaseChatProps {
  onSelectAndBuild: (config: PhoneConfiguration) => void;
  onRequestQuote: (config: PhoneConfiguration) => void;
  onClose: () => void;
}

export const SajaseChat: React.FC<SajaseChatProps> = ({
  onSelectAndBuild,
  onRequestQuote,
  onClose,
}) => {
  const [budget, setBudget] = useState<number>(30000);
  const [selectedUsages, setSelectedUsages] = useState<UsageOption[]>(['Gaming', 'Social media']);
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityOption[]>([
    'Gaming',
    'Battery',
    'Camera',
  ]);
  const [naturalText, setNaturalText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SajaseRecommendationResponse | null>(null);

  const toggleUsage = (usage: UsageOption) => {
    setSelectedUsages((prev) =>
      prev.includes(usage) ? prev.filter((u) => u !== usage) : [...prev, usage]
    );
  };

  const togglePriority = (priority: PriorityOption) => {
    setSelectedPriorities((prev) => {
      if (prev.includes(priority)) {
        return prev.filter((p) => p !== priority);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), priority];
      }
      return [...prev, priority];
    });
  };

  const handleGenerate = async (customPrompt?: string) => {
    setIsLoading(true);
    try {
      // Parse natural prompt if provided
      let targetBudget = budget;
      let targetUsages = [...selectedUsages];
      let targetPriorities = [...selectedPriorities];

      const promptText = customPrompt || naturalText;
      if (promptText) {
        const budgetMatch = promptText.match(/(?:₹|rs\.?|inr)\s*(\d[\d,]*)/i) || promptText.match(/(\d{4,6})/);
        if (budgetMatch && budgetMatch[1]) {
          const parsed = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
          if (parsed >= 10000 && parsed <= 200000) {
            targetBudget = parsed;
            setBudget(parsed);
          }
        }
        if (promptText.toLowerCase().includes('game') || promptText.toLowerCase().includes('bgmi') || promptText.toLowerCase().includes('free fire')) {
          if (!targetUsages.includes('Gaming')) targetUsages.push('Gaming');
          if (!targetPriorities.includes('Gaming')) targetPriorities.unshift('Gaming');
        }
        if (promptText.toLowerCase().includes('camera') || promptText.toLowerCase().includes('photo') || promptText.toLowerCase().includes('vlog')) {
          if (!targetUsages.includes('Camera')) targetUsages.push('Camera');
          if (!targetPriorities.includes('Camera')) targetPriorities.push('Camera');
        }
        if (promptText.toLowerCase().includes('battery') || promptText.toLowerCase().includes('endurance')) {
          if (!targetUsages.includes('Battery')) targetUsages.push('Battery');
          if (!targetPriorities.includes('Battery')) targetPriorities.push('Battery');
        }
      }

      const res = await requestSajaseRecommendations({
        budgetINR: targetBudget,
        usages: targetUsages.length > 0 ? targetUsages : ['Everyday use'],
        priorities: targetPriorities.length > 0 ? targetPriorities : ['Performance'],
        userPrompt: promptText,
      });

      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (results) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <button
            onClick={() => setResults(null)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-cyan-400 font-mono transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Modify SAJASE Query</span>
          </button>
          <span className="text-xs font-mono text-zinc-500">
            3 Optimized Configurations Generated
          </span>
        </div>
        <SajaseResults
          data={results}
          onSelectAndBuild={onSelectAndBuild}
          onRequestQuote={onRequestQuote}
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SAJASE Header Tagline */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-zinc-900 to-indigo-950/60 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base sm:text-lg text-white font-mono">
              SAJASE ARCHITECT
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500 text-black font-bold">
              AI ENGINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-cyan-200 mt-1 font-medium">
            &quot;Tell me your budget and how you use your phone. I&apos;ll help you build it.&quot;
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">
            No technical knowledge required. We match processors, displays, cooling, and battery dynamically.
          </p>
        </div>
      </div>

      {/* Quick Example Prompts */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
          Or Pick a Real-World Request:
        </div>
        <div className="space-y-2">
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setNaturalText(prompt);
                handleGenerate(prompt);
              }}
              className="w-full text-left p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-cyan-500/50 text-xs text-zinc-300 transition-all flex items-center justify-between group"
            >
              <span className="leading-relaxed">&quot;{prompt}&quot;</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Guided Questions Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-zinc-800">
        {/* Question 1: Budget */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold block">
            1. What&apos;s your budget?
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-zinc-400">
              ₹
            </span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. 30000"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {QUICK_BUDGETS.map((qb) => (
              <button
                key={qb}
                type="button"
                onClick={() => setBudget(qb)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                  budget === qb
                    ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                ₹{qb.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Usage */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold block">
            2. What do you mainly use your phone for?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {USAGE_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedUsages.includes(item.label);
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => toggleUsage(item.label)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question 3: Priorities */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold block">
            3. What matters most? (Select up to 4 priorities)
          </label>
          <span className="text-[10px] font-mono text-zinc-500">
            {selectedPriorities.length}/4 Selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map((p) => {
            const isSelected = selectedPriorities.includes(p);
            const rank = selectedPriorities.indexOf(p) + 1;
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePriority(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-950 border-blue-500 text-blue-200 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-cyan-400 text-black text-[9px] font-bold flex items-center justify-center">
                    {rank}
                  </span>
                )}
                <span>{p}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Natural Text Box */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <label className="text-xs font-mono text-zinc-400 block">
          Additional Notes or Specific Demands (Optional):
        </label>
        <textarea
          rows={2}
          value={naturalText}
          onChange={(e) => setNaturalText(e.target.value)}
          placeholder="e.g. I need 90FPS BGMI, dual stereo speakers, and water resistance for heavy travel."
          className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <button
          onClick={() => handleGenerate()}
          disabled={isLoading || budget <= 5000}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Architecture &amp; Bill of Materials...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              <span>GENERATE 3 SMART PHONE CONFIGURATIONS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
