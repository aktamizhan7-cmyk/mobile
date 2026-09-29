import React from 'react';
import { X, Cpu, Check, ShieldCheck, Zap, Activity, Flame, BatteryCharging, Sparkles } from 'lucide-react';
import { ProcessorComponent } from '../../types/phone';
import { formatINR } from '../../utils/formatters';

interface ProcessorCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProcessors: ProcessorComponent[];
  onRemoveProcessor: (id: string) => void;
  onEquipProcessor: (processor: ProcessorComponent) => void;
  currentEquippedId?: string;
}

export const ProcessorCompareModal: React.FC<ProcessorCompareModalProps> = ({
  isOpen,
  onClose,
  selectedProcessors,
  onRemoveProcessor,
  onEquipProcessor,
  currentEquippedId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wide">
                PROCESSOR SILICON COMPARISON MATRIX ({selectedProcessors.length}/3)
              </h2>
              <p className="text-[11px] text-zinc-400">
                Direct side-by-side architectural, benchmark, and efficiency analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {selectedProcessors.length === 0 ? (
            <div className="text-center py-16 text-zinc-400">
              <Cpu className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
              <h3 className="text-base font-bold text-zinc-200">No processors queued for comparison</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Select "Compare" on up to 3 processors in the builder or SoC explorer to evaluate core clusters, AnTuTu benchmarks, and gaming stability.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {selectedProcessors.map((proc) => {
                const isEquipped = currentEquippedId === proc.id;

                return (
                  <div
                    key={proc.id}
                    className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between relative group hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
                            {proc.brand}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                            {proc.tier}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveProcessor(proc.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1">{proc.name}</h3>
                      <div className="text-xs text-zinc-400 font-mono mb-4">
                        Family: {proc.family}
                      </div>

                      {/* Procurement Price */}
                      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 mb-4 flex items-center justify-between">
                        <span className="text-xs text-zinc-500 font-mono">BOM Unit Cost</span>
                        <span className="text-base font-bold font-mono text-cyan-400">
                          {formatINR(proc.price)}
                        </span>
                      </div>

                      {/* Key Benchmark Scores */}
                      <div className="space-y-2 mb-4">
                        <div>
                          <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                            <span>AnTuTu v10 Benchmark</span>
                            <span className="text-emerald-400 font-bold">
                              {(proc.antutu_v10_score / 1000).toFixed(0)}k pts
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, (proc.antutu_v10_score / 3200000) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                            <span>Geekbench 6 (Single / Multi)</span>
                            <span className="text-zinc-200">
                              {proc.geekbench_single} / {proc.geekbench_multi}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${Math.min(100, (proc.geekbench_multi / 10500) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/60 text-center">
                            <div className="text-[10px] text-zinc-500 font-mono">Gaming Rating</div>
                            <div className="text-sm font-bold font-mono text-amber-400">
                              {proc.gaming_rating}/100
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/60 text-center">
                            <div className="text-[10px] text-zinc-500 font-mono">Efficiency</div>
                            <div className="text-sm font-bold font-mono text-cyan-400">
                              {proc.efficiency_rating}/100
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Technical Specs Breakdown */}
                      <div className="space-y-1.5 text-xs text-zinc-300 font-mono border-t border-zinc-800 pt-3">
                        <div className="flex justify-between py-1 border-b border-zinc-800/40">
                          <span className="text-zinc-500">Fabrication Node:</span>
                          <span className="text-zinc-200 font-semibold">{proc.processNode}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-800/40">
                          <span className="text-zinc-500">CPU Architecture:</span>
                          <span className="text-zinc-200">{proc.cpuArch}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-800/40">
                          <span className="text-zinc-500">GPU Unit:</span>
                          <span className="text-zinc-200 truncate max-w-[160px] text-right">{proc.gpu}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-800/40">
                          <span className="text-zinc-500">AI / NPU Class:</span>
                          <span className="text-zinc-200">
                            {proc.ai?.ai_class || 'Standard'} {proc.ai?.tops ? `(${proc.ai.tops} TOPS)` : ''}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-800/40">
                          <span className="text-zinc-500">Camera ISP Limit:</span>
                          <span className="text-cyan-400 font-semibold">
                            Up to {proc.camera_isp?.max_single_camera_mp || proc.maxCameraMP}MP
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-800/40">
                          <span className="text-zinc-500">Memory Bus:</span>
                          <span className="text-zinc-200">Up to {proc.maxRamBandwidth}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-800/40">
                          <span className="text-zinc-500">Thermal TDP:</span>
                          <span className="text-zinc-200 font-semibold">~{proc.thermal_tdp_watts || proc.tdpWatts}W</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-zinc-500">Cellular Modem:</span>
                          <span className={proc.network?.five_g ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}>
                            {proc.network?.five_g ? '5G + 4G' : '4G LTE'}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-zinc-800/60">
                        {proc.features.slice(0, 3).map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Equip Action */}
                    <div className="mt-5 pt-3 border-t border-zinc-800">
                      {isEquipped ? (
                        <div className="w-full py-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold text-xs font-mono flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4" />
                          <span>CURRENTLY EQUIPPED</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            onEquipProcessor(proc);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/20"
                        >
                          EQUIP TO CUSTOM PHONE
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>Provisional SoC specifications derived from silicon vendor architectural datasheets.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
