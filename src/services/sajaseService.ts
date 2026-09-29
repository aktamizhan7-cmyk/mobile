import {
  PhoneConfiguration,
  SajaseRecommendationResponse,
  SajaseRecommendationItem,
  PriorityOption,
  UsageOption,
} from '../types/phone';
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
} from '../data/components';
import { calculatePriceBreakdown } from '../utils/pricingEngine';

export interface SajaseInputParams {
  budgetINR: number;
  usages: UsageOption[];
  priorities: PriorityOption[];
  userPrompt?: string;
}

export async function requestSajaseRecommendations(
  params: SajaseInputParams
): Promise<SajaseRecommendationResponse> {
  try {
    const response = await fetch('/api/sajase/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.recommendations?.bestMatch) {
        return data as SajaseRecommendationResponse;
      }
    }
  } catch {
    // Fall back to algorithmic heuristic generation
  }

  // Fallback heuristic generator
  return generateDeterministicSajaseRecommendations(params);
}

export function generateDeterministicSajaseRecommendations(
  params: SajaseInputParams
): SajaseRecommendationResponse {
  const { budgetINR, usages, priorities } = params;
  const isGaming = usages.includes('Gaming') || priorities.includes('Gaming');
  const isCamera = usages.includes('Camera') || priorities.includes('Camera');
  const isBattery = usages.includes('Battery') || priorities.includes('Battery');
  const isWork = usages.includes('Work') || priorities.includes('Storage');

  const getProc = (id: string, fallbackIdx = 0) =>
    PROCESSORS.find((p) => p.id === id) || PROCESSORS[fallbackIdx];
  const getDisp = (id: string, fallbackIdx = 1) =>
    DISPLAYS.find((d) => d.id === id) || DISPLAYS[fallbackIdx];

  // 1. BEST MATCH Configuration
  let proc = getProc('dimensity_7300'); // default mid-range efficiency
  let disp = getDisp('disp_amoled_120_flat');
  let ram = RAM_OPTIONS[1];
  let storage = STORAGE_OPTIONS[1];
  let cam = CAMERAS[0];
  let batt = BATTERIES[1];
  let charge = CHARGERS[1];
  let cool = COOLINGS[1];
  let audio = AUDIO_HAPTICS[1];
  let design = DESIGNS[0];

  if (budgetINR < 22000) {
    proc = isGaming ? getProc('snapdragon_4_gen_2') : isBattery ? getProc('dimensity_6300') : getProc('unisoc_t8200');
    disp = getDisp('disp_fhd_lcd_90', 0); // 90Hz LCD
    ram = RAM_OPTIONS[0]; // 6GB
    storage = STORAGE_OPTIONS[0]; // 128GB
    cam = CAMERAS[0]; // 50MP
    batt = BATTERIES[1]; // 5000mAh
    charge = CHARGERS[0]; // 33W
    cool = COOLINGS[0]; // Standard
    audio = AUDIO_HAPTICS[0];
    design = DESIGNS[6]; // Poly
  } else if (budgetINR <= 35000) {
    if (isGaming) {
      proc = getProc('dimensity_8300'); // Dimensity 8300 Ultra
      disp = getDisp('disp_crystalres_15k_144'); // 1.5K 144Hz
      cool = COOLINGS[2]; // 3D Vapor Chamber
      ram = RAM_OPTIONS[2]; // 12GB
      storage = STORAGE_OPTIONS[1]; // 256GB
      cam = CAMERAS[0]; // 50MP OIS (cost balance)
      batt = isBattery ? BATTERIES[3] : BATTERIES[2]; // 6000 or 5500
      charge = CHARGERS[2]; // 80W
      audio = AUDIO_HAPTICS[1]; // Stereo 480Hz
      design = DESIGNS[2]; // Azure Carbon
    } else if (isCamera) {
      proc = getProc('snapdragon_7_gen_3'); // 200MP ISP
      disp = getDisp('disp_amoled_120_flat'); // 120Hz AMOLED
      cool = COOLINGS[1];
      ram = RAM_OPTIONS[1]; // 8GB
      storage = STORAGE_OPTIONS[2]; // 512GB (photo store)
      cam = CAMERAS[2]; // 108MP Pro
      batt = BATTERIES[1]; // 5000mAh
      charge = CHARGERS[1]; // 67W
      audio = AUDIO_HAPTICS[1];
      design = DESIGNS[1]; // Glacier White
    } else {
      proc = isBattery ? getProc('dimensity_7300') : getProc('snapdragon_7s_gen_3');
      disp = getDisp('disp_amoled_120_flat');
      cool = COOLINGS[1];
      ram = RAM_OPTIONS[1];
      storage = STORAGE_OPTIONS[1];
      cam = CAMERAS[0];
      batt = BATTERIES[2];
      charge = CHARGERS[1];
      audio = AUDIO_HAPTICS[1];
      design = DESIGNS[0];
    }
  } else if (budgetINR <= 55000) {
    if (isGaming) {
      proc = getProc('snapdragon_8_gen_2');
      disp = getDisp('disp_esports_165_amoled'); // 165Hz Esports Pro
      ram = RAM_OPTIONS[2]; // 12GB
      storage = STORAGE_OPTIONS[1]; // 256GB
      cam = CAMERAS[0];
      batt = BATTERIES[3];
      charge = CHARGERS[2];
      cool = COOLINGS[2];
    } else if (isCamera) {
      proc = getProc('google_tensor_g4'); // Custom Google Computational Camera
      disp = getDisp('disp_ltpo_15k_144');
      ram = RAM_OPTIONS[2];
      storage = STORAGE_OPTIONS[2];
      cam = CAMERAS[3]; // Triple Studio
      batt = BATTERIES[1];
      charge = CHARGERS[1];
      cool = COOLINGS[1];
    } else {
      proc = getProc('snapdragon_8s_gen_4');
      disp = getDisp('disp_ltpo_15k_144');
      ram = RAM_OPTIONS[2];
      storage = STORAGE_OPTIONS[2];
      cam = CAMERAS[2];
      batt = BATTERIES[3];
      charge = CHARGERS[2];
      cool = COOLINGS[2];
    }
    audio = AUDIO_HAPTICS[1];
    design = DESIGNS[1];
  } else {
    // Ultra Flagship tier (₹55,000+)
    proc = isGaming ? getProc('snapdragon_8_elite') : isCamera ? getProc('google_tensor_g5') : getProc('dimensity_9400');
    disp = getDisp('disp_curved_2k_120'); // 2K Quad-Curved LTPO OLED
    ram = RAM_OPTIONS[3]; // 16GB
    storage = STORAGE_OPTIONS[3]; // 1TB UFS 4.0
    cam = CAMERAS[4]; // 200MP Periscope
    batt = BATTERIES[3]; // 6000mAh
    charge = CHARGERS[4]; // 120W Extreme
    cool = COOLINGS[3]; // Cryo-Loop
    audio = AUDIO_HAPTICS[2]; // 720Hz
    design = DESIGNS[4]; // Titanium
  }

  const bestMatchConfig: PhoneConfiguration = {
    id: `cfg_sajase_best_${Date.now()}`,
    name: 'Custom SAJASE Best Match',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0',
    processor: proc,
    display: disp,
    ram,
    storage,
    camera: cam,
    battery: batt,
    charging: charge,
    cooling: cool,
    audioHaptics: audio,
    design,
  };

  const bestPrice = calculatePriceBreakdown(bestMatchConfig).totalEstimatedPriceINR;

  // 2. BALANCED Configuration
  // An even distribution across all hardware without skewing excessively towards one part
  const balancedProc =
    budgetINR >= 60000
      ? getProc('snapdragon_8_gen_3')
      : budgetINR >= 38000
      ? getProc('snapdragon_7_plus_gen_3')
      : budgetINR >= 24000
      ? getProc('dimensity_7300')
      : getProc('snapdragon_4_gen_2');
  const balancedDisp = budgetINR >= 35000 ? DISPLAYS[2] : DISPLAYS[1];
  const balancedRam = budgetINR >= 35000 ? RAM_OPTIONS[2] : RAM_OPTIONS[1];
  const balancedStorage = STORAGE_OPTIONS[1]; // 256GB
  const balancedCam = CAMERAS[0]; // 50MP OIS
  const balancedBatt = BATTERIES[1]; // 5000mAh
  const balancedCharge = CHARGERS[1]; // 67W
  const balancedCool = COOLINGS[1]; // Graphite
  const balancedAudio = AUDIO_HAPTICS[1];
  const balancedDesign = DESIGNS[0];

  const balancedConfig: PhoneConfiguration = {
    id: `cfg_sajase_balanced_${Date.now()}`,
    name: 'Custom SAJASE Balanced Daily',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0',
    processor: balancedProc,
    display: balancedDisp,
    ram: balancedRam,
    storage: balancedStorage,
    camera: balancedCam,
    battery: balancedBatt,
    charging: balancedCharge,
    cooling: balancedCool,
    audioHaptics: balancedAudio,
    design: balancedDesign,
  };
  const balancedPrice = calculatePriceBreakdown(balancedConfig).totalEstimatedPriceINR;

  // 3. VALUE Configuration
  // Trims non-essential components to maximize cost efficiency and leave budget headroom
  const valueProc =
    budgetINR >= 50000
      ? getProc('snapdragon_8s_gen_3')
      : budgetINR >= 28000
      ? getProc('dimensity_7050')
      : getProc('unisoc_t8200');
  const valueDisp = DISPLAYS[1]; // 120Hz Super AMOLED
  const valueRam = RAM_OPTIONS[1]; // 8GB
  const valueStorage = STORAGE_OPTIONS[1]; // 256GB
  const valueCam = CAMERAS[0]; // 50MP Sony
  const valueBatt = BATTERIES[1]; // 5000mAh
  const valueCharge = CHARGERS[1]; // 67W
  const valueCool = COOLINGS[0]; // Standard Graphene
  const valueAudio = AUDIO_HAPTICS[0];
  const valueDesign = DESIGNS[6]; // Lightweight Poly

  const valueConfig: PhoneConfiguration = {
    id: `cfg_sajase_value_${Date.now()}`,
    name: 'Custom SAJASE Smart Value',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0',
    processor: valueProc,
    display: valueDisp,
    ram: valueRam,
    storage: valueStorage,
    camera: valueCam,
    battery: valueBatt,
    charging: valueCharge,
    cooling: valueCool,
    audioHaptics: valueAudio,
    design: valueDesign,
  };
  const valuePrice = calculatePriceBreakdown(valueConfig).totalEstimatedPriceINR;

  // Generate dynamic explanations
  const bestReasoning: string[] = [];
  if (isGaming) {
    bestReasoning.push(
      `You prioritized gaming, so more of the available budget was allocated to the ${proc.name}, ${cool.name}, and high-refresh-rate ${disp.refreshRate} display.`
    );
    bestReasoning.push(
      `Battery capacity (${batt.capacity}) was prioritized for longer sessions with 80W rapid replenishment.`
    );
    bestReasoning.push(
      `Camera spending was balanced with the dependable 50MP OIS sensor because photography was a secondary priority.`
    );
  } else if (isCamera) {
    bestReasoning.push(
      `You prioritized camera & photography, so budget was allocated to the ${cam.name} with dedicated focal lengths and ${storage.capacity} fast storage.`
    );
    bestReasoning.push(
      `The high-color-accuracy ${disp.name} ensures precise color grading and preview fidelity.`
    );
    bestReasoning.push(
      `Processor choice was balanced for fluid image processing without inflating thermal dissipation.`
    );
  } else {
    bestReasoning.push(
      `Configuration is tuned to deliver an all-day reliable experience with ${batt.capacity} battery and ${disp.name}.`
    );
    bestReasoning.push(
      `Balanced hardware ensures seamless multitasking and longevity within your ₹${budgetINR.toLocaleString('en-IN')} target.`
    );
  }

  const bestItem: SajaseRecommendationItem = {
    type: 'best_match',
    title: 'Best Match Configuration',
    subtitle: 'Optimized specifically around your selected usage & priority focus',
    config: bestMatchConfig,
    estimatedPriceINR: bestPrice,
    reasoning: bestReasoning,
    keyHighlights: [
      `${proc.name} (${proc.brandTier})`,
      `${disp.size} ${disp.type} ${disp.refreshRate}`,
      `${ram.capacity} RAM + ${storage.capacity} Storage`,
      `${batt.capacity} with ${charge.wattage} Charging`,
    ],
  };

  const balancedItem: SajaseRecommendationItem = {
    type: 'balanced',
    title: 'Balanced Configuration',
    subtitle: 'Harmonious performance across gaming, battery, camera, and daily apps',
    config: balancedConfig,
    estimatedPriceINR: balancedPrice,
    reasoning: [
      `Distributes your budget evenly across high-efficiency processor, vibrant 120Hz display, and 50MP OIS optical capture.`,
      `Avoids over-indexing into single components, preserving overall battery efficiency and comfort.`,
    ],
    keyHighlights: [
      `${balancedProc.name}`,
      `${balancedDisp.type} 120Hz`,
      `${balancedRam.capacity} / ${balancedStorage.capacity}`,
      `${balancedBatt.capacity} + ${balancedCharge.wattage}`,
    ],
  };

  const valueItem: SajaseRecommendationItem = {
    type: 'value',
    title: 'Value Champion Configuration',
    subtitle: 'Protects key essentials while maximizing budget savings',
    config: valueConfig,
    estimatedPriceINR: valuePrice,
    savingsOrDeltaINR: Math.max(0, budgetINR - valuePrice),
    reasoning: [
      `Trims structural materials and secondary sensors to give you maximum core hardware per rupee spent.`,
      `Saves money while retaining the essential 120Hz display and 50MP main camera.`,
    ],
    keyHighlights: [
      `Save ₹${Math.max(0, budgetINR - valuePrice).toLocaleString('en-IN')} from budget`,
      `${valueProc.name}`,
      `Super AMOLED 120Hz`,
      `50MP Sony OIS Capture`,
    ],
  };

  return {
    budgetINR,
    primaryUsage: usages,
    priorities,
    recommendations: {
      bestMatch: bestItem,
      balanced: balancedItem,
      value: valueItem,
    },
    overallExplanation: `SAJASE analyzed your budget of ₹${budgetINR.toLocaleString('en-IN')} alongside your top priorities (${priorities.join(', ') || 'General Performance'}). Below are three distinct tailored paths: your tailored Best Match, an evenly weighted Balanced configuration, and a Value build with cost savings.`,
  };
}

