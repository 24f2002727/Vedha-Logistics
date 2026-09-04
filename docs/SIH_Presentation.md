# 🏆 Smart India Hackathon 2026 — Official Presentation Deck

## Project: **Vedha Logistics**
### *AI-Powered Maritime Freight Forecasting, Vessel Selection & Multi-Voyage Charter Optimizer*

---

## 📑 Slide-by-Slide Presentation Structure

---

### **Slide 1: Title Slide (Official SIH Format)**
- **Hackathon**: Smart India Hackathon 2026 (SIH-2026)
- **Ministry / Organization**: Ministry of Ports, Shipping and Waterways
- **Theme**: Smart Logistics / Marine Technology / Supply Chain
- **Project Title**: **VEDHA LOGISTICS**
- **Sub-Title**: *AI-Driven Decision Engine for Optimal Market Entry Timing, Vessel Type Optimization, and Idle Scenario Management across India's East Coast Ports*
- **Team Details**: Team Leader & Members

---

### **Slide 2: Problem Background & Real-World Challenges**
- **1. Unhedged Freight Rate Volatility**:
  - Spot charter rates across Baltic Capesize (BCI) and Panamax (BPI) indices swing by **$20\% - 45\%$** within weeks, causing industrial procurement budgets to overflow.
- **2. Physical Draft Bottlenecks on India's East Coast**:
  - Berth depths vary from **8.5m tidal river draft at Haldia** to **18.5m deepwater at Gangavaram**.
  - Suboptimal vessel nominations cause grounding risks, mandatory high-cost lighterage, or demurrage.
- **3. High Port Demurrage & Wastage ("Rush & Wait")**:
  - Bulk vessels steam at top speed only to idle at anchorages for 3–5 days, paying **$18,000–$28,000/day in demurrage** and generating excess Scope 1 greenhouse emissions.
- **4. Empty Ballast Deadheading Loss**:
  - Bulk carriers return empty on return legs without backhaul cargo triangulation, wasting up to $45\%$ of total voyage economics.

---

### **Slide 3: Proposed Solution — The Vedha Logistics Platform**
- **1. Optimal Market Entry Timing & Rate Forecaster**:
  - 180-Day probabilistic Baltic forward curves with confidence intervals and plain-English buy/hold signals (*"LOCK 6-MONTH COA NOW"*, *"WAIT / SPOT BUFFER"*).
- **2. Vessel Selection & Port Draft Solver**:
  - Multi-constraint solver with **Interactive Under-Keel Clearance (UKC) Water-Column Visualizer** and automated Sandheads STS lighterage tariffs.
- **3. Mixed-Integer Linear Programming (MILP) Portfolio Solver**:
  - Mathematical volume allocation across Spot, Multi-Voyage COA (3–6M), and Period Time Charter (6–12M) with **VaR95 tail-risk reduction**.
- **4. Virtual Arrival & Just-In-Time Green Steaming**:
  - Non-linear cubic hydrodynamics reducing bunker fuel burn, avoiding demurrage, and upgrading **IMO Carbon Intensity Indicator (CII)** ratings.
- **5. Port Congestion Radar & Macro Shock Simulator**:
  - Live queue benchmarks with one-click stress testing for China steel surges, monsoons, and bunker spikes.

---

### **Slide 4: Technical Architecture & System Flow**

```mermaid
graph TD
    subgraph Data Layer
        A1[Historical Baltic Indices CSV]
        A2[18 Port Infrastructure Matrix JSON]
        A3[Fleet Technical Database]
        A4[Live AIS Congestion Feeds]
    end

    subgraph Mathematical & ML Core
        B1[SARIMAX Rate Forecaster]
        B2[MILP Portfolio Allocation Solver]
        B3[Cubic Virtual Arrival Hydrodynamics]
        B4[Under-Keel Clearance UKC Engine]
    end

    subgraph User Experience Layer
        C1[Authentic World Map Landing Page]
        C2[Quick Route Feasibility Matcher]
        C3[Interactive Water Column Hull Visualizer]
        C4[Landed Cost Waterfall & Laycan Schedule]
        C5[Dual Currency: USD $ & INR ₹ Lakh/Cr]
    end

    Data Layer --> Mathematical & ML Core
    Mathematical & ML Core --> User Experience Layer
```

---

### **Slide 5: Mathematical Formulations & Physics Engine**

#### 1. Virtual Arrival Cubic Propeller Steaming Law:
$$\text{Sea Fuel Burn (MT/day)} = \text{Design Sea Fuel} \times \left(\frac{V_{\text{opt}}}{V_{\text{design}}}\right)^3$$
$$\text{Sea Days Delta} = \frac{\text{Distance}}{24 \times V_{\text{opt}}} - \frac{\text{Distance}}{24 \times V_{\text{orig}}}$$
$$\text{Remaining Anchorage Wait} = \max\left(0, \text{Known Queue Delay} - \text{Sea Days Delta}\right)$$
$$\text{Net Financial Savings (\$)} = (\Delta\text{Fuel MT} \times \text{VLSFO Price}) + (\Delta\text{Anchor Days} \times \text{Demurrage Rate})$$

