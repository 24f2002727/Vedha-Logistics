# Vedha Logistics — AI Maritime Freight Forecasting & Charter Optimization Platform

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **An enterprise-grade AI maritime intelligence platform designed to transition bulk cargo procurement for India's East Coast ports from volatile daily spot fixtures to high-yield short-term and medium-term multiple voyage contracts (Contracts of Affreightment - COAs).**

---

## 📌 Problem Background & Overview

Procuring bulk raw materials (coking coal, thermal coal, iron ore, limestone, and minerals) for India's East Coast industrial corridor is historically plagued by daily spot market exploration. This reactive approach leads to:
1. **Unhedged Freight Volatility**: Missing favorable entry points during cyclical rate troughs across the Baltic Dry Index (BDI, BCI, BPI, BSI).
2. **Suboptimal Vessel Utilization**: Frequent mismatches between vessel deadweight (Handysize, Supramax, Ultramax, Panamax, Kamsarmax, Capesize) and port infrastructure limits (draft, LOA, beam, handling rates).
3. **Severe Riverine & Tidal Bottlenecks**: Inadequate pre-planning for draft restrictions at ports like **Haldia** (7.5m - 8.5m draft) requiring transshipment / lighterage at **Sagar-Sandheads** or **Dhamra**.
4. **Vessel Idle Time & Deadheading**: Lack of triangulation and backhaul matching leading to high ballast voyage waste.

**Vedha Logistics** provides an end-to-end analytical decision engine that predicts freight rates up to 180 days in advance, verifies multi-port infrastructure feasibility, and models programmatic COA contracts to unlock **13.5% - 18.5% freight savings per metric ton**.

---

## 🚢 Monitored Corridors & Port Infrastructure

### 🇮🇳 East Coast India Discharge Ports
| Port Name | UN/LOCODE | Max Permissible Draft | Max LOA | Discharge Rate (TPD) | Permitted Vessels | Berthing & Lighterage Constraints |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Paradip Port** | `INPRT` | **16.0 m** | 260 m | 32,000 MT/d | Cape / Panamax / Supra | Deep draft mechanized coal terminal (MCH). Direct Panamax intake. |
| **Visakhapatnam (Vizag)** | `INVTZ` | **18.1 m** | 285 m | 35,000 MT/d | Capesize / Panamax | Outer harbour supports 200k DWT Capesize; Inner harbour restricted to 14.5m draft. |
| **Gangavaram Port** | `INGGV` | **18.5 m** | 300 m | 38,000 MT/d | Super Capesize | All-weather deepwater terminal with fastest bulk discharge turnaround. |
| **Gopalpur Port** | `INGPL` | **14.0 m** | 225 m | 18,000 MT/d | Panamax / Supramax | Geared grab discharge. Suited for Supramax and short-loaded Panamax. |
| **Dhamra Port** | `INDHR` | **18.0 m** | 300 m | 42,000 MT/d | Capesize / Baby Cape | Deep draft automated conveyor discharge; ideal alternative to Haldia/Paradip. |
| **Sagar - Sandheads** | `INSAG` | **9.0 m (River approach)** | 310 m | 16,000 MT/d | Capesize (Lightering) | Deepwater offshore anchorage for Ship-to-Ship (STS) lighterage before Haldia. |
| **Haldia Dock Complex** | `INHAL` | **8.5 m (Tidal limit)** | 230 m | 15,000 MT/d | Handysize / Supramax | Strict Hooghly river sandbar draft limits; necessitates pre-lightering or parceling. |

### 🌐 Key Global Loading Origins
- **Australia**: Hay Point / Dalrymple Bay (DBCT), Newcastle (PWCS/NCIG), Gladstone (RG Tanna), Abbot Point.
- **United States**: Norfolk / Hampton Roads (Lamberts Point & Pier IX), New Orleans (Mississippi River IMT/Convent), Baltimore (CNX Marine).
- **Indonesia**: Taboneo Anchorage (South Kalimantan), Muara Berau / Samarinda, Tanjung Bara (KPC Deepwater).
- **Mozambique**: Maputo / Matola Coal Terminal (TCM), Nacala Deepwater Port.
- **Russia**: Taman Bulk Terminal (Black Sea), Ust-Luga (Baltic Sea), Vostochny (Far East).

---

## ⚡ Key Platform Modules

### 1. 📈 Predictive Baltic Freight Forecaster & Sensitivity Matrix
- **Probabilistic Forecasting Horizon**: 12-month historical actuals + 30, 60, 90, and 180-day forward forecasts.
- **Baltic Indices Tracked**: BDI (Baltic Dry Index), BCI (Capesize), BPI (Panamax), BSI (Supramax), BHSI (Handysize).
- **Confidence Bounds**: 95% statistical boundary area with interactive hover inspection and key maritime driver callouts.
- **Dynamic Sensitivity Sliders**: Real-time modeling of Singapore VLSFO bunker prices ($450 - $750/MT) and global commodity demand multipliers.

