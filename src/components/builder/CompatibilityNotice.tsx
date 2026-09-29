import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import {
  PROCESSORS,
  DISPLAYS,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  CAMERAS,
  BATTERIES,
  CHARGERS,
  COOLINGS,
} from '../../data/components';

export const CompatibilityNotice: React.FC = () => {
  const { compatibilityIssues, updateComponent } = usePhoneBuilder();

  if (compatibilityIssues.length === 0) {
    return (
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Compatibility Verified:</strong> Hardware architecture, RAM bus, ISP bandwidth, and thermal envelope operate within optimal tolerances.
        </span>
      </div>
    );
  }

  const handleApplyFix = (issue: any) => {
    if (!issue.recommendedFix) return;
    const { category, componentId } = issue.recommendedFix;

    let targetComponent: any = null;
    if (category === 'processor') targetComponent = PROCESSORS.find((c) => c.id === componentId);
    if (category === 'display') targetComponent = DISPLAYS.find((c) => c.id === componentId);
    if (category === 'ram') targetComponent = RAM_OPTIONS.find((c) => c.id === componentId);
    if (category === 'storage') targetComponent = STORAGE_OPTIONS.find((c) => c.id === componentId);
    if (category === 'camera') targetComponent = CAMERAS.find((c) => c.id === componentId);
    if (category === 'battery') targetComponent = BATTERIES.find((c) => c.id === componentId);
    if (category === 'charging') targetComponent = CHARGERS.find((c) => c.id === componentId);
    if (category === 'cooling') targetComponent = COOLINGS.find((c) => c.id === componentId);

    if (targetComponent) {
      updateComponent(category, targetComponent);
    }
  };

  return (
    <div className="space-y-2">
      {compatibilityIssues.map((issue) => {
        const isError = issue.severity === 'error';
        const isWarning = issue.severity === 'warning';

        return (
          <div
            key={issue.id}
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
              isError
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                : isWarning
                ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold font-mono uppercase tracking-wider text-[11px]">
                  {issue.title}
                </div>
                <p className="mt-0.5 leading-relaxed text-zinc-300">{issue.description}</p>
              </div>
            </div>

            {issue.recommendedFix && (
              <button
                onClick={() => handleApplyFix(issue)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-cyan-300 hover:text-white shrink-0 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span>{issue.recommendedFix.actionLabel}</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
