import type { SymptomMechanismMap, MedicalImage } from '../types';

/**
 * Offline symptom→mechanism maps, served when no AI provider is configured or the provider fails.
 * Curated maps exist for high-yield topics. Every other topic gets a clearly labelled generic
 * template, so offline mode never presents invented, topic-specific "facts".
 */

interface SymptomSeed {
  name: string;
  definition: string;
  acuteChronic: string;
  commonness: string;
  severity: string;
  redFlag: string;
  system: string;
  mechanism: string;
  site: string;
  histo: string;
  biochem: string;
  genetic: string;
  investigations: string;
  differentials: string;
  dangerous: string;
  common: string;
  treatment: string;
  pearl: string;
}

const WIKIMEDIA_MI_IMAGE: MedicalImage = {
  originalSourcePage: 'https://commons.wikimedia.org/wiki/File:Infarct_of_the_posterior_wall_of_the_left_ventricle.jpg',
  imageTitle: 'Posterior wall myocardial infarction (gross pathology)',
  imageCategory: 'gross pathology specimen',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Infarct_of_the_posterior_wall_of_the_left_ventricle.jpg',
  sourceName: 'Wikimedia Commons',
  authorInstitution: 'Patho (Wikimedia Commons contributor)',
  license: 'CC BY-SA 3.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.en',
  attributionText: 'By Patho, CC BY-SA 3.0, via Wikimedia Commons',
  teachingPoints: 'Yellow-tan zone of coagulative necrosis with hyperaemic border: a subacute infarct roughly 3 to 7 days old.',
  clinicalPathologyCorrelation: 'Coronary occlusion → ATP depletion → loss of membrane integrity → troponin release; the soft necrotic zone is the substrate for free-wall rupture at days 3 to 14.',
  verificationStatus: 'verified',
};

const MI_SEEDS: SymptomSeed[] = [
  {
    name: 'Retrosternal chest pain',
    definition: 'Pressure-like, crushing central chest discomfort lasting more than 20 minutes and not relieved by rest or nitrates.',
    acuteChronic: 'Acute',
    commonness: 'Present in about 80% of presentations; absent more often in older adults, women and people with diabetes',
    severity: 'Ongoing ischaemic pain signals myocardium still at risk that can be salvaged',
    redFlag: 'Yes: pain lasting over 20 minutes with diaphoresis, haemodynamic instability or new ECG changes',
    system: 'Cardiovascular',
    mechanism: 'Ischaemic myocytes switch to anaerobic glycolysis. Adenosine, lactate, H+, K+ and bradykinin activate cardiac sympathetic afferents (T1–T5), so the pain is referred over that dermatome distribution.',
    site: 'Left ventricular myocardium supplied by the occluded artery (LAD → anterior; RCA → inferior; LCx → lateral)',
    histo: '0–4 h: no light-microscopic change; 4–12 h: wavy fibres, contraction bands; 12–24 h: coagulative necrosis begins',
    biochem: 'ATP depletion → Na+/K+-ATPase failure → cytosolic Ca2+ overload → mitochondrial permeability transition',
    genetic: 'Polygenic CAD risk (9p21 locus); LDLR, APOB and PCSK9 variants in familial hypercholesterolaemia',
    investigations: '12-lead ECG within 10 min; high-sensitivity troponin at 0/1 h or 0/3 h; bedside echo for wall-motion abnormality',
    differentials: 'Aortic dissection, pulmonary embolism, pericarditis, tension pneumothorax, oesophageal rupture',
    dangerous: 'Aortic dissection: antithrombotics are contraindicated',
    common: 'Gastro-oesophageal reflux / musculoskeletal pain',
    treatment: 'Reperfusion (primary PCI within 120 min of diagnosis, else fibrinolysis), antiplatelets, nitrates if not hypotensive or RV infarct',
    pearl: 'Pain alone cannot rule MI in or out. Act on the ECG and troponin kinetics.',
  },
  {
    name: 'Dyspnoea',
    definition: 'Subjective breathlessness at rest or minimal exertion.',
    acuteChronic: 'Acute',
    commonness: 'About 40–50%; may be the only symptom (an "anginal equivalent")',
    severity: 'Implies left-ventricular dysfunction with raised filling pressures (Killip ≥ II)',
    redFlag: 'Yes: with crackles, hypoxaemia or hypotension, consider cardiogenic shock or acute mitral regurgitation',
    system: 'Cardiovascular → Respiratory',
    mechanism: 'Ischaemic LV loses contractility and compliance → ↑ LVEDP → ↑ pulmonary capillary hydrostatic pressure (> 18 mmHg) → interstitial then alveolar oedema → J-receptor stimulation and reduced compliance.',
    site: 'Left ventricle → pulmonary capillary bed and interstitium',
    histo: 'Lung: protein-poor alveolar transudate, distended capillaries; haemosiderin-laden macrophages if recurrent',
    biochem: 'BNP/NT-proBNP released from stretched myocytes; hypoxaemia with respiratory alkalosis, later lactic acidosis',
    genetic: 'Not primarily genetic; titin (TTN) truncating variants predispose to cardiomyopathy-related failure',
    investigations: 'Chest X-ray (Kerley B lines, bat-wing oedema), lung ultrasound B-lines, echo LVEF, NT-proBNP, ABG',
    differentials: 'Pulmonary embolism, pneumonia, COPD/asthma exacerbation, acute mitral regurgitation from papillary-muscle rupture',
    dangerous: 'Papillary-muscle rupture (days 2–7), which needs urgent surgery',
    common: 'Acute decompensated heart failure',
    treatment: 'Oxygen only if SpO2 < 90%; IV loop diuretic; vasodilators if BP permits; inotropes or mechanical support in shock',
    pearl: 'A new holosystolic murmur plus flash pulmonary oedema after MI points to papillary-muscle rupture until proven otherwise.',
  },
];

