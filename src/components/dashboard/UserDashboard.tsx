import React from 'react';
import {
  BookmarkCheck,
  FileSpreadsheet,
  Trash2,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Download,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { useUserAccount } from '../../context/UserAccountContext';
import { usePhoneBuilder } from '../../context/PhoneBuilderContext';
import { formatINR } from '../../utils/formatters';
import { calculatePriceBreakdown } from '../../utils/pricingEngine';
import { PhoneConfiguration } from '../../types/phone';

interface UserDashboardProps {
  onLoadConfiguration: (config: PhoneConfiguration) => void;
  onOpenQuotationForConfig: (config: PhoneConfiguration) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onLoadConfiguration,
  onOpenQuotationForConfig,
}) => {
  const { savedConfigurations, deleteSavedConfiguration, quotations } = useUserAccount();

  const handleExportJSON = (config: PhoneConfiguration) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${config.name.replace(/\s+/g, '_')}_spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Submitted') {
      return 'bg-blue-950 text-blue-300 border-blue-800';
    }
    if (status === 'Technical Review') {
      return 'bg-amber-950 text-amber-300 border-amber-800';
    }
    if (status === 'Component Validation') {
      return 'bg-purple-950 text-purple-300 border-purple-800';
    }
    if (status === 'Quotation') {
      return 'bg-cyan-950 text-cyan-300 border-cyan-800';
    }
    return 'bg-emerald-950 text-emerald-300 border-emerald-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Personal Engineering Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">
            USER DASHBOARD
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Access your saved smartphone architectures, inspect BOM breakdown history, and follow official manufacturing quotation reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Saved Phones</span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              {savedConfigurations.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Quotations</span>
            <span className="text-xl font-bold font-mono text-blue-400">
              {quotations.length}
            </span>
          </div>
        </div>
      </div>

      {/* Saved Configurations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-mono">
              SAVED SMARTPHONE DESIGNS ({savedConfigurations.length})
            </h2>
          </div>
        </div>

        {savedConfigurations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-500">
            No custom phones saved yet. Head to the Phone Builder or consult SAJASE to create your first phone!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedConfigurations.map((phone) => {
              const price = calculatePriceBreakdown(phone).totalEstimatedPriceINR;

              return (
                <div
                  key={phone.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: phone.design?.hexColor || '#18181b' }}
                        />
                        <span className="text-xs font-mono text-zinc-400">
                          {phone.design?.colorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleExportJSON(phone)}
                          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                          title="Export JSON Spec"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSavedConfiguration(phone.id)}
                          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white font-mono">{phone.name}</h3>

                    <div className="space-y-1 mt-3 text-xs text-zinc-400 font-mono">
                      <div>SoC: {phone.processor?.name}</div>
                      <div>Display: {phone.display?.type} {phone.display?.refreshRate}</div>
                      <div>RAM/ROM: {phone.ram?.capacity} + {phone.storage?.capacity}</div>
                      <div>Camera: {phone.camera?.mainMP} Main ({phone.camera?.secondarySetup})</div>
                      <div>Battery: {phone.battery?.capacity} ({phone.charging?.wattage})</div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-baseline justify-between">
                      <span className="text-xs text-zinc-500 font-mono">Estimated Price:</span>
                      <span className="text-base font-bold font-mono text-cyan-400">
                        {formatINR(price)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-800/80">
                    <button
                      onClick={() => onLoadConfiguration(phone)}
                      className="py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Open Builder</span>
                    </button>
                    <button
                      onClick={() => onOpenQuotationForConfig(phone)}
                      className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Quote</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submitted Quotation Requests Tracker */}
      <div className="space-y-4 pt-6 border-t border-zinc-850">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white font-mono">
              MANUFACTURING QUOTATION DOSSIERS ({quotations.length})
            </h2>
          </div>
        </div>

        {quotations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-500">
            No quotation requests submitted yet. Complete your custom phone and click &quot;Request Manufacturing Quotation&quot;.
          </div>
        ) : (
          <div className="space-y-3">
            {quotations.map((quot) => (
              <div
                key={quot.id}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      Ref: {quot.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${getStatusBadge(
                        quot.status
                      )}`}
                    >
                      {quot.status}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(quot.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-200">
                    {quot.configuration.name} • {quot.quantityTier}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Contact: {quot.fullName} ({quot.email}) {quot.company ? `• ${quot.company}` : ''}
                  </p>
                  {quot.adminNotes && (
                    <div className="text-xs text-amber-300 font-mono bg-amber-950/40 p-2 rounded-lg border border-amber-900/50 mt-1">
                      Note from ODM Lead: {quot.adminNotes}
                    </div>
                  )}
                </div>

                <div className="md:text-right border-t md:border-t-0 md:border-l border-zinc-800 pt-3 md:pt-0 md:pl-5 shrink-0 flex md:flex-col justify-between items-center md:items-end">
                  <span className="text-xs text-zinc-500 font-mono">BOM Unit Estimate</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {formatINR(quot.estimatedPriceINR)}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Region: {quot.targetRegion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
