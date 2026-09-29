import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, ZoomIn, ZoomOut, Smartphone, Sparkles, Cpu, Battery, Wifi, ShieldCheck, Tag, Edit2 } from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { PhoneCameraModule } from './PhoneCameraModule';
import { COLOR_SWATCHES } from '../../data/components';
import { ThorLogo } from '../common/ThorLogo';

interface PhoneVisualizerProps {
  compact?: boolean;
}

export const PhoneVisualizer: React.FC<PhoneVisualizerProps> = ({ compact = false }) => {
  const {
    config,
    previewSide,
    setPreviewSide,
    togglePreviewSide,
    previewColor,
    setPreviewColor,
    previewZoom,
    setPreviewZoom,
    updateBrandName,
  } = usePhoneBuilder();

  const [tiltAngle, setTiltAngle] = useState<number>(0);
  const [screenView, setScreenView] = useState<'wallpaper' | 'gaming_dashboard'>('wallpaper');
  const [isEditingBrandInline, setIsEditingBrandInline] = useState<boolean>(false);

  const backMaterial = config.design?.backMaterial || 'Frosted Matte AG Glass';
  const frameMaterial = config.design?.frameMaterial || 'Aerospace Aluminum 6000';
  const customEngraving = config.design?.customEngraving || '';
  const brandDisplayName = config.brandName !== undefined ? config.brandName : 'THOR';

  // Get matching accent
  const activeSwatch = COLOR_SWATCHES.find((s) => s.hex.toLowerCase() === previewColor.toLowerCase()) || {
    name: 'Custom',
    hex: previewColor,
    accent: '#06b6d4',
  };

  // Calculate realistic thickness & weight
  const baseThickness = 7.4;
  const batteryThickness = config.battery?.thicknessAddedMm || 0.4;
  const totalThickness = (baseThickness + batteryThickness).toFixed(1);

  const baseWeight = 145;
  const batteryWeight = config.battery?.weightGrams || 68;
  const materialBonus = backMaterial === 'Nano-Zirconia Ceramic' ? 24 : frameMaterial === 'Grade 5 Titanium & Steel' ? 14 : 0;
  const totalWeight = Math.round(baseWeight + batteryWeight + materialBonus);

  // Background texture styles
  const getBackTextureStyle = () => {
    if (backMaterial === 'Cyber Carbon Fiber Weave') {
      return {
        backgroundColor: previewColor,
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(circle at 0% 0%, rgba(0,0,0,0.4) 1px, transparent 1px)`,
        backgroundSize: '12px 12px, 6px 6px',
      };
    }
    if (backMaterial === 'Nano-Zirconia Ceramic') {
      return {
        backgroundColor: previewColor,
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.3) 100%)`,
      };
    }
    if (backMaterial === 'Bio-Eco Vegan Leather') {
      return {
        backgroundColor: previewColor,
        backgroundImage: `radial-gradient(rgba(0,0,0,0.18) 15%, transparent 16%)`,
        backgroundSize: '4px 4px',
      };
    }
    // Frosted Matte AG Glass default
    return {
      backgroundColor: previewColor,
      backgroundImage: `linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.35) 100%)`,
    };
  };

  // Frame border styling based on frame material
  const getFrameBorderClass = () => {
    if (frameMaterial === 'Grade 5 Titanium & Steel') {
      return 'border-[5px] border-zinc-400/90 shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-zinc-300';
    }
    if (frameMaterial === 'Aerospace Aluminum 6000') {
      return 'border-[5px] border-zinc-600/90 shadow-2xl ring-1 ring-zinc-500/50';
    }
    return 'border-[5px] border-zinc-800 shadow-xl';
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Top Quick Badges */}
      <div className="flex items-center justify-between w-full max-w-sm px-2 mb-3 text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-zinc-800">
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>{config.display?.size || '6.7"'}</span>
          <span className="text-zinc-600">•</span>
          <span>{totalThickness}mm</span>
          <span className="text-zinc-600">•</span>
          <span>{totalWeight}g</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setTiltAngle((prev) => (prev === 0 ? -12 : prev === -12 ? 12 : 0))}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            title="3D Perspective Tilt"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewZoom(previewZoom === 1 ? 1.15 : 1)}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            title="Toggle Zoom"
          >
            {previewZoom === 1 ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main 3D Phone Container */}
      <div
        className="relative py-2 flex items-center justify-center transition-transform duration-300"
        style={{
          transform: `scale(${compact ? 0.85 : previewZoom}) rotateY(${tiltAngle}deg)`,
          perspective: 1200,
        }}
      >
        <AnimatePresence mode="wait">
          {previewSide === 'front' ? (
            /* FRONT DISPLAY VIEW */
            <motion.div
              key="front-view"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`relative w-72 h-[550px] rounded-[42px] bg-black p-2.5 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ${getFrameBorderClass()}`}
            >
              {/* Antenna Bands on Frame */}
              <div className="absolute top-24 -left-1.5 w-1 h-3 bg-zinc-500 rounded-r" />
              <div className="absolute top-24 -right-1.5 w-1 h-3 bg-zinc-500 rounded-l" />
              <div className="absolute bottom-24 -left-1.5 w-1 h-3 bg-zinc-500 rounded-r" />
              <div className="absolute bottom-24 -right-1.5 w-1 h-3 bg-zinc-500 rounded-l" />

              {/* Inner Screen Bezel */}
              <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-zinc-950 flex flex-col justify-between border border-zinc-800/80">
                {/* Punch Hole Selfie Camera */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-black border border-zinc-800 flex items-center justify-center shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-zinc-900 border border-blue-900 flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-cyan-400" />
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="relative z-20 px-6 pt-3 flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span>12:45</span>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <span className="text-[9px] px-1 bg-cyan-500/20 text-cyan-300 rounded font-bold">5G</span>
                    <Wifi className="w-3 h-3 text-zinc-300" />
                    <div className="flex items-center gap-0.5">
                      <span>98%</span>
                      <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Interactive Screen Body */}
                <div
                  onClick={() => setScreenView((v) => (v === 'wallpaper' ? 'gaming_dashboard' : 'wallpaper'))}
                  className="relative flex-1 px-4 py-4 flex flex-col justify-between cursor-pointer"
                  style={{
                    background:
                      screenView === 'wallpaper'
                        ? `radial-gradient(ellipse at top, ${activeSwatch.accent}33 0%, rgba(15,23,42,0.85) 55%, #09090b 100%)`
                        : `linear-gradient(180deg, #09090b 0%, #111827 100%)`,
                  }}
                >
                  {screenView === 'wallpaper' ? (
                    <>
                      {/* Wallpaper Clock & Date */}
                      <div className="mt-6 text-center">
                        <div className="text-4xl font-light tracking-tight text-white drop-shadow-md">
                          12:45
                        </div>
                        <div className="text-xs text-zinc-300 font-medium mt-1">
                          Monday, September 28
                        </div>
                        <div className="inline-flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full mt-2">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{config.display?.refreshRate || '120Hz'} Active Display</span>
                        </div>
                      </div>

                      {/* Interactive Live Widgets */}
                      <div className="space-y-2 mt-auto mb-4">
                        <div className="p-2.5 rounded-2xl bg-zinc-900/80 backdrop-blur border border-zinc-700/60 shadow-lg">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-200">
                            <span className="flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                              {config.processor?.name || 'Processor'}
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {config.ram?.capacity} RAM
                            </span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-2/5 rounded-full" />
                          </div>
                        </div>

                        <div className="text-center text-[10px] text-zinc-400 font-mono">
                          (Tap screen to view Gaming Space)
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Gaming Space Overlay */
                    <div className="mt-4 flex flex-col justify-between h-full py-2">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" /> GAME SPACE OS
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono rounded">
                          {config.audioHaptics?.touchSamplingRate || '480Hz'} Touch
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-auto">
                        <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                          <div className="text-[10px] text-zinc-400">FPS STABILITY</div>
                          <div className="text-lg font-bold text-cyan-400 font-mono">90 - 120</div>
                          <div className="text-[9px] text-zinc-500">Free Fire / BGMI</div>
                        </div>
                        <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                          <div className="text-[10px] text-zinc-400">CHASSIS TEMP</div>
                          <div className="text-lg font-bold text-emerald-400 font-mono">35.4°C</div>
                          <div className="text-[9px] text-zinc-500">{config.cooling?.tier || 'Cooling'}</div>
                        </div>
                      </div>

                      <div className="text-center text-[10px] text-zinc-400 font-mono">
                        (Tap screen to return to wallpaper)
                      </div>
                    </div>
                  )}

                  {/* Bottom Navigation Indicator Bar */}
                  <div className="w-24 h-1 bg-white/70 rounded-full mx-auto mb-1" />
                </div>
              </div>
            </motion.div>
          ) : (
            /* BACK CHASSIS VIEW */
            <motion.div
              key="back-view"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`relative w-72 h-[550px] rounded-[42px] p-2.5 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ${getFrameBorderClass()}`}
              style={getBackTextureStyle()}
            >
              {/* Antenna Bands on Frame */}
              <div className="absolute top-24 -left-1.5 w-1 h-3 bg-zinc-400 rounded-r" />
              <div className="absolute top-24 -right-1.5 w-1 h-3 bg-zinc-400 rounded-l" />
              <div className="absolute bottom-24 -left-1.5 w-1 h-3 bg-zinc-400 rounded-r" />
              <div className="absolute bottom-24 -right-1.5 w-1 h-3 bg-zinc-400 rounded-l" />

              {/* Gloss Light Reflection Curve */}
              <div className="absolute top-0 right-0 w-36 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none rounded-[36px]" />

              {/* Camera Module Island */}
              <div className="relative pt-4 z-10">
                <PhoneCameraModule camera={config.camera} design={config.design} />
              </div>

              {/* Middle Subtle Qi Wireless Charging Coil Ring Accent (if wireless capable) */}
              {config.charging?.wirelessCharging && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-white/10 pointer-events-none flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/5" />
                </div>
              )}

              {/* Custom Laser Engraving (if present) */}
              {customEngraving && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
                  <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase px-2 py-0.5 border border-white/10 rounded">
                    {customEngraving}
                  </span>
                </div>
              )}

              {/* Bottom THOR Mobile Brand Emblem */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <ThorLogo
                  variant={brandDisplayName === 'THOR' ? 'full' : 'emblem'}
                  size={brandDisplayName === 'THOR' ? 96 : 38}
                  subtext="MOBILE BRAND"
                  className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                />
                {brandDisplayName !== 'THOR' && (
                  <div className="text-[11px] font-bold tracking-[0.25em] text-white/90 uppercase mt-0.5">
                    {brandDisplayName}
                  </div>
                )}
                <div className="text-[7.5px] font-mono tracking-wider text-white/40 uppercase mt-0.5">
                  DESIGNED BY USER • VERIFIED BY SAJASE
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View Switcher & Color Swatches */}
      <div className="w-full max-w-sm mt-3 flex flex-col items-center gap-3">
        {/* Front / Back Toggle Buttons */}
        <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner">
          <button
            onClick={() => setPreviewSide('front')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              previewSide === 'front'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Front Screen
          </button>
          <button
            onClick={() => setPreviewSide('back')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              previewSide === 'back'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Back Chassis
          </button>
        </div>

        {/* Brand Name Modifier */}
        <div className="flex items-center justify-between w-full max-w-sm px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono shadow-sm">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">Rear Emblem:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              maxLength={20}
              value={brandDisplayName}
              onChange={(e) => updateBrandName(e.target.value.toUpperCase())}
              placeholder="THOR"
              className="w-32 px-2 py-0.5 rounded-lg bg-zinc-950 border border-cyan-800/80 text-cyan-300 font-bold text-xs uppercase tracking-widest text-center focus:outline-none focus:border-cyan-400"
              title="Change phone brand name etched onto rear chassis"
            />
            {brandDisplayName !== 'THOR' && (
              <button
                onClick={() => updateBrandName('THOR')}
                className="text-[10px] text-zinc-500 hover:text-cyan-400 font-mono underline cursor-pointer"
                title="Reset to THOR"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Color Swatches */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-[11px] font-mono text-zinc-400 mr-1">Color:</span>
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.name}
              onClick={() => setPreviewColor(swatch.hex)}
              className={`w-5 h-5 rounded-full transition-transform border ${
                previewColor.toLowerCase() === swatch.hex.toLowerCase()
                  ? 'scale-125 border-cyan-400 ring-2 ring-cyan-500/40'
                  : 'border-zinc-700 hover:scale-110'
              }`}
              style={{ backgroundColor: swatch.hex }}
              title={swatch.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
