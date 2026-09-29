import React from 'react';
import { AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';

export const BudgetOptimizerBanner: React.FC = () => {
  const {
    isOverBudget,
    overBudgetAmountINR,
    userBudgetINR,
    optimizeToBudget,
    userPriorities,
  } = usePhoneBuilder();

  if (!isOverBudget) return null;

  return (
    <div className="w-full bg-gradient-to-r from-amber-950/80 via-zinc-900 to-amber-950/80 border border-amber-500/40 rounded-2xl p-4 shadow-lg mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              OVER BUDGET BY {formatINR(overBudgetAmountINR)}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
              Target: {formatINR(userBudgetINR)}
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-0.5">
            SAJASE can re-balance secondary parts (storage, materials, secondary lenses) while protecting your #1 priority (
            <span className="text-cyan-400 font-semibold">{userPriorities[0] || 'Performance'}</span>).
          </p>
        </div>
      </div>

      <button
        onClick={optimizeToBudget}
        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-md transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        <span>OPTIMIZE TO {formatINR(userBudgetINR)}</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </button>
    </div>
  );
};
