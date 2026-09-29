import React from 'react';
import { Check, CircuitBoard, Gauge } from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { RAM_OPTIONS } from '../../data/components';
import { formatINR } from '../../utils/formatters';

export const StepRAM: React.FC = () => {
  const { config, updateComponent, nextStep, prevStep } = usePhoneBuilder();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CircuitBoard className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Step 3: Select Memory (RAM)</h2>
        </div>
        <p className="text-xs text-zinc-400">
          Dictates background multitasking, how many heavy apps stay alive, and video/AI buffer capacity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RAM_OPTIONS.map((ram) => {
          const isSelected = config.ram?.id === ram.id;

          return (
            <div
              key={ram.id}
              onClick={() => updateComponent('ram', ram)}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                    {ram.type}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-cyan-400" />
                    <span>{ram.speedMbps} Mbps</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-100 font-mono">{ram.capacity}</h3>
                <p className="text-xs text-zinc-400 mt-1">{ram.name}</p>

                <div className="space-y-1 mt-3">
                  {ram.features.map((feat, i) => (
                    <div key={i} className="text-xs text-zinc-300 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">BOM Cost</span>
                <span className="text-sm font-bold font-mono text-cyan-400">
                  {formatINR(ram.price)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs sm:text-sm font-semibold transition-colors"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Step 4: Storage</span>
        </button>
      </div>
    </div>
  );
};