function genericSeeds(topic: string, symptoms: string[]): SymptomSeed[] {
  const names = symptoms.length ? symptoms.slice(0, 4) : ['Principal presenting symptom'];
  return names.map((name) => ({
    name,
    definition: `Clinical description of "${name}" as it presents in ${topic}.`,
    acuteChronic: 'Depends on the disease phase; establish onset, duration and progression',
    commonness: 'Frequency data require AI mode or a reference text',
    severity: 'Stratify by haemodynamic stability, end-organ dysfunction and trajectory',
    redFlag: 'Screen for instability, altered consciousness, hypoxaemia and rapid progression',
    system: 'Determine from the anatomy of the affected organ system',
    mechanism: 'Map the symptom through: trigger → molecular event → cellular injury or adaptation → tissue change → organ dysfunction → clinical sign.',
    site: 'Identify the tissue whose dysfunction produces this symptom',
    histo: 'Classify the process: inflammation, necrosis, fibrosis, hyperplasia/neoplasia, deposition or atrophy',
    biochem: 'Consider mediators (cytokines, prostaglandins), electrolyte or acid–base shifts and enzyme or receptor defects',
    genetic: 'Check for monogenic forms, inheritance pattern and pharmacogenomic modifiers',
    investigations: 'Bedside tests → targeted labs → imaging → tissue diagnosis; choose tests that confirm the proposed mechanism',
    differentials: 'List conditions that share the final common pathway, then separate them by mechanism',
    dangerous: "Name the can't-miss diagnosis for this symptom first",
    common: 'Name the statistically most likely cause in this demographic',
    treatment: 'Target the mechanism (disease-modifying), then the symptom (supportive)',
    pearl: 'Explaining why a symptom occurs predicts which test confirms it and which drug relieves it.',
  }));
}

