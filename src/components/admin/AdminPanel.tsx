import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Edit2,
  Check,
  Save,
  FileSpreadsheet,
  Layers,
  Cpu,
  RefreshCw,
  Search,
  DollarSign,
  AlertCircle,
  Monitor,
  Plus,
  Calculator,
  X,
} from 'lucide-react';
import { useUserAccount } from '../../context/UserAccountContext';
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
import { formatINR } from '../../utils/formatters';
import { calculatePPI, calculateAspectRatio, getResolutionCategory } from '../../utils/displayCalculators';
import { DisplayComponent, DisplayTechnology } from '../../types/phone';

export const AdminPanel: React.FC = () => {
  const { quotations, updateQuotationStatus, isAdmin, setIsAdmin } = useUserAccount();

  const [activeCategory, setActiveCategory] = useState<string>('processors');
  const [componentList, setComponentList] = useState<any[]>(PROCESSORS);
  const [adminProcessorBrand, setAdminProcessorBrand] = useState<string>('All');
  const [adminDisplayTech, setAdminDisplayTech] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Add Custom Display Modal State
  const [isAddDisplayOpen, setIsAddDisplayOpen] = useState(false);
  const [newDispName, setNewDispName] = useState('6.7" Pro 1.5K LTPO AMOLED 144Hz');
  const [newDispTech, setNewDispTech] = useState<DisplayTechnology>('LTPO OLED');
  const [newDispWidth, setNewDispWidth] = useState(1220);
  const [newDispHeight, setNewDispHeight] = useState(2712);
  const [newDispDiagonal, setNewDispDiagonal] = useState(6.7);
  const [newDispRefresh, setNewDispRefresh] = useState('144Hz');
  const [newDispBrightness, setNewDispBrightness] = useState(3000);
  const [newDispGlass, setNewDispGlass] = useState('Corning Gorilla Glass Victus 2');
  const [newDispPrice, setNewDispPrice] = useState(5500);

  const newDispPPI = useMemo(() => {
    return calculatePPI(newDispWidth, newDispHeight, newDispDiagonal);
  }, [newDispWidth, newDispHeight, newDispDiagonal]);

  const newDispRatio = useMemo(() => {
    return calculateAspectRatio(newDispWidth, newDispHeight);
  }, [newDispWidth, newDispHeight]);

  const newDispCategory = useMemo(() => {
    return getResolutionCategory(newDispWidth, newDispHeight);
  }, [newDispWidth, newDispHeight]);

  const handleAddDisplay = () => {
    const newDisplay: DisplayComponent = {
      id: `disp_custom_${Date.now()}`,
      name: newDispName,
      type: newDispTech === 'LTPO OLED' ? 'LTPO 3.0 AMOLED' : newDispTech === 'Super AMOLED' ? 'Super AMOLED' : 'IPS LCD',
      size: `${newDispDiagonal}"`,
      refreshRate: newDispRefresh,
      resolution: `${newDispCategory} (${newDispHeight}p)`,
      peakBrightness: newDispBrightness,
      hdrSupport: ['HDR10+', 'Dolby Vision'],
      glassType: newDispGlass,
      price: newDispPrice,
      features: [`${newDispPPI} Calculated PPI`, `${newDispRefresh} Fluid Refresh`, 'Admin Custom Display'],
      inStock: true,

      technology: newDispTech,
      marketing_name: newDispName,
      diagonal_inches: newDispDiagonal,
      resolution_details: {
        width: newDispWidth,
        height: newDispHeight,
        category: newDispCategory,
        aspect_ratio: newDispRatio,
      },
      ppi: newDispPPI,
      refresh_rate_range: {
        min_hz: 1,
        max_hz: parseInt(newDispRefresh.replace('Hz', ''), 10) || 120,
        adaptive_type: newDispTech.includes('LTPO') ? 'LTPO Adaptive' : 'Adaptive',
      },
      touch_sampling_hz: 360,
      brightness: {
        typical_nits: Math.round(newDispBrightness * 0.4),
        peak_nits: newDispBrightness,
        hbm_nits: Math.round(newDispBrightness * 0.6),
      },
      hdr: ['HDR10', 'HDR10+', 'Dolby Vision'],
      color_depth: '10-bit',
      color_gamut: {
        dci_p3: 100,
        srgb: 100,
      },
      panel_shape: 'Flat',
      panel_flags: {
        flat: true,
        curved: false,
        foldable: false,
      },
      screen_protection: {
        category: 'Gorilla Glass',
        protection_model: newDispGlass,
      },
      pwm: {
        frequency_hz: 2160,
        dc_dimming: true,
        flicker_reduction: true,
      },
      eye_comfort: ['TÜV Rheinland Low Blue Light'],
      always_on_display: {
        supported: !newDispTech.includes('LCD'),
        aod_type: newDispTech.includes('LTPO') ? 'LTPO 1Hz AOD' : newDispTech.includes('LCD') ? 'None' : 'Full AOD',
      },
      fingerprint_support: newDispTech.includes('LCD') ? 'Side-Mounted Compatible' : 'Optical In-Display',
      estimated_cost_inr: newDispPrice,
      availability: 'In Stock',
      status: 'Active',
    };

    DISPLAYS.unshift(newDisplay);
    setComponentList([...DISPLAYS]);
    setIsAddDisplayOpen(false);
  };

  const [quotationStatusFilter, setQuotationStatusFilter] = useState<string>('all');
  const [adminNoteInput, setAdminNoteInput] = useState<{ [id: string]: string }>({});

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setEditingId(null);
    if (cat === 'processors') setComponentList(PROCESSORS);
    else if (cat === 'displays') setComponentList(DISPLAYS);
    else if (cat === 'ram') setComponentList(RAM_OPTIONS);
    else if (cat === 'storage') setComponentList(STORAGE_OPTIONS);
    else if (cat === 'cameras') setComponentList(CAMERAS);
    else if (cat === 'batteries') setComponentList(BATTERIES);
    else if (cat === 'charging') setComponentList(CHARGERS);
    else if (cat === 'cooling') setComponentList(COOLINGS);
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditPrice(item.price);
    setEditStock(item.inStock !== false);
  };

  const handleSaveEdit = (item: any) => {
    item.price = Number(editPrice) || item.price;
    item.inStock = editStock;
    setEditingId(null);
  };

  const filteredComponents = componentList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.brand && c.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.model && c.model.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeCategory === 'processors' && adminProcessorBrand !== 'All') {
      return matchesSearch && c.brand === adminProcessorBrand;
    }
    if (activeCategory === 'displays' && adminDisplayTech !== 'All') {
      if (adminDisplayTech === 'LTPO') return matchesSearch && (c.technology === 'LTPO OLED' || c.type?.includes('LTPO'));
      if (adminDisplayTech === 'OLED') return matchesSearch && (c.technology?.includes('OLED') || c.technology?.includes('AMOLED'));
      if (adminDisplayTech === 'LCD') return matchesSearch && c.technology?.includes('LCD');
    }
    return matchesSearch;
  });

  const filteredQuotations = quotations.filter((q) =>
    quotationStatusFilter === 'all' ? true : q.status === quotationStatusFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Warning Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-200">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider">
              ADMINISTRATIVE SUPPLY CHAIN PORTAL
            </h2>
            <p className="text-xs text-rose-300/80">
              Live adjustments directly calibrate customer BOM pricing, stock availability, and ODM quotation statuses.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAdmin(false)}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 border border-zinc-700 transition-colors shrink-0"
        >
          Exit Admin Mode
        </button>
      </div>

      {/* Component BOM Price & Stock Editor */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>SUPPLIER COMPONENT CATALOG &amp; COST MANAGEMENT</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Edit demo base procurement prices in INR and toggle supplier inventory availability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter component..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'processors', label: 'Processors (SoC)' },
            { id: 'displays', label: 'Displays' },
            { id: 'ram', label: 'RAM' },
            { id: 'storage', label: 'Storage' },
            { id: 'cameras', label: 'Cameras' },
            { id: 'batteries', label: 'Batteries' },
            { id: 'charging', label: 'Charging' },
            { id: 'cooling', label: 'Cooling' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Processor Brand Sub-Filter (when in processors category) */}
        {activeCategory === 'processors' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs font-mono">
            <span className="text-zinc-500 text-[11px] mr-1">Brand:</span>
            {['All', 'Qualcomm', 'MediaTek', 'Samsung', 'Google', 'UNISOC', 'HiSilicon'].map((brand) => (
              <button
                key={brand}
                onClick={() => setAdminProcessorBrand(brand)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                  adminProcessorBrand === brand
                    ? 'bg-zinc-800 text-cyan-300 border-cyan-700 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {brand === 'All' ? 'All Brands' : brand}
              </button>
            ))}
          </div>
        )}

        {/* Display Technology Sub-Filter and Quick Add (when in displays category) */}
        {activeCategory === 'displays' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pb-1 pt-1 text-xs font-mono border-t border-zinc-800/60 pt-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-zinc-500 text-[11px] mr-1">Technology:</span>
              {[
                { id: 'All', label: 'All Displays' },
                { id: 'LTPO', label: 'LTPO OLED' },
                { id: 'OLED', label: 'AMOLED' },
                { id: 'LCD', label: 'IPS/LTPS LCD' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setAdminDisplayTech(t.id)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                    adminDisplayTech === t.id
                      ? 'bg-zinc-800 text-cyan-300 border-cyan-700 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddDisplayOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Display (Auto-PPI)</span>
            </button>
          </div>
        )}

        {/* Table of Components */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="py-2.5 px-3">Identifier</th>
                <th className="py-2.5 px-3">Component &amp; Family</th>
                {activeCategory === 'processors' && <th className="py-2.5 px-3">Node / Benchmark</th>}
                {activeCategory === 'displays' && <th className="py-2.5 px-3">Panel Specs &amp; PPI</th>}
                <th className="py-2.5 px-3">Inventory Status</th>
                <th className="py-2.5 px-3">Base BOM Price (INR)</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-zinc-300">
              {filteredComponents.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-zinc-850/50">
                    <td className="py-3 px-3 text-zinc-500">{item.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{item.name}</div>
                      {item.brand && (
                        <div className="text-[10px] text-zinc-400">
                          {item.brand} • {item.family || item.tier || ''}
                        </div>
                      )}
                    </td>
                    {activeCategory === 'processors' && (
                      <td className="py-3 px-3 text-zinc-400">
                        <div>{item.processNode}</div>
                        {item.antutu_v10_score && (
                          <div className="text-[10px] text-emerald-400">
                            ~{(item.antutu_v10_score / 1000).toFixed(0)}k AnTuTu
                          </div>
                        )}
                      </td>
                    )}
                    {activeCategory === 'displays' && (
                      <td className="py-3 px-3 text-zinc-300">
                        <div className="font-semibold text-cyan-300">
                          {item.resolution_details ? `${item.resolution_details.width}×${item.resolution_details.height}` : item.resolution}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {item.ppi ? `${item.ppi} PPI` : ''} • {item.technology || item.type} • {item.refresh_rate_range ? `${item.refresh_rate_range.min_hz}-${item.refresh_rate_range.max_hz}Hz` : item.refreshRate}
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editStock}
                            onChange={(e) => setEditStock(e.target.checked)}
                          />
                          <span className="text-[11px]">{editStock ? 'In Stock' : 'Out of Stock'}</span>
                        </label>
                      ) : (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            item.inStock !== false
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {item.inStock !== false ? 'IN STOCK' : 'OUT OF STOCK'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseInt(e.target.value, 10) || 0)}
                          className="w-28 px-2 py-1 rounded bg-zinc-950 border border-cyan-400 text-cyan-300 font-bold"
                        />
                      ) : (
                        <span className="font-bold text-cyan-400">{formatINR(item.price)}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(item)}
                          className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1 ml-auto"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                          title="Edit Price & Stock"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quotation Workflow Management */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              <span>MANUFACTURING PIPELINE &amp; DOSSIER STATUS</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Review incoming OEM requests, advance stages, and append engineering review notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Filter:</span>
            <select
              value={quotationStatusFilter}
              onChange={(e) => setQuotationStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="all">All Statuses ({quotations.length})</option>
              <option value="Submitted">Submitted</option>
              <option value="Technical Review">Technical Review</option>
              <option value="Component Validation">Component Validation</option>
              <option value="Quotation">Quotation</option>
              <option value="Prototype Discussion">Prototype Discussion</option>
            </select>
          </div>
        </div>

        {filteredQuotations.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 font-mono text-xs">
            No dossiers match current filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotations.map((quot) => (
              <div
                key={quot.id}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400 mr-2">
                      Ref: {quot.id}
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {quot.configuration.name}
                    </span>
                    <span className="text-xs text-zinc-500 ml-2">
                      ({quot.quantityTier} • {quot.targetRegion})
                    </span>
                  </div>

                  {/* Status Advance Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-400">Stage:</span>
                    <select
                      value={quot.status}
                      onChange={(e: any) => updateQuotationStatus(quot.id, e.target.value)}
                      className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-bold text-cyan-300 focus:outline-none"
                    >
                      <option value="Submitted">1. Submitted</option>
                      <option value="Technical Review">2. Technical Review</option>
                      <option value="Component Validation">3. Component Validation</option>
                      <option value="Quotation">4. Quotation</option>
                      <option value="Prototype Discussion">5. Prototype Discussion</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-zinc-400">
                  <div>Contact: {quot.fullName} ({quot.phone})</div>
                  <div>Email: {quot.email}</div>
                  <div>Estimated Unit: {formatINR(quot.estimatedPriceINR)}</div>
                </div>

                {quot.additionalRequirements && (
                  <div className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-zinc-500 font-mono uppercase text-[10px] block">Client Demands:</span>
                    {quot.additionalRequirements}
                  </div>
                )}

                {/* Add / Update Admin Notes */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Append technical review note for client..."
                    value={adminNoteInput[quot.id] ?? quot.adminNotes ?? ''}
                    onChange={(e) =>
                      setAdminNoteInput((prev) => ({ ...prev, [quot.id]: e.target.value }))
                    }
                    className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => {
                      const note = adminNoteInput[quot.id];
                      if (note !== undefined) {
                        updateQuotationStatus(quot.id, quot.status, note);
                        alert('Engineering notes updated!');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Display Modal with Automatic PPI Calculation */}
      {isAddDisplayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    PROVISION NEW SMARTPHONE DISPLAY
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Enter physical resolution and diagonal size; PPI and aspect ratio are calculated automatically.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddDisplayOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Auto-Calculated Spec Banner */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/80 grid grid-cols-3 gap-2 text-center font-mono">
              <div>
                <span className="text-[10px] text-zinc-400 block">Calculated Density</span>
                <span className="text-lg font-bold text-cyan-300">{newDispPPI} PPI</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Aspect Ratio</span>
                <span className="text-sm font-bold text-white mt-1 block">{newDispRatio}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Resolution Class</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">{newDispCategory}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">Display Model Name</label>
                <input
                  type="text"
                  value={newDispName}
                  onChange={(e) => setNewDispName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Panel Technology</label>
                <select
                  value={newDispTech}
                  onChange={(e: any) => setNewDispTech(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="LTPO OLED">LTPO OLED (1Hz Adaptive)</option>
                  <option value="Super AMOLED">Super AMOLED</option>
                  <option value="AMOLED">AMOLED</option>
                  <option value="LTPS LCD">LTPS LCD (DC Dimmed)</option>
                  <option value="IPS LCD">IPS LCD</option>
                  <option value="Foldable OLED">Foldable OLED (UTG)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Diagonal Size (Inches)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newDispDiagonal}
                  onChange={(e) => setNewDispDiagonal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Pixel Width</label>
                <input
                  type="number"
                  value={newDispWidth}
                  onChange={(e) => setNewDispWidth(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Pixel Height</label>
                <input
                  type="number"
                  value={newDispHeight}
                  onChange={(e) => setNewDispHeight(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Max Refresh Rate</label>
                <select
                  value={newDispRefresh}
                  onChange={(e) => setNewDispRefresh(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="60Hz">60Hz</option>
                  <option value="90Hz">90Hz</option>
                  <option value="120Hz">120Hz</option>
                  <option value="144Hz">144Hz</option>
                  <option value="165Hz">165Hz</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Peak Brightness (nits)</label>
                <input
                  type="number"
                  value={newDispBrightness}
                  onChange={(e) => setNewDispBrightness(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Glass Protection Model</label>
                <input
                  type="text"
                  value={newDispGlass}
                  onChange={(e) => setNewDispGlass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Estimated BOM Cost (₹ INR)</label>
                <input
                  type="number"
                  value={newDispPrice}
                  onChange={(e) => setNewDispPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setIsAddDisplayOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDisplay}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Display Catalog</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
