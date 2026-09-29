# THOR Mobile Brand — Custom Smartphone Architecture & BOM Configurator

<p align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" width="48" height="48" alt="React" />
  &nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg" width="48" height="48" alt="TypeScript" />
  &nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" width="48" height="48" alt="Tailwind" />
  &nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Vite-Dark.svg" width="48" height="48" alt="Vite" />
</p>

<p align="center">
  <strong>Build the phone you actually want.</strong><br />
  THOR is a full-stack custom smartphone engineering and manufacturing feasibility platform. It pairs an interactive 3D device visualizer with an automated Bill of Materials (BOM) cost estimator, hardware compatibility validation engine, and formal OEM/ODM quotation pipeline.
</p>

---

## ⚡ Highlights & Key Features

### 1. Interactive 3D Device Visualizer
- **Dual Perspective**: Toggle instantly between the bezel-less front display and the rear chassis.
- **Realistic Material Shaders**: Visual simulation of Frosted Matte AG Glass, Nano-Zirconia Ceramic, Aerospace Titanium/Aluminum, and Cyber Carbon Fiber.
- **THOR Orbital Lightning Emblem**: Precision laser-etched brand emblem featuring brushed metallic typography, neon electric blue lighting, and customizable rear branding.
- **Dynamic Camera Modules**: Live rendering of Cyber Matrix, Circular Horizon, Linear Duo/Trio, and Hexa Shield camera islands.
- **Interactive Gaming HUD & Wallpaper Mode**: Switch between high-resolution wallpaper aesthetics and a live gaming telemetry dashboard.

### 2. Comprehensive 11-Step Hardware Configurator
1. **Display**: Curved/Flat LTPO 1–144Hz AMOLED panels with HDR10+ and Gorilla Glass Victus 2 / Ceramic Shield.
2. **SoC & Processor**: Flagship Dimensity & Snapdragon silicon architectures with node fabrication metrics.
3. **RAM**: High-bandwidth LPDDR5 / LPDDR5X modules up to 16GB.
4. **Storage**: High-speed UFS 3.1 & UFS 4.0 flash storage up to 1TB.
5. **Camera Array**: Sony LYT/IMX primary sensors, periscope optical zoom, ultra-wide lenses, and OIS stabilization.
6. **Battery Cell**: High-density Silicon-Carbon and Li-Po batteries from 4,500mAh to 6,500mAh.
7. **Fast Charging**: 67W to 120W GaN SuperCharge options with Qi wireless charging coils.
8. **Thermal Cooling**: Multi-layer 3D Vapor Chambers, graphite dissipation sheets, and active cryogenic heat pipes.
9. **Audio & Haptics**: Dual symmetrical Dolby Atmos speakers and bionic X-axis linear haptic actuators.
10. **Chassis & Custom Engraving**: Aerospace alloy framing, bespoke color swatches, customizable rear emblem, and micron laser etching.
11. **Review & BOM Quotation**: Complete component-by-component Bill of Materials analysis.

### 3. Engineering & Manufacturing Engine
- **Live BOM Pricing**: Instant subtotal calculation in Indian Rupees (₹ INR) with real-time USD conversion.
- **Automated Compatibility Verification**: Flags thermal bottlenecks, power supply constraints, and form-factor thickness limits.
- **SAJASE Smart Assistant**: Recommends balanced component pairings tailored to specific budgets and usage priorities (Gaming, Photography, Battery Life, Productivity).
- **Formal RFQ Generation**: Exportable quote proposals with volume tiered pricing (1–99 units prototyping to 10,000+ mass production).

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 (SPA) with TypeScript
- **Styling**: Tailwind CSS
- **Animations & 3D Transitions**: Motion (`motion/react`)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend / Dev Proxy**: Express & Node.js (`server.ts`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/thor-custom-phone.git
   cd thor-custom-phone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Run linter & TypeScript type check**:
   ```bash
   npm run lint
   ```

---

## 📁 Project Structure

```text
├── index.html                   # HTML entry point with metadata
├── package.json                 # Project dependencies & build scripts
├── server.ts                    # Full-stack Express server with Vite middleware
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── src/
│   ├── App.tsx                  # Root application router & view manager
│   ├── index.css                # Global stylesheet & Tailwind directives
│   ├── main.tsx                 # Client entry point
│   ├── components/
│   │   ├── builder/             # 11-step configuration components & sidebar
│   │   ├── common/              # Header, Footer, and vector ThorLogo components
│   │   ├── preview/             # 3D interactive phone canvas & camera modules
│   │   └── quotation/           # Manufacturing RFQ and quotation modal
│   ├── context/                 # State management (PhoneBuilder & UserAccount)
│   ├── data/                    # Component catalog, presets, and color palettes
│   ├── types/                   # TypeScript interfaces & domain types
│   └── utils/                   # BOM pricing engine & compatibility checks
└── README.md                    # Project documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
