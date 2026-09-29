import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { label: 'User Idea', desc: 'Needs & Budget' },
  { label: 'Configuration', desc: 'Hardware Selection' },
  { label: 'Compatibility', desc: 'Thermal & Bus Validation' },
  { label: 'BOM Estimate', desc: 'Cost Breakdown' },
  { label: 'Design Preview', desc: 'Materials & Finish' },
  { label: 'Feasibility Review', desc: 'ODM Partner Analysis' },
  { label: 'Quotation', desc: 'Firm MOQ & Pricing' },
  { label: 'Prototype & Test', desc: 'Tooling & Testing' },
  { label: 'Manufacturing', desc: 'SMT Mass Production' },
];

export const WorkflowDiagram: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 md:p-6 backdrop-blur">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Real-World Manufacturing Journey
          </span>
          <h4 className="text-sm md:text-base font-semibold text-zinc-100">
            From Custom Concept to Certified Hardware
          </h4>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo estimate until ODM feasibility approval</span>
        </div>
      </div>

      {/* Workflow Horizontal Steps */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex items-center min-w-max gap-2 md:gap-3">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div
                className={`flex flex-col items-center text-center p-2.5 rounded-xl border ${
                  idx <= 4
                    ? 'bg-zinc-800/80 border-cyan-500/40 text-cyan-200 shadow-sm'
                    : 'bg-zinc-900/40 border-zinc-800/90 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center font-bold ${
                      idx <= 4
                        ? 'bg-cyan-500 text-black'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold whitespace-nowrap">{step.label}</span>
                </div>
                {!compact && (
                  <span className="text-[10px] text-zinc-400 font-mono whitespace-nowrap">
                    {step.desc}
                  </span>
                )}
              </div>

              {idx < STEPS.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
