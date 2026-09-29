import React, { useState, useMemo } from 'react';
import {
  Monitor,
  Search,
  SlidersHorizontal,
  Sun,
  Eye,
  Shield,
  Zap,
  Activity,
  Sparkles,
  Columns,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Check,
  Layers,
  Info,
} from 'lucide-react';
import { DISPLAYS } from '../data/components';
import { DisplayComponent, DisplayTechnology } from '../types/phone';
import { formatINR } from '../utils/formatters';
import { calculatePPI, calculateAspectRatio, getResolutionCategory } from '../utils/displayCalculators';
import { DisplayCompareModal } from '../components/displays/DisplayCompareModal';

interface DisplayCatalogPageProps {
  onSelectDisplayAndBuild: (display: DisplayComponent) => void;
}

export const DisplayCatalogPage: React.FC<DisplayCatalogPageProps> = ({
  onSelectDisplayAndBuild,
}) => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [selectedResolution, setSelectedResolution] = useState<string>('All');
  const [selectedShape, setSelectedShape] = useState<string>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'brightness' | 'ppi'>('recommended');

  // Interactive Live PPI Calculator State
  const [calcWidth, setCalcWidth] = useState<number>(2712);
  const [calcHeight, setCalcHeight] = useState<number>(1220);
  const [calcDiagonal, setCalcDiagonal] = useState<number>(6.67);

  const calculatedPPI = useMemo(() => {
    return calculatePPI(calcWidth, calcHeight, calcDiagonal);
  }, [calcWidth, calcHeight, calcDiagonal]);

  const calculatedAspect = useMemo(() => {
    return calculateAspectRatio(calcWidth, calcHeight);
  }, [calcWidth, calcHeight]);

  const calculatedCategory = useMemo(() => {
    return getResolutionCategory(calcWidth, calcHeight);
  }, [calcWidth, calcHeight]);

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
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

  // Stats calculation
  const stats = useMemo(() => {
    const total = DISPLAYS.length;
    const ltpo = DISPLAYS.filter((d) => d.technology === 'LTPO OLED').length;
    const amoled = DISPLAYS.filter((d) => d.technology?.includes('OLED') || d.technology?.includes('AMOLED')).length;
    const lcd = DISPLAYS.filter((d) => d.technology?.includes('LCD')).length;
    const peak4k = DISPLAYS.filter((d) => (d.brightness?.peak_nits || d.peakBrightness) >= 3000).length;
    return { total, ltpo, amoled, lcd, peak4k };
  }, []);

  // Filtered & Sorted Display list
  const filteredDisplays = useMemo(() => {
    return DISPLAYS.filter((disp) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        disp.name.toLowerCase().includes(search) ||
        (disp.marketing_name && disp.marketing_name.toLowerCase().includes(search)) ||
        disp.type.toLowerCase().includes(search) ||
        disp.glassType.toLowerCase().includes(search) ||
        (disp.screen_protection?.protection_model && disp.screen_protection.protection_model.toLowerCase().includes(search)) ||
        disp.features.some((f) => f.toLowerCase().includes(search));

      if (!matchesSearch) return false;

      if (selectedTech !== 'All') {
        if (selectedTech === 'LTPO') {
          if (disp.technology !== 'LTPO OLED' && !disp.type.includes('LTPO')) return false;
        } else if (selectedTech === 'OLED') {
          if (!disp.technology?.includes('OLED') && !disp.technology?.includes('AMOLED')) return false;
        } else if (selectedTech === 'LCD') {
          if (!disp.technology?.includes('LCD')) return false;
        }
      }

      if (selectedResolution !== 'All') {
        const cat = disp.resolution_details?.category || (disp.resolution.includes('2K') ? '2K' : disp.resolution.includes('1.5K') ? '1.5K' : disp.resolution.includes('FHD') ? 'FHD+' : 'HD+');
        if (!cat.toLowerCase().includes(selectedResolution.toLowerCase())) return false;
      }

      if (selectedShape !== 'All') {
        const shape = disp.panel_shape || (disp.type.includes('Curved') ? 'Curved' : 'Flat');
        if (selectedShape === 'Curved' && shape !== 'Curved' && shape !== 'Micro-Curved') return false;
        if (selectedShape === 'Flat' && shape !== 'Flat') return false;
        if (selectedShape === 'Foldable' && shape !== 'Foldable') return false;
      }

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
      return 0;
    });
  }, [searchTerm, selectedTech, selectedResolution, selectedShape, selectedSizeFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-cyan-950/30 border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono mb-2">
              <Monitor className="w-3.5 h-3.5" />
              <span>SMARTPHONE DISPLAY &amp; OPTICS LABORATORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              Smartphone Display Database
            </h1>
            <p className="text-sm text-zinc-400 max-w-3xl mt-1">
              Explore authentic panel technologies across LTPO 3.0 AMOLED, high-refresh 165Hz esports panels, eye-safe DC-dimmed LTPS LCDs, and foldable Ultra-Thin Glass (UTG).
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center min-w-[75px]">
              <span className="text-xl font-bold font-mono text-cyan-400 block">{stats.total}</span>
              <span className="text-[10px] text-zinc-400 font-mono">Panels</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center min-w-[75px]">
              <span className="text-xl font-bold font-mono text-purple-400 block">{stats.ltpo}</span>
              <span className="text-[10px] text-zinc-400 font-mono">LTPO 1Hz</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center min-w-[75px]">
              <span className="text-xl font-bold font-mono text-amber-400 block">{stats.peak4k}</span>
              <span className="text-[10px] text-zinc-400 font-mono">&gt;3000 Nits</span>
            </div>
          </div>
        </div>

        {/* Interactive PPI & Aspect Ratio Calculator Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mt-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <Calculator className="w-4 h-4" />
            <span>INTERACTIVE DISPLAY PPI &amp; ASPECT RATIO CALCULATOR</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Height (Pixels)</label>
              <input
                type="number"
                value={calcHeight}
                onChange={(e) => setCalcHeight(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Width (Pixels)</label>
              <input
                type="number"
                value={calcWidth}
                onChange={(e) => setCalcWidth(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Diagonal (Inches)</label>
              <input
                type="number"
                step="0.01"
                value={calcDiagonal}
                onChange={(e) => setCalcDiagonal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60">
              <span className="text-[10px] text-zinc-400 font-mono block">Calculated Density</span>
              <span className="text-base font-bold font-mono text-cyan-300">{calculatedPPI} PPI</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 font-mono block">Ratio &amp; Category</span>
              <span className="text-xs font-bold font-mono text-white block truncate">
                {calculatedAspect} • {calculatedCategory}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by panel model, resolution, Gorilla Glass, or PWM..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {compareIds.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Columns className="w-4 h-4" />
                <span>Compare Matrix ({compareIds.length})</span>
              </button>
            )}

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="recommended">Sort: Default</option>
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
            { id: 'All', label: 'All Displays' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDisplays.map((disp) => {
          const isCompared = compareIds.includes(disp.id);

          return (
            <div
              key={disp.id}
              className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
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
                  </div>

                  <button
                    onClick={() => toggleCompare(disp.id)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                      isCompared
                        ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Columns className="w-3 h-3" />
                    <span>{isCompared ? 'Compared' : 'Compare'}</span>
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {disp.name}
                </h3>
                {disp.marketing_name && (
                  <p className="text-xs text-zinc-400 italic mb-3">{disp.marketing_name}</p>
                )}

                {/* Technical Specifications Matrix */}
                <div className="space-y-2 mt-3 text-xs font-mono border-t border-zinc-800/80 pt-3">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Resolution &amp; PPI:
                    </span>
                    <span className="text-zinc-200 font-semibold">
                      {disp.resolution_details ? `${disp.resolution_details.width}×${disp.resolution_details.height} (${disp.ppi} PPI)` : disp.resolution}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      Peak Brightness:
                    </span>
                    <span className="text-amber-400 font-bold">
                      {disp.brightness?.peak_nits || disp.peakBrightness} nits
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      Touch Sampling:
                    </span>
                    <span className="text-zinc-200 font-semibold">
                      {disp.touch_sampling_hz || 240}Hz
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      PWM / Dimming:
                    </span>
                    <span className="text-purple-300">
                      {disp.pwm?.frequency_hz ? `${disp.pwm.frequency_hz}Hz High-Freq` : 'DC Dimming (0 PWM)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-zinc-400" />
                      Glass Protection:
                    </span>
                    <span className="text-zinc-300 truncate max-w-[150px]">
                      {disp.screen_protection?.protection_model || disp.glassType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Color &amp; HDR:
                    </span>
                    <span className="text-zinc-300 truncate max-w-[150px]">
                      {disp.color_depth || '10-bit'} • {(disp.hdr && disp.hdr.length > 0) ? disp.hdr[0] : (disp.hdrSupport?.[0] || 'Standard')}
                    </span>
                  </div>
                </div>

                {/* Features & Certifications */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {disp.features.slice(0, 2).map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800"
                    >
                      {feat}
                    </span>
                  ))}
                  {disp.fingerprint_support && (
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      {disp.fingerprint_support}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Cost and Action */}
              <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block">Estimated BOM Cost</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {formatINR(disp.price || disp.estimated_cost_inr)}
                  </span>
                </div>

                <button
                  onClick={() => onSelectDisplayAndBuild(disp)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <span>Equip in Build</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      <DisplayCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        displays={selectedCompareDisplays}
        onSelectDisplay={onSelectDisplayAndBuild}
      />
    </div>
  );
};
