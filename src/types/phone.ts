export type ComponentCategory =
  | 'processor'
  | 'display'
  | 'ram'
  | 'storage'
  | 'camera'
  | 'battery'
  | 'charging'
  | 'cooling'
  | 'audioHaptics'
  | 'design';

export type ProcessorBrand =
  | 'Qualcomm'
  | 'MediaTek'
  | 'Samsung'
  | 'Google'
  | 'UNISOC'
  | 'HiSilicon';

export type ProcessorTier =
  | 'Entry'
  | 'Budget'
  | 'Mid-Range'
  | 'Upper Mid-Range'
  | 'Flagship'
  | 'Ultra Flagship';

export interface ProcessorComponent {
  id: string;
  name: string;
  brand: ProcessorBrand;
  family: string;
  model: string;
  tier: ProcessorTier;
  brandTier: 'Entry' | 'Mid-Range' | 'High Performance' | 'Flagship Gaming' | 'Extreme Pro';
  cores: string;
  processNode: string; // e.g. "4nm TSMC"
  cpuArch: string;
  gpu: string;
  antutuScoreEstimate: number; // For score rating
  maxRamBandwidth: 'LPDDR3' | 'LPDDR4X' | 'LPDDR5' | 'LPDDR5X';
  maxStorageTier: 'eMMC5.1' | 'eMMC 5.1' | 'UFS2.1' | 'UFS2.2' | 'UFS3.0' | 'UFS3.1' | 'UFS4.0';
  maxCameraMP: number;
  tdpWatts: number;
  price: number; // Demo INR
  features: string[];
  inStock: boolean;

  // Detailed hardware database specifications
  process: {
    nm: number;
    foundry?: string;
  };
  cpu: {
    architecture: string;
    cores: number;
    cluster: string;
    max_clock_ghz?: number;
  };
  gpuDetails?: {
    name: string;
    class: string;
    ray_tracing: boolean;
  };
  ai: {
    npu_available: boolean;
    ai_class: 'Basic' | 'Moderate' | 'High' | 'Very High' | 'Cutting Edge';
    tops?: number;
  };
  network: {
    four_g: boolean;
    five_g: boolean;
    modem?: string;
  };
  memory: {
    supported_types: string[];
    max_channels?: number;
  };
  storage: {
    supported_types: string[];
  };
  camera_isp: {
    max_single_camera_mp: number;
    max_video: string;
    isp_name?: string;
  };
  thermal_tdp_watts: number;
  antutu_v10_score: number;
  geekbench_single: number;
  geekbench_multi: number;
  efficiency_rating: number; // 0 - 100
  gaming_rating: number; // 0 - 100
  ai_rating: number; // 0 - 100
  camera_rating: number; // 0 - 100
  regionalAvailability?: 'Global' | 'Selected Markets' | 'China / Limited' | 'China / Selected Markets';
  specialBadge?: string;
}

export type DisplayTechnology =
  | 'LCD'
  | 'IPS LCD'
  | 'LTPS LCD'
  | 'OLED'
  | 'AMOLED'
  | 'Super AMOLED'
  | 'LTPO OLED'
  | 'Flexible OLED'
  | 'Foldable OLED';

export type DisplayPanelShape =
  | 'Flat'
  | '2.5D'
  | 'Curved'
  | 'Micro-Curved'
  | 'Foldable'
  | 'Rollable';

export type AdaptiveRefreshRateType =
  | 'Fixed'
  | 'Adaptive'
  | 'LTPO Adaptive';

export type DisplayColorDepth =
  | '8-bit'
  | '8-bit + FRC'
  | '10-bit'
  | '12-bit';

export type DisplayHDR =
  | 'No HDR'
  | 'HDR10'
  | 'HDR10+'
  | 'Dolby Vision'
  | 'HDR Vivid';

export type ScreenProtectionCategory =
  | 'Basic Glass'
  | 'Strengthened Glass'
  | 'Gorilla Glass'
  | 'Custom Cover Glass';

export type DisplayFingerprintSupport =
  | 'Optical In-Display'
  | 'Ultrasonic In-Display'
  | 'Side-Mounted Compatible'
  | 'None';

export interface DisplayComponent {
  id: string;
  name: string;
  type: string; // Compatible with existing UI string
  size: string; // e.g. '6.67"'
  refreshRate: string; // e.g. '120Hz'
  resolution: string; // e.g. 'FHD+ (1080p)'
  peakBrightness: number; // nits
  hdrSupport: string[]; // HDR10+, Dolby Vision
  glassType: string;
  price: number;
  features: string[];
  inStock: boolean;

