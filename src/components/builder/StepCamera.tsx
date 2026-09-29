import React from 'react';
import { Check, Camera, Info, Video, Sparkles, Crosshair } from 'lucide-react';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { CAMERAS } from '../../data/components';
import { formatINR } from '../../utils/formatters';

export const StepCamera: React.FC = () => {
  const { config, updateComponent, nextStep, prevStep } = usePhoneBuilder();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Camera className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Step 5: Configure Optics &amp; Cameras</h2>
        </div>
        <p className="text-xs text-zinc-400">
          Choose primary sensor physics, optical image stabilization (OIS), focal lengths, and front selfie optics.
        </p>
      </div>

      {/* Critical Photographic Quality Notice */}
      <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-cyan-300 font-semibold">Important Photography Rule: </strong>
          Megapixels alone do not determine camera quality. Physical sensor area (e.g. 1/1.3&quot;), optical image stabilization (OIS), lens aperture, and the processor&apos;s computational RAW ISP pipeline are what create crisp low-light shots and natural portrait depth.
        </div>
      </div>

      <div className="space-y-3">
        {CAMERAS.map((cam) => {
          const isSelected = config.camera?.id === cam.id;

          return (
            <div
              key={cam.id}
              onClick={() => updateComponent('camera', cam)}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-zinc-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                    {cam.mainMP} Main
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    Sensor: {cam.sensorSize}
                  </span>
                  {cam.ois && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      Hardware OIS Active
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-zinc-100">{cam.name}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-zinc-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Lenses: {cam.secondarySetup}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Video: {cam.videoCapability}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Front Camera: {cam.frontMP}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {cam.features.map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:text-right border-t md:border-t-0 md:border-l border-zinc-800 pt-3 md:pt-0 md:pl-5 shrink-0 flex md:flex-col justify-between items-center md:items-end">
                <span className="text-xs text-zinc-500 font-mono">Estimated Cost</span>
                <span className="text-lg font-bold font-mono text-cyan-400">
                  {formatINR(cam.price)}
                </span>
              </div>
            </div>
          );
        })}
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
          <span>Continue to Step 6: Battery</span>
        </button>
      </div>
    </div>
  );
};
