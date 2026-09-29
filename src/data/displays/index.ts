import { DisplayComponent, DisplayTechnology } from '../../types/phone';
import { FLAGSHIP_LTPO_DISPLAYS } from './flagshipLtpo';
import { PERFORMANCE_AMOLED_DISPLAYS } from './performanceAmoled';
import { LCD_AND_ENTRY_DISPLAYS } from './lcdAndEntry';
import { SPECIAL_FOLDABLE_DISPLAYS } from './specialFoldable';

export const ALL_DISPLAYS: DisplayComponent[] = [
  ...FLAGSHIP_LTPO_DISPLAYS,
  ...PERFORMANCE_AMOLED_DISPLAYS,
  ...LCD_AND_ENTRY_DISPLAYS,
  ...SPECIAL_FOLDABLE_DISPLAYS,
];

export {
  FLAGSHIP_LTPO_DISPLAYS,
  PERFORMANCE_AMOLED_DISPLAYS,
  LCD_AND_ENTRY_DISPLAYS,
  SPECIAL_FOLDABLE_DISPLAYS,
};

/**
 * Retrieve display by unique ID
 */
export function getDisplayById(id: string): DisplayComponent | undefined {
  return ALL_DISPLAYS.find((d) => d.id === id);
}

/**
 * Filter displays by underlying display technology
 */
export function getDisplaysByTechnology(tech: DisplayTechnology | 'All'): DisplayComponent[] {
  if (tech === 'All') return ALL_DISPLAYS;
  return ALL_DISPLAYS.filter((d) => d.technology === tech);
}

/**
 * Retrieve display stats for catalog and admin
 */
export function getDisplayDatabaseStats() {
  const total = ALL_DISPLAYS.length;
  const ltpoCount = ALL_DISPLAYS.filter((d) => d.technology === 'LTPO OLED').length;
  const amoledCount = ALL_DISPLAYS.filter((d) => d.technology === 'AMOLED' || d.technology === 'Super AMOLED').length;
  const lcdCount = ALL_DISPLAYS.filter((d) => d.technology.includes('LCD')).length;
  const highRefreshCount = ALL_DISPLAYS.filter((d) => parseInt(d.refreshRate.replace('Hz', ''), 10) >= 120).length;
  const dolbyVisionCount = ALL_DISPLAYS.filter((d) => d.hdr.includes('Dolby Vision')).length;

  return {
    total,
    ltpoCount,
    amoledCount,
    lcdCount,
    highRefreshCount,
    dolbyVisionCount,
  };
}
