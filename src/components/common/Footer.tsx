import React from 'react';
import { Smartphone, Shield, Info, ArrowUpRight } from 'lucide-react';
import { ThorLogo } from './ThorLogo';

export const Footer: React.FC<{
  onSelectTab: (tab: 'home' | 'builder' | 'compare' | 'quotation' | 'dashboard' | 'admin') => void;
  onOpenSajase: () => void;
}> = ({ onSelectTab, onOpenSajase }) => {
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-sm mt-16">
      {/* Important Real-World Positioning Disclaimer */}
      <div className="bg-zinc-900/60 border-b border-zinc-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-xs text-zinc-300 leading-relaxed">
            <strong className="text-zinc-100 font-semibold">Important Manufacturing Disclosure: </strong>
            THOR does not present immediate consumer retail sales. The platform provides smartphone hardware
            architecture, Bill of Materials (BOM) cost estimation, and formal OEM/ODM feasibility quotations. All prices
            and component availability reflect demo/provisional supplier estimates until validated through engineering
            prototyping, RF certification (BIS, FCC, CE), and batch tooling agreements.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <ThorLogo variant="emblem" size={32} />
              <span className="font-extrabold tracking-wider text-zinc-100 font-mono text-base">
                THOR
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Build the phone you actually want. High-fidelity custom smartphone builder with dynamic BOM pricing,
              compatibility verification, and SAJASE smart recommendation engine.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Independent Open Hardware Architecture</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-cyan-400 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('builder')} className="hover:text-cyan-400 transition-colors">
                  11-Step Phone Builder
                </button>
              </li>
              <li>
                <button onClick={onOpenSajase} className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-cyan-400 font-semibold">
                  <span>Ask SAJASE AI</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('compare')} className="hover:text-cyan-400 transition-colors">
                  Compare Configurations
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('quotation')} className="hover:text-cyan-400 transition-colors">
                  Request Quotation
                </button>
              </li>
            </ul>
          </div>

          {/* Workflow & Engineering */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold mb-3">
              Engineering Workflow
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-mono">
              <li>1. User Specification & Budget</li>
              <li>2. Thermal & Bus Compatibility</li>
              <li>3. Live BOM Estimation</li>
              <li>4. ODM Feasibility Review</li>
              <li>5. Prototype Tooling & SMT</li>
              <li>6. Regulatory Certification</li>
            </ul>
          </div>

          {/* SAJASE Assistant Info */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold mb-3">
              SAJASE Assistant
            </h4>
            <p className="text-xs text-zinc-400 mb-3">
              Tell me your budget and how you use your phone. I will balance CPU, display, camera, cooling, and battery without technical jargon.
            </p>
            <button
              onClick={onOpenSajase}
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Launch SAJASE Assistant</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
          <div>
            © {new Date().getFullYear()} CUSTOM PHONE. Original Technology Brand. No affiliation with any third-party smartphone trademark.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectTab('admin')} className="hover:text-zinc-300">
              Admin Portal
            </button>
            <span>•</span>
            <span className="text-cyan-400">Status: SMT Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
