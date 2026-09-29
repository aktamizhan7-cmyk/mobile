import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  SlidersHorizontal,
  Flame,
  BatteryCharging,
  Sparkles,
  Columns,
  Radio,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { ALL_PROCESSORS, PROCESSOR_BRANDS, PROCESSOR_TIERS } from '../data/processors/index';
import { ProcessorComponent, ProcessorBrand, ProcessorTier } from '../types/phone';
import { formatINR } from '../utils/formatters';
import { ProcessorCompareModal } from '../components/processors/ProcessorCompareModal';

interface ProcessorCatalogPageProps {
  onSelectProcessorAndBuild: (proc: ProcessorComponent) => void;
}

export const ProcessorCatalogPage: React.FC<ProcessorCatalogPageProps> = ({
  onSelectProcessorAndBuild,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<ProcessorBrand | 'All'>('All');
  const [selectedTier, setSelectedTier] = useState<ProcessorTier | 'All'>('All');
  const [only5G, setOnly5G] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'antutu' | 'gaming' | 'efficiency' | 'price_asc' | 'price_desc' | 'ai'>('antutu');

  const [compareList, setCompareList] = useState<ProcessorComponent[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  const toggleCompare = (proc: ProcessorComponent) => {
    if (compareList.some((p) => p.id === proc.id)) {
      setCompareList(compareList.filter((p) => p.id !== proc.id));
    } else {
      if (compareList.length >= 3) {
        setCompareList([...compareList.slice(1), proc]);
      } else {
        setCompareList([...compareList, proc]);
      }
    }
  };

  const filteredProcessors = useMemo(() => {
    let list = [...ALL_PROCESSORS];

    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    if (selectedTier !== 'All') {
      list = list.filter((p) => p.tier === selectedTier);
    }

    if (only5G) {
      list = list.filter((p) => p.network?.five_g);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.family.toLowerCase().includes(q) ||
          p.processNode.toLowerCase().includes(q) ||
          p.gpu.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'antutu':
        list.sort((a, b) => (b.antutu_v10_score || 0) - (a.antutu_v10_score || 0));
        break;
      case 'gaming':
        list.sort((a, b) => (b.gaming_rating || 0) - (a.gaming_rating || 0));
        break;
      case 'efficiency':
        list.sort((a, b) => (b.efficiency_rating || 0) - (a.efficiency_rating || 0));
        break;
      case 'ai':
        list.sort((a, b) => (b.ai_rating || 0) - (a.ai_rating || 0));
        break;
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return list;
  }, [searchQuery, selectedBrand, selectedTier, only5G, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950/40 border border-zinc-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-mono text-xs font-bold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>ANDROlD SILICON HARDWARE DATABASE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Smartphone Processor Database &amp; Benchmarks
          </h1>

          <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Explore 6 major Android processor families across Qualcomm Snapdragon, MediaTek Dimensity, Samsung Exynos, Google Tensor, UNISOC, and HiSilicon Kirin. Filter by fabrication node, GPU ray tracing, AnTuTu v10 scores, and equip any chip into your custom build.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Columns className="w-4 h-4" />
                <span>Open Matrix Comparison ({compareList.length}/3)</span>
              </button>
            )}
            <span className="text-xs font-mono text-zinc-500">
              Total {ALL_PROCESSORS.length} cataloged processor architectures
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 6 families (e.g. Snapdragon 8 Gen 3, Dimensity 9400, Tensor G4, TSMC 3nm)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="font-mono text-[11px] text-zinc-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="antutu" className="bg-zinc-950">AnTuTu v10 Benchmark</option>
                <option value="gaming" className="bg-zinc-950">Gaming Rating</option>
                <option value="efficiency" className="bg-zinc-950">Battery Efficiency</option>
                <option value="ai" className="bg-zinc-950">AI &amp; NPU Class</option>
                <option value="price_asc" className="bg-zinc-950">Procurement: Low to High</option>
                <option value="price_desc" className="bg-zinc-950">Procurement: High to Low</option>
              </select>
            </div>

            <button
              onClick={() => setOnly5G(!only5G)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                only5G
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-bold'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>5G Only</span>
            </button>
          </div>
        </div>

        {/* Brand Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {PROCESSOR_BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={`px-3.5 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                selectedBrand === b.id
                  ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>{b.name}</span>
              <span className="ml-1.5 text-[10px] opacity-75 font-normal">({b.count})</span>
            </button>
          ))}
        </div>

        {/* Tier sub-filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] font-mono scrollbar-none">
          <span className="text-zinc-500 mr-1 shrink-0">Tier:</span>
          {PROCESSOR_TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTier(t.id)}
              className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                selectedTier === t.id
                  ? 'bg-zinc-800 text-cyan-300 border-cyan-800 font-semibold'
                  : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Processors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredProcessors.map((proc) => {
          const inCompare = compareList.some((p) => p.id === proc.id);

          return (
            <div
              key={proc.id}
              className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
                    {proc.brand}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {proc.processNode}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                      {proc.network?.five_g ? '5G' : '4G'}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {proc.name}
                </h3>
                <div className="text-xs text-zinc-500 font-mono mb-3">
                  {proc.family} • {proc.tier}
                </div>

                {/* Score bars */}
                <div className="space-y-2 mb-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800/70">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                      <span>AnTuTu v10</span>
                      <span className="text-emerald-400 font-bold">
                        {(proc.antutu_v10_score / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (proc.antutu_v10_score / 3200000) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono">
                    <div className="text-zinc-400">
                      Gaming: <span className="text-amber-400 font-bold">{proc.gaming_rating}/100</span>
                    </div>
                    <div className="text-zinc-400">
                      Eff: <span className="text-cyan-400 font-bold">{proc.efficiency_rating}/100</span>
                    </div>
                  </div>
                </div>

                {/* Tech Specs */}
                <div className="space-y-1 text-xs text-zinc-400 font-mono mb-4">
                  <div className="truncate">CPU: {proc.cores}</div>
                  <div className="truncate">GPU: {proc.gpu}</div>
                  <div>ISP Limit: <span className="text-cyan-400">Up to {proc.maxCameraMP}MP</span></div>
                  <div>TDP: ~{proc.thermal_tdp_watts || proc.tdpWatts} Watts</div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {proc.features.slice(0, 2).map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="border-t border-zinc-800 pt-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-zinc-500 font-mono">BOM Cost</div>
                  <div className="text-sm font-bold font-mono text-cyan-400">
                    {formatINR(proc.price)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleCompare(proc)}
                    className={`p-2 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                      inCompare
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800 font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                    title="Toggle compare"
                  >
                    <Columns className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectProcessorAndBuild(proc)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Equip &amp; Build</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compare Modal */}
      <ProcessorCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedProcessors={compareList}
        onRemoveProcessor={(id) => setCompareList(compareList.filter((p) => p.id !== id))}
        onEquipProcessor={(proc) => onSelectProcessorAndBuild(proc)}
      />
    </div>
  );
};
