import React, { useState } from 'react';
import { usePhoneBuilder } from '../context/PhoneBuilderContext';
import { BuilderStepNav } from '../components/builder/BuilderStepNav';
import { BudgetOptimizerBanner } from '../components/sajase/BudgetOptimizerBanner';
import { CompatibilityNotice } from '../components/builder/CompatibilityNotice';
import { PhoneVisualizer } from '../components/preview/PhoneVisualizer';
import { LivePriceSidebar } from '../components/builder/LivePriceSidebar';
import { StepDisplay } from '../components/builder/StepDisplay';
import { StepProcessor } from '../components/builder/StepProcessor';
import { StepRAM } from '../components/builder/StepRAM';
import { StepStorage } from '../components/builder/StepStorage';
import { StepCamera } from '../components/builder/StepCamera';
import { StepBattery } from '../components/builder/StepBattery';
import { StepCharging } from '../components/builder/StepCharging';
import { StepCooling } from '../components/builder/StepCooling';
import { StepGaming } from '../components/builder/StepGaming';
import { StepDesign } from '../components/builder/StepDesign';
import { StepReview } from '../components/builder/StepReview';
import { Eye, Layers, Sparkles } from 'lucide-react';

interface BuilderPageProps {
  onOpenQuote: () => void;
  onOpenShare: () => void;
  onOpenCompare: () => void;
  onOpenSajase: () => void;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({
  onOpenQuote,
  onOpenShare,
  onOpenCompare,
  onOpenSajase,
}) => {
  const { activeStep } = usePhoneBuilder();
  const [mobileView, setMobileView] = useState<'hardware' | 'preview'>('hardware');

  const renderActiveStepComponent = () => {
    switch (activeStep) {
      case 0:
        return <StepDisplay />;
      case 1:
        return <StepProcessor />;
      case 2:
        return <StepRAM />;
      case 3:
        return <StepStorage />;
      case 4:
        return <StepCamera />;
      case 5:
        return <StepBattery />;
      case 6:
        return <StepCharging />;
      case 7:
        return <StepCooling />;
      case 8:
        return <StepGaming />;
      case 9:
        return <StepDesign />;
      case 10:
        return (
          <StepReview
            onOpenQuote={onOpenQuote}
            onOpenShare={onOpenShare}
            onOpenCompare={onOpenCompare}
          />
        );
      default:
        return <StepDisplay />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 11-Step Navigation Wizard Bar */}
      <BuilderStepNav />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Mobile View Toggle: Hardware vs Phone Preview */}
        <div className="flex lg:hidden items-center justify-center p-1 bg-zinc-900 rounded-xl border border-zinc-800">
          <button
            onClick={() => setMobileView('hardware')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mobileView === 'hardware'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hardware Configurator</span>
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mobileView === 'preview'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Phone &amp; Price</span>
          </button>
        </div>

        {/* Over-budget SAJASE Optimizer Banner */}
        <BudgetOptimizerBanner />

        {/* Compatibility Alert notices */}
        <CompatibilityNotice />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Step Configuration Form */}
          <div
            className={`lg:col-span-7 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-5 sm:p-7 backdrop-blur ${
              mobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {renderActiveStepComponent()}
          </div>

          {/* Right Column: Sticky Live Phone Preview & BOM Price Engine */}
          <div
            className={`lg:col-span-5 space-y-6 lg:sticky lg:top-32 ${
              mobileView === 'hardware' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Phone Visualizer */}
            <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur shadow-2xl flex flex-col items-center">
              <PhoneVisualizer />
            </div>

            {/* Live Price Sidebar & BOM breakdown */}
            <LivePriceSidebar onOpenQuote={onOpenQuote} onOpenShare={onOpenShare} />
          </div>
        </div>
      </div>
    </div>
  );
};
