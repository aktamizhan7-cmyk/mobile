import { DisplayComponent } from '../../types/phone';
import { calculatePPI } from '../../utils/displayCalculators';

export const SPECIAL_FOLDABLE_DISPLAYS: DisplayComponent[] = [
  // 1. 7.92" 2K Foldable LTPO OLED (Dual Screen Ecosystem)
  {
    id: 'disp_foldable_792_ltpo',
    name: '7.92" 2K Foldable LTPO OLED Dual-Screen',
    type: 'Foldable OLED',
    size: '7.0"', // mapped for broad filter
    refreshRate: '120Hz',
    resolution: '2K QHD+ (1440p)',
    peakBrightness: 5000,
    hdrSupport: ['Dolby Vision', 'HDR10+', 'HDR Vivid'],
    glassType: 'Ultra-Thin Flexible Glass (UTG)',
    price: 18500,
    features: [
      'Dual Display (7.92" Inner Tablet + 6.43" Outer Screen)',
      '1Hz-120Hz LTPO on Both Panels',
      '3840Hz Risk-Free PWM Dimming',
      'Titanium Waterdrop Zero-Crease Hinge Compatible',
    ],
    inStock: true,

    technology: 'Foldable OLED',
    marketing_name: 'Dual-Flex 2K LTPO Foldable & Cover Screen',
    diagonal_inches: 7.92,
    resolution_details: {
      width: 2156,
      height: 2344,
      category: '2K QHD+',
      aspect_ratio: '9.8:9 (Inner Folded Square-Format)',
    },
    ppi: calculatePPI(2156, 2344, 7.92),
    refresh_rate_range: {
      min_hz: 1,
      max_hz: 120,
      adaptive_type: 'LTPO Adaptive',
    },
    touch_sampling_hz: 360,
    brightness: {
      typical_nits: 1600,
      peak_nits: 5000,
      hbm_nits: 2600,
    },
    hdr: ['HDR10', 'HDR10+', 'Dolby Vision', 'HDR Vivid'],
    color_depth: '10-bit',
    color_gamut: {
      dci_p3: 100,
      srgb: 100,
      display_p3: 100,
    },
    color_calibration: {
      preset: 'Factory Calibrated',
      delta_e: 0.3,
      gamma: 2.2,
      white_point: 'D65',
    },
    panel_shape: 'Foldable',
    panel_flags: {
      flat: false,
      curved: false,
      foldable: true,
    },
    screen_to_body_percentage: 91.0,
    response_time_ms: 1,
    screen_protection: {
      category: 'Custom Cover Glass',
      protection_model: 'Ultra-Thin Glass (UTG) + Impact-Resistant Silicone Cushion Layer',
    },
    pwm: {
      frequency_hz: 3840,
      dc_dimming: true,
      flicker_reduction: true,
    },
    eye_comfort: [
      'TÜV Rheinland Circadian Friendly',
      'TÜV Rheinland Flicker Free',
      'Dual Light Sensor Auto Brightness',
    ],
    always_on_display: {
      supported: true,
      aod_type: 'LTPO 1Hz AOD',
    },
    fingerprint_support: 'Side-Mounted Compatible',
    estimated_cost_inr: 18500,
    availability: 'Limited Batch',
    status: 'Active',
  },

  // 2. 6.9" 2K Extreme Flagship LTPO OLED (5000 nits Peak Outdoor Monster)
  {
    id: 'disp_extreme_69_ltpo',
    name: '6.9" 2K Extreme LTPO OLED 5000-Nits',
    type: 'LTPO 3.0 AMOLED',
    size: '6.9"',
    refreshRate: '120Hz',
    resolution: '2K QHD+ (1440p)',
    peakBrightness: 5000,
    hdrSupport: ['Dolby Vision', 'HDR10+', 'HDR Vivid'],
    glassType: 'Corning Gorilla Glass Armor',
    price: 9800,
    features: [
      '5000 nits Unmatched Outdoor Sunlight Readability',
      'Anti-Reflective 75% Reflection Reduction',
      'Ultrasonic 3D In-Display Fingerprint Sensor',
      '4320Hz Extreme Eye-Comfort PWM Dimming',
    ],
    inStock: true,

    technology: 'LTPO OLED',
    marketing_name: 'Sunlight Beast 2K LTPO Armor',
    diagonal_inches: 6.9,
    resolution_details: {
      width: 1440,
      height: 3120,
      category: '2K QHD+',
      aspect_ratio: '19.5:9',
    },
    ppi: calculatePPI(1440, 3120, 6.9),
    refresh_rate_range: {
      min_hz: 1,
      max_hz: 120,
      adaptive_type: 'LTPO Adaptive',
    },
    touch_sampling_hz: 480,
    brightness: {
      typical_nits: 1800,
      peak_nits: 5000,
      hbm_nits: 3000,
    },
    hdr: ['HDR10', 'HDR10+', 'Dolby Vision', 'HDR Vivid'],
    color_depth: '12-bit',
    color_gamut: {
      dci_p3: 100,
      srgb: 100,
      display_p3: 100,
    },
    color_calibration: {
      preset: 'Cinema',
      delta_e: 0.22,
      gamma: 2.2,
      white_point: 'D65',
      color_temp_k: 6500,
    },
    panel_shape: 'Flat',
    panel_flags: {
      flat: true,
      curved: false,
      foldable: false,
    },
    screen_to_body_percentage: 94.6,
    response_time_ms: 1,
    screen_protection: {
      category: 'Gorilla Glass',
      protection_model: 'Corning Gorilla Glass Armor (Anti-Reflective + 4x Scratch Resistance)',
    },
    pwm: {
      frequency_hz: 4320,
      dc_dimming: true,
      flicker_reduction: true,
    },
    eye_comfort: [
      '4320Hz PWM Risk-Free Eye Care',
      'TÜV Rheinland Circadian & Full Care Display 3.0',
      'Circadian Sleep Optimization',
    ],
    always_on_display: {
      supported: true,
      aod_type: 'LTPO 1Hz AOD',
    },
    fingerprint_support: 'Ultrasonic In-Display',
    estimated_cost_inr: 9800,
    availability: 'In Stock',
    status: 'Active',
  },
];
