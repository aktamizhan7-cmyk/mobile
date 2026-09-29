import React, { useState, useMemo } from 'react';
import {
  Check,
  Sparkles,
  Monitor,
  Eye,
  Sun,
  Shield,
  Search,
  SlidersHorizontal,
  Columns,
  Layers,
  Zap,
  Activity,
  Maximize2,
  Info,
} from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { DISPLAYS } from '../../data/components';
import { DisplayComponent, DisplayTechnology } from '../../types/phone';
import { formatINR } from '../../utils/formatters';
import { DisplayCompareModal } from '../displays/DisplayCompareModal';

export const StepDisplay: React.FC = () => {
  const { config, updateComponent, nextStep } = usePhoneBuilder();

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [selectedResolution, setSelectedResolution] = useState<string>('All');
  const [selectedShape, setSelectedShape] = useState<string>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'brightness' | 'ppi'>('recommended');

  // Compare selection state (up to 3 displays)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], id];
      }
      return [...prev, id];
    });
  };

  const selectedCompareDisplays = useMemo(() => {
    return DISPLAYS.filter((d) => compareIds.includes(d.id));
  }, [compareIds]);

  // Filtered & Sorted Display list
  const filteredDisplays = useMemo(() => {
    return DISPLAYS.filter((disp) => {
      // Search
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        disp.name.toLowerCase().includes(search) ||
        (disp.marketing_name && disp.marketing_name.toLowerCase().includes(search)) ||
        disp.type.toLowerCase().includes(search) ||
        disp.glassType.toLowerCase().includes(search) ||
        (disp.screen_protection?.protection_model && disp.screen_protection.protection_model.toLowerCase().includes(search)) ||
        disp.features.some((f) => f.toLowerCase().includes(search));

      if (!matchesSearch) return false;

      // Technology filter
      if (selectedTech !== 'All') {
        if (selectedTech === 'LTPO') {
          if (disp.technology !== 'LTPO OLED' && !disp.type.includes('LTPO')) return false;
        } else if (selectedTech === 'OLED') {
          if (!disp.technology?.includes('OLED') && !disp.technology?.includes('AMOLED')) return false;
        } else if (selectedTech === 'LCD') {
          if (!disp.technology?.includes('LCD')) return false;
        }
      }

      // Resolution filter
      if (selectedResolution !== 'All') {
        const cat = disp.resolution_details?.category || (disp.resolution.includes('2K') ? '2K' : disp.resolution.includes('1.5K') ? '1.5K' : disp.resolution.includes('FHD') ? 'FHD+' : 'HD+');
        if (!cat.toLowerCase().includes(selectedResolution.toLowerCase())) return false;
      }

      // Shape filter
      if (selectedShape !== 'All') {
        const shape = disp.panel_shape || (disp.type.includes('Curved') ? 'Curved' : 'Flat');
        if (selectedShape === 'Curved' && shape !== 'Curved' && shape !== 'Micro-Curved') return false;
        if (selectedShape === 'Flat' && shape !== 'Flat') return false;
        if (selectedShape === 'Foldable' && shape !== 'Foldable') return false;
      }

      // Size Filter
      if (selectedSizeFilter !== 'All') {
        const diag = disp.diagonal_inches || parseFloat(disp.size.replace('"', ''));
        if (selectedSizeFilter === 'compact' && diag >= 6.4) return false;
        if (selectedSizeFilter === 'standard' && (diag < 6.4 || diag > 6.75)) return false;
        if (selectedSizeFilter === 'large' && diag <= 6.75) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'brightness') {
        const bA = a.brightness?.peak_nits || a.peakBrightness || 0;
        const bB = b.brightness?.peak_nits || b.peakBrightness || 0;
        return bB - bA;
      }
      if (sortBy === 'ppi') {
        return (b.ppi || 400) - (a.ppi || 400);
      }
      return 0; // recommended order
    });
  }, [searchQuery, selectedTech, selectedResolution, selectedShape, selectedSizeFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Monitor className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-mono">Step 1: Choose Display &amp; Visuals</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Select panel technology (LTPO OLED / AMOLED / LCD), resolution (HD+ to 2K QHD+), dynamic refresh (up to 165Hz), PWM eye safety, and brightness.
          </p>
        </div>

        {/* Compare Floating / Quick Action Indicator */}
        <div className="flex items-center gap-2">
          {compareIds.length > 0 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg transition-all animate-pulse cursor-pointer"
            >
              <Columns className="w-4 h-4" />
              <span>Compare Selected ({compareIds.length}/3)</span>
            </button>
          )}
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
            {filteredDisplays.length} Displays Cataloged
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
        {/* Search input + Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search displays by panel, resolution, Gorilla Glass, or PWM..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="brightness">Highest Peak Brightness</option>
              <option value="ppi">Highest Density (PPI)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
          <span className="text-zinc-500 text-[11px]">Tech:</span>
          {[
            { id: 'All', label: 'All Tech' },
            { id: 'LTPO', label: 'LTPO OLED (1Hz Adaptive)' },
            { id: 'OLED', label: 'AMOLED / OLED' },
            { id: 'LCD', label: 'IPS / LTPS LCD' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTech(tab.id)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                selectedTech === tab.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-bold'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <span className="text-zinc-500 text-[11px] ml-2">Resolution:</span>
          {['All', '2K', '1.5K', 'FHD', 'HD'].map((res) => (
            <button
              key={res}
              onClick={() => setSelectedResolution(res)}
              className={`px-2 py-0.5 rounded-lg border text-[10px] transition-colors cursor-pointer ${
                selectedResolution === res
                  ? 'bg-zinc-800 text-cyan-400 border-cyan-800 font-bold'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {res === 'All' ? 'All Res' : res}
            </button>
          ))}

          <span className="text-zinc-500 text-[11px] ml-2">Shape:</span>
          {['All', 'Flat', 'Curved', 'Foldable'].map((shp) => (
            <button
              key={shp}
              onClick={() => setSelectedShape(shp)}
              className={`px-2 py-0.5 rounded-lg border text-[10px] transition-colors cursor-pointer ${
                selectedShape === shp
                  ? 'bg-zinc-800 text-cyan-400 border-cyan-800 font-bold'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {shp}
            </button>
          ))}

          <span className="text-zinc-500 text-[11px] ml-2">Size:</span>
          {[
            { id: 'All', label: 'All Sizes' },
            { id: 'compact', label: 'Compact (<6.4")' },
            { id: 'standard', label: '6.4" - 6.75"' },
            { id: 'large', label: 'Large (>6.75")' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSizeFilter(s.id)}
              className={`px-2 py-0.5 rounded-lg border text-[10px] transition-colors cursor-pointer ${
                selectedSizeFilter === s.id
                  ? 'bg-zinc-800 text-cyan-400 border-cyan-800 font-bold'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Displays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDisplays.map((disp) => {
          const isSelected = config.display?.id === disp.id;
          const isCompared = compareIds.includes(disp.id);

          return (
            <div
              key={disp.id}
              onClick={() => updateComponent('display', disp)}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-zinc-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div>
                {/* Header Pills & Compare Checkbox */}
                <div className="flex items-center justify-between gap-2 mb-2 pr-8">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
                      {disp.technology || disp.type}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-semibold">
                      {disp.size}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {disp.refresh_rate_range ? `${disp.refresh_rate_range.min_hz}-${disp.refresh_rate_range.max_hz}Hz` : disp.refreshRate}
                    </span>
                    {disp.panel_shape && disp.panel_shape !== 'Flat' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        {disp.panel_shape}
                      </span>
                    )}
                  </div>

                  {/* Compare Button */}
                  <button
                    onClick={(e) => toggleCompare(disp.id, e)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                      isCompared
                        ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                    title="Add to side-by-side comparison"
                  >
                    <Columns className="w-3 h-3" />
                    <span>{isCompared ? 'Compared' : 'Compare'}</span>
                  </button>
                </div>

                {/* Display Title & Marketing Name */}
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                  {disp.name}
                </h3>
                {disp.marketing_name && (
                  <p className="text-xs text-zinc-400 italic mb-2">{disp.marketing_name}</p>
                )}

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-zinc-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-zinc-300">
                      {disp.resolution_details ? `${disp.resolution_details.width}×${disp.resolution_details.height}` : disp.resolution}
                      {disp.ppi ? ` (${disp.ppi} PPI)` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      {disp.brightness?.peak_nits || disp.peakBrightness} nits Peak
                      {disp.brightness?.typical_nits ? ` / ${disp.brightness.typical_nits} typ` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{disp.screen_protection?.protection_model || disp.glassType}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>
                      {disp.pwm?.frequency_hz ? `${disp.pwm.frequency_hz}Hz PWM` : 'DC Dimming (0 PWM)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">
                      {(disp.hdr && disp.hdr.length > 0) ? disp.hdr.join(', ') : (disp.hdrSupport?.join(', ') || 'Standard Gamut')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{disp.touch_sampling_hz || 240}Hz Touch Sampling</span>
                  </div>
                </div>

                {/* Eye comfort & Feature Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {disp.features.slice(0, 3).map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800"
                    >
                      {feat}
                    </span>
                  ))}
                  {disp.always_on_display?.supported && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {disp.always_on_display.aod_type}
                    </span>
                  )}
                  {disp.fingerprint_support && (
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      {disp.fingerprint_support}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Cost & Select Action */}
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block">Estimated BOM Cost</span>
                  <span className="text-base font-bold font-mono text-cyan-400">
                    {formatINR(disp.price || disp.estimated_cost_inr)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateComponent('display', disp);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Continue Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-400 font-mono">
          Selected:{' '}
          <span className="text-cyan-400 font-bold">
            {config.display ? config.display.name : 'No Display Selected'}
          </span>
        </div>
        <button
          onClick={nextStep}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <span>Continue to Step 2: Processor</span>
        </button>
      </div>

      {/* Display Compare Modal */}
      <DisplayCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        displays={selectedCompareDisplays}
        currentDisplayId={config.display?.id}
        onSelectDisplay={(d) => updateComponent('display', d)}
      />
    </div>
  );
};
