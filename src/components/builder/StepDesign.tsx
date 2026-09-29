import React from 'react';
import { Check, Palette, Sparkles, Shield, Box, Type } from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { DESIGNS, COLOR_SWATCHES } from '../../data/components';
import { formatINR } from '../../utils/formatters';
import { ThorLogo } from '../common/ThorLogo';

const CAMERA_MODULE_STYLES: { id: 'Cyber Matrix' | 'Circular Horizon' | 'Linear Duo/Trio' | 'Hexa Shield'; name: string; desc: string }[] = [
  { id: 'Cyber Matrix', name: 'Cyber Matrix', desc: 'Chamfered tech rectangle with dual accent rings' },
  { id: 'Circular Horizon', name: 'Circular Horizon', desc: 'Luxury mechanical chronometer style central dial' },
  { id: 'Linear Duo/Trio', name: 'Linear Duo/Trio', desc: 'Ultra-clean vertical minimalist floating lenses' },
  { id: 'Hexa Shield', name: 'Hexa Shield', desc: 'Angular sci-fi shield with high-aperture primary lens' },
];

export const StepDesign: React.FC = () => {
  const {
    config,
    updateComponent,
    nextStep,
    prevStep,
    previewColor,
    setPreviewColor,
    setPreviewSide,
    updateBrandName,
  } = usePhoneBuilder();

  const handleSelectDesignPreset = (design: any) => {
    updateComponent('design', design);
    setPreviewColor(design.hexColor);
    setPreviewSide('back');
  };

  const handleColorChange = (hex: string, name: string) => {
    setPreviewColor(hex);
    if (config.design) {
      updateComponent('design', {
        ...config.design,
        hexColor: hex,
        colorName: name,
      });
    }
  };

  const handleLayoutChange = (layout: 'Cyber Matrix' | 'Circular Horizon' | 'Linear Duo/Trio' | 'Hexa Shield') => {
    if (config.design) {
      updateComponent('design', {
        ...config.design,
        cameraModuleLayout: layout,
      });
      setPreviewSide('back');
    }
  };

  const handleEngravingChange = (text: string) => {
    if (config.design) {
      updateComponent('design', {
        ...config.design,
        customEngraving: text.slice(0, 24),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Step 10: Exterior Design &amp; Materials</h2>
        </div>
        <p className="text-xs text-zinc-400">
          Tailor chassis materials, finish, camera module geometry, bespoke color, and laser engraving.
        </p>
      </div>

      {/* Camera Module Layout Picker */}
      <div className="space-y-3">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold block">
          Camera Module Architecture
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CAMERA_MODULE_STYLES.map((style) => {
            const isSelected = config.design?.cameraModuleLayout === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleLayoutChange(style.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-mono">{style.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">{style.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bespoke Color Palette */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold block">
            Color Finish
          </label>
          <span className="text-xs font-mono text-cyan-400 font-semibold">
            {config.design?.colorName || 'Obsidian Black'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          {COLOR_SWATCHES.map((swatch) => {
            const isSelected = previewColor.toLowerCase() === swatch.hex.toLowerCase();
            return (
              <button
                key={swatch.name}
                type="button"
                onClick={() => handleColorChange(swatch.hex, swatch.name)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-zinc-800 border-cyan-400 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="text-xs font-mono">{swatch.name}</span>
              </button>
            );
          })}

          {/* Custom Color Input */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-xl">
            <span className="text-[11px] font-mono text-zinc-400">Custom:</span>
            <input
              type="color"
              value={previewColor}
              onChange={(e) => handleColorChange(e.target.value, 'Custom Bespoke')}
              className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Frame & Back Material Presets */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold block">
          Structural Materials &amp; Finish
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DESIGNS.map((d) => {
            const isSelected = config.design?.id === d.id;

            return (
              <div
                key={d.id}
                onClick={() => handleSelectDesignPreset(d)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: d.hexColor }}
                    />
                    <span className="text-xs font-bold text-zinc-100">{d.colorName}</span>
                  </div>

                  <div className="text-xs text-zinc-300 font-medium">
                    {d.frameMaterial} + {d.backMaterial}
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                      {d.finishStyle} Finish
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                      {d.waterResistanceRating}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Chassis Cost</span>
                  <span className="text-cyan-400 font-bold">{formatINR(d.price)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rear Brand Emblem & Laser Engraving */}
      <div className="space-y-4 pt-2 border-t border-zinc-800">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold block">
                Rear Chassis Brand Emblem
              </label>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              {config.brandName || 'THOR'}
            </span>
          </div>

          {/* Logo Showcase Banner */}
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ThorLogo variant="emblem" size={40} />
              <div>
                <div className="text-xs font-bold font-mono text-white tracking-widest uppercase">
                  THOR MOBILE BRAND
                </div>
                <div className="text-[10px] text-zinc-400">
                  Precision laser-etched orbital lightning emblem
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <ThorLogo variant="full" size="sm" subtext={config.brandName || 'THOR'} />
            </div>
          </div>

          <input
            type="text"
            maxLength={20}
            value={config.brandName !== undefined ? config.brandName : 'THOR'}
            onChange={(e) => {
              updateBrandName(e.target.value.toUpperCase());
              setPreviewSide('back');
            }}
            placeholder="THOR"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 uppercase tracking-widest font-bold"
          />
          <div className="text-[10px] text-zinc-500 font-mono">
            Customizes the brand name displayed directly on the rear chassis orbital emblem.
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Type className="w-4 h-4 text-cyan-400" />
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold block">
              Custom Laser Engraving (Optional)
            </label>
          </div>
          <input
            type="text"
            maxLength={24}
            value={config.design?.customEngraving || ''}
            onChange={(e) => handleEngravingChange(e.target.value)}
            placeholder="e.g. SPECIAL EDITION #001 or YOUR NAME"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400"
          />
          <div className="text-[10px] text-zinc-500 font-mono">
            Precision micron laser etched onto lower back chassis. Max 24 characters.
          </div>
        </div>
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
          <span>Continue to Step 11: Review &amp; Quotation</span>
        </button>
      </div>
    </div>
  );
};
