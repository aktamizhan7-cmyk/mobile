import { PhoneConfiguration } from '../types/phone';
import {
  PROCESSORS,
  DISPLAYS,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  CAMERAS,
  BATTERIES,
  CHARGERS,
  COOLINGS,
  AUDIO_HAPTICS,
  DESIGNS,
} from './components';

export interface PhonePreset {
  id: string;
  badge: string;
  name: string;
  tagline: string;
  targetBudgetINR: number;
  configuration: PhoneConfiguration;
  highlights: string[];
}

const findProc = (id: string, fallbackIdx = 0) =>
  PROCESSORS.find((p) => p.id === id) || PROCESSORS[fallbackIdx];

export const PRESETS: PhonePreset[] = [
  {
    id: 'preset_apex_gamer',
    badge: 'ESPORTS FOCUS',
    name: 'Apex Gamer X9',
    tagline: 'Sustained 90-120FPS gaming with ultra-low latency & 6000mAh endurance',
    targetBudgetINR: 32000,
    highlights: ['Dimensity 8300 Ultra 4nm', '1.5K 144Hz AMOLED', '3D Vapor Chamber', '6000mAh Silicon-Carbon'],
    configuration: {
      id: 'cfg_apex_gamer_default',
      name: 'Apex Gamer X9',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      processor: findProc('dimensity_8300', 0),
      display: DISPLAYS[2], // 1.5K 144Hz
      ram: RAM_OPTIONS[2], // 12GB LPDDR5X
      storage: STORAGE_OPTIONS[1], // 256GB UFS 3.1
      camera: CAMERAS[0], // 50MP OIS
      battery: BATTERIES[3], // 6000mAh
      charging: CHARGERS[2], // 80W
      cooling: COOLINGS[2], // 3D Vapor Chamber
      audioHaptics: AUDIO_HAPTICS[1], // Dual Stereo + 480Hz
      design: DESIGNS[2], // Azure Cyber Carbon
    },
  },
  {
    id: 'preset_lumix_creator',
    badge: 'PHOTOGRAPHY & VIDEO',
    name: 'Lumix Vision Studio',
    tagline: 'Triple optical portrait focal lengths with 512GB fast video storage',
    targetBudgetINR: 42000,
    highlights: ['Snapdragon 8s Gen 4 4nm', 'Triple Studio 3X Optical Zoom', '512GB UFS 4.0 Storage', '1.5K 120Hz True-Color Display'],
    configuration: {
      id: 'cfg_lumix_creator_default',
      name: 'Lumix Vision Studio',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      processor: findProc('snapdragon_8s_gen_4', 3),
      display: DISPLAYS[2], // 1.5K LTPO
      ram: RAM_OPTIONS[2], // 12GB
      storage: STORAGE_OPTIONS[2], // 512GB UFS 4.0
      camera: CAMERAS[3], // Triple Studio Telephoto
      battery: BATTERIES[1], // 5000mAh
      charging: CHARGERS[1], // 67W
      cooling: COOLINGS[1], // Graphite Aerogel
      audioHaptics: AUDIO_HAPTICS[1], // Stereo
      design: DESIGNS[1], // Glacier Ceramic
    },
  },
  {
    id: 'preset_endurance_pro',
    badge: 'MARATHON BATTERY',
    name: 'Endurance Max 65',
    tagline: 'Over 2 days of continuous enterprise work and outdoor battery life',
    targetBudgetINR: 26000,
    highlights: ['Dimensity 7300 4nm Efficiency', '6500mAh Marathon Battery', '67W Turbo FlashCharge', 'Super AMOLED 120Hz'],
    configuration: {
      id: 'cfg_endurance_pro_default',
      name: 'Endurance Max 65',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      processor: findProc('dimensity_7300', 8),
      display: DISPLAYS[1], // AMOLED 120Hz
      ram: RAM_OPTIONS[1], // 8GB
      storage: STORAGE_OPTIONS[1], // 256GB
      camera: CAMERAS[0], // 50MP Sony
      battery: BATTERIES[4], // 6500mAh
      charging: CHARGERS[1], // 67W
      cooling: COOLINGS[1], // Graphite Aerogel
      audioHaptics: AUDIO_HAPTICS[0], // Standard
      design: DESIGNS[3], // Emerald Vegan Leather
    },
  },
  {
    id: 'preset_cyber_titan_ultra',
    badge: 'UNCOMPROMISING TITANIUM',
    name: 'Cyber Titan Ultra Max',
    tagline: '3nm Snapdragon 8 Elite, 200MP Periscope, 2K Curved OLED and Grade 5 Titanium',
    targetBudgetINR: 75000,
    highlights: ['Snapdragon 8 Elite 3nm N3E', '200MP Periscope 5X Zoom', '120W GaN + 50W Wireless', 'Cryo-Loop Active Cooling'],
    configuration: {
      id: 'cfg_cyber_titan_default',
      name: 'Cyber Titan Ultra Max',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      processor: findProc('snapdragon_8_elite', 0),
      display: DISPLAYS[3], // 2K Curved OLED
      ram: RAM_OPTIONS[3], // 16GB LPDDR5X
      storage: STORAGE_OPTIONS[3], // 1TB UFS 4.0
      camera: CAMERAS[4], // 200MP Periscope
      battery: BATTERIES[3], // 6000mAh
      charging: CHARGERS[4], // 120W + Wireless
      cooling: COOLINGS[3], // Cryo-Loop
      audioHaptics: AUDIO_HAPTICS[2], // Audiophile 720Hz
      design: DESIGNS[4], // Crimson Titanium
    },
  },
  {
    id: 'preset_budget_champion',
    badge: 'VALUE ESSENTIAL',
    name: 'Custom Core V1',
    tagline: 'High quality essential smartphone experience with modern 5G under ₹20,000',
    targetBudgetINR: 18500,
    highlights: ['Snapdragon 4 Gen 2 4nm 5G', '50MP Sony OIS Camera', '5000mAh Dual-Cell', 'FHD+ 90Hz Display'],
    configuration: {
      id: 'cfg_budget_champion_default',
      name: 'Custom Core V1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      processor: findProc('snapdragon_4_gen_2', 15),
      display: DISPLAYS[0], // FHD+ LCD 90Hz
      ram: RAM_OPTIONS[0], // 6GB
      storage: STORAGE_OPTIONS[0], // 128GB
      camera: CAMERAS[0], // 50MP Sony
      battery: BATTERIES[1], // 5000mAh
      charging: CHARGERS[0], // 33W
      cooling: COOLINGS[0], // Standard Graphene
      audioHaptics: AUDIO_HAPTICS[0], // Standard
      design: DESIGNS[6], // Minimal Polycarbonate
    },
  },
];
