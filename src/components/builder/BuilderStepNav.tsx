import React from 'react';
import {
  Monitor,
  Cpu,
  CircuitBoard,
  HardDrive,
  Camera,
  Battery,
  Zap,
  Wind,
  Gamepad2,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';

export const BUILDER_STEPS = [
  { id: 'display', label: 'Display', icon: Monitor },
  { id: 'processor', label: 'Processor', icon: Cpu },
  { id: 'ram', label: 'RAM', icon: CircuitBoard },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'camera', label: 'Camera', icon: Camera },
  { id: 'battery', label: 'Battery', icon: Battery },
  { id: 'charging', label: 'Charging', icon: Zap },
  { id: 'cooling', label: 'Cooling', icon: Wind },
  { id: 'gaming', label: 'Gaming & Audio', icon: Gamepad2 },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'review', label: 'Review', icon: CheckCircle2 },
];

export const BuilderStepNav: React.FC = () => {
  const { activeStep, setActiveStep } = usePhoneBuilder();

  return (
    <div className="w-full bg-zinc-950/70 border-b border-zinc-800/80 sticky top-16 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto">
        <div className="flex items-center min-w-max gap-1 sm:gap-2">
          {BUILDER_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : isCompleted
                    ? 'bg-zinc-900/90 text-cyan-300 border border-cyan-900/40 hover:bg-zinc-850'
                    : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border border-zinc-800/60'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-black text-cyan-400'
                      : isCompleted
                      ? 'bg-cyan-950 text-cyan-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <Icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
