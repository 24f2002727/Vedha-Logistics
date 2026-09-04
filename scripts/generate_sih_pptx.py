import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_sih_presentation(output_path="Vedha_Logistics_SIH_Presentation.pptx"):
    prs = Presentation()
    # Set 16:9 widescreen dimensions (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    DARK_NAVY = RGBColor(15, 23, 42)      # #0F172A
    CARD_BG = RGBColor(30, 41, 59)        # #1E293B
    LIGHT_BG = RGBColor(248, 250, 252)    # #F8FAFC
    ORANGE = RGBColor(249, 115, 22)       # #F97316
    SKY_BLUE = RGBColor(2, 132, 199)      # #0284C7
    EMERALD = RGBColor(16, 185, 129)      # #10B981
    WHITE = RGBColor(255, 255, 255)
    SLATE_GRAY = RGBColor(148, 163, 184)  # #94A3B8
    TEXT_DARK = RGBColor(30, 41, 59)
    BORDER_COLOR = RGBColor(51, 65, 85)

    def set_slide_background(slide, color=DARK_NAVY):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="SMART INDIA HACKATHON 2026 | SMART LOGISTICS"):
        # Top banner tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = category_text.upper()
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = ORANGE

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.65))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = WHITE

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=BORDER_COLOR):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        return card

    # =========================================================================
    # SLIDE 1: Title Slide (Official SIH Format)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, DARK_NAVY)

    # Header Badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(4.5), Inches(0.4))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(30, 41, 59)
    badge.line.color.rgb = ORANGE
    tf = badge.text_frame
    p = tf.paragraphs[0]
    p.text = "SMART INDIA HACKATHON 2026"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ORANGE
    p.alignment = PP_ALIGN.CENTER

    # Main Project Title
    title_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(2.2))
    tf = title_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "VEDHA LOGISTICS"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p2 = tf.add_paragraph()
    p2.text = "AI-Driven Maritime Freight Forecasting, Vessel Selection & Multi-Voyage Charter Optimizer"
    p2.font.size = Pt(20)
    p2.font.color.rgb = SKY_BLUE
    p2.space_before = Pt(8)

    # Problem Statement Info Card
    add_card(s1, 0.8, 4.0, 11.73, 2.7)
    ps_box = s1.shapes.add_textbox(Inches(1.0), Inches(4.15), Inches(11.3), Inches(2.4))
    tf = ps_box.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "PROBLEM STATEMENT OBJECTIVE:"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ORANGE

    p = tf.add_paragraph()
    p.text = "• Optimal Market Entry Timing: Identify ideal windows to secure short/medium-term charter contracts minimizing freight costs.\n• Vessel Type Optimization: Nominate suitable vessel class (Handysize to Capesize) accounting for East Coast India draft/LOA restrictions.\n• Idle Scenario Management & Virtual Arrival: Propose speed optimization to eliminate port queue waiting and reduce bunker burn.\n• Risk Mitigation: Early warnings for market volatility, monsoon disruptions, and macro shocks."
    p.font.size = Pt(12)
    p.font.color.rgb = WHITE
    p.space_before = Pt(6)

    # =========================================================================
    # SLIDE 2: Problem Background & Real-World Maritime Challenges
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, DARK_NAVY)
    add_header(s2, "Problem Background: The Challenges in India's Bulk Maritime Supply Chain")

    cards_s2 = [
        ("1. Extreme Freight Volatility", "Spot charter rates across Baltic Capesize (BCI) and Panamax (BPI) indices swing 20%–45% within weeks, causing severe procurement budget overruns.", ORANGE),
        ("2. Physical Draft Bottlenecks", "India's East Coast ports range from 8.5m tidal river draft at Haldia to 18.5m deepwater at Gangavaram. Poor vessel nomination causes groundings or lighterage penalties.", SKY_BLUE),
        ("3. High Port Demurrage & Waste", "Vessels 'rush and wait' at anchorage, burning bunker fuel while incurring $18,000–$28,000/day in demurrage penalties and high Scope 1 GHG emissions.", EMERALD),
        ("4. Ballast Deadheading Loss", "Bulk carriers return empty on reverse legs without backhaul cargo triangulation, wasting 35%–45% of total voyage economics.", RGBColor(239, 68, 68))
    ]

    for i, (title, desc, color) in enumerate(cards_s2):
        col = i % 2
        row = i // 2
        x = 0.8 + col * 5.95
        y = 1.6 + row * 2.65
        add_card(s2, x, y, 5.75, 2.45)
        
        tb = s2.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.2), Inches(5.35), Inches(2.05))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = SLATE_GRAY
        p2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 3: Proposed Solution — Vedha Logistics Decision Platform
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, DARK_NAVY)
    add_header(s3, "Proposed Solution: An End-to-End Maritime Decision Intelligence Engine")

    features_s3 = [
        ("📈 Optimal Market Timing", "180-Day Probabilistic Baltic Forecaster with SARIMAX/ML ensemble and plain-English buy/hold directives.", ORANGE),
        ("⚓ Marine Physics Draft Solver", "Evaluates Under-Keel Clearance (UKC), LOA, beam, and automated Sandheads STS lighterage tariffs.", SKY_BLUE),
        ("📄 MILP Contract Strategy", "Mixed-Integer Linear Programming allocating volume across Spot, 6M COA, and Period Time Charter.", EMERALD),
        ("🌿 Virtual Arrival Eco-Steaming", "Non-linear cubic speed optimization cutting bunker burn, demurrage, and upgrading IMO CII rating.", RGBColor(20, 184, 166)),
        ("🚨 Port Congestion & Macro Radar", "Live East Coast queue benchmarks with one-click geopolitical & monsoon shock stress testing.", RGBColor(245, 158, 11)),
        ("🧭 GIS Sea Routes & Triangulation", "Interactive maritime maps with backhaul pairing (e.g. Paradip to China) to eliminate deadheading.", RGBColor(168, 85, 247))
    ]

    for i, (title, desc, color) in enumerate(features_s3):
        col = i % 3
        row = i // 3
        x = 0.8 + col * 3.95
        y = 1.6 + row * 2.65
        add_card(s3, x, y, 3.8, 2.45)
        
        tb = s3.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.15), Inches(3.5), Inches(2.15))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = WHITE
        p2.space_before = Pt(6)

    # =========================================================================
    # SLIDE 4: Technical Architecture & System Flow
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, DARK_NAVY)
    add_header(s4, "Technical Architecture & System Flow")

    arch_layers = [
        ("1. Data Ingestion Layer", "• Historical Baltic Indices (BCI, BPI, BSI, BDI)\n• 18 Port Infrastructure Matrix (Draft, LOA, TPD)\n• Fleet Technical Database (Intake, Speed, Fuel)\n• AIS Queue & Weather Congestion Feeds", ORANGE),
        ("2. ML & Optimization Core", "• SARIMAX Econometric Rate Predictor\n• Mixed-Integer Linear Programming (MILP)\n• Non-linear Cubic Hydrodynamic Physics\n• Monte Carlo 95% Confidence Interval Engine", SKY_BLUE),
        ("3. Human-in-the-Loop Engine", "• Chartering Risk-Tolerance Adjustment Slider\n• Macro Disruption & Shock Stress Testing\n• Custom Laycan Window Generation\n• Dual Currency (USD $ & INR ₹ Lakh/Cr)", EMERALD),
        ("4. Interactive Enterprise UI", "• Authentic Maritime Landing Homepage\n• Cross-Sectional Under-Keel Clearance Diagram\n• Landed Cost Scenario Waterfall ($/MT)\n• Printable BIMCO Executive Term Sheets", RGBColor(168, 85, 247))
    ]

    for i, (title, desc, color) in enumerate(arch_layers):
        x = 0.8 + i * 2.95
        y = 1.6
        add_card(s4, x, y, 2.85, 5.2)
        
        tb = s4.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.2), Inches(2.55), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = WHITE
        p2.space_before = Pt(10)

    # =========================================================================
    # SLIDE 5: Mathematical Formulations & Algorithms
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, DARK_NAVY)
    add_header(s5, "Mathematical Formulations & Physics Engine")

    math_cards = [
        ("1. Virtual Arrival Cubic Propeller Law", 
         "Fuel Burn (MT/day) = Design Sea Fuel × (V_opt / V_design)³\n\n"
         "Sea Time Delta (Days) = (Dist / (24 × V_opt)) - (Dist / (24 × V_orig))\n"
         "Remaining Queue = max(0, Known Delay - Sea Time Delta)\n"
         "Net Financial ROI = (Fuel Saved × VLSFO Price) + (Demurrage Avoided)", 
         EMERALD),
        ("2. MILP Portfolio Optimization Formulation", 
         "Minimize Total Landed Spend:\n"
         "min ∑ (Vol_i × Rate_i + PortDues + Lighterage_i + Demurrage_i)\n\n"
         "Subject to:\n"
         "• ∑ Vol_i = Total Annual Demand (e.g. 600k MT)\n"
         "• Draft_v ≤ Permissible Port Chart Datum (m)\n"
         "• Value-at-Risk VaR95 ≤ Target Volatility Cap", 
         SKY_BLUE),
        ("3. Under-Keel Clearance & Lightering Surcharge", 
         "Draft Margin = Port Max Permissible Draft - Vessel Loaded Draft\n\n"
         "If Riverine Draft Margin < 0 (Haldia/Hooghly):\n"
         "• Lightering Volume = Cargo MT × min(0.65, Excess Draft / Draft)\n"
         "• Lighterage Tariff = Volume × $4.20/MT (at Sagar-Sandheads)\n"
         "• Under-Keel Clearance (UKC) Margin = max(0, Draft Margin)", 
         ORANGE)
    ]

    for i, (title, desc, color) in enumerate(math_cards):
        x = 0.8 + i * 3.95
        y = 1.6
        add_card(s5, x, y, 3.8, 5.2)
        
        tb = s5.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.2), Inches(3.5), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = WHITE
        p2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 6: India East Coast Port Network & Feasibility Validation
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, DARK_NAVY)
    add_header(s6, "India East Coast Strategic Ports & Feasibility Validation")

    add_card(s6, 0.8, 1.6, 11.73, 5.2)
    tb = s6.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.33), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "EAST COAST DISCHARGE PORTS MATRIX & PHYSICAL CONSTRAINTS SOLVER:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ORANGE

    port_rows = [
        "• Paradip Port (INPRT): 16.0m Draft | 260m LOA | 32k TPD | Direct intake for gearless Panamax/Kamsarmax without lighterage.",
        "• Vizag Port (INVTZ): 18.1m Outer Harbour Draft | 285m LOA | 35k TPD | Direct discharge for 200k DWT Capesize bulkers.",
        "• Gangavaram Port (INGGV): 18.5m Draft | 300m LOA | 38k TPD | Modern all-weather terminal with fastest turnaround in India.",
        "• Gopalpur Port (INGPL): 14.0m Draft | 225m LOA | 18k TPD | Grab discharge best suited for Geared Supramax / Ultramax.",
        "• Dhamra Port (INDHR): 18.0m Draft | 300m LOA | 42k TPD | Ultra-modern Capesize automated conveyor terminal.",
        "• Sagar - Sandheads (INSAG): 9.0m River Draft | 310m LOA | STS lightering zone for mother vessels bound for Haldia.",
        "• Haldia Dock Complex (INHAL): 8.5m Tidal Draft | 230m LOA | 15k TPD | Mandatory STS lighterage of ~84k MT at Sandheads ($4.20/MT)."
    ]

    for row in port_rows:
        p = tf.add_paragraph()
        p.text = row
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p.space_before = Pt(6)

    p_summary = tf.add_paragraph()
    p_summary.text = "\n✅ Automated 3-Tier Feasibility Status: PASSED (Direct Safe Berthing) | RESTRICTED (STS Lighterage Required) | REJECTED (Draft Deficit > 2m)"
    p_summary.font.size = Pt(11)
    p_summary.font.bold = True
    p_summary.font.color.rgb = EMERALD
    p_summary.space_before = Pt(6)

    # =========================================================================
    # SLIDE 7: Economic Impact, ROI & Sustainability
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, DARK_NAVY)
    add_header(s7, "Economic Viability, Procurement ROI & Environmental Impact")

    roi_cards = [
        ("💰 13.5% - 18.5% Freight Savings", 
         "• Pure Spot Status Quo: $18.50 / MT\n• Recommended MILP Hybrid: $16.06 / MT\n• Net Dollar Savings: $1,464,186 (~₹12.67 Crore) per 600k MT annual procurement program.", 
         EMERALD),
        ("🛡️ 67% Value-at-Risk (VaR95) Cut", 
         "• Spot Tail-Risk Exposure: $2,886,000\n• MILP Hedged Exposure: $952,000\n• Drastically shields procurement budget from seasonal Q4 Baltic index spikes.", 
         SKY_BLUE),
        ("🌿 Virtual Arrival Eco-Steaming", 
         "• Bunker Saved: 269.7 MT VLSFO ($166,675)\n• Demurrage Avoided: $112,000\n• Scope 1 CO2e Abatement: 839.9 MT per voyage\n• IMO CII Upgrade: Grade D ➔ Grade A (+38%)", 
         RGBColor(20, 184, 166)),
        ("🔄 Backhaul Triangulation", 
         "• Paradip/Dhamra to Qingdao (Iron Ore): +$9.5d ballast cut\n• Vizag to Tuticorin (Coastal Coal): +$4.80/t revenue\n• Haldia to Singapore (Steel): Eliminates deadhead loss.", 
         ORANGE)
    ]

    for i, (title, desc, color) in enumerate(roi_cards):
        col = i % 2
        row = i // 2
        x = 0.8 + col * 5.95
        y = 1.6 + row * 2.65
        add_card(s7, x, y, 5.75, 2.45)
        
        tb = s7.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.15), Inches(5.35), Inches(2.15))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = WHITE
        p2.space_before = Pt(6)

    # =========================================================================
    # SLIDE 8: Technology Stack & Future Roadmap
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, DARK_NAVY)
    add_header(s8, "Technology Stack, Scalability & Future Roadmap")

    add_card(s8, 0.8, 1.6, 5.75, 5.2)
    tb_tech = s8.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.35), Inches(4.8))
    tf_tech = tb_tech.text_frame
    tf_tech.word_wrap = True
    p = tf_tech.paragraphs[0]
    p.text = "ROBUST TECHNOLOGY STACK:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ORANGE

    p = tf_tech.add_paragraph()
    p.text = "• Frontend: React 19, TypeScript, Tailwind CSS v4, Lucide Icons\n• Build System: Vite 6 (Sub-second HMR & Production Bundler)\n• Mathematical Solvers: In-browser MILP & Hydrodynamic Physics Engines\n• Currency Engine: Dynamic USD ($) & INR (₹ Lakh/Cr) conversion\n• Verification: Automated Unit & Physics Test Suite (src/test-suite.ts)\n• UI Design: Veson Nautical inspired high-contrast maritime design system"
    p.font.size = Pt(11)
    p.font.color.rgb = WHITE
    p.space_before = Pt(8)

    add_card(s8, 6.75, 1.6, 5.78, 5.2)
    tb_road = s8.shapes.add_textbox(Inches(6.95), Inches(1.8), Inches(5.38), Inches(4.8))
    tf_road = tb_road.text_frame
    tf_road.word_wrap = True
    p = tf_road.paragraphs[0]
    p.text = "FUTURE SCALABILITY & ROADMAP:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = SKY_BLUE

    p = tf_road.add_paragraph()
    p.text = "• Real-Time Satellite AIS Integration: Live vessel GPS tracking and speed verification.\n• Automated Smart Contracts: Blockchain-enabled BIMCO digital term sheets with automated demurrage settlement.\n• West Coast Port Expansion: Expanding matrix to JNPT, Kandla, Mundra, and Cochin.\n• Weather Routing APIs: Dynamic cyclone avoidance and sea-swell ETA adjustment.\n• Enterprise ERP Connectors: SAP / Oracle SCM integration for automated chartering PO triggers."
    p.font.size = Pt(11)
    p.font.color.rgb = WHITE
    p.space_before = Pt(8)

    prs.save(output_path)
    print(f"✅ Successfully generated SIH presentation: {output_path}")

if __name__ == "__main__":
    create_sih_presentation()
