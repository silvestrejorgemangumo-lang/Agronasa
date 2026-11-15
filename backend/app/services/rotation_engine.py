from itertools import permutations

def recommend(crops, soil_type, previous_crops, priority, climate):
    """Transparent rule-based ranking; not a yield forecast or agronomic prescription."""
    by_name = {c["name"]: c for c in crops}
    previous = [by_name[n] for n in previous_crops if n in by_name]
    previous_families = {c["family"] for c in previous[-1:]}
    options=[]
    for a,b in permutations(crops,2):
        if a["name"] == b["name"] or a["family"] == b["family"]: continue
        if previous and a["family"] == previous[-1]["family"]: continue
        if b["family"] == a["family"]: continue
        water = (6-a["water_need"] + 6-b["water_need"])/2 * 20
        soil = (15 if a["fixes_nitrogen"] else 0) + (15 if b["fixes_nitrogen"] else 0)
        soil += 10 if soil_type in a["preferred_soils"] else 0
        drought = (a["drought_tolerance"] + b["drought_tolerance"])/10 * 20
        rain = climate.get("precipitation_mm_day") if climate else None
        if rain is not None and rain < 2: drought += 8
        if priority == "poupar_agua": score = water*.55 + drought*.35 + soil*.10
        elif priority == "recuperar_solo": score = soil*.55 + drought*.20 + water*.25
        else: score = (6-a["water_need"])*8 + (20 if b["fixes_nitrogen"] else 0) + (12 if soil_type in b["preferred_soils"] else 0) + 15
        score = max(0,min(100,round(score,1)))
        options.append({"sequence":[a["name"],b["name"]],"score":score,
          "scores":{"water_saving":round(water,1),"soil_health":round(soil,1),"climate_resilience":round(drought,1)},
          "explanation":[f"Alterna famílias botânicas ({a['family']} → {b['family']}).",
             "Inclui leguminosa fixadora de azoto." if a["fixes_nitrogen"] or b["fixes_nitrogen"] else "Não inclui leguminosa fixadora de azoto.",
             f"Considera a prioridade: {priority.replace('_',' ')}."]})
    options.sort(key=lambda x:x["score"],reverse=True)
    return options[:3]
