import React from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Eye,
  Sliders,
  Award,
  ChevronRight,
} from 'lucide-react';
import { PhoneVisualizer } from '../components/preview/PhoneVisualizer';
import { WorkflowDiagram } from '../components/common/WorkflowDiagram';
import { PRESETS } from '../data/presets';
import { formatINR } from '../utils/formatters';
import { usePhoneBuilder } from '../context/PhoneBuilderContext';
import { PhoneConfiguration } from '../types/phone';

interface HomePageProps {
  onStartBuilding: () => void;
  onOpenSajase: () => void;
  onLoadPreset: (config: PhoneConfiguration) => void;
  onExplorePresets: () => void;
  onOpenProcessors?: () => void;
  onOpenDisplays?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartBuilding,
  onOpenSajase,
  onLoadPreset,
  onExplorePresets,
  onOpenProcessors,
  onOpenDisplays,
}) => {
  const { loadConfiguration } = usePhoneBuilder();

  const handleApplyPreset = (preset: any) => {
    loadConfiguration(preset.configuration, preset.targetBudgetINR);
    onLoadPreset(preset.configuration);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 md:py-16">
        {/* Glow ambient background orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Next-Gen Smartphone Hardware Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-mono leading-[1.1]">
                BUILD YOUR OWN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  SMARTPHONE
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Design your ideal smartphone, choose the hardware, visualize your phone, check compatibility and get an estimated price.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onStartBuilding}
                  className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>START BUILDING</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={onOpenSajase}
                  className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/40 text-cyan-300 font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>ASK SAJASE</span>
                </button>

                <button
                  onClick={onExplorePresets}
                  className="px-5 py-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white text-sm font-semibold transition-colors"
                >
                  EXPLORE PRESETS
                </button>

                {onOpenDisplays && (
                  <button
                    onClick={onOpenDisplays}
                    className="px-4 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-cyan-400 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Display Lab</span>
                  </button>
                )}

                {onOpenProcessors && (
                  <button
                    onClick={onOpenProcessors}
                    className="px-4 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-cyan-400 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SoC Lab</span>
                  </button>
                )}
              </div>

              {/* Key Specs Ticker */}
              <div className="pt-6 border-t border-zinc-850 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left font-mono">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                  <div className="text-[11px] text-zinc-500">Component Freedom</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-400">0.0 ms</div>
                  <div className="text-[11px] text-zinc-500">Live BOM Calculator</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-blue-400">SAJASE</div>
                  <div className="text-[11px] text-zinc-500">AI Architect Built-In</div>
                </div>
              </div>
            </div>

            {/* Right Visual Phone Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl" />
                <PhoneVisualizer />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESSOR DATABASE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 md:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Silicon Hardware Intelligence
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white font-mono mt-1">
                COMPREHENSIVE ANDROID PROCESSOR DATABASE
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
                Choose from Snapdragon 8 Elite, Dimensity 9400, Google Tensor G4/G5, Exynos 2600, UNISOC 5G, and Kirin chips. Compare AnTuTu v10, Geekbench 6, Ray Tracing, and ISP megapixel thresholds in real-time.
              </p>
            </div>

            {onOpenProcessors && (
              <button
                onClick={onOpenProcessors}
                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Cpu className="w-4 h-4" />
                <span>EXPLORE SOC LAB</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Family Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {[
              { brand: 'Snapdragon', desc: '8 Elite & 7+ Gen 3', color: 'border-rose-900/60 bg-rose-950/20 text-rose-300' },
              { brand: 'Dimensity', desc: '9400 & 8300 Ultra', color: 'border-amber-900/60 bg-amber-950/20 text-amber-300' },
              { brand: 'Exynos', desc: '2600 & AMD RDNA 3', color: 'border-blue-900/60 bg-blue-950/20 text-blue-300' },
              { brand: 'Tensor', desc: 'G5 & Edge TPU 60 TOPS', color: 'border-emerald-900/60 bg-emerald-950/20 text-emerald-300' },
              { brand: 'UNISOC', desc: 'T9300 & Budget 5G', color: 'border-purple-900/60 bg-purple-950/20 text-purple-300' },
              { brand: 'Kirin', desc: '9020 & Taishan Cores', color: 'border-teal-900/60 bg-teal-950/20 text-teal-300' },
            ].map((f, idx) => (
              <div key={idx} className={`p-3 rounded-2xl border font-mono text-center space-y-1 ${f.color}`}>
                <div className="text-xs font-bold">{f.brand}</div>
                <div className="text-[10px] text-zinc-400 truncate">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MANUFACTURING WORKFLOW TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WorkflowDiagram />
      </section>

      {/* SAJASE SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/80 via-zinc-900 to-indigo-950/80 border border-cyan-500/30 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Meet Your AI Phone Architect
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              &quot;Tell me your budget and how you use your phone. I&apos;ll help you build it.&quot;
            </h2>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
              Don&apos;t know the difference between LPDDR5X and UFS 4.0? SAJASE translates your daily habits—like competitive BGMI gaming, travel 4K vlogging, or 2-day battery demands—into balanced hardware architectures matching your exact rupee limit.
            </p>
          </div>

          <button
            onClick={onOpenSajase}
            className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center gap-2 shrink-0 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>CONSULT SAJASE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* INSPIRING PRESET ARCHITECTURES */}
      <section id="presets-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Curated Concept Builds
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              EXPLORE PRE-ENGINEERED ARCHITECTURES
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm">
            Load any pre-configured custom smartphone into the builder as a springboard for your own modifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESETS.slice(0, 3).map((preset) => (
            <div
              key={preset.id}
              className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                  {preset.badge}
                </span>

                <h3 className="text-lg font-bold text-white font-mono mt-2">{preset.name}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{preset.tagline}</p>

                <div className="space-y-1.5 my-4">
                  {preset.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-zinc-300 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block">Target Budget</span>
                  <span className="text-base font-bold font-mono text-cyan-400">
                    {formatINR(preset.targetBudgetINR)}
                  </span>
                </div>

                <button
                  onClick={() => handleApplyPreset(preset)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 group-hover:bg-cyan-500 text-zinc-200 group-hover:text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Customize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Real-Time BOM Price Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every processor, sensor, battery cell, and chassis finish is dynamically computed with transparent assembly, RF calibration, and testing estimates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Hardware Compatibility Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Never build a phone that throttles. The engine flags memory bus bandwidth bottlenecks, ISP megapixel limits, and thermal TDP mismatches before quoting.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Certified Manufacturing Path</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Seamlessly generate complete engineering dossiers and formal quotation requests for evaluation batches, prototype tooling, and pilot volume runs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