### 2. 🧭 Vessel Selection & Port Infrastructure Solver
- Multi-variable constraint engine checking cargo volume vs draft, LOA, beam, and berth discharge rate (TPD).
- Automatic lighterage requirement detection for riverine channels (Haldia / Hooghly).
- Landed freight cost breakdown ($/MT), voyage days, fuel consumption, and CO2 emissions across Handysize, Supramax, Ultramax, Panamax, Kamsarmax, and Capesize.

### 3. 📄 Multi-Voyage COA Transition Engine (Spot → COA)
- Direct financial simulation comparing **Spot Status Quo** vs **3-Month**, **6-Month**, and **12-Month Contracts of Affreightment**.
- Projected net dollar savings ($140k – $2.4M+) with annual volume sensitivity sliders.
- **BIMCO Structured Clauses**:
  - Bunker Escalation / De-escalation formula with Singapore trigger collars.
  - Guaranteed Demurrage sharing cap ($18,500/day).
  - Sandheads STS lighterage rate indexation ($4.20/MT).

### 4. 🗺️ Interactive Global Maritime Route & Choke Point Map
- Vector geodesic trade route rendering with animated vessel tracks.
- Chokepoint risk monitor: Malacca Strait, Suez Canal / Red Sea, Cape of Good Hope, Torres Strait, and Hooghly River.
- Click-to-inspect port terminals and backhaul triangulation recommendations (e.g. Paradip to China Iron Ore or Coastal Coal).

### 5. 🚨 Port Congestion Radar & Constraints Directory
- Live waiting queue days, turnaround benchmarks, and weather/monsoon swell warnings for all 7 East Coast Indian ports.
- Searchable 18-port nautical directory filterable by region, draft, and vessel intake class.

---

## 💻 Tech Stack & Architecture

- **Frontend Core**: React 19, TypeScript, HTML5
- **Styling**: Tailwind CSS v4, Custom Maritime CSS Design System, Glassmorphic overlays
- **Icons**: Lucide React
- **Build Tool**: Vite 6 (Fast HMR & Optimized Production Bundler)
- **Design Inspiration**: Veson Nautical (`veson.com`) & Kepler Logistics (Clean, high-contrast, transparent navbar, soft ocean blue connectivity route background, signal orange accents).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/24f2002727/Vedha-Logistics.git
cd Vedha-Logistics

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in your browser
# Server starts at http://localhost:3000
```

### Production Build

```bash
# Compile TypeScript and generate production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Repository Structure

```
Vedha-Logistics/
├── index.html                   # HTML5 entry with Outfit & Inter typography
├── package.json                 # Dependencies & scripts
├── vite.config.ts               # Vite configuration with @tailwindcss/vite plugin
├── tsconfig.json                # TypeScript compiler configuration
├── src/
│   ├── main.tsx                 # React application root
│   ├── App.tsx                  # Main layout, tab controller & state management
│   ├── index.css                # Global styles, variables & design tokens
│   ├── types/
│   │   └── maritime.ts          # Core TypeScript interfaces (Ports, Vessels, Routes, COAs)
│   ├── data/
│   │   ├── portsData.ts         # Verified port infrastructure constraints (7 Indian + 11 Global)
│   │   ├── vesselData.ts        # Fleet technical specifications & charter benchmarks
│   │   ├── freightRatesData.ts  # Historical & forecasted Baltic indices & market timing signals
│   │   └── tradeRoutesData.ts   # Distance (NM), chokepoints, transit days & route benchmarks
│   ├── utils/
│   │   ├── vesselOptimizer.ts   # Draft constraint solver & vessel intake optimizer
│   │   └── contractSimulator.ts # Spot vs COA multi-voyage financial modeling engine
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx                # Transparent navbar with refined typography
│       │   ├── MarketTicker.tsx          # Live Baltic & Bunker stream
│       │   ├── HeroBanner.tsx            # Hero with floating input & route launcher
│       │   ├── MaritimeMapBackground.tsx # SVG global maritime route connectivity background
│       │   └── Footer.tsx                # Enterprise footer
│       ├── forecasting/
│       │   ├── FreightForecastDashboard.tsx # SVG time-series chart with confidence bounds
│       │   └── MarketTimingAdvisor.tsx      # Algorithmic buy/hold timing signals
│       ├── optimization/
│       │   ├── VesselOptimizerTool.tsx      # Multi-constraint vessel selection solver
│       │   └── PortConstraintsViewer.tsx    # 18-port searchable directory & constraints table
│       ├── contracts/
│       │   └── COAContractPlanner.tsx       # Spot vs COA comparison & BIMCO terms builder
│       ├── map/
│       │   └── InteractiveMaritimeMap.tsx   # SVG global trade route map with chokepoints
│       ├── alerts/
│       │   └── PortCongestionMonitor.tsx    # East Coast India port queue monitor & warnings
│       └── modals/
│           ├── RequestDemoModal.tsx         # Enterprise demo booking modal
│           └── ExportReportModal.tsx        # Printable executive chartering intelligence brief
└── README.md
```

---

## 📜 License
This project is licensed under the MIT License.
