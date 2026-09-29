import { PhoneConfiguration, PriceBreakdown } from '../types/phone';

export function calculatePriceBreakdown(config: PhoneConfiguration): PriceBreakdown {
  const bomSubtotal =
    (config.processor?.price || 0) +
    (config.display?.price || 0) +
    (config.ram?.price || 0) +
    (config.storage?.price || 0) +
    (config.camera?.price || 0) +
    (config.battery?.price || 0) +
    (config.charging?.price || 0) +
    (config.cooling?.price || 0) +
    (config.audioHaptics?.price || 0) +
    (config.design?.price || 0);

  // Scaled production fees
  const isFlagship = (config.processor?.price || 0) > 10000 || (config.display?.price || 0) > 5000;
  const assemblyFee = isFlagship ? 1800 : 1200;
  const testingAndRfFee = isFlagship ? 900 : 600;
  const packagingAndAccessories = 650;
  const logisticsInsurance = 550;
  const warrantyReserve = Math.round(Math.max(750, bomSubtotal * 0.04));
  const businessMargin = Math.round(bomSubtotal * 0.08);

  const preTaxSubtotal =
    bomSubtotal +
    assemblyFee +
    testingAndRfFee +
    packagingAndAccessories +
    logisticsInsurance +
    warrantyReserve +
    businessMargin;

  const taxesGST = Math.round(preTaxSubtotal * 0.18);
  const totalEstimatedPriceINR = preTaxSubtotal + taxesGST;
  const totalEstimatedPriceUSD = Math.round(totalEstimatedPriceINR / 85);

  return {
    bomSubtotal,
    assemblyFee,
    testingAndRfFee,
    packagingAndAccessories,
    logisticsInsurance,
    warrantyReserve,
    businessMargin,
    taxesGST,
    totalEstimatedPriceINR,
    totalEstimatedPriceUSD,
  };
}
