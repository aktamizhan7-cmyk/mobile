import { ProcessorComponent, ProcessorBrand, ProcessorTier } from '../../types/phone';
import { QUALCOMM_PROCESSORS } from './qualcomm';
import { MEDIATEK_PROCESSORS } from './mediatek';
import { SAMSUNG_PROCESSORS } from './samsung';
import { GOOGLE_PROCESSORS } from './google';
import { UNISOC_PROCESSORS } from './unisoc';
import { HISILICON_PROCESSORS } from './hisilicon';

export {
  QUALCOMM_PROCESSORS,
  MEDIATEK_PROCESSORS,
  SAMSUNG_PROCESSORS,
  GOOGLE_PROCESSORS,
  UNISOC_PROCESSORS,
  HISILICON_PROCESSORS,
};

export const ALL_PROCESSORS: ProcessorComponent[] = [
  ...QUALCOMM_PROCESSORS,
  ...MEDIATEK_PROCESSORS,
  ...SAMSUNG_PROCESSORS,
  ...GOOGLE_PROCESSORS,
  ...UNISOC_PROCESSORS,
  ...HISILICON_PROCESSORS,
];

export const PROCESSOR_BRANDS: { id: ProcessorBrand | 'All'; name: string; count: number }[] = [
  { id: 'All', name: 'All Brands', count: ALL_PROCESSORS.length },
  { id: 'Qualcomm', name: 'Snapdragon', count: QUALCOMM_PROCESSORS.length },
  { id: 'MediaTek', name: 'Dimensity', count: MEDIATEK_PROCESSORS.length },
  { id: 'Samsung', name: 'Exynos', count: SAMSUNG_PROCESSORS.length },
  { id: 'Google', name: 'Google Tensor', count: GOOGLE_PROCESSORS.length },
  { id: 'UNISOC', name: 'UNISOC', count: UNISOC_PROCESSORS.length },
  { id: 'HiSilicon', name: 'HiSilicon Kirin', count: HISILICON_PROCESSORS.length },
];

export const PROCESSOR_TIERS: { id: ProcessorTier | 'All'; name: string }[] = [
  { id: 'All', name: 'All Tiers' },
  { id: 'Ultra Flagship', name: 'Ultra Flagship (3nm/2nm)' },
  { id: 'Flagship', name: 'Flagship Performance' },
  { id: 'Upper Mid-Range', name: 'Upper Mid-Range (Sub-Flagship)' },
  { id: 'Mid-Range', name: 'Mid-Range Mainstream' },
  { id: 'Budget', name: 'Budget 5G & 4G' },
  { id: 'Entry', name: 'Entry Tier' },
];

export function getProcessorById(id: string): ProcessorComponent | undefined {
  return ALL_PROCESSORS.find((p) => p.id === id);
}

export function filterProcessors(options: {
  searchQuery?: string;
  brand?: ProcessorBrand | 'All';
  tier?: ProcessorTier | 'All';
  only5G?: boolean;
  sortBy?: 'antutu' | 'gaming' | 'efficiency' | 'price_asc' | 'price_desc' | 'ai';
}): ProcessorComponent[] {
  let list = [...ALL_PROCESSORS];

  if (options.brand && options.brand !== 'All') {
    list = list.filter((p) => p.brand === options.brand);
  }

  if (options.tier && options.tier !== 'All') {
    list = list.filter((p) => p.tier === options.tier);
  }

  if (options.only5G) {
    list = list.filter((p) => p.network.five_g);
  }

  if (options.searchQuery && options.searchQuery.trim()) {
    const q = options.searchQuery.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.family.toLowerCase().includes(q) ||
        p.processNode.toLowerCase().includes(q) ||
        p.gpu.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q))
    );
  }

  if (options.sortBy) {
    switch (options.sortBy) {
      case 'antutu':
        list.sort((a, b) => b.antutu_v10_score - a.antutu_v10_score);
        break;
      case 'gaming':
        list.sort((a, b) => b.gaming_rating - a.gaming_rating);
        break;
      case 'efficiency':
        list.sort((a, b) => b.efficiency_rating - a.efficiency_rating);
        break;
      case 'ai':
        list.sort((a, b) => (b.ai_rating || 0) - (a.ai_rating || 0));
        break;
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
  }

  return list;
}
