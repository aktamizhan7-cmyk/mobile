import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  PhoneConfiguration,
  PriceBreakdown,
  CompatibilityIssue,
  ConfigurationScore,
  ComponentCategory,
  PriorityOption,
} from '../types/phone';
import { PRESETS } from '../data/presets';
import { calculatePriceBreakdown } from '../utils/pricingEngine';
import { checkCompatibility } from '../utils/compatibilityEngine';
import { calculateConfigurationScores } from '../utils/scoreEngine';
import { optimizeConfigurationToBudget } from '../services/sajaseService';

interface PhoneBuilderContextType {
  config: PhoneConfiguration;
  activeStep: number;
  setActiveStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateComponent: (category: ComponentCategory, component: any) => void;
  loadConfiguration: (newConfig: PhoneConfiguration, targetBudget?: number) => void;
  resetToDefault: () => void;
  priceBreakdown: PriceBreakdown;
  compatibilityIssues: CompatibilityIssue[];
  scores: ConfigurationScore;
  userBudgetINR: number;
  setUserBudgetINR: (budget: number) => void;
  userPriorities: PriorityOption[];
  setUserPriorities: (priorities: PriorityOption[]) => void;
  optimizeToBudget: () => void;
  isOverBudget: boolean;
  overBudgetAmountINR: number;
  // Preview visualizer state
  previewSide: 'front' | 'back';
  setPreviewSide: (side: 'front' | 'back') => void;
  togglePreviewSide: () => void;
  previewColor: string;
  setPreviewColor: (hex: string) => void;
  previewZoom: number;
  setPreviewZoom: (zoom: number) => void;
  updateBrandName: (brandName: string) => void;
  updateDeviceName: (name: string) => void;
}

const PhoneBuilderContext = createContext<PhoneBuilderContextType | null>(null);

export const PhoneBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial configuration from Apex Gamer preset
  const [config, setConfig] = useState<PhoneConfiguration>(() => {
    const saved = localStorage.getItem('custom_phone_current_build');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return PRESETS[0].configuration;
  });

  const [activeStep, setActiveStep] = useState<number>(0);
  const [userBudgetINR, setUserBudgetINR] = useState<number>(35000);
  const [userPriorities, setUserPriorities] = useState<PriorityOption[]>(['Gaming', 'Performance']);

  // Preview state
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('back');
  const [previewColor, setPreviewColor] = useState<string>(config.design?.hexColor || '#0284c7');
  const [previewZoom, setPreviewZoom] = useState<number>(1);

  // Sync previewColor if design changes
  useEffect(() => {
    if (config.design?.hexColor) {
      setPreviewColor(config.design.hexColor);
    }
  }, [config.design?.hexColor]);

  // Persist current build to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('custom_phone_current_build', JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  const priceBreakdown = useMemo(() => calculatePriceBreakdown(config), [config]);
  const compatibilityIssues = useMemo(() => checkCompatibility(config), [config]);
  const scores = useMemo(() => calculateConfigurationScores(config), [config]);

  const isOverBudget = priceBreakdown.totalEstimatedPriceINR > userBudgetINR;
  const overBudgetAmountINR = Math.max(0, priceBreakdown.totalEstimatedPriceINR - userBudgetINR);

  const nextStep = () => {
    setActiveStep((prev) => Math.min(10, prev + 1));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const updateComponent = (category: ComponentCategory, component: any) => {
    setConfig((prev) => {
      const updated = {
        ...prev,
        [category]: component,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });
  };

  const loadConfiguration = (newConfig: PhoneConfiguration, targetBudget?: number) => {
    setConfig({
      ...newConfig,
      updatedAt: new Date().toISOString(),
    });
    if (targetBudget) {
      setUserBudgetINR(targetBudget);
    }
    if (newConfig.design?.hexColor) {
      setPreviewColor(newConfig.design.hexColor);
    }
  };

  const resetToDefault = () => {
    setConfig(PRESETS[0].configuration);
    setActiveStep(0);
  };

  const optimizeToBudget = () => {
    const optimized = optimizeConfigurationToBudget(config, userBudgetINR, userPriorities);
    setConfig(optimized);
  };

  const togglePreviewSide = () => {
    setPreviewSide((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const updateBrandName = (brandName: string) => {
    setConfig((prev) => ({
      ...prev,
      brandName,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateDeviceName = (name: string) => {
    setConfig((prev) => ({
      ...prev,
      name,
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <PhoneBuilderContext.Provider
      value={{
        config,
        activeStep,
        setActiveStep,
        nextStep,
        prevStep,
        updateComponent,
        loadConfiguration,
        resetToDefault,
        priceBreakdown,
        compatibilityIssues,
        scores,
        userBudgetINR,
        setUserBudgetINR,
        userPriorities,
        setUserPriorities,
        optimizeToBudget,
        isOverBudget,
        overBudgetAmountINR,
        previewSide,
        setPreviewSide,
        togglePreviewSide,
        previewColor,
        setPreviewColor,
        previewZoom,
        setPreviewZoom,
        updateBrandName,
        updateDeviceName,
      }}
    >
      {children}
    </PhoneBuilderContext.Provider>
  );
};

export const usePhoneBuilder = () => {
  const context = useContext(PhoneBuilderContext);
  if (!context) {
    throw new Error('usePhoneBuilder must be used within a PhoneBuilderProvider');
  }
  return context;
};
