import { PhoneConfiguration, CompatibilityIssue } from '../types/phone';
import { RAM_OPTIONS, COOLINGS, PROCESSORS, DISPLAYS } from '../data/components';

export function checkCompatibility(config: PhoneConfiguration): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  // 1. Processor <-> RAM compatibility
  if (config.processor && config.ram) {
    if (config.processor.maxRamBandwidth === 'LPDDR4X' && config.ram.type === 'LPDDR5X') {
      issues.push({
        id: 'proc_ram_bandwidth_mismatch',
        severity: 'error',
        title: 'Processor Memory Controller Bandwidth Mismatch',
        description: `${config.processor.name} only supports up to LPDDR4X bus speeds. Pairing with ${config.ram.name} will not utilize high-speed LPDDR5X and may cause memory bus instability.`,
        affectedComponents: ['processor', 'ram'],
        recommendedFix: {
          category: 'ram',
          componentId: RAM_OPTIONS[0].id, // 6GB LPDDR4X
          actionLabel: 'Downgrade RAM to compatible LPDDR4X',
        },
      });
    } else if (config.processor.brandTier === 'Entry' && config.ram.capacity === '16GB') {
      issues.push({
        id: 'proc_ram_capacity_inefficiency',
        severity: 'warning',
        title: 'RAM Over-allocation for Entry Processor',
        description: `The memory bus on ${config.processor.name} cannot fully saturate 16GB RAM for sustained workloads. An 8GB or 12GB configuration offers identical real-world speed at lower cost.`,
        affectedComponents: ['processor', 'ram'],
        recommendedFix: {
          category: 'ram',
          componentId: RAM_OPTIONS[1].id, // 8GB
          actionLabel: 'Switch to Balanced 8GB RAM',
        },
      });
    }
  }

  // 2. Processor <-> Storage compatibility
  if (config.processor && config.storage) {
    if (config.processor.maxStorageTier === 'UFS2.2' && config.storage.type === 'UFS 4.0') {
      issues.push({
        id: 'proc_storage_bus_mismatch',
        severity: 'warning',
        title: 'Storage Bus Speed Capped by Chipset',
        description: `${config.processor.name} has a UFS 2.2 host controller. The ultra-fast ${config.storage.name} will be down-negotiated to UFS 2.2 speeds (capped around 1000MB/s).`,
        affectedComponents: ['processor', 'storage'],
      });
    }
  }

  // 3. Processor ISP <-> Camera MP
  if (config.processor && config.camera) {
    const mainMpNumber = parseInt(config.camera.mainMP.replace('MP', ''), 10);
    const maxIspMp = config.processor.camera_isp?.max_single_camera_mp || config.processor.maxCameraMP || 64;
    if (mainMpNumber > maxIspMp) {
      issues.push({
        id: 'proc_camera_isp_exceeded',
        severity: 'error',
        title: 'Camera Sensor Exceeds Processor ISP Limit',
        description: `${config.processor.name}'s Image Signal Processor natively supports up to ${maxIspMp}MP. The ${config.camera.mainMP} sensor cannot run full-resolution RAW captures without software binning or severe lag.`,
        affectedComponents: ['processor', 'camera'],
        recommendedFix: {
          category: 'processor',
          componentId: 'snapdragon_7_plus_gen_3',
          actionLabel: 'Upgrade Processor to Snapdragon 7+ Gen 3 (200MP ISP)',
        },
      });
    }
  }

  // 4. Processor GPU <-> Display 2K 144Hz
  if (config.processor && config.display) {
    const isUltraDisplay =
      config.display.resolution.includes('2K') ||
      config.display.resolution_details?.category === '2K QHD+' ||
      config.display.refreshRate === '144Hz' ||
      config.display.refreshRate === '165Hz' ||
      (config.display.refresh_rate_range?.max_hz || 60) >= 144;

    const isEntryOrBudget =
      config.processor.tier === 'Entry' ||
      config.processor.tier === 'Budget' ||
      config.processor.brandTier === 'Entry' ||
      (config.processor.antutu_v10_score && config.processor.antutu_v10_score < 400000);

    if (isUltraDisplay && isEntryOrBudget) {
      issues.push({
        id: 'display_gpu_throttling',
        severity: 'warning',
        title: 'Display Bandwidth Demands High GPU Throughput',
        description: `Driving ${config.display.name} requires substantial pixel fill-rate. ${config.processor.name}'s GPU (${config.processor.gpu}) will struggle to maintain high frame rates fluidly in 3D gaming and heavy animations.`,
        affectedComponents: ['processor', 'display'],
        recommendedFix: {
          category: 'display',
          componentId: 'disp_amoled_120_flat', // FHD+ 120Hz Super AMOLED
          actionLabel: 'Switch to Balanced FHD+ 120Hz Super AMOLED',
        },
      });
    }
  }

  // 5. In-Display Fingerprint Sensor <-> LCD Panel Technology
  if (config.display) {
    const isLcd = config.display.technology?.includes('LCD') || config.display.type?.includes('LCD');
    if (isLcd && config.display.fingerprint_support === 'Side-Mounted Compatible') {
      issues.push({
        id: 'lcd_biometric_architecture_notice',
        severity: 'info',
        title: 'Side-Mounted Fingerprint Architecture Required',
        description: `${config.display.name} utilizes an LED backlight module. In-display optical and ultrasonic fingerprint sensors cannot penetrate LCD backlight sheets. Capacitive biometric recognition is routed to the side power key.`,
        affectedComponents: ['display'],
      });
    }
  }

  // 6. Display Size & Resolution <-> Battery Capacity Bottleneck
  if (config.display && config.battery) {
    const isPowerHungryDisplay =
      (config.display.resolution.includes('2K') || config.display.resolution_details?.category === '2K QHD+') &&
      config.display.refresh_rate_range?.adaptive_type !== 'LTPO Adaptive';
    const isSmallBattery = config.battery.capacity === '4500mAh';

    if (isPowerHungryDisplay && isSmallBattery) {
      issues.push({
        id: 'display_battery_drain_warning',
        severity: 'warning',
        title: 'High Display Power Consumption on 4500mAh Cell',
        description: `Running a high-resolution 2K display without 1Hz LTPO adaptive downclocking on a compact 4500mAh battery will yield reduced screen-on-time (estimated under 5 hours). Upgrading to a 5000mAh+ battery or an LTPO display is recommended.`,
        affectedComponents: ['display', 'battery'],
        recommendedFix: {
          category: 'battery',
          componentId: 'batt_5000_standard',
          actionLabel: 'Upgrade to 5000mAh All-Day Battery',
        },
      });
    }
  }

  // 5. Thermal System <-> Processor (Flagship Heat Dissipation)
  if (config.processor && config.cooling) {
    const isHighTdp = (config.processor.thermal_tdp_watts || config.processor.tdpWatts) >= 9.0;
    if (isHighTdp && config.cooling.tier === 'Standard') {
      issues.push({
        id: 'thermal_throttle_risk',
        severity: 'warning',
        title: 'Thermal Throttling Warning Under Sustained Loads',
        description: `${config.processor.name} draws up to ${config.processor.thermal_tdp_watts || config.processor.tdpWatts}W under load. Standard Graphene cooling will cause thermal throttling within 5-8 minutes of continuous 3D load.`,
        affectedComponents: ['processor', 'cooling'],
        recommendedFix: {
          category: 'cooling',
          componentId: COOLINGS[2].id, // 3D Vapor Chamber
          actionLabel: 'Upgrade to 3D Vapor Chamber Cooling',
        },
      });
    }
  }

  // 6. Network connectivity notice (4G processor in 5G era)
  if (config.processor && !config.processor.network?.five_g) {
    issues.push({
      id: 'processor_4g_only_notice',
      severity: 'info',
      title: '4G LTE Connectivity Selected',
      description: `${config.processor.name} utilizes a 4G LTE cellular modem. 5G standalone (SA) and sub-6 networks will not be accessible on this configuration.`,
      affectedComponents: ['processor'],
    });
  }

  // 6. Battery <-> Fast Charging (Dual-cell safety requirement for 120W)
  if (config.charging && config.battery) {
    if (config.charging.wattage === '120W' && config.battery.cellType === 'Single Cell') {
      issues.push({
        id: 'charging_battery_cell_mismatch',
        severity: 'warning',
        title: '120W Charging Requires Dual-Cell Architecture',
        description: `120W flash charging generates high current that requires dual-cell splitting (e.g. 2x 2500mAh) to avoid excessive battery wear and heat.`,
        affectedComponents: ['battery', 'charging'],
      });
    }
  }

  // 7. Ergonomics & Weight check (6500mAh + Ceramic back)
  if (config.battery && config.design) {
    if (config.battery.capacity === '6500mAh' && config.design.backMaterial === 'Nano-Zirconia Ceramic') {
      issues.push({
        id: 'chassis_weight_notice',
        severity: 'info',
        title: 'Device Weight Notice (~238g)',
        description: `Combining the heavy 6500mAh marathon battery with dense Nano-Zirconia Ceramic results in an estimated weight exceeding 235 grams. Consider Frosted AG Glass or Vegan Leather for lighter daily handling.`,
        affectedComponents: ['battery', 'design'],
      });
    }
  }

  return issues;
}
