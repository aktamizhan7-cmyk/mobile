import React, { useState, useMemo } from 'react';
import {
  Check,
  Cpu,
  Zap,
  Activity,
  ShieldAlert,
  Search,
  SlidersHorizontal,
  Flame,
  BatteryCharging,
  Sparkles,
  Columns,
  Radio,
  ExternalLink,
  Info,
} from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { ALL_PROCESSORS, PROCESSOR_BRANDS, PROCESSOR_TIERS } from '../../data/processors/index';
import { ProcessorComponent, ProcessorBrand, ProcessorTier } from '../../types/phone';
import { formatINR } from '../../utils/formatters';
import { ProcessorCompareModal } from '../processors/ProcessorCompareModal';

export const StepProcessor: React.FC = () => {
  const { config, updateComponent, nextStep, prevStep } = usePhoneBuilder();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<ProcessorBrand | 'All'>('All');
  const [selectedTier, setSelectedTier] = useState<ProcessorTier | 'All'>('All');
  const [only5G, setOnly5G] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'antutu' | 'gaming' | 'efficiency' | 'price_asc' | 'price_desc' | 'ai'>('antutu');

  // Processor comparison state
  const [compareList, setCompareList] = useState<ProcessorComponent[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Expanded details toggle per processor
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleCompare = (e: React.MouseEvent, proc: ProcessorComponent) => {
    e.stopPropagation();
    if (compareList.some((p) => p.id === proc.id)) {
      setCompareList(compareList.filter((p) => p.id !== proc.id));
    } else {
      if (compareList.length >= 3) {
        // Replace oldest
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

  const brandPillStyle = (brand: string) => {
    switch (brand) {
      case 'Qualcomm':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/80';
      case 'MediaTek':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
      case 'Samsung':
        return 'text-blue-400 bg-blue-950/60 border-blue-800/80';
      case 'Google':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
      case 'UNISOC':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/80';
      case 'HiSilicon':
        return 'text-teal-400 bg-teal-950/60 border-teal-800/80';
      default:
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80';
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Step 2: Choose Central Processor (SoC)</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Select from the complete Android silicon database powering gaming framerates, ISP limits, on-device AI, and battery endurance.
          </p>
        </div>

        {/* Compare quick launcher */}
        {compareList.length > 0 && (
          <button
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer transition-all shrink-0"
          >
            <Columns className="w-4 h-4" />
            <span>Compare Matrix ({compareList.length}/3)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, node (e.g. 3nm, TSMC), GPU, or feature..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                Clear
              </button>
            )}
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
                <option value="antutu" className="bg-zinc-950">AnTuTu Score (High to Low)</option>
                <option value="gaming" className="bg-zinc-950">Gaming Rating (High to Low)</option>
                <option value="efficiency" className="bg-zinc-950">Battery Efficiency</option>
                <option value="ai" className="bg-zinc-950">AI &amp; NPU Class</option>
                <option value="price_asc" className="bg-zinc-950">Price: Low to High</option>
                <option value="price_desc" className="bg-zinc-950">Price: High to Low</option>
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

        {/* Brand Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {PROCESSOR_BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={`px-3 py-1 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                selectedBrand === b.id
                  ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-sm shadow-cyan-500/20'
                  : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>{b.name}</span>
              <span className="ml-1.5 text-[10px] opacity-75 font-normal">({b.count})</span>
            </button>
          ))}
        </div>

        {/* Tier Sub-Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] font-mono scrollbar-none">
          <span className="text-zinc-500 mr-1 shrink-0">Tier:</span>
          {PROCESSOR_TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTier(t.id)}
              className={`px-2.5 py-0.5 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono px-1">
        <span>
          Showing {filteredProcessors.length} of {ALL_PROCESSORS.length} Android SoCs
        </span>
        {compareList.length > 0 && (
          <span className="text-cyan-400">
            {compareList.length}/3 selected for compare
          </span>
        )}
      </div>

      {/* Processors List */}
      <div className="space-y-3.5">
        {filteredProcessors.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
            <Cpu className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
            <p className="font-semibold text-zinc-200">No processors match the current filters.</p>
            <p className="text-xs text-zinc-500 mt-1">Try clearing your search query or selecting "All Brands".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('All');
                setSelectedTier('All');
                setOnly5G(false);
              }}
              className="mt-3 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-cyan-400 font-mono cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProcessors.map((proc) => {
            const isSelected = config.processor?.id === proc.id;
            const inCompare = compareList.some((p) => p.id === proc.id);
            const isExpanded = expandedId === proc.id;

            return (
              <div
                key={proc.id}
                onClick={() => updateComponent('processor', proc)}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-zinc-900 border-2 border-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.22)]'
                    : 'bg-zinc-900/60 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/95'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-md z-10">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="flex-1">
                  {/* Top Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2 pr-8">
                    {/* Brand Pill */}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${brandPillStyle(proc.brand)}`}>
                      {proc.brand}
                    </span>

                    {/* Tier */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {proc.tier}
                    </span>

                    {/* Process Node */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {proc.processNode}
                    </span>

                    {/* Modem */}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      proc.network?.five_g
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {proc.network?.five_g ? '5G' : '4G LTE'}
                    </span>

                    {/* Special Badge if present */}
                    {proc.specialBadge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/80 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{proc.specialBadge}</span>
                      </span>
                    )}

                    {/* Regional Availability Note */}
                    {proc.regionalAvailability && proc.regionalAvailability !== 'Global' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800">
                        {proc.regionalAvailability}
                      </span>
                    )}
                  </div>

                  {/* Title & Family */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {proc.name}
                    </h3>
                    <span className="text-xs text-zinc-400 font-mono">
                      {proc.family} Family
                    </span>
                  </div>

                  {/* Google Tensor Special Classification Notice */}
                  {proc.brand === 'Google' && (
                    <div className="mt-2 p-2 rounded-xl bg-blue-950/30 border border-blue-800/50 text-[11px] text-blue-200/90 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Google Tensor Specialty:</strong> Industry-leading on-device TPU ({proc.ai?.tops || 45} TOPS) and computational camera processing. Tuned for AI experiences and HDRnet rather than maximum gaming FPS.
                      </span>
                    </div>
                  )}

                  {/* Core Architecture and GPU Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-zinc-400 font-mono">
                    <div>
                      <span className="text-zinc-500">CPU: </span>
                      {proc.cores}
                    </div>
                    <div>
                      <span className="text-zinc-500">GPU: </span>
                      {proc.gpu}
                    </div>
                    <div>
                      <span className="text-zinc-500">Memory Support: </span>
                      Up to {proc.maxRamBandwidth}
                    </div>
                    <div>
                      <span className="text-zinc-500">ISP Camera Limit: </span>
                      <span className="text-cyan-400 font-semibold">Up to {proc.maxCameraMP}MP</span>
                    </div>
                  </div>

                  {/* Benchmark & Metrics Bar */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {/* AnTuTu Score */}
                    <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                      <Activity className="w-3 h-3" />
                      <span>AnTuTu: ~{(proc.antutu_v10_score / 1000).toFixed(0)}k</span>
                    </div>

                    {/* Geekbench */}
                    {proc.geekbench_multi && (
                      <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900">
                        GB6: {proc.geekbench_single} / {proc.geekbench_multi}
                      </div>
                    )}

                    {/* Gaming Rating */}
                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900">
                      <Flame className="w-3 h-3" />
                      <span>Gaming: {proc.gaming_rating}/100</span>
                    </div>

                    {/* Efficiency */}
                    <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900">
                      <BatteryCharging className="w-3 h-3" />
                      <span>Efficiency: {proc.efficiency_rating}/100</span>
                    </div>

                    {/* TDP */}
                    <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      TDP: ~{proc.thermal_tdp_watts || proc.tdpWatts}W
                    </div>
                  </div>

                  {/* Features Tag Cloud */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    {proc.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Expanded Technical Details */}
                  {isExpanded && (
                    <div className="mt-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1 text-xs font-mono text-zinc-300">
                      <div className="text-[11px] font-bold text-cyan-400 mb-1">DETAILED HARDWARE SPECIFICATIONS</div>
                      <div>Architecture: {proc.cpu?.architecture || proc.cpuArch} ({proc.cpu?.cluster || proc.cores})</div>
                      <div>Foundry / Fabrication: {proc.process?.foundry || proc.processNode}</div>
                      <div>GPU Ray Tracing: {proc.gpuDetails?.ray_tracing ? 'Hardware Ray Tracing Enabled' : 'Standard Rasterization'}</div>
                      <div>AI Tops: {proc.ai?.tops ? `${proc.ai.tops} TOPS` : 'Baseline NPU Acceleration'}</div>
                      <div>Modem Model: {proc.network?.modem || (proc.network?.five_g ? '5G UltraSave' : '4G LTE Cat.7')}</div>
                      <div>Storage Interface: {proc.storage?.supported_types?.join(', ') || proc.maxStorageTier}</div>
                      <div>Video Capture Capability: {proc.camera_isp?.max_video || '4K 30fps'}</div>
                    </div>
                  )}
                </div>

                {/* Card Actions & Pricing */}
                <div className="border-t border-zinc-800/80 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(isExpanded ? null : proc.id);
                      }}
                      className="text-[11px] font-mono text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Specs' : 'Full Architecture Specs'}</span>
                    </button>

                    <button
                      onClick={(e) => toggleCompare(e, proc)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                        inCompare
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-800 font-bold'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <Columns className="w-3 h-3" />
                      <span>{inCompare ? 'In Compare Matrix' : 'Compare SoC'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-zinc-500 font-mono">BOM Estimate</div>
                      <div className="text-base font-bold font-mono text-cyan-400">
                        {formatINR(proc.price)}
                      </div>
                    </div>

                    <button
                      onClick={() => updateComponent('processor', proc)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                      }`}
                    >
                      {isSelected ? 'Equipped' : 'Equip SoC'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-zinc-800">
        <button
          onClick={prevStep}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <span>Continue to RAM</span>
          <span>→</span>
        </button>
      </div>

      {/* Processor Compare Modal */}
      <ProcessorCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedProcessors={compareList}
        onRemoveProcessor={(id) => setCompareList(compareList.filter((p) => p.id !== id))}
        onEquipProcessor={(proc) => updateComponent('processor', proc)}
        currentEquippedId={config.processor?.id}
      />
    </div>
  );
};