  // Complete Structured Smartphone Display Database Fields
  technology: DisplayTechnology;
  marketing_name?: string;
  diagonal_inches: number;
  resolution_details: {
    width: number;
    height: number;
    category: 'HD+' | 'FHD+' | '1.5K' | '2K QHD+' | 'Custom';
    aspect_ratio: string;
  };
  ppi: number;
  refresh_rate_range: {
    min_hz: number;
    max_hz: number;
    adaptive_type: AdaptiveRefreshRateType;
  };
  touch_sampling_hz: number;
  brightness: {
    typical_nits: number | null;
    peak_nits: number | null;
    hbm_nits?: number | null;
  };
  hdr: DisplayHDR[];
  color_depth: DisplayColorDepth;
  color_gamut: {
    srgb?: number;
    dci_p3?: number;
    display_p3?: number;
    adobe_rgb?: number;
    ntsc?: number;
  };
  color_calibration?: {
    preset: 'Standard' | 'Natural' | 'Vivid' | 'Cinema' | 'Professional' | 'Factory Calibrated' | 'Custom';
    delta_e?: number | null;
    gamma?: number | null;
    white_point?: string | null;
    color_temp_k?: number | null;
  };
  panel_shape: DisplayPanelShape;
  panel_flags: {
    flat: boolean;
    curved: boolean;
    foldable: boolean;
  };
  screen_to_body_percentage?: number | null;
  response_time_ms?: number | null;
  screen_protection: {
    category: ScreenProtectionCategory;
    protection_model: string;
  };
  pwm: {
    frequency_hz: number | null;
    dc_dimming: boolean;
    flicker_reduction: boolean;
  };
  eye_comfort: string[];
  always_on_display: {
    supported: boolean;
    aod_type: 'Full AOD' | 'Minimal AOD' | 'LTPO 1Hz AOD' | 'None';
  };
  fingerprint_support: DisplayFingerprintSupport;
  estimated_cost_inr: number;
  availability: 'In Stock' | 'Limited Batch' | 'Demo' | 'Pre-order';
  status: 'Active' | 'Discontinued' | 'Concept';
}

export interface RAMComponent {
  id: string;
  name: string;
  capacity: '6GB' | '8GB' | '12GB' | '16GB';
  type: 'LPDDR4X' | 'LPDDR5' | 'LPDDR5X';
  speedMbps: number;
  price: number;
  features: string[];
  inStock: boolean;
}

export interface StorageComponent {
  id: string;
  name: string;
  capacity: '128GB' | '256GB' | '512GB' | '1TB';
  type: 'UFS 2.2' | 'UFS 3.1' | 'UFS 4.0';
  readSpeedMBs: number;
  price: number;
  features: string[];
  inStock: boolean;
}

export interface CameraComponent {
  id: string;
  name: string;
  mainMP: '50MP' | '64MP' | '108MP' | '200MP';
  sensorSize: string; // e.g. "1/1.56 inch"
  ois: boolean;
  eis: boolean;
  videoCapability: string; // "4K 60fps" | "8K 30fps"
  secondarySetup: 'None' | '8MP Ultrawide' | '12MP Ultrawide + 50MP 3X Telephoto' | '50MP Ultrawide + 50MP Periscope 5X';
  frontMP: '16MP' | '24MP' | '32MP HDR' | '50MP 4K Autofocus';
  price: number;
  features: string[];
  inStock: boolean;
}

export interface BatteryComponent {
  id: string;
  name: string;
  capacity: '4500mAh' | '5000mAh' | '5500mAh' | '6000mAh' | '6500mAh';
  tech: 'Li-Po' | 'Silicon-Carbon High-Density';
  cellType: 'Single Cell' | 'Dual Cell';
  estimatedBatteryHours: number; // Screen on time estimate
  thicknessAddedMm: number;
  weightGrams: number;
  price: number;
  features: string[];
  inStock: boolean;
}

export interface ChargingComponent {
  id: string;
  name: string;
  wattage: '33W' | '67W' | '80W' | '100W' | '120W';
  protocol: string; // "USB-PD 3.0" | "GaN Dual-Pump"
  wirelessCharging: boolean; // Qi2 15W/50W
  estimated0To100Mins: string; // e.g. "~26 mins"
  chargerInBox: boolean;
  price: number;
  features: string[];
  inStock: boolean;
}

export interface CoolingComponent {
  id: string;
  name: string;
  tier: 'Standard' | 'Graphite' | 'Vapor Chamber' | 'Advanced Cooling';
  chamberAreaMm2: number;
  techDescription: string;
  thermalDissipationWatts: number;
  price: number;
  features: string[];
  inStock: boolean;
}

