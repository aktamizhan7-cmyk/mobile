import React from 'react';
import { Check, Gamepad2, Volume2, Vibrate, ShieldAlert, Cpu } from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { AUDIO_HAPTICS } from '../../data/components';
import { formatINR } from '../../utils/formatters';

export const StepGaming: React.FC = () => {
  const { config, updateComponent, nextStep, prevStep } = usePhoneBuilder();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Gamepad2 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Step 9: Gaming, Audio &amp; Haptics</h2>
        </div>
        <p className="text-xs text-zinc-400">
          Configure digitizer touch response latency, symmetrical stereo sound, and bionic mechanical haptics.
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong>Performance Transparency:</strong> No hardware manufacturer can guarantee rigid constant FPS due to software game engine updates. High touch sampling and low-jitter thermal cooling minimize frame variance.
        </span>
      </div>

      <div className="space-y-3">
        {AUDIO_HAPTICS.map((item) => {
          const isSelected = config.audioHaptics?.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => updateComponent('audioHaptics', item)}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col md:flex-row md:items-center justify-between gap-4 ${
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

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                    {item.touchSamplingRate} Touch Sampling
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {item.speakers}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {item.haptics} Motor
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-100">{item.name}</h3>
                <div className="text-xs text-zinc-400 font-mono mt-1">
                  Acoustic Tuning: {item.audioTuning}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.features.map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:text-right border-t md:border-t-0 md:border-l border-zinc-800 pt-3 md:pt-0 md:pl-5 shrink-0 flex md:flex-col justify-between items-center md:items-end">
                <span className="text-xs text-zinc-500 font-mono">BOM Cost</span>
                <span className="text-lg font-bold font-mono text-cyan-400">
                  {formatINR(item.price)}
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
          <span>Continue to Step 10: Design</span>
        </button>
      </div>
    </div>
  );
};
