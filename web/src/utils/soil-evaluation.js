export function evaluateSoilHealth(report, farmingMode = 'Organic Farming') {
    let score = 0;
    if (farmingMode && farmingMode.toLowerCase().includes('organic')) {
        score += 1;
    }
    // 1. pH (Max 15 pts) - Ideal: 6.0 - 7.5
    if (report.ph >= 6.2 && report.ph <= 7.3) {
        score += 15;
    }
    else if ((report.ph >= 5.8 && report.ph < 6.2) || (report.ph > 7.3 && report.ph <= 7.8)) {
        score += 12;
    }
    else if ((report.ph >= 5.2 && report.ph < 5.8) || (report.ph > 7.8 && report.ph <= 8.3)) {
        score += 7;
    }
    else if ((report.ph >= 4.5 && report.ph < 5.2) || (report.ph > 8.3 && report.ph <= 9.0)) {
        score += 3;
    }
    // 2. Electrical Conductivity EC (Max 10 pts) - Ideal: 0.5 - 1.5 mS/cm
    if (report.ec >= 0.5 && report.ec <= 1.2) {
        score += 10;
    }
    else if ((report.ec >= 0.2 && report.ec < 0.5) || (report.ec > 1.2 && report.ec <= 1.8)) {
        score += 8;
    }
    else if (report.ec > 1.8 && report.ec <= 2.5) {
        score += 4;
    }
    else if (report.ec > 2.5) {
        score += 1;
    }
    // 3. Organic Carbon (Max 15 pts) - Ideal: >= 0.8%
    if (report.organicCarbon >= 0.9) {
        score += 15;
    }
    else if (report.organicCarbon >= 0.7) {
        score += 12;
    }
    else if (report.organicCarbon >= 0.5) {
        score += 8;
    }
    else if (report.organicCarbon >= 0.3) {
        score += 4;
    }
    else {
        score += 1;
    }
    // 4. Nitrogen (Max 15 pts) - Ideal: 280 - 560 kg/ha
    if (report.nitrogen >= 280 && report.nitrogen <= 560) {
        score += 15;
    }
    else if (report.nitrogen >= 220 && report.nitrogen < 280) {
        score += 11;
    }
    else if (report.nitrogen >= 160 && report.nitrogen < 220) {
        score += 7;
    }
    else if (report.nitrogen > 560) {
        score += 10; // Excessive nitrogen
    }
    else {
        score += 3;
    }
    // 5. Phosphorus (Max 10 pts) - Ideal: 23 - 57 kg/ha
    if (report.phosphorus >= 23 && report.phosphorus <= 57) {
        score += 10;
    }
    else if (report.phosphorus >= 16 && report.phosphorus < 23) {
        score += 7;
    }
    else if (report.phosphorus >= 10 && report.phosphorus < 16) {
        score += 4;
    }
    else if (report.phosphorus > 57) {
        score += 7;
    }
    else {
        score += 2;
    }
    // 6. Potassium (Max 10 pts) - Ideal: 140 - 330 kg/ha
    if (report.potassium >= 140 && report.potassium <= 330) {
        score += 10;
    }
    else if (report.potassium >= 110 && report.potassium < 140) {
        score += 7;
    }
    else if (report.potassium >= 80 && report.potassium < 110) {
        score += 4;
    }
    else if (report.potassium > 330) {
        score += 7;
    }
    else {
        score += 2;
    }
    // 7. Sulphur (Max 5 pts) - Ideal: >= 10 ppm
    if (report.sulphur >= 12)
        score += 5;
    else if (report.sulphur >= 8)
        score += 3.5;
    else if (report.sulphur >= 5)
        score += 2;
    else
        score += 0.5;
    // 8. Zinc (Max 5 pts) - Ideal: >= 0.6 ppm
    if (report.zinc >= 0.8)
        score += 5;
    else if (report.zinc >= 0.5)
        score += 3.5;
    else
        score += 1;
    // 9. Iron (Max 5 pts) - Ideal: >= 4.5 ppm
    if (report.iron >= 5.0)
        score += 5;
    else if (report.iron >= 3.5)
        score += 3.5;
    else
        score += 1;
    // 10. Boron (Max 4 pts) - Ideal: >= 0.5 ppm
    if (report.boron >= 0.5)
        score += 4;
    else if (report.boron >= 0.3)
        score += 2.5;
    else
        score += 0.5;
    // 11. Copper (Max 3 pts) - Ideal: >= 0.2 ppm
    if (report.copper >= 0.2)
        score += 3;
    else
        score += 1;
    // 12. Manganese (Max 3 pts) - Ideal: >= 2.0 ppm
    if (report.manganese >= 2.0)
        score += 3;
    else
        score += 1;
    const finalScore = Math.min(100, Math.max(0, Math.round(score)));
    // Classification logic according to specs:
    // 90–100 -> Excellent, 75–89 -> Good, 60–74 -> Moderate, 40–59 -> Poor, Below 40 -> Critical
    let classification = 'Moderate';
    if (finalScore >= 90)
        classification = 'Excellent';
    else if (finalScore >= 75)
        classification = 'Good';
    else if (finalScore >= 60)
        classification = 'Moderate';
    else if (finalScore >= 40)
        classification = 'Poor';
    else
        classification = 'Critical';
    // Microbial Health
    let microbialHealth = 'Optimal Microbial Balance';
    if (finalScore >= 85 && report.organicCarbon >= 0.8) {
        microbialHealth = 'High Microbial Activity';
    }
    else if (finalScore >= 65 && report.organicCarbon >= 0.6) {
        microbialHealth = 'Optimal Microbial Balance';
    }
    else if (finalScore >= 45 && report.organicCarbon >= 0.4) {
        microbialHealth = 'Impaired Microbial Activity';
    }
    else {
        microbialHealth = 'Critical Microbial Depletion';
    }
    // Detect Deficiencies & Excesses
    const deficiencies = [];
    const excesses = [];
    if (report.ph < 6.0)
        deficiencies.push(`Acidic Soil pH (${report.ph})`);
    if (report.ph > 7.5)
        excesses.push(`Alkaline Soil pH (${report.ph})`);
    if (report.ec > 1.8)
        excesses.push(`High Electrical Conductivity / Salinity (${report.ec} mS/cm)`);
    if (report.organicCarbon < 0.8)
        deficiencies.push(`Organic Carbon Deficient (${report.organicCarbon}%)`);
    if (report.nitrogen < 280)
        deficiencies.push(`Low Nitrogen (${report.nitrogen} kg/ha)`);
    else if (report.nitrogen > 560)
        excesses.push(`High Nitrogen (${report.nitrogen} kg/ha)`);
    if (report.phosphorus < 23)
        deficiencies.push(`Low Available Phosphorus (${report.phosphorus} kg/ha)`);
    if (report.potassium < 140)
        deficiencies.push(`Low Available Potassium (${report.potassium} kg/ha)`);
    if (report.sulphur < 10)
        deficiencies.push(`Sulphur Deficient (${report.sulphur} ppm)`);
    if (report.zinc < 0.6)
        deficiencies.push(`Zinc Deficient (${report.zinc} ppm)`);
    if (report.iron < 4.5)
        deficiencies.push(`Iron Deficient (${report.iron} ppm)`);
    if (report.boron < 0.5)
        deficiencies.push(`Boron Deficient (${report.boron} ppm)`);
    if (report.copper < 0.2)
        deficiencies.push(`Copper Deficient (${report.copper} ppm)`);
    if (report.manganese < 2.0)
        deficiencies.push(`Manganese Deficient (${report.manganese} ppm)`);
    // Fertilizer Recommendations
    const organicFerts = [];
    const inmFerts = [];
    const convFerts = [];
    if (report.nitrogen < 280) {
        organicFerts.push('Apply Vermicompost (4 tonnes/ha) & Neem Cake (250 kg/ha)');
        inmFerts.push('Apply Neem Coated Urea (75% dose) combined with Vermicompost (2 tonnes/ha)');
        convFerts.push('Topdress Urea @ 100 kg/ha in 2 split doses');
    }
    if (report.phosphorus < 23) {
        organicFerts.push('Apply Rock Phosphate with Phosphate Solubilizing Bacteria (PSB) @ 5 kg/ha');
        inmFerts.push('Apply Single Super Phosphate (SSP) @ 150 kg/ha + PSB bio-inoculant');
        convFerts.push('Apply DAP (Di-Ammonium Phosphate) @ 120 kg/ha basal dose');
    }
    if (report.potassium < 140) {
        organicFerts.push('Apply Wood Ash & Banana Peel Compost / Potash Mobilizing Bacteria (KMB)');
        inmFerts.push('Apply Muriate of Potash (MOP) @ 50 kg/ha + Bio-potash');
        convFerts.push('Apply MOP (Muriate of Potash) @ 80 kg/ha');
    }
    if (report.ph < 6.0) {
        organicFerts.push('Incorporate Agricultural Lime (Calcium Carbonate) @ 500 kg/ha');
        inmFerts.push('Apply Dolomitic Lime to balance Magnesium & increase pH');
        convFerts.push('Apply Calcium Oxide / Lime @ recommended buffering dose');
    }
    else if (report.ph > 7.5) {
        organicFerts.push('Incorporate Pressmud compost and Elemental Sulphur @ 25 kg/ha');
        inmFerts.push('Apply Agricultural Gypsum @ 500 kg/ha with irrigation');
        convFerts.push('Apply Ammonium Sulphate fertilizer to reduce rhizosphere alkalinity');
    }
    if (report.zinc < 0.6) {
        organicFerts.push('Soil application of Zinc Solubilizing Bacteria (ZSB)');
        inmFerts.push('Foliar spray of Zinc Sulphate (0.5%) + Citric acid');
        convFerts.push('Soil apply Zinc Sulphate @ 25 kg/ha');
    }
    if (organicFerts.length === 0) {
        organicFerts.push('Soil is well-balanced. Maintain routine FYM compost @ 10 tonnes/ha per crop season.');
        inmFerts.push('Balanced soil profile. Apply maintenance split NPK application.');
        convFerts.push('Standard maintenance dose of NPK (19:19:19) foliar spray.');
    }
    // Companion Recommendations matched to soil
    const companions = [];
    if (report.nitrogen < 280)
        companions.push('Cowpea & Sunnhemp (Biomass & N-Fixation)');
    if (report.organicCarbon < 0.8)
        companions.push('Dhaincha & Velvet Bean (Organic Soil Builder)');
    if (report.ph > 7.5)
        companions.push('Mustard & Radish (Rhizosphere Exudate Acidifiers)');
    if (report.phosphorus < 23)
        companions.push('Buckwheat (Phosphorus Mobilizing Root System)');
    if (companions.length === 0)
        companions.push('Marigold & French Basil (Bio-pest Guard)');
    // Practices
    const practices = [
        'Maintain continuous soil cover with organic crop residues to preserve soil moisture.',
        'Practice zero/minimum tillage to protect native mycorrhizal fungal networks.',
        'Execute 3-tier companion intercropping to optimize root depth and nutrient scavenging.'
    ];
    return {
        score: finalScore,
        classification,
        microbialHealth,
        deficiencies,
        excesses,
        fertilizerRecommendations: {
            organic: organicFerts,
            inm: inmFerts,
            conventional: convFerts
        },
        companionRecommendations: companions,
        practices
    };
}
