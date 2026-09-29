import React from 'react';
import { X, Check, ShieldCheck, Sun, Eye, Zap, Sparkles, Monitor, Layers } from 'lucide-react';
import { DisplayComponent } from '../../types/phone';
import { formatINR } from '../../utils/formatters';

interface DisplayCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  displays: DisplayComponent[];
  onSelectDisplay?: (display: DisplayComponent) => void;
  currentDisplayId?: string;
}

export const DisplayCompareModal: React.FC<DisplayCompareModalProps> = ({
  isOpen,
  onClose,
  displays,
  onSelectDisplay,
  currentDisplayId,
}) => {
  if (!isOpen || displays.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                <span>SMARTPHONE DISPLAY COMPARISON MATRIX</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Side-by-side technical evaluation across panel architecture, resolution, PWM, and optical performance.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Side-by-Side Comparison Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-zinc-800/80 space-y-6">
          {/* Top Panel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displays.map((disp) => {
              const isCurrent = currentDisplayId === disp.id;

              return (
                <div
                  key={disp.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-zinc-900 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-zinc-900/70 border-zinc-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
                        {disp.technology || disp.type}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        {disp.size}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{disp.name}</h3>
                    {disp.marketing_name && (
                      <p className="text-[11px] text-zinc-400 italic mb-2">{disp.marketing_name}</p>
                    )}

                    <div className="text-lg font-bold font-mono text-cyan-400 mb-3">
                      {formatINR(disp.price || disp.estimated_cost_inr)}
                    </div>
                  </div>

                  {onSelectDisplay && (
                    <button
                      onClick={() => {
                        onSelectDisplay(disp);
                        onClose();
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-zinc-800 text-cyan-400 border border-cyan-700/50'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Equipped in Build</span>
                        </>
                      ) : (
                        <span>Equip to Current Build</span>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Spec Comparison Rows */}
          <div className="pt-4 space-y-4">
            <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
              DISPLAY HARDWARE SPECIFICATION BENCHMARK
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500">
                    <th className="py-2.5 px-3 w-1/4">Specification</th>
                    {displays.map((d) => (
                      <th key={d.id} className="py-2.5 px-3 text-white font-bold">
                        {d.name.split(' ')[0]} {d.name.split(' ')[1]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300">
                  {/* Resolution & Density */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">Resolution &amp; PPI</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3 font-semibold text-cyan-300">
                        {d.resolution_details ? (
                          <>
                            {d.resolution_details.width} × {d.resolution_details.height}
                            <span className="block text-[10px] text-zinc-400 font-normal">
                              {d.ppi} PPI ({d.resolution_details.category})
                            </span>
                          </>
                        ) : (
                          `${d.resolution}`
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Refresh Rate Range & Adaptive Type */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">Refresh Rate &amp; Type</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3">
                        <span className="font-bold text-white">
                          {d.refresh_rate_range ? `${d.refresh_rate_range.min_hz}Hz - ${d.refresh_rate_range.max_hz}Hz` : d.refreshRate}
                        </span>
                        <span className="block text-[10px] text-zinc-400">
                          {d.refresh_rate_range?.adaptive_type || 'Adaptive Refresh'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Touch Sampling Rate */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">Touch Sampling Rate</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3">
                        <span className="font-bold text-amber-400">{d.touch_sampling_hz || 240}Hz</span>
                        <span className="text-[10px] text-zinc-500 block">Touch response</span>
                      </td>
                    ))}
                  </tr>

                  {/* Brightness Levels */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">Typical / Peak Brightness</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3">
                        <span className="text-white font-bold">
                          {d.brightness?.typical_nits ? `${d.brightness.typical_nits} nits (Typ)` : 'Standard'}
                        </span>
                        <span className="block text-[10px] text-emerald-400 font-bold">
                          {d.brightness?.peak_nits || d.peakBrightness} nits Peak
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* HDR Certification */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">HDR Standards</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {(d.hdr || d.hdrSupport || []).map((h, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                              {h}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Color Depth & Calibration */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">Color Depth &amp; Gamut</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3">
                        <span className="font-semibold text-white">{d.color_depth || '10-bit'}</span>
                        <span className="block text-[10px] text-zinc-400">
                          {d.color_gamut?.dci_p3 ? `${d.color_gamut.dci_p3}% DCI-P3` : 'Wide Gamut'}
                          {d.color_calibration?.delta_e ? ` (ΔE < ${d.color_calibration.delta_e})` : ''}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* PWM & Flicker Reduction */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">PWM Dimming &amp; DC</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3">
                        {d.pwm?.frequency_hz ? (
                          <span className="font-bold text-purple-400">{d.pwm.frequency_hz}Hz High-Freq</span>
                        ) : (
                          <span className="font-bold text-emerald-400">Pure DC Dimming (0 PWM)</span>
                        )}
                        <span className="block text-[10px] text-zinc-400">
                          {d.pwm?.dc_dimming ? 'DC Dimming Supported' : 'Hardware Flicker Protection'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Panel Shape & Screen Protection */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">Glass Protection &amp; Shape</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3">
                        <span className="text-white font-medium">
                          {d.screen_protection?.protection_model || d.glassType}
                        </span>
                        <span className="block text-[10px] text-zinc-400">
                          Panel Shape: {d.panel_shape || 'Flat'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Fingerprint Sensor Support */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">Fingerprint Sensor Method</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block ${
                            d.fingerprint_support === 'Ultrasonic In-Display'
                              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                              : d.fingerprint_support === 'Optical In-Display'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {d.fingerprint_support || 'Optical In-Display'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Always-On Display */}
                  <tr>
                    <td className="py-2.5 px-3 text-zinc-400">Always-On Display (AOD)</td>
                    {displays.map((d) => (
                      <td key={d.id} className="py-2.5 px-3 text-zinc-300">
                        {d.always_on_display?.supported ? (
                          <span className="text-emerald-400 font-semibold">{d.always_on_display.aod_type}</span>
                        ) : (
                          <span className="text-zinc-500">Not Supported</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