#### 2. MILP Portfolio Allocation Formulation:
$$\min_{\mathbf{x}} \sum_{i=1}^{N} \left( \text{Volume}_i \times \text{Rate}_i + \text{PortDues}_i + \text{Lighterage}_i + \text{Demurrage}_i \right)$$
$$\text{Subject to: } \sum_{i} \text{Volume}_i = \text{Total Program Demand}, \quad \text{Draft}_v \le \text{Port Permissible Draft}$$

#### 3. Under-Keel Clearance (UKC) & Lighterage Tariff:
$$\text{Draft Margin} = \text{Port Permissible Draft} - \text{Vessel Loaded Draft}$$
$$\text{If Riverine / Draft Margin} < 0 \implies \text{Lightering Volume} = \text{Cargo MT} \times \min\left(0.65, \frac{\text{Excess Draft}}{\text{Vessel Draft}}\right)$$
$$\text{STS Lighterage Cost} = \text{Lightering Volume} \times \$4.20/\text{MT (Sagar-Sandheads)}$$

---

### **Slide 6: India East Coast Port Network & Feasibility Matrix**

| Port Name | UN/LOCODE | Permissible Draft | Max LOA | Handling Rate | Feasibility Status & Lightering Strategy |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Paradip Port** | `INPRT` | **16.0 m** | 260 m | 32,000 MT/d | **PASSED** (Direct gearless Panamax/Kamsarmax intake) |
| **Vizag Outer Port** | `INVTZ` | **18.1 m** | 285 m | 35,000 MT/d | **PASSED** (Direct discharge for 200,000 DWT Capesize) |
| **Gangavaram Port** | `INGGV` | **18.5 m** | 300 m | 38,000 MT/d | **PASSED** (All-weather deepwater terminal; fastest turnaround) |
| **Gopalpur Port** | `INGPL` | **14.0 m** | 225 m | 18,000 MT/d | **RESTRICTED** (Suited for Geared Supramax / Ultramax) |
| **Dhamra Port** | `INDHR` | **18.0 m** | 300 m | 42,000 MT/d | **PASSED** (Deepwater automated conveyor terminal) |
| **Sagar - Sandheads** | `INSAG` | **9.0 m (River)** | 310 m | 16,000 MT/d | **RESTRICTED** (STS lighterage anchorage for Haldia bound vessels) |
| **Haldia Dock Complex** | `INHAL` | **8.5 m (Tidal)** | 230 m | 15,000 MT/d | **RESTRICTED** (Mandatory STS lightering of ~84k MT at Sandheads) |

---

### **Slide 7: Economic Viability, ROI & Sustainability Impact**

- **💰 Landed Freight Savings**:
  - Pure Spot Status Quo: **$18.50 / MT**
  - Recommended MILP Hybrid: **$16.06 / MT**
  - **Net Annual Savings**: **$1,464,186 (~₹12.67 Crore)** per 600,000 MT procurement program (**$13.2\%$ reduction**).
- **🛡️ Value-at-Risk (VaR95) Reduction**:
  - Spot Tail-Risk Exposure: **$2,886,000**
  - MILP Hedged Exposure: **$952,000** (**$-67\%$ Risk Reduction**).
- **🌿 Virtual Arrival Eco-Steaming Impact**:
  - Bunker Fuel Saved: **269.7 MT VLSFO ($166,675)** per voyage.
  - Demurrage Avoided: **$112,000** per voyage.
  - Scope 1 GHG Abatement: **839.9 MT $\text{CO}_2\text{e}$**.
  - IMO CII Rating Upgrade: **Grade D $\rightarrow$ Grade A (+38% improvement)**.
- **🔄 Backhaul Triangulation**:
  - Paradip/Dhamra to Qingdao (Iron Ore): **+$9.5\text{d}$ ballast cut**.
  - Vizag to Tuticorin (Coastal Coal): **+$4.80/\text{t}$ freight revenue**.

---

### **Slide 8: Technology Stack & Future Roadmap**

- **Modern Tech Stack**:
  - Frontend: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
  - Build System: Vite 6 (Fast HMR & Production Bundler).
  - Mathematical Solvers: In-browser MILP & Hydrodynamic Physics Engines.
  - Verification: Automated test suite ([src/test-suite.ts](file:///Users/shivamkumar/Desktop/projects/Vedha-Logistics/src/test-suite.ts)).
  - Dual Currency: Instant switching between **USD ($)** and **INR (₹ Lakh / ₹ Cr)**.
- **Future Roadmap**:
  - Satellite AIS real-time vessel tracking.
  - Smart Blockchain-enabled BIMCO digital contracts.
  - West Coast port expansion (JNPT, Kandla, Mundra, Cochin).
  - Enterprise ERP Connectors (SAP / Oracle SCM integration).

---

## 🎯 Verification Command

To regenerate or verify the presentation:
```bash
# Generate PPTX presentation file
python3 scripts/generate_sih_pptx.py

# Run test suite
npx tsx src/test-suite.ts
```