function buildMap(topic: string, overview: string, seeds: SymptomSeed[], images: MedicalImage[], summary: string, isTemplate: boolean): SymptomMechanismMap {
  return {
    topic,
    diseaseOverview: isTemplate
      ? `${overview}\n\nOFFLINE TEMPLATE: no AI provider is configured, so this is a structured reasoning scaffold rather than topic-verified content. Configure GEMINI_API_KEY for full mapping.`
      : overview,
    keySymptoms: seeds.map((s) => ({
      name: s.name,
      definition: s.definition,
      acuteChronic: s.acuteChronic,
      commonness: s.commonness,
      severityImplication: s.severity,
      redFlagStatus: s.redFlag,
      relatedOrganSystem: s.system,
    })),
    masterTable: seeds.map((s) => ({
      symptomName: s.name,
      primaryMechanism: s.mechanism,
      anatomicalSite: s.site,
      histopathology: s.histo,
      biochemicalBasis: s.biochem,
      geneticMolecularBasis: s.genetic,
      keyInvestigations: s.investigations,
      differentialClues: s.differentials,
      treatmentImplication: s.treatment,
      highYieldPoint: s.pearl,
    })),
    pathophysiologicalAnalysis: seeds.map((s) => ({
      symptomName: s.name,
      primaryDiseaseMechanism: s.mechanism,
      initiatingTrigger: isTemplate ? 'Identify the etiological trigger' : 'Atherosclerotic plaque rupture or erosion → occlusive thrombus',
      cellularResponse: s.biochem,
      tissueLevelChange: s.histo,
      organLevelDysfunction: s.site,
      systemicEffect: s.severity,
      finalClinicalManifestation: s.name,
      chainOfEvents: `Cause → molecular event → cellular injury → tissue pathology → organ dysfunction → ${s.name}`,
    })),
    histopathologicalAnalysis: seeds.map((s) => ({
      symptomName: s.name,
      relevantTissue: s.site,
      microscopicChanges: s.histo,
      cellularInfiltrate: isTemplate ? 'Characterise the infiltrate (neutrophils, lymphocytes, macrophages, eosinophils)' : 'Neutrophils at 1–3 days, macrophages at 3–10 days, granulation tissue at 1–2 weeks',
      pathologicalProcess: isTemplate ? 'Classify the process' : 'Coagulative necrosis → organisation → fibrosis',
      vascularChanges: isTemplate ? 'Assess thrombosis, vasculitis, congestion or oedema' : 'Occlusive thrombus on a ruptured fibrous cap; microvascular obstruction (no-reflow)',
      specialStains: isTemplate ? 'Select stains for the suspected process' : 'TTC (gross: unstained pale infarct), Masson trichrome (scar collagen)',
      immunohistochemistry: isTemplate ? 'Select markers for the suspected process' : 'Loss of myocyte troponin/myoglobin staining in early necrosis; C4d deposition',
      mechanismOfSymptomProduction: s.mechanism,
    })),
    biochemicalAnalysis: seeds.map((s) => ({
      symptomName: s.name,
      enzymeAbnormality: isTemplate ? 'Identify enzyme defects or released enzymes' : 'Released troponin I/T and CK-MB; reduced pyruvate dehydrogenase flux',
      hormonalAbnormality: isTemplate ? 'Assess neuroendocrine activation' : 'Catecholamine surge; RAAS activation; natriuretic peptide release',
      metabolicPathwayAffected: isTemplate ? 'Identify the affected metabolic pathway' : 'Fatty-acid β-oxidation → anaerobic glycolysis',
      receptorDysfunction: isTemplate ? 'Assess receptor-level change' : 'β1-adrenergic overstimulation; P2Y12/GPIIb-IIIa platelet activation',
      ionChannelAbnormality: isTemplate ? 'Assess ion-channel involvement' : 'K-ATP channel opening; reduced resting potential → injury current (ST elevation)',
      electrolyteDisturbance: isTemplate ? 'Check Na+, K+, Ca2+, Mg2+' : 'Extracellular K+ accumulation in the ischaemic zone; arrhythmogenic hypokalaemia/hypomagnesaemia',
      acidBaseDisturbance: isTemplate ? 'Obtain a blood gas' : 'Local intracellular lactic acidosis; systemic lactic acidosis in shock',
      oxidativeStress: isTemplate ? 'Assess ROS involvement' : 'Reperfusion ROS burst (xanthine oxidase, mitochondrial complex I)',
      inflammatoryMediator: isTemplate ? 'Identify mediators' : 'DAMPs → NLRP3 inflammasome → IL-1β',
      cytokineRole: isTemplate ? 'Identify cytokines' : 'IL-1β, IL-6, TNF-α drive infarct expansion and remodelling',
      biomarkersLabCorrelation: s.investigations,
    })),
    geneticAndMolecularAnalysis: seeds.map((s) => ({
      symptomName: s.name,
      geneInvolved: s.genetic,
      mutationType: isTemplate ? 'Determine if relevant' : 'Mostly polygenic; LDLR loss-of-function in FH',
      inheritancePattern: isTemplate ? 'Determine if relevant' : 'Polygenic; FH is autosomal dominant',
      proteinAffected: isTemplate ? 'Identify the protein' : 'LDL receptor, apolipoprotein B, PCSK9',
      molecularPathway: isTemplate ? 'Identify the pathway' : 'LDL uptake and clearance; NF-κB vascular inflammation',
      genotypePhenotypeCorrelation: isTemplate ? 'Assess' : 'Homozygous FH → MI in childhood or adolescence',
      epigeneticContribution: isTemplate ? 'Assess' : 'Smoking-associated methylation (AHRR) linked with CAD risk',
      pharmacogenomicRelevance: isTemplate ? 'Check CPIC guidance' : 'CYP2C19 loss-of-function alleles reduce clopidogrel activation; prefer ticagrelor or prasugrel',
      familialRiskScreening: isTemplate ? 'Assess cascade screening' : 'Cascade lipid screening of first-degree relatives in suspected FH',
    })),
    anatomyPhysiologyCorrelation: seeds.map((s) => ({
      symptomName: s.name,
      anatomicalStructure: s.site,
      normalFunction: isTemplate ? 'Describe normal function' : 'Aerobic contraction generating stroke volume',
      howStructuralDamageCausesDysfunction: s.mechanism,
      localVsSystemic: s.severity,
      neurovascularLymphatic: isTemplate ? 'Map neurovascular supply' : 'Sympathetic afferents T1–T5 → referred pain to arm, jaw and epigastrium',
      normalPhysiologicalProcess: isTemplate ? 'Describe' : 'Myocardial O2 supply matches demand (HR × contractility × wall stress)',
      abnormalPhysiologicalChange: isTemplate ? 'Describe' : 'Supply falls to near zero distal to the occlusion',
      feedbackLoopDisruption: isTemplate ? 'Describe' : 'Falling cardiac output → baroreflex tachycardia → ↑ O2 demand (vicious cycle)',
      homeostaticFailure: isTemplate ? 'Describe' : 'Loss of forward flow and pulmonary venous congestion',
      compensatoryResponse: isTemplate ? 'Describe' : 'Sympathetic activation, RAAS, Frank–Starling recruitment',
      decompensaryMechanism: isTemplate ? 'Describe' : 'More than 40% LV loss → cardiogenic shock',
    })),
    investigationCorrelation: seeds.map((s) => ({
      symptomName: s.name,
      bedsideTests: isTemplate ? 'Vitals, focused exam, point-of-care tests' : '12-lead ECG, SpO2, POCUS',
      laboratoryTests: isTemplate ? 'Targeted labs' : 'hs-troponin (serial), CBC, U&E, lipids, HbA1c, NT-proBNP',
      imagingFindings: isTemplate ? 'Targeted imaging' : 'Echo regional wall-motion abnormality; coronary angiography shows the culprit lesion',
      histopathologyFindings: s.histo,
      geneticTests: isTemplate ? 'If indicated' : 'FH panel if LDL-C ≥ 190 mg/dL or premature CAD',
      biomarkers: isTemplate ? 'Identify biomarkers' : 'Troponin rise/fall above the 99th percentile URL',
      diagnosticCriteria: isTemplate ? 'Cite a validated criterion set' : 'Fourth Universal Definition of MI (2018)',
      expectedAbnormalResults: s.investigations,
      howTestConfirmsMechanism: isTemplate ? 'Link the test to the mechanism' : 'Troponin release proves myocyte necrosis; ST elevation reflects a transmural injury current',
    })),
    differentialDiagnosisMapping: seeds.map((s) => ({
      symptomName: s.name,
      otherDiseases: s.differentials,
      sharedMechanism: isTemplate ? 'Identify the shared final pathway' : 'Visceral afferent stimulation via shared T1–T5 segments',
      differentMechanism: isTemplate ? 'Identify the distinguishing mechanism' : 'Dissection: intimal tear; PE: RV pressure overload; pericarditis: serosal inflammation',
      differentiatingClues: isTemplate ? 'Key history, exam and test discriminators' : 'Tearing pain radiating to the back with pulse deficit → dissection; pleuritic, positional pain with diffuse ST↑ and PR↓ → pericarditis',
      mostDangerousDifferential: s.dangerous,
      mostCommonDifferential: s.common,
      commonDiagnosticTraps: isTemplate ? 'List anchoring and premature-closure risks' : 'Normal first troponin within 3 h of onset; inferior MI presenting as epigastric pain',
    })),
    therapeuticImplications: seeds.map((s) => ({
      symptomName: s.name,
      treatmentTarget: isTemplate ? 'Mechanistic target' : 'Occluded coronary artery and platelet activation',
      mechanismOfSymptomRelief: isTemplate ? 'How relief occurs' : 'Reperfusion restores aerobic metabolism and halts afferent stimulation',
      diseaseModifyingTherapy: isTemplate ? 'Disease-modifying options' : 'High-intensity statin, ACE inhibitor, β-blocker, SGLT2i/MRA if LVEF ≤ 40%',
      supportiveTherapy: isTemplate ? 'Supportive care' : 'Analgesia, oxygen if hypoxaemic, rhythm monitoring',
      advancedTherapy: isTemplate ? 'Advanced options' : 'Mechanical circulatory support (Impella/IABP) in shock; CABG for multivessel or left-main disease',
      monitoringResponse: isTemplate ? 'Monitoring' : 'ST resolution ≥ 50% at 60–90 min, troponin trend, telemetry',
      urgentTreatmentCriteria: s.redFlag,
    })),
    visualMindMapStructure: seeds.map((s) => ({
      symptomName: s.name,
      branches: {
        pathophysiology: s.mechanism.split('.')[0],
        histopathology: s.histo.split(';')[0],
        biochemistry: s.biochem.split('→')[0].trim(),
        genetics: s.genetic.split(';')[0],
        anatomy: s.site.split('(')[0].trim(),
        physiology: s.severity,
        investigations: s.investigations.split(';')[0],
        differentialDiagnosis: s.dangerous,
        treatmentImplication: s.treatment.split(',')[0],
        highYieldPoint: s.pearl,
      },
    })),
    causeToSymptomFlow: [
      isTemplate
        ? {
            etiology: 'Etiological trigger',
            molecularTrigger: 'Molecular initiating event',
            biochemicalDisturbance: 'Mediator or metabolic disturbance',
            cellularInjury: 'Cellular injury or adaptation',
            histopathologicalChange: 'Tissue-level change',
            organDysfunction: 'Organ dysfunction',
            clinicalSymptom: seeds.map((s) => s.name).join(', '),
            diagnosticFinding: 'Confirmatory finding',
            treatmentTarget: 'Mechanistic treatment target',
          }
        : {
            etiology: 'Atherosclerosis + plaque rupture',
            molecularTrigger: 'Tissue factor exposure → thrombin → fibrin; platelet GPIIb/IIIa cross-linking',
            biochemicalDisturbance: 'ATP depletion, lactic acidosis, Ca2+ overload',
            cellularInjury: 'Irreversible myocyte injury after 20–40 min of ischaemia',
            histopathologicalChange: 'Coagulative necrosis, wavefront from subendocardium to epicardium',
            organDysfunction: 'Regional LV akinesis → ↓ stroke volume, ↑ LVEDP',
            clinicalSymptom: 'Chest pain, dyspnoea, diaphoresis',
            diagnosticFinding: 'ST elevation + troponin rise/fall',
            treatmentTarget: 'Thrombus (PCI/fibrinolysis), platelets (DAPT), remodelling (ACEi/β-blocker)',
          },
    ],
    highYieldExamPoints: seeds.map((s) => ({
      symptomName: s.name,
      oneLineMechanism: s.mechanism.split('.')[0],
      mcqTrap: isTemplate ? 'Watch for a distractor that treats the symptom while ignoring the mechanism' : 'Giving nitrates in inferior MI with RV involvement → preload-dependent hypotension',
      vivaQuestion: `Why does ${s.name.toLowerCase()} occur in ${topic}?`,
      diagnosticClue: s.investigations.split(';')[0],
      redFlag: s.redFlag,
      mustKnowCorrelation: s.pearl,
      memoryHook: isTemplate ? 'Trigger → Molecule → Cell → Tissue → Organ → Sign' : 'MONA is outdated: reperfuse first, oxygen only if hypoxaemic',
    })),
    visualLearningPrompts: {
      pathophysiologyDiagram: `Layered flow diagram for ${topic}: etiology → molecular trigger → cellular injury → organ dysfunction → each symptom.`,
      histopathologySlide: `Annotated H&E panel series showing the time-course of tissue change in ${topic}.`,
      grossPathology: `Labelled gross specimen of the primary organ affected in ${topic}.`,
      biochemicalPathway: `Pathway map highlighting the enzymes and mediators disturbed in ${topic}.`,
      geneticPathway: `Gene → protein → pathway schematic for heritable forms of ${topic}.`,
      flowchart: `Diagnostic algorithm flowchart from first presentation to confirmed ${topic}.`,
      reasoningMap: `Symptom-centred reasoning map linking each finding to the test that proves its mechanism.`,
    },
    finalSummary: summary,
    sourcesAndLinks: images,
  };
}

