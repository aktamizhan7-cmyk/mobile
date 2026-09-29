import React from 'react';
import { CameraComponent, DesignComponent } from '../../types/phone';

interface PhoneCameraModuleProps {
  camera: CameraComponent;
  design: DesignComponent;
}

export const PhoneCameraModule: React.FC<PhoneCameraModuleProps> = ({ camera, design }) => {
  const layout = design?.cameraModuleLayout || 'Cyber Matrix';

  // Render based on selected layout style
  if (layout === 'Circular Horizon') {
    return (
      <div className="relative w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-1 shadow-2xl border border-zinc-700/60 flex items-center justify-center">
        {/* Outer metallic fluted bezel */}
        <div className="absolute inset-1 rounded-full border border-zinc-500/30" />
        <div className="relative w-28 h-28 rounded-full bg-zinc-950 p-2 flex flex-wrap items-center justify-around">
          {/* Main Lens */}
          <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-600/80 p-1 relative shadow-inner">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-950 to-indigo-950 border border-cyan-500/40 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            </div>
            <div className="absolute -bottom-1 -right-1 text-[8px] font-mono text-zinc-400 bg-zinc-900/90 px-1 rounded border border-zinc-700">
              {camera.mainMP}
            </div>
          </div>

          {/* Secondary Lens */}
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-600 p-0.5 relative">
            <div className="w-full h-full rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500/70" />
            </div>
          </div>

          {/* Third Lens / Periscope */}
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-600 p-0.5 relative">
            <div className="w-full h-full rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
          </div>

          {/* Flash & Laser AF */}
          <div className="w-5 h-5 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.6)] border border-amber-200" />
        </div>
      </div>
    );
  }

  if (layout === 'Hexa Shield') {
    return (
      <div className="relative w-32 p-3 rounded-2xl bg-zinc-900/90 backdrop-blur border border-zinc-700 shadow-xl ml-4">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            {/* Primary Large Lens */}
            <div className="w-11 h-11 rounded-xl bg-zinc-950 border-2 border-cyan-500/60 p-1 flex items-center justify-center shadow-inner">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-950 to-blue-900 border border-cyan-400 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              </div>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <div className="w-4 h-4 rounded-full bg-amber-300 shadow-md" />
              <span className="text-[7px] font-mono text-cyan-400 tracking-wider">OIS</span>
            </div>
          </div>

          {/* Secondary Lenses */}
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-700 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500/80" />
            </div>
            <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-700 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-zinc-600" />
            </div>
          </div>
          <div className="text-[8px] font-mono text-zinc-400 border-t border-zinc-800 pt-1 text-center">
            {camera.mainMP} • {camera.sensorSize}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'Linear Duo/Trio') {
    return (
      <div className="relative flex flex-col gap-3 ml-5 py-2">
        {/* Floating Minimalist Lenses */}
        <div className="w-12 h-12 rounded-full bg-zinc-950 border-2 border-zinc-500 shadow-2xl p-1 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-zinc-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-cyan-500/90 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-500 shadow-xl p-1 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-blue-500/80" />
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-500 shadow-xl p-1 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
        </div>

        <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm ml-3.5 mt-0.5" />
      </div>
    );
  }

  // Default: Cyber Matrix
  return (
    <div className="relative w-36 p-3 rounded-2xl bg-zinc-900/95 backdrop-blur border border-zinc-700/80 shadow-2xl ml-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
            {camera.mainMP} MATRIX
          </span>
          <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Main Primary Camera */}
          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-600 p-1 flex items-center justify-center relative">
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 border border-cyan-500/60 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-cyan-400/90 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
            </div>
            <span className="absolute bottom-0 right-1 text-[7px] font-mono text-zinc-400">1X</span>
          </div>

          {/* Ultrawide */}
          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-700 p-1 flex items-center justify-center relative">
            <div className="w-full h-full rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500/80" />
            </div>
            <span className="absolute bottom-0 right-1 text-[7px] font-mono text-zinc-400">UW</span>
          </div>

          {/* Telephoto / Macro */}
          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-700 p-1 flex items-center justify-center relative">
            <div className="w-full h-full rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="absolute bottom-0 right-1 text-[7px] font-mono text-zinc-400">3X</span>
          </div>

          {/* Sensor specs badge */}
          <div className="w-12 h-12 rounded-xl bg-zinc-950/70 border border-zinc-800 flex flex-col items-center justify-center p-1 text-center">
            <span className="text-[7px] font-mono text-zinc-300 font-bold leading-tight">OIS+EIS</span>
            <span className="text-[6px] font-mono text-zinc-500 mt-0.5">SPECTRA</span>
          </div>
        </div>

        <div className="text-[7.5px] font-mono text-zinc-400 border-t border-zinc-800 pt-1 flex justify-between">
          <span>{camera.sensorSize}</span>
          <span className="text-cyan-400">4K HDR</span>
        </div>
      </div>
    </div>
  );
};
