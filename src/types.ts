export interface MindMap {
  id?: string;
  userId: string;
  topic: string;
  data: any;
  createdAt: string;
}

export interface Pathology {
  name: string;
  code: string;
  desc: string;
}

export interface AnatomyProfile {
  definition: string;
  functions: string[];
  biomarkers: string[];
  pathologies: Pathology[];
  tests: string[];
  trivia: string;
}

export interface PatientVitals {
  hr: number;
  bp: string;
  spo2: number;
  temp: number;
}

export interface CaseTest {
  name: string;
  result: string;
  status: 'normal' | 'abnormal';
  details: string;
}

export interface CaseOption {
  name: string;
  success: boolean;
  feedback: string;
  vitals: PatientVitals;
}

export interface PatientCase {
  id: string;
  title: string;
  summary: string;
  demographics: string;
  history: string;
  initialVitals: PatientVitals;
  correctDiagnosis: string;
  correctTreatment: string;
  tests: Record<string, CaseTest>;
  options: string[];
  treatments: CaseOption[];
  
  // Refined Educational & Simulation fields
  chiefComplaint?: string;
  examination?: string;
  differentialDiagnosis?: string[];
  pathophysiologyCorrelation?: string;
  managementApproach?: string;
  complications?: string;
  prognosis?: string;
  questions?: { question: string; options: string[]; answer: string; explanation: string }[];
  highYieldPoints?: string[];
  visualLearningPrompts?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface DrugInteraction {
  severity: 'Severe' | 'Moderate' | 'Mild' | 'None';
  mechanism: string;
  clinicalGuideline: string;
  alternatives: string;
}

export interface SymptomDifferential {
  name: string;
  probability: number;
  mechanism: string;
  emergency: boolean;
}

export interface SymptomAnalysis {
  differentials: SymptomDifferential[];
  tests: string[];
  clinicalPearl: string;
}

export interface MedicalImage {
  originalSourcePage: string;
  imageTitle: string;
  imageCategory: string;
  imageUrl: string;
  sourceName: string;
  authorInstitution: string;
  license: string;
  licenseUrl: string;
  attributionText: string;
  teachingPoints: string;
  clinicalPathologyCorrelation: string;
  verificationStatus: string;
}

export interface SymptomMechanismMap {
  topic: string;
  diseaseOverview: string;
  keySymptoms: {
    name: string;
    definition: string;
    acuteChronic: string;
    commonness: string;
    severityImplication: string;
    redFlagStatus: string;
    relatedOrganSystem: string;
  }[];
  masterTable: {
    symptomName: string;
    primaryMechanism: string;
    anatomicalSite: string;
    histopathology: string;
    biochemicalBasis: string;
    geneticMolecularBasis: string;
    keyInvestigations: string;
    differentialClues: string;
    treatmentImplication: string;
    highYieldPoint: string;
  }[];
  pathophysiologicalAnalysis: {
    symptomName: string;
    primaryDiseaseMechanism: string;
    initiatingTrigger: string;
    cellularResponse: string;
    tissueLevelChange: string;
    organLevelDysfunction: string;
    systemicEffect: string;
    finalClinicalManifestation: string;
    chainOfEvents: string;
  }[];
  histopathologicalAnalysis: {
    symptomName: string;
    relevantTissue: string;
    microscopicChanges: string;
    cellularInfiltrate: string;
    pathologicalProcess: string;
    vascularChanges: string;
    specialStains: string;
    immunohistochemistry: string;
    mechanismOfSymptomProduction: string;
  }[];
  biochemicalAnalysis: {
    symptomName: string;
    enzymeAbnormality: string;
    hormonalAbnormality: string;
    metabolicPathwayAffected: string;
    receptorDysfunction: string;
    ionChannelAbnormality: string;
    electrolyteDisturbance: string;
    acidBaseDisturbance: string;
    oxidativeStress: string;
    inflammatoryMediator: string;
    cytokineRole: string;
    biomarkersLabCorrelation: string;
  }[];
  geneticAndMolecularAnalysis: {
    symptomName: string;
    geneInvolved: string;
    mutationType: string;
    inheritancePattern: string;
    proteinAffected: string;
    molecularPathway: string;
    genotypePhenotypeCorrelation: string;
    epigeneticContribution: string;
    pharmacogenomicRelevance: string;
    familialRiskScreening: string;
  }[];
  anatomyPhysiologyCorrelation: {
    symptomName: string;
    anatomicalStructure: string;
    normalFunction: string;
    howStructuralDamageCausesDysfunction: string;
    localVsSystemic: string;
    neurovascularLymphatic: string;
    normalPhysiologicalProcess: string;
    abnormalPhysiologicalChange: string;
    feedbackLoopDisruption: string;
    homeostaticFailure: string;
    compensatoryResponse: string;
    decompensaryMechanism: string;
  }[];
  investigationCorrelation: {
    symptomName: string;
    bedsideTests: string;
    laboratoryTests: string;
    imagingFindings: string;
    histopathologyFindings: string;
    geneticTests: string;
    biomarkers: string;
    diagnosticCriteria: string;
    expectedAbnormalResults: string;
    howTestConfirmsMechanism: string;
  }[];
  differentialDiagnosisMapping: {
    symptomName: string;
    otherDiseases: string;
    sharedMechanism: string;
    differentMechanism: string;
    differentiatingClues: string;
    mostDangerousDifferential: string;
    mostCommonDifferential: string;
    commonDiagnosticTraps: string;
  }[];
  therapeuticImplications: {
    symptomName: string;
    treatmentTarget: string;
    mechanismOfSymptomRelief: string;
    diseaseModifyingTherapy: string;
    supportiveTherapy: string;
    advancedTherapy: string;
    monitoringResponse: string;
    urgentTreatmentCriteria: string;
  }[];
  visualMindMapStructure: {
    symptomName: string;
    branches: {
      pathophysiology: string;
      histopathology: string;
      biochemistry: string;
      genetics: string;
      anatomy: string;
      physiology: string;
      investigations: string;
      differentialDiagnosis: string;
      treatmentImplication: string;
      highYieldPoint: string;
    };
  }[];
  causeToSymptomFlow: {
    etiology: string;
    molecularTrigger: string;
    biochemicalDisturbance: string;
    cellularInjury: string;
    histopathologicalChange: string;
    organDysfunction: string;
    clinicalSymptom: string;
    diagnosticFinding: string;
    treatmentTarget: string;
  }[];
  caseBasedCorrelation?: {
    finding: string;
    mechanisticExplanation: string;
    supportingEvidenceHistory: string;
    supportingExamination: string;
    supportingLabImaging: string;
    differentialDiagnosis: string;
    finalInterpretation: string;
  }[];
  highYieldExamPoints: {
    symptomName: string;
    oneLineMechanism: string;
    mcqTrap: string;
    vivaQuestion: string;
    diagnosticClue: string;
    redFlag: string;
    mustKnowCorrelation: string;
    memoryHook: string;
  }[];
  visualLearningPrompts: {
    pathophysiologyDiagram: string;
    histopathologySlide: string;
    grossPathology: string;
    biochemicalPathway: string;
    geneticPathway: string;
    flowchart: string;
    reasoningMap: string;
  };
  finalSummary: string;
  sourcesAndLinks: MedicalImage[];
}

export interface SimulationLog {
  id?: string;
  timestamp: string;
  caseId: string;
  caseTitle?: string;
  demographics?: string;
  presentingSymptoms?: string;
  vitalsBefore?: string;
  diagnosticsOrdered?: string;
  suspectedDiagnosis?: string;
  interventionChosen?: string;
  vitalsAfter?: string;
  outcome?: string;
  attendingFeedback?: string;
  learningPoints?: string;
}