export interface AudioHapticsComponent {
  id: string;
  name: string;
  touchSamplingRate: '240Hz' | '480Hz' | '720Hz';
  speakers: 'Single Downward' | 'Dual Symmetrical Stereo';
  audioTuning: string; // "Dolby Atmos Spatial Audio"
  haptics: 'Standard Linear' | 'Advanced Bionic X-Axis';
  gamingSoftware: boolean; // "Custom Game Space + Thermal Guard"
  price: number;
  features: string[];
  inStock: boolean;
}

export interface DesignComponent {
  id: string;
  name: string;
  frameMaterial: 'Polycarbonate Polymer' | 'Aerospace Aluminum 6000' | 'Grade 5 Titanium & Steel';
  backMaterial: 'Frosted Matte AG Glass' | 'Cyber Carbon Fiber Weave' | 'Nano-Zirconia Ceramic' | 'Bio-Eco Vegan Leather';
  colorName: string;
  hexColor: string;
  accentColor: string;
  cameraModuleLayout: 'Cyber Matrix' | 'Circular Horizon' | 'Linear Duo/Trio' | 'Hexa Shield';
  customEngraving?: string;
  finishStyle: 'Matte' | 'Glass-style' | 'Carbon-style' | 'Ceramic';
  waterResistanceRating: 'IP54 Splash' | 'IP68 Submersion';
  price: number;
  inStock: boolean;
}

export interface PhoneConfiguration {
  id: string;
  name: string;
  brandName?: string; // Rear chassis branding (defaults to THOR)
  createdAt: string;
  updatedAt: string;
  version: string;
  processor: ProcessorComponent;
  display: DisplayComponent;
  ram: RAMComponent;
  storage: StorageComponent;
  camera: CameraComponent;
  battery: BatteryComponent;
  charging: ChargingComponent;
  cooling: CoolingComponent;
  audioHaptics: AudioHapticsComponent;
  design: DesignComponent;
  customNotes?: string;
}

export interface PriceBreakdown {
  bomSubtotal: number;
  assemblyFee: number;
  testingAndRfFee: number;
  packagingAndAccessories: number;
  logisticsInsurance: number;
  warrantyReserve: number;
  businessMargin: number;
  taxesGST: number; // 18%
  totalEstimatedPriceINR: number;
  totalEstimatedPriceUSD: number;
}

export interface CompatibilityIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  affectedComponents: ComponentCategory[];
  recommendedFix?: {
    category: ComponentCategory;
    componentId: string;
    actionLabel: string;
  };
}

export interface ConfigurationScore {
  performance: number; // 0 - 100
  gaming: number; // 0 - 100
  camera: number; // 0 - 100
  battery: number; // 0 - 100
  display: number; // 0 - 100
  value: number; // 0 - 100
  overallScore: number;
}

export type UsageOption =
  | 'Gaming'
  | 'Camera'
  | 'Video editing'
  | 'Social media'
  | 'Work'
  | 'Battery'
  | 'Everyday use';

export type PriorityOption =
  | 'Performance'
  | 'Gaming'
  | 'Camera'
  | 'Battery'
  | 'Display'
  | 'Storage'
  | 'Design'
  | 'Charging'
  | 'Speakers';

export interface SajaseRecommendationItem {
  type: 'best_match' | 'balanced' | 'value';
  title: string;
  subtitle: string;
  config: PhoneConfiguration;
  estimatedPriceINR: number;
  savingsOrDeltaINR?: number;
  reasoning: string[];
  keyHighlights: string[];
}

export interface SajaseRecommendationResponse {
  budgetINR: number;
  primaryUsage: string[];
  priorities: string[];
  recommendations: {
    bestMatch: SajaseRecommendationItem;
    balanced: SajaseRecommendationItem;
    value: SajaseRecommendationItem;
  };
  overallExplanation: string;
}

export interface ManufacturingQuotationRequest {
  id: string;
  submittedAt: string;
  status: 'Submitted' | 'Technical Review' | 'Component Validation' | 'Quotation' | 'Prototype Discussion';
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  quantityTier: '1 Prototype Unit' | '10-50 Evaluation Batch' | '100-500 Pilot Production' | '1,000+ Volume Run';
  targetRegion: string;
  additionalRequirements?: string;
  configuration: PhoneConfiguration;
  estimatedPriceINR: number;
  estimatedPriceUSD: number;
  adminNotes?: string;
}