const MI_KEYWORDS = ['myocardial', 'infarction', 'heart attack', 'stemi', 'nstemi', 'acs', 'acute coronary', 'coronary'];

export function getFallbackMap(topic: string, symptoms?: string | string[]): SymptomMechanismMap {
  const cleanTopic = (topic || 'Clinical topic').trim();
  const lower = cleanTopic.toLowerCase();

  if (MI_KEYWORDS.some((k) => lower.includes(k))) {
    return buildMap(
      cleanTopic,
      'Myocardial infarction is myocyte necrosis caused by prolonged ischaemia, usually from occlusive thrombus on a ruptured or eroded atherosclerotic plaque (Type 1). It is defined by a rise and/or fall of cardiac troponin with at least one value above the 99th-percentile upper reference limit plus clinical evidence of ischaemia (Fourth Universal Definition, 2018).',
      MI_SEEDS,
      [WIKIMEDIA_MI_IMAGE],
      'Occlusion → ATP failure → injury current (ST↑) and troponin leak → regional LV failure (dyspnoea) and sympathetic afferent pain. Time to reperfusion is the dominant modifiable determinant of infarct size and survival.',
      false,
    );
  }

  const symptomList = Array.isArray(symptoms)
    ? symptoms
    : String(symptoms || '')
        .split(/[,;\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

  return buildMap(
    cleanTopic,
    `${cleanTopic}: structured mechanism-mapping scaffold.`,
    genericSeeds(cleanTopic, symptomList),
    [],
    `Work through each symptom of ${cleanTopic} from trigger to clinical sign, then choose investigations that prove each link and therapies that break it.`,
    true,
  );
}
