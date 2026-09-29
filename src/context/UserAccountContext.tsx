import React, { createContext, useContext, useState, useEffect } from 'react';
import { PhoneConfiguration, ManufacturingQuotationRequest } from '../types/phone';
import { PRESETS } from '../data/presets';
import { calculatePriceBreakdown } from '../utils/pricingEngine';

interface UserAccountContextType {
  savedConfigurations: PhoneConfiguration[];
  saveCurrentConfiguration: (name: string, config: PhoneConfiguration) => void;
  deleteSavedConfiguration: (id: string) => void;
  compareList: PhoneConfiguration[];
  addToCompare: (config: PhoneConfiguration) => boolean;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  quotations: ManufacturingQuotationRequest[];
  submitQuotationRequest: (request: Omit<ManufacturingQuotationRequest, 'id' | 'submittedAt' | 'status'>) => ManufacturingQuotationRequest;
  updateQuotationStatus: (id: string, status: ManufacturingQuotationRequest['status'], adminNotes?: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const UserAccountContext = createContext<UserAccountContextType | null>(null);

const STORAGE_SAVED_BUILDS = 'custom_phone_saved_builds';
const STORAGE_QUOTATIONS = 'custom_phone_quotations';
const STORAGE_THEME = 'custom_phone_theme';

export const UserAccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedConfigurations, setSavedConfigurations] = useState<PhoneConfiguration[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_BUILDS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    // Seed with 2 default saved phones for instant rich testing
    return [
      PRESETS[0].configuration,
      PRESETS[1].configuration,
    ];
  });

  const [compareList, setCompareList] = useState<PhoneConfiguration[]>([
    PRESETS[0].configuration,
    PRESETS[1].configuration,
  ]);

  const [quotations, setQuotations] = useState<ManufacturingQuotationRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_QUOTATIONS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    // Initial sample quotation for demonstration
    const sampleConfig = PRESETS[0].configuration;
    const { totalEstimatedPriceINR, totalEstimatedPriceUSD } = calculatePriceBreakdown(sampleConfig);
    return [
      {
        id: 'QUOT-882194',
        submittedAt: new Date(Date.now() - 3600 * 24 * 1000 * 2).toISOString(),
        status: 'Technical Review',
        fullName: 'Aakash Verma',
        email: 'aakash@customphone.tech',
        phone: '+91 98765 43210',
        company: 'Apex Esports Labs',
        quantityTier: '10-50 Evaluation Batch',
        targetRegion: 'India & SEA',
        additionalRequirements: 'Laser etched team logo on titanium frame + dual OS bootloader unlocked for competitive profiling.',
        configuration: sampleConfig,
        estimatedPriceINR: totalEstimatedPriceINR,
        estimatedPriceUSD: totalEstimatedPriceUSD,
        adminNotes: 'BOM feasibility verified with Foxconn/Dixon partners. Awaiting PCB thermal simulation report.',
      },
    ];
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_THEME);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch {
      // ignore
    }
    return 'dark';
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_BUILDS, JSON.stringify(savedConfigurations));
    } catch {
      // ignore
    }
  }, [savedConfigurations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_QUOTATIONS, JSON.stringify(quotations));
    } catch {
      // ignore
    }
  }, [quotations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const saveCurrentConfiguration = (name: string, configToSave: PhoneConfiguration) => {
    const updated: PhoneConfiguration = {
      ...configToSave,
      id: `saved_${Date.now()}`,
      name: name.trim() || configToSave.name || 'My Custom Phone',
      updatedAt: new Date().toISOString(),
    };
    setSavedConfigurations((prev) => [updated, ...prev]);
  };

  const deleteSavedConfiguration = (id: string) => {
    setSavedConfigurations((prev) => prev.filter((item) => item.id !== id));
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  const addToCompare = (cfg: PhoneConfiguration): boolean => {
    if (compareList.some((item) => item.id === cfg.id)) {
      return false; // already in compare
    }
    if (compareList.length >= 3) {
      return false; // maximum 3
    }
    setCompareList((prev) => [...prev, cfg]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  const isInCompare = (id: string) => {
    return compareList.some((item) => item.id === id);
  };

  const submitQuotationRequest = (
    reqData: Omit<ManufacturingQuotationRequest, 'id' | 'submittedAt' | 'status'>
  ): ManufacturingQuotationRequest => {
    const newQuotation: ManufacturingQuotationRequest = {
      ...reqData,
      id: `QUOT-${Math.floor(100000 + Math.random() * 900000)}`,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
    };
    setQuotations((prev) => [newQuotation, ...prev]);
    return newQuotation;
  };

  const updateQuotationStatus = (
    id: string,
    status: ManufacturingQuotationRequest['status'],
    adminNotes?: string
  ) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status, ...(adminNotes ? { adminNotes } : {}) } : q))
    );
  };

  return (
    <UserAccountContext.Provider
      value={{
        savedConfigurations,
        saveCurrentConfiguration,
        deleteSavedConfiguration,
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        quotations,
        submitQuotationRequest,
        updateQuotationStatus,
        theme,
        toggleTheme,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </UserAccountContext.Provider>
  );
};

export const useUserAccount = () => {
  const context = useContext(UserAccountContext);
  if (!context) {
    throw new Error('useUserAccount must be used within a UserAccountProvider');
  }
  return context;
};
