import { PhoneConfiguration, ConfigurationScore } from '../types/phone';
import { calculatePriceBreakdown } from './pricingEngine';

export function calculateConfigurationScores(config: PhoneConfiguration): ConfigurationScore {
  // 1. Performance (Processor AnTuTu + Geekbench + RAM bandwidth + Storage speed)
  let perfScore = 30;
  if (config.processor) {
    if (config.processor.antutu_v10_score) {
      // Scale AnTuTu v10 (100k - 3.2M) into 30 - 99 score
      const antutu = config.processor.antutu_v10_score;
      if (antutu >= 2500000) perfScore = 98;
      else if (antutu >= 1800000) perfScore = 92;
      else if (antutu >= 1200000) perfScore = 85;
      else if (antutu >= 750000) perfScore = 74;
      else if (antutu >= 450000) perfScore = 60;
      else perfScore = 45;
    } else {
      if (config.processor.brandTier === 'Entry') perfScore = 48;
      else if (config.processor.brandTier === 'Mid-Range') perfScore = 65;
      else if (config.processor.brandTier === 'High Performance') perfScore = 78;
      else if (config.processor.brandTier === 'Flagship Gaming') perfScore = 90;
      else if (config.processor.brandTier === 'Extreme Pro') perfScore = 99;
    }
  }
  if (config.ram?.capacity === '16GB') perfScore += 3;
  if (config.storage?.type === 'UFS 4.0') perfScore += 2;
  perfScore = Math.min(100, Math.max(30, perfScore));

  // 2. Gaming (Processor GPU rating + Refresh Rate + Cooling + Touch sampling)
  let gamingScore = 35;
  if (config.processor) {
    if (config.processor.gaming_rating) {
      gamingScore = Math.round(config.processor.gaming_rating * 0.95);
    } else {
      if (config.processor.brandTier === 'Entry') gamingScore = 45;
      else if (config.processor.brandTier === 'Mid-Range') gamingScore = 62;
      else if (config.processor.brandTier === 'High Performance') gamingScore = 76;
      else if (config.processor.brandTier === 'Flagship Gaming') gamingScore = 91;
      else if (config.processor.brandTier === 'Extreme Pro') gamingScore = 98;
    }
  }
  // Cooling bonus/penalty
  if (config.cooling?.tier === 'Advanced Cooling') gamingScore += 5;
  else if (config.cooling?.tier === 'Vapor Chamber') gamingScore += 3;
  else if (config.cooling?.tier === 'Standard' && gamingScore > 65) gamingScore -= 8;

  // Touch sampling & display gaming fluidity
  const touchSampling = config.display?.touch_sampling_hz || (config.audioHaptics?.touchSamplingRate === '720Hz' ? 720 : 240);
  if (touchSampling >= 720) gamingScore += 4;
  else if (touchSampling >= 480) gamingScore += 3;
  else if (touchSampling >= 360) gamingScore += 2;

  const maxHz = config.display?.refresh_rate_range?.max_hz || parseInt(config.display?.refreshRate?.replace('Hz', '') || '60', 10);
  if (maxHz >= 165) gamingScore += 5;
  else if (maxHz >= 144) gamingScore += 4;
  else if (maxHz >= 120) gamingScore += 2;

  gamingScore = Math.min(100, Math.max(25, gamingScore));

  // 3. Camera (Main sensor size, OIS, secondary focal lengths, front camera + Processor ISP/AI rating)
  let cameraScore = 40;
  if (config.camera) {
    if (config.camera.mainMP === '50MP' && config.camera.ois) cameraScore = 72;
    else if (config.camera.mainMP === '64MP') cameraScore = 64;
    else if (config.camera.mainMP === '108MP') cameraScore = 80;
    else if (config.camera.mainMP === '200MP') cameraScore = 94;

    if (config.camera.secondarySetup.includes('Telephoto') || config.camera.secondarySetup.includes('Periscope')) {
      cameraScore += 8;
    }
  }
  // Processor computational photography bonus (e.g. Google Tensor or Flagship Cognitive ISP)
  if (config.processor?.camera_rating && config.processor.camera_rating >= 95) {
    cameraScore += 4;
  }
  cameraScore = Math.min(100, Math.max(30, cameraScore));

  // 4. Battery (Capacity + Charging speed + Processor efficiency node + Display LTPO savings)
  let batteryScore = 50;
  if (config.battery) {
    if (config.battery.capacity === '4500mAh') batteryScore = 60;
    else if (config.battery.capacity === '5000mAh') batteryScore = 75;
    else if (config.battery.capacity === '5500mAh') batteryScore = 85;
    else if (config.battery.capacity === '6000mAh') batteryScore = 94;
    else if (config.battery.capacity === '6500mAh') batteryScore = 99;
  }
  // Processor efficiency adjustment (3nm/4nm TSMC vs older nodes)
  if (config.processor?.efficiency_rating) {
    const effDelta = Math.round((config.processor.efficiency_rating - 85) / 3);
    batteryScore += effDelta;
  }
  // Display LTPO power savings vs fixed high-refresh drain
  if (config.display?.refresh_rate_range?.adaptive_type === 'LTPO Adaptive' || config.display?.refresh_rate_range?.min_hz === 1) {
    batteryScore += 4; // 1Hz idle downclocking conserves power
  } else if (config.display && (config.display.resolution_details?.category === '2K QHD+' || config.display.resolution.includes('2K')) && config.display.refresh_rate_range?.adaptive_type === 'Fixed') {
    batteryScore -= 3; // Fixed high-res drain
  }

  if (config.charging?.wattage === '120W' || config.charging?.wattage === '100W') batteryScore += 3;
  batteryScore = Math.min(100, Math.max(35, batteryScore));

  // 5. Display (Panel technology, Resolution, PPI, Refresh rate, Brightness, Color Depth, PWM)
  let displayScore = 50;
  if (config.display) {
    const tech = config.display.technology || config.display.type;
    if (tech === 'LTPO OLED' || config.display.type === 'Micro-Curved OLED') displayScore = 92;
    else if (tech === 'Foldable OLED') displayScore = 96;
    else if (tech === 'Super AMOLED' || tech === 'AMOLED' || tech === 'OLED') displayScore = 80;
    else if (tech === 'LTPS LCD') displayScore = 68;
    else if (tech === 'IPS LCD') displayScore = 60;
    else displayScore = 50;

    // Resolution bonus
    const resCat = config.display.resolution_details?.category || (config.display.resolution.includes('2K') ? '2K QHD+' : config.display.resolution.includes('1.5K') ? '1.5K' : 'FHD+');
    if (resCat === '2K QHD+') displayScore += 4;
    else if (resCat === '1.5K') displayScore += 2;

    // Peak brightness bonus
    const peak = config.display.brightness?.peak_nits || config.display.peakBrightness || 1000;
    if (peak >= 4500) displayScore += 3;
    else if (peak >= 3000) displayScore += 2;
    else if (peak >= 2000) displayScore += 1;

    // Color depth bonus
    if (config.display.color_depth === '12-bit') displayScore += 2;

    // HDR bonus
    if (config.display.hdr?.includes('Dolby Vision') || config.display.hdrSupport?.includes('Dolby Vision')) displayScore += 2;

    // Refresh rate bonus
    if (maxHz >= 144) displayScore += 2;
  }
  displayScore = Math.min(100, Math.max(40, displayScore));

  // 6. Value-for-money score
  const { totalEstimatedPriceINR } = calculatePriceBreakdown(config);
  const performanceSum = perfScore * 0.3 + gamingScore * 0.25 + cameraScore * 0.25 + batteryScore * 0.2;
  // Cost efficiency ratio
  const valueRatio = (performanceSum / (totalEstimatedPriceINR / 1000)) * 25;
  const valueScore = Math.min(98, Math.max(45, Math.round(valueRatio)));

  const overallScore = Math.round(
    perfScore * 0.25 +
      gamingScore * 0.2 +
      cameraScore * 0.2 +
      batteryScore * 0.15 +
      displayScore * 0.1 +
      valueScore * 0.1
  );

  return {
    performance: perfScore,
    gaming: gamingScore,
    camera: cameraScore,
    battery: batteryScore,
    display: displayScore,
    value: valueScore,
    overallScore,
  };
}
