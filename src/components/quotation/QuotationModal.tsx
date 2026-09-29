import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  User,
  Phone,
  Globe,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { PhoneConfiguration } from '../../types/phone';
import { useUserAccount } from '../../context/UserAccountContext';
import { calculatePriceBreakdown } from '../../utils/pricingEngine';
import { formatINR, formatUSD } from '../../utils/formatters';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PhoneConfiguration;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const { submitQuotationRequest } = useUserAccount();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [quantityTier, setQuantityTier] = useState<
    '1 Prototype Unit' | '10-50 Evaluation Batch' | '100-500 Pilot Production' | '1,000+ Volume Run'
  >('1 Prototype Unit');
  const [targetRegion, setTargetRegion] = useState<string>('India / Domestic');
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');
  const [submittedQuotationId, setSubmittedQuotationId] = useState<string | null>(null);

  if (!isOpen) return null;

  const { totalEstimatedPriceINR, totalEstimatedPriceUSD } = calculatePriceBreakdown(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      alert('Please fill in required fields (Name, Email, and Phone).');
      return;
    }

    const created = submitQuotationRequest({
      fullName,
      email,
      phone,
      company: company || undefined,
      quantityTier,
      targetRegion,
      additionalRequirements: additionalRequirements || undefined,
      configuration: config,
      estimatedPriceINR: totalEstimatedPriceINR,
      estimatedPriceUSD: totalEstimatedPriceUSD,
    });

    setSubmittedQuotationId(created.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-mono">
              REQUEST A MANUFACTURING QUOTATION
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
          {submittedQuotationId ? (
            /* Success confirmation */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-white font-mono">
                Quotation Request Submitted!
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Your dossier has been assigned Reference ID{' '}
                <strong className="text-cyan-400 font-mono">{submittedQuotationId}</strong> and routed to our OEM engineering partner group for bill-of-materials and SMT line feasibility review.
              </p>

              {/* Real-world stage tracker */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 max-w-lg mx-auto text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-2">
                  Dossier Stage Tracker
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>1. Request Submitted (Logged &amp; Stored)</span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-300">
                    <div className="w-4 h-4 rounded-full border border-cyan-400 flex items-center justify-center text-[9px] font-bold">
                      2
                    </div>
                    <span>2. Technical &amp; PCB Thermal Review (In Progress)</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[9px]">
                      3
                    </div>
                    <span>3. Supplier MOQ &amp; Lead Time Validation</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[9px]">
                      4
                    </div>
                    <span>4. Formal Commercial Quotation Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[9px]">
                      5
                    </div>
                    <span>5. Engineering Prototype Discussion</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs sm:text-sm hover:bg-cyan-400 transition-colors"
                >
                  Return to Phone Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Brief Banner */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Selected Configuration:</span>
                  <div className="text-sm font-bold text-white font-mono">{config.name}</div>
                  <div className="text-[11px] text-zinc-400">
                    {config.processor?.name} • {config.ram?.capacity} • {config.battery?.capacity}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Estimated Unit BOM:</span>
                  <div className="text-base font-bold font-mono text-cyan-400">
                    {formatINR(totalEstimatedPriceINR)}
                  </div>
                </div>
              </div>

              {/* Feasibility Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Legal Notice:</strong> Submitting a quotation request initiates an engineering review. It does not constitute a guaranteed contract or retail order until tooling, RF testing, and formal commercial terms are approved.
                </span>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-zinc-500" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aakash Verma"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" /> Business / Personal Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aakash@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-zinc-500" /> Organization / Studio (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Hardware Labs"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-zinc-500" /> Target Batch Quantity *
                  </label>
                  <select
                    value={quantityTier}
                    onChange={(e: any) => setQuantityTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1 Prototype Unit">1 Prototype Unit (Proof of Concept)</option>
                    <option value="10-50 Evaluation Batch">10-50 Evaluation Batch (Field Testing)</option>
                    <option value="100-500 Pilot Production">100-500 Pilot Production</option>
                    <option value="1,000+ Volume Run">1,000+ Volume Run (Commercial Scale)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-zinc-500" /> Target Region / Regulatory Bands
                  </label>
                  <input
                    type="text"
                    value={targetRegion}
                    onChange={(e) => setTargetRegion(e.target.value)}
                    placeholder="e.g. India (BIS), EU (CE), North America (FCC)"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-mono text-zinc-300 block">
                  Additional Engineering &amp; Packaging Requirements:
                </label>
                <textarea
                  rows={2}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. Laser engraving on side bezel, custom Android ROM bootloader, or specialized sensor calibration."
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-black" />
                  <span>SUBMIT ENGINEERING DOSSIER</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
