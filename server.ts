import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
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
} from './src/data/components.ts';
import { generateDeterministicSajaseRecommendations } from './src/services/sajaseService.ts';
import { calculatePriceBreakdown } from './src/utils/pricingEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // SAJASE AI Recommendation API Endpoint
  app.post('/api/sajase/recommend', async (req, res) => {
    try {
      const { budgetINR, usages = [], priorities = [], userPrompt = '' } = req.body;
      const budget = Number(budgetINR) || 30000;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Fallback to deterministic engine
        const fallback = generateDeterministicSajaseRecommendations({
          budgetINR: budget,
          usages,
          priorities,
          userPrompt,
        });
        return res.json(fallback);
      }

      const ai = new GoogleGenAI({ apiKey });

      const componentCatalogPrompt = `
Available Processors: ${PROCESSORS.map((p) => `${p.id} (${p.name} [${p.brand || 'SoC'} ${p.tier || p.brandTier}], ₹${p.price}, AnTuTu: ${Math.round((p.antutu_v10_score || p.antutuScoreEstimate || 0) / 1000)}k, ISP: ${p.maxCameraMP}MP, 5G: ${p.network?.five_g !== false})`).join(', ')}
Available Displays: ${DISPLAYS.map((d) => `${d.id} (${d.name} [${d.technology || d.type}, ${d.resolution}, ${d.refreshRate}, ${d.peakBrightness}nits, ${d.touch_sampling_hz || 240}Hz Touch], ₹${d.price})`).join(', ')}
Available RAM: ${RAM_OPTIONS.map((r) => `${r.id} (${r.capacity}, ₹${r.price})`).join(', ')}
Available Storage: ${STORAGE_OPTIONS.map((s) => `${s.id} (${s.capacity}, ₹${s.price})`).join(', ')}
Available Cameras: ${CAMERAS.map((c) => `${c.id} (${c.name}, ₹${c.price})`).join(', ')}
Available Batteries: ${BATTERIES.map((b) => `${b.id} (${b.capacity}, ₹${b.price})`).join(', ')}
Available Charging: ${CHARGERS.map((ch) => `${ch.id} (${ch.wattage}, ₹${ch.price})`).join(', ')}
Available Cooling: ${COOLINGS.map((co) => `${co.id} (${co.name}, ₹${co.price})`).join(', ')}
Available AudioHaptics: ${AUDIO_HAPTICS.map((a) => `${a.id} (${a.name}, ₹${a.price})`).join(', ')}
Available Designs: ${DESIGNS.map((de) => `${de.id} (${de.colorName}, ₹${de.price})`).join(', ')}
`;

      const prompt = `
You are SAJASE, an intelligent custom smartphone hardware architect for CUSTOM PHONE.
User Request:
- Target Budget: ₹${budget}
- Primary Usages: ${usages.join(', ') || 'General Everyday'}
- Priorities: ${priorities.join(', ') || 'Performance'}
- User Notes: "${userPrompt}"

Processor & Display Architecture Guidelines:
- Heavy Gaming: Prioritize high-refresh displays like 165Hz Esports Pro AMOLED (disp_esports_165_amoled) or 144Hz LTPO (disp_ltpo_15k_144, disp_crystalres_15k_144) with 720Hz touch sampling, paired with Snapdragon 8 Elite, 8 Gen 3, or Dimensity 9400/8300 and Vapor Chamber cooling.
- Eye Comfort & Flicker Sensitivity: Prioritize zero-PWM DC Dimming LTPS LCD (disp_ltps_144_lcd) or high-frequency 3840Hz/4320Hz PWM OLEDs.
- Camera & Computational Photography: Prioritize Google Tensor G4/G5, Snapdragon 8 Gen 3, or Dimensity 9300 with 200MP+ ISP capability and high-accuracy DCI-P3 10-bit displays.
- Battery & Energy Efficiency: Prioritize 1Hz LTPO adaptive variable displays (disp_ltpo_15k_144, disp_curved_2k_120) and 4nm/3nm TSMC architectures like Dimensity 7300 or Snapdragon 7s Gen 3.
- Budget 5G (under ₹22,000): Utilize Snapdragon 4 Gen 2, Dimensity 6300, or UNISOC T8200 with FHD+ 90Hz/120Hz displays.

Task:
Generate 3 distinct phone recommendations selecting EXACT component IDs from the catalog above:
1. BEST_MATCH: strictly optimized around the user's primary priorities and budget.
2. BALANCED: an evenly balanced build across camera, processor, battery, and display.
3. VALUE: a cost-efficient build that saves 15-25% budget while protecting essentials.

Rules:
- You MUST only use component IDs from the provided catalog. Do NOT invent new IDs.
- Ensure camera megapixel does not exceed processor ISP limit.
- Include 2-3 specific bullet reasons ("reasoning") for each configuration explaining trade-offs.

Output valid JSON matching this schema:
{
  "bestMatch": {
    "processorId": "string",
    "displayId": "string",
    "ramId": "string",
    "storageId": "string",
    "cameraId": "string",
    "batteryId": "string",
    "chargingId": "string",
    "coolingId": "string",
    "audioHapticsId": "string",
    "designId": "string",
    "reasoning": ["string"]
  },
  "balanced": {
    "processorId": "string",
    "displayId": "string",
    "ramId": "string",
    "storageId": "string",
    "cameraId": "string",
    "batteryId": "string",
    "chargingId": "string",
    "coolingId": "string",
    "audioHapticsId": "string",
    "designId": "string",
    "reasoning": ["string"]
  },
  "value": {
    "processorId": "string",
    "displayId": "string",
    "ramId": "string",
    "storageId": "string",
    "cameraId": "string",
    "batteryId": "string",
    "chargingId": "string",
    "coolingId": "string",
    "audioHapticsId": "string",
    "designId": "string",
    "reasoning": ["string"]
  },
  "overallExplanation": "string"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${componentCatalogPrompt}\n\n${prompt}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);

      const buildConfigFromIds = (item: any, name: string) => {
        const proc = PROCESSORS.find((c) => c.id === item.processorId) || PROCESSORS[1];
        const disp = DISPLAYS.find((c) => c.id === item.displayId) || DISPLAYS[1];
        const ram = RAM_OPTIONS.find((c) => c.id === item.ramId) || RAM_OPTIONS[1];
        const storage = STORAGE_OPTIONS.find((c) => c.id === item.storageId) || STORAGE_OPTIONS[1];
        const cam = CAMERAS.find((c) => c.id === item.cameraId) || CAMERAS[0];
        const batt = BATTERIES.find((c) => c.id === item.batteryId) || BATTERIES[1];
        const charge = CHARGERS.find((c) => c.id === item.chargingId) || CHARGERS[1];
        const cool = COOLINGS.find((c) => c.id === item.coolingId) || COOLINGS[1];
        const audio = AUDIO_HAPTICS.find((c) => c.id === item.audioHapticsId) || AUDIO_HAPTICS[1];
        const design = DESIGNS.find((c) => c.id === item.designId) || DESIGNS[0];

        const cfg = {
          id: `cfg_sajase_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name,
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

        const price = calculatePriceBreakdown(cfg).totalEstimatedPriceINR;
        return {
          config: cfg,
          estimatedPriceINR: price,
          reasoning: Array.isArray(item.reasoning) ? item.reasoning : ['Tuned to your priorities'],
          keyHighlights: [
            `${proc.name} (${proc.brandTier})`,
            `${disp.size} ${disp.type} ${disp.refreshRate}`,
            `${ram.capacity} + ${storage.capacity}`,
            `${batt.capacity} + ${charge.wattage}`,
          ],
        };
      };

      const best = buildConfigFromIds(parsed.bestMatch || {}, 'Custom SAJASE Best Match');
      const balanced = buildConfigFromIds(parsed.balanced || {}, 'Custom SAJASE Balanced');
      const value = buildConfigFromIds(parsed.value || {}, 'Custom SAJASE Smart Value');

      return res.json({
        budgetINR: budget,
        primaryUsage: usages,
        priorities,
        recommendations: {
          bestMatch: {
            type: 'best_match',
            title: 'Best Match Configuration',
            subtitle: 'Optimized specifically around your selected usage & priority focus',
            config: best.config,
            estimatedPriceINR: best.estimatedPriceINR,
            reasoning: best.reasoning,
            keyHighlights: best.keyHighlights,
          },
          balanced: {
            type: 'balanced',
            title: 'Balanced Configuration',
            subtitle: 'Harmonious performance across gaming, battery, camera, and daily apps',
            config: balanced.config,
            estimatedPriceINR: balanced.estimatedPriceINR,
            reasoning: balanced.reasoning,
            keyHighlights: balanced.keyHighlights,
          },
          value: {
            type: 'value',
            title: 'Value Champion Configuration',
            subtitle: 'Protects key essentials while maximizing budget savings',
            config: value.config,
            estimatedPriceINR: value.estimatedPriceINR,
            savingsOrDeltaINR: Math.max(0, budget - value.estimatedPriceINR),
            reasoning: value.reasoning,
            keyHighlights: value.keyHighlights,
          },
        },
        overallExplanation:
          parsed.overallExplanation ||
          `SAJASE tailored 3 configurations for ₹${budget.toLocaleString('en-IN')} with priority on ${priorities.join(', ') || 'Overall Performance'}.`,
      });
    } catch (err) {
      console.error('Gemini SAJASE Error:', err);
      const fallback = generateDeterministicSajaseRecommendations(req.body);
      return res.json(fallback);
    }
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CUSTOM PHONE server listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
});
