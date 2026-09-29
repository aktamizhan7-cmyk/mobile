import React from 'react';
import { X, Columns, Trash2, Layers, Check, ArrowRight } from 'lucide-react';
import { useUserAccount } from '../../context/UserAccountContext';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { formatINR } from '../../utils/formatters';
import { calculatePriceBreakdown } from '../../utils/pricingEngine';
import { PhoneConfiguration } from '../../types/phone';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBuild: (config: PhoneConfiguration) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  onSelectBuild,
}) => {
  const { compareList, removeFromCompare } = useUserAccount();
  const { loadConfiguration } = usePhoneBuilder();

  if (!isOpen) return null;

  const handleLoad = (cfg: PhoneConfiguration) => {
    loadConfiguration(cfg);
    onSelectBuild(cfg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Columns className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-mono">
              COMPARE HARDWARE ARCHITECTURES ({compareList.length}/3)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {compareList.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <Columns className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
              <h3 className="text-base font-bold text-zinc-200">No phones in comparison</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Add up to 3 custom phone configurations from the builder or your saved library to compare hardware trade-offs side by side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="py-3 px-4 w-44">Specification</th>
                    {compareList.map((phone, i) => (
                      <th key={phone.id || i} className="py-3 px-4 min-w-[200px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white font-mono">
                            {phone.name || `Phone ${String.fromCharCode(65 + i)}`}
                          </span>
                          <button
                            onClick={() => removeFromCompare(phone.id)}
                            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-cyan-400 text-sm font-bold">
                          {formatINR(calculatePriceBreakdown(phone).totalEstimatedPriceINR)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300">
                  <tr>
                    <td className="py-3 px-4 text-zinc-500 font-semibold">Processor (SoC)</td>
                    {compareList.map((phone, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="font-bold text-zinc-100">{phone.processor?.name}</div>
                        <div className="text-[10px] text-zinc-400">{phone.processor?.brandTier} • {phone.processor?.processNode}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-500 font-semibold">Display</td>
                    {compareList.map((phone, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="font-bold text-zinc-100">{phone.display?.type}</div>
                        <div className="text-[10px] text-zinc-400">{phone.display?.size} • {phone.display?.refreshRate} • {phone.display?.resolution}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-500 font-semibold">RAM</td>
                    {compareList.map((phone, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="font-bold text-zinc-100">{phone.ram?.capacity}</div>
                        <div className="text-[10px] text-zinc-400">{phone.ram?.type} ({phone.ram?.speedMbps} Mbps)</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-500 font-semibold">Storage</td>
                    {compareList.map((phone, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="font-bold text-zinc-100">{phone.storage?.capacity}</div>
                        <div className="text-[10px] text-zinc-400">{phone.storage?.type}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-500 font-semibold">Camera Setup</td>
                    {compareList.map((phone, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="font-bold text-zinc-100">{phone.camera?.mainMP} Main ({phone.camera?.ois ? 'OIS' : 'EIS'})</div>
                        <div className="text-[10px] text-zinc-400">{phone.camera?.secondarySetup}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-500 font-semibold">Battery &amp; Charging</td>
                    {compareList.map((phone, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="font-bold text-zinc-100">{phone.battery?.capacity}</div>
                        <div className="text-[10px] text-zinc-400">{phone.charging?.wattage} Flash ({phone.charging?.estimated0To100Mins})</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-500 font-semibold">Cooling System</td>
                    {compareList.map((phone, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="font-bold text-zinc-100">{phone.cooling?.tier}</div>
                        <div className="text-[10px] text-zinc-400">{phone.cooling?.chamberAreaMm2.toLocaleString()} mm²</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-500 font-semibold">Materials &amp; Finish</td>
                    {compareList.map((phone, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="font-bold text-zinc-100">{phone.design?.colorName}</div>
                        <div className="text-[10px] text-zinc-400">{phone.design?.frameMaterial} + {phone.design?.backMaterial}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-500 font-semibold">Action</td>
                    {compareList.map((phone, i) => (
                      <td key={i} className="py-3 px-4">
                        <button
                          onClick={() => handleLoad(phone)}
                          className="py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Load in Builder</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