export function optimizeConfigurationToBudget(
  currentConfig: PhoneConfiguration,
  targetBudgetINR: number,
  priorities: PriorityOption[] = ['Performance']
): PhoneConfiguration {
  const cloned: PhoneConfiguration = JSON.parse(JSON.stringify(currentConfig));
  const isPriority = (cat: string) => priorities.some((p) => p.toLowerCase() === cat.toLowerCase());

  // Step 1: Reduce Design material if not priority
  if (!isPriority('Design') && cloned.design.price > 1200) {
    cloned.design = DESIGNS[6]; // Polycarbonate
  }

  let currentPrice = calculatePriceBreakdown(cloned).totalEstimatedPriceINR;
  if (currentPrice <= targetBudgetINR) return cloned;

  // Step 2: Storage downgrade from 1TB/512GB to 256GB if not priority
  if (!isPriority('Storage') && cloned.storage.price > 2300) {
    cloned.storage = STORAGE_OPTIONS[1]; // 256GB
  }

  currentPrice = calculatePriceBreakdown(cloned).totalEstimatedPriceINR;
  if (currentPrice <= targetBudgetINR) return cloned;

  // Step 3: Charging speed downgrade if not priority
  if (!isPriority('Charging') && cloned.charging.price > 1200) {
    cloned.charging = CHARGERS[1]; // 67W
  }

  currentPrice = calculatePriceBreakdown(cloned).totalEstimatedPriceINR;
  if (currentPrice <= targetBudgetINR) return cloned;

  // Step 4: Camera downgrade if not priority
  if (!isPriority('Camera') && cloned.camera.price > 2600) {
    cloned.camera = CAMERAS[0]; // 50MP OIS
  }

  currentPrice = calculatePriceBreakdown(cloned).totalEstimatedPriceINR;
  if (currentPrice <= targetBudgetINR) return cloned;

  // Step 5: RAM downgrade from 16GB/12GB to 8GB if not performance/gaming
  if (!isPriority('Performance') && !isPriority('Gaming') && cloned.ram.price > 1800) {
    cloned.ram = RAM_OPTIONS[1]; // 8GB
  }

  currentPrice = calculatePriceBreakdown(cloned).totalEstimatedPriceINR;
  if (currentPrice <= targetBudgetINR) return cloned;

  // Step 6: Cooling downgrade from Cryo-Loop to Vapor Chamber
  if (cloned.cooling.tier === 'Advanced Cooling') {
    cloned.cooling = COOLINGS[2];
  }

  currentPrice = calculatePriceBreakdown(cloned).totalEstimatedPriceINR;
  if (currentPrice <= targetBudgetINR) return cloned;

  // Step 7: Display downgrade to 1080p 120Hz if not display priority
  if (!isPriority('Display') && cloned.display.price > 3400) {
    cloned.display = DISPLAYS[1];
  }

  currentPrice = calculatePriceBreakdown(cloned).totalEstimatedPriceINR;
  if (currentPrice <= targetBudgetINR) return cloned;

  // Last resort: downgrade processor by 1 tier if still over budget
  if (cloned.processor.id === PROCESSORS[4].id) {
    cloned.processor = PROCESSORS[3];
  } else if (cloned.processor.id === PROCESSORS[3].id && !isPriority('Gaming')) {
    cloned.processor = PROCESSORS[2];
  } else if (cloned.processor.id === PROCESSORS[2].id && !isPriority('Performance')) {
    cloned.processor = PROCESSORS[1];
  }

  return cloned;
}
