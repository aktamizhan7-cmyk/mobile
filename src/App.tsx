/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccountProvider, useUserAccount } from './context/UserAccountContext';
import { PhoneBuilderProvider, usePhoneBuilder } from './context/PhoneBuilderContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { BuilderPage } from './pages/BuilderPage';
import { DisplayCatalogPage } from './pages/DisplayCatalogPage';
import { ProcessorCatalogPage } from './pages/ProcessorCatalogPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { SajaseModal } from './components/sajase/SajaseModal';
import { QuotationModal } from './components/quotation/QuotationModal';
import { ShareModal } from './components/share/ShareModal';
import { CompareModal } from './components/comparison/CompareModal';
import { PhoneConfiguration, ProcessorComponent, DisplayComponent } from './types/phone';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'builder' | 'displays' | 'processors' | 'compare' | 'quotation' | 'dashboard' | 'admin'
  >('home');

  const [isSajaseOpen, setIsSajaseOpen] = useState<boolean>(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  const { config, loadConfiguration, setActiveStep, updateComponent } = usePhoneBuilder();
  const [activeQuoteConfig, setActiveQuoteConfig] = useState<PhoneConfiguration>(config);

  const handleStartBuilding = () => {
    setCurrentTab('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDisplayAndBuild = (disp: DisplayComponent) => {
    updateComponent('display', disp);
    setCurrentTab('builder');
    setActiveStep(1); // Next step is processor
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProcessorAndBuild = (proc: ProcessorComponent) => {
    updateComponent('processor', proc);
    setCurrentTab('builder');
    setActiveStep(2); // Jump to ram
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplorePresets = () => {
    const el = document.getElementById('presets-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentTab('home');
    }
  };

  const handleLoadPresetAndBuild = (newConfig: PhoneConfiguration) => {
    loadConfiguration(newConfig);
    setCurrentTab('builder');
    setActiveStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuotation = (cfgToQuote?: PhoneConfiguration) => {
    setActiveQuoteConfig(cfgToQuote || config);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openSajaseModal={() => setIsSajaseOpen(true)}
      />

      {/* Main Tab View */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onStartBuilding={handleStartBuilding}
            onOpenSajase={() => setIsSajaseOpen(true)}
            onLoadPreset={handleLoadPresetAndBuild}
            onExplorePresets={handleExplorePresets}
            onOpenProcessors={() => setCurrentTab('processors')}
            onOpenDisplays={() => setCurrentTab('displays')}
          />
        )}

        {currentTab === 'builder' && (
          <BuilderPage
            onOpenQuote={() => handleOpenQuotation(config)}
            onOpenShare={() => setIsShareOpen(true)}
            onOpenCompare={() => setIsCompareOpen(true)}
            onOpenSajase={() => setIsSajaseOpen(true)}
          />
        )}

        {currentTab === 'displays' && (
          <DisplayCatalogPage
            onSelectDisplayAndBuild={handleSelectDisplayAndBuild}
          />
        )}

        {currentTab === 'processors' && (
          <ProcessorCatalogPage
            onSelectProcessorAndBuild={handleSelectProcessorAndBuild}
          />
        )}

        {currentTab === 'compare' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CompareModal
              isOpen={true}
              onClose={() => setCurrentTab('builder')}
              onSelectBuild={(cfg) => {
                loadConfiguration(cfg);
                setCurrentTab('builder');
              }}
            />
          </div>
        )}

        {currentTab === 'quotation' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <QuotationModal
              isOpen={true}
              onClose={() => setCurrentTab('builder')}
              config={config}
            />
          </div>
        )}

        {currentTab === 'dashboard' && (
          <UserDashboard
            onLoadConfiguration={(cfg) => {
              loadConfiguration(cfg);
              setCurrentTab('builder');
            }}
            onOpenQuotationForConfig={(cfg) => handleOpenQuotation(cfg)}
          />
        )}

        {currentTab === 'admin' && <AdminPanel />}
      </main>

      {/* Persistent Global Modals */}
      <SajaseModal
        isOpen={isSajaseOpen}
        onClose={() => setIsSajaseOpen(false)}
        onSelectAndBuild={(cfg) => {
          loadConfiguration(cfg);
          setCurrentTab('builder');
          setActiveStep(0);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRequestQuote={(cfg) => {
          handleOpenQuotation(cfg);
        }}
      />

      <QuotationModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        config={activeQuoteConfig}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        config={config}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectBuild={(cfg) => {
          loadConfiguration(cfg);
          setCurrentTab('builder');
        }}
      />

      {/* Global Footer */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSajase={() => setIsSajaseOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <UserAccountProvider>
      <PhoneBuilderProvider>
        <MainApp />
      </PhoneBuilderProvider>
    </UserAccountProvider>
  );
}
