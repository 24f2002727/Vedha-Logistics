#!/usr/bin/env python3
"""
Vedha Logistics — Mathematical Vessel Selection & Port Constraint Solver
========================================================================
Mixed-Integer Constraint Optimization formulation for selecting optimal vessel class
(Handysize to Capesize) accounting for port draft, LOA, beam, lighterage, and demurrage risk.
"""

import json
import os
import math

VESSEL_FLEET = [
    {
        "type": "Handysize",
        "dwt": 35000,
        "draft_m": 10.2,
        "loa_m": 180.0,
        "speed_knots": 13.0,
        "sea_fuel_tpd": 18.5,
        "port_fuel_tpd": 3.5,
        "daily_spot_usd": 13500,
        "daily_coa_usd": 11400,
        "is_geared": True
    },
    {
        "type": "Supramax",
        "dwt": 55000,
        "draft_m": 12.8,
        "loa_m": 190.0,
        "speed_knots": 13.5,
        "sea_fuel_tpd": 24.0,
        "port_fuel_tpd": 4.5,
        "daily_spot_usd": 16800,
        "daily_coa_usd": 14100,
        "is_geared": True
    },
    {
        "type": "Ultramax",
        "dwt": 63500,
        "draft_m": 13.3,
        "loa_m": 199.9,
        "speed_knots": 13.8,
        "sea_fuel_tpd": 25.5,
        "port_fuel_tpd": 4.5,
        "daily_spot_usd": 18200,
        "daily_coa_usd": 15100,
        "is_geared": True
    },
    {
        "type": "Panamax",
        "dwt": 75000,
        "draft_m": 14.2,
        "loa_m": 225.0,
        "speed_knots": 13.8,
        "sea_fuel_tpd": 28.0,
        "port_fuel_tpd": 3.5,
        "daily_spot_usd": 19800,
        "daily_coa_usd": 16200,
        "is_geared": False
    },
    {
        "type": "Kamsarmax",
        "dwt": 82000,
        "draft_m": 14.5,
        "loa_m": 229.0,
        "speed_knots": 14.0,
        "sea_fuel_tpd": 29.5,
        "port_fuel_tpd": 3.8,
        "daily_spot_usd": 21500,
        "daily_coa_usd": 17500,
        "is_geared": False
    },
    {
        "type": "Capesize",
        "dwt": 180000,
        "draft_m": 18.2,
        "loa_m": 292.0,
        "speed_knots": 14.2,
        "sea_fuel_tpd": 48.0,
        "port_fuel_tpd": 5.5,
        "daily_spot_usd": 28500,
        "daily_coa_usd": 22000,
        "is_geared": False
    }
]

def solve_optimal_vessel(
    origin_max_draft: float,
    origin_max_loa: float,
    origin_tpd: float,
    dest_max_draft: float,
    dest_max_loa: float,
    dest_tpd: float,
    dest_is_riverine: bool,
    dest_congestion_days: float,
    distance_nm: float,
    cargo_volume_mt: float,
    bunker_price_usd: float = 580.0,
    contract_type: str = "COA_6M"
):
    """Solves integer constraints and ranks feasible vessels by lowest effective landed $/MT."""
    evaluations = []

    for v in VESSEL_FLEET:
        reasons = []
        is_feasible = True
        requires_lighterage = False
        lighterage_cost_per_ton = 0.0

        # Draft Constraint
        if v["draft_m"] > origin_max_draft:
            is_feasible = False
            reasons.append(f"Origin draft violation: {v['draft_m']}m > {origin_max_draft}m")

        if v["draft_m"] > dest_max_draft:
            if dest_is_riverine:
                requires_lighterage = True
                lighterage_cost_per_ton = 4.20 # STS Transshipment rate
                reasons.append(f"Riverine draft limitation ({dest_max_draft}m). Lighterage required at Sandheads.")
            else:
                is_feasible = False
                reasons.append(f"Destination draft violation: {v['draft_m']}m > {dest_max_draft}m")

        # LOA Constraint
        if v["loa_m"] > dest_max_loa and not requires_lighterage:
            is_feasible = False
            reasons.append(f"Destination LOA violation: {v['loa_m']}m > {dest_max_loa}m")

        # Voyage Duration & Costs
        sea_days_laden = distance_nm / (v["speed_knots"] * 24)
        sea_days_ballast = distance_nm / ((v["speed_knots"] + 0.5) * 24)
        load_days = (v["dwt"] * 0.95) / origin_tpd
        discharge_days = (v["dwt"] * 0.95) / dest_tpd
        total_days = math.ceil(sea_days_laden + sea_days_ballast + load_days + discharge_days + dest_congestion_days)

        # Fuel Calculation
        sea_fuel = (sea_days_laden + sea_days_ballast) * v["sea_fuel_tpd"]
        port_fuel = (load_days + discharge_days + dest_congestion_days) * v["port_fuel_tpd"]
        total_fuel_cost = (sea_fuel + port_fuel) * bunker_price_usd

        # Charter Hire Rate (Spot vs COA)
        hire_rate = v["daily_coa_usd"] if "COA" in contract_type else v["daily_spot_usd"]
        total_charter_spend = hire_rate * total_days

        # Port Disbursement & Canal Dues
        port_dues = 180000 + (v["dwt"] * 1.45)

        total_voyage_cost = total_charter_spend + total_fuel_cost + port_dues
        actual_lifted = min(cargo_volume_mt, v["dwt"] * 0.95)
        base_freight_per_ton = total_voyage_cost / actual_lifted
        effective_freight_per_ton = base_freight_per_ton + lighterage_cost_per_ton

        # Demurrage Risk
        demurrage_prob = min(90, round(dest_congestion_days * 14 + (15 if dest_is_riverine else 0)))

        evaluations.append({
            "vessel_type": v["type"],
            "is_feasible": is_feasible or requires_lighterage,
            "requires_lighterage": requires_lighterage,
            "effective_freight_usd_mt": round(effective_freight_per_ton, 2),
            "total_voyage_spend_usd": round(total_voyage_cost),
            "total_days": total_days,
            "demurrage_risk_pct": demurrage_prob,
            "reasons": reasons
        })

    # Sort feasible vessels by lowest landed cost per metric ton
    feasible_vessels = [e for e in evaluations if e["is_feasible"]]
    feasible_vessels.sort(key=lambda x: x["effective_freight_usd_mt"])

    return {
        "all_evaluations": evaluations,
        "recommended_vessel": feasible_vessels[0] if feasible_vessels else evaluations[0]
    }

if __name__ == "__main__":
    print("==========================================================")
    print(" Running MILP Solver: Australia (Hay Point) -> Paradip Port")
    print("==========================================================")
    result = solve_optimal_vessel(
        origin_max_draft=19.0, origin_max_loa=320.0, origin_tpd=60000,
        dest_max_draft=16.0, dest_max_loa=260.0, dest_tpd=32000,
        dest_is_riverine=False, dest_congestion_days=2.4,
        distance_nm=5200, cargo_volume_mt=75000
    )
    rec = result["recommended_vessel"]
    print(f" Optimal Vessel:      {rec['vessel_type']}")
    print(f" Landed Freight:     ${rec['effective_freight_usd_mt']:.2f} / MT")
    print(f" Total Voyage Days:   {rec['total_days']} Days")
    print(f" Demurrage Risk:      {rec['demurrage_risk_pct']}%")
    print("==========================================================")
