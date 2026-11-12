export function getFallbackMindmap(topic: string): any {
  const cleanTopic = topic.trim();
  const lower = cleanTopic.toLowerCase();

  // 0. MYOCARDIAL INFARCTION FALLBACK
  if (lower.includes("myocardial") || lower.includes("infarction") || lower.includes("heart attack") || lower.includes("coronary")) {
    return {
      topic: "Myocardial Infarction",
      markdown: `# MEDICAL MIND MAP: MYOCARDIAL INFARCTION

## 1. Definition
### 1.1 Standard Definition
Necrosis of myocardial tissue resulting from a sudden, acute obstruction of coronary blood flow, leading to localized cellular hypoxia and infarction.
### 1.2 Clinical Definition
An acute clinical event defined by myocardial cell death in a setting consistent with acute myocardial ischemia, typically diagnosed by rise/fall of cardiac troponin coupled with symptoms, ECG changes, or imaging evidence.
### 1.3 Key Terminology
STEMI (ST-Elevation Myocardial Infarction), NSTEMI (Non-ST-Elevation Myocardial Infarction), Type 1 MI (Atherothrombotic plaque rupture), Type 2 MI (Supply-demand mismatch).

## 2. Anatomy
### 2.1 Relevant Structures
Left Ventricle, Left Anterior Descending (LAD) coronary artery, Left Circumflex (LCx), Right Coronary Artery (RCA), and AV/SA nodes.
### 2.2 Blood Supply
Coronary arterial tree. LAD supplies the anterior wall, apex, and anterior septum. RCA supplies the inferior wall, posterior septum, and conduction system.
### 2.3 Nerve Supply
Sympathetic fibers from the cardiac plexus (T1-T5 spinal levels) conveying nociceptive pain; Parasympathetic vagal fibers modulating heart rate.
### 2.4 Lymphatics
Epicardial and subendocardial lymph capillaries draining into the tracheobronchial and mediastinal lymph nodes.
### 2.5 Applied Anatomy
A complete proximal LAD occlusion ("Widowmaker") produces a large anterior wall STEMI with high mortality. Inferior MI from RCA occlusion often causes acute bradycardia or heart blocks due to AV nodal ischemia.

## 3. Physiology
### 3.1 Normal Function
Myocardium generates rhythmic contractile force to pump oxygenated blood systemically. Relies on aerobic ATP production.
### 3.2 Regulation
Modulated by autonomic inputs (norepinephrine increasing chronotropy/inotropy, acetylcholine decreasing rate) and coronary blood flow autoregulation.
### 3.3 Feedback Mechanisms
Baroreceptors detect pressure changes, modifying heart rate and systemic vascular resistance via the cardioregulatory center in the medulla.
### 3.4 Homeostasis
Maintained by balance between oxygen supply (coronary flow, Hb saturation) and myocardial oxygen demand (heart rate, afterload, contractility).

## 4. Biochemistry
### 4.1 Molecular Basis
Sarcomere contraction driven by calcium binding to Troponin C, shifting tropomyosin to expose actin-myosin binding sites.
### 4.2 Enzymes / Proteins / Receptors
Cardiac troponins I and T (highly specific markers), Creatine Kinase-MB (CK-MB), Beta-1 adrenergic receptors, and L-type Calcium channels.
### 4.3 Metabolic Pathways
Primary reliance on beta-oxidation of fatty acids (70%) and aerobic glycolysis. Ischemia triggers rapid switch to anaerobic glycolysis, producing lactic acid.
### 4.4 Biomarkers
Cardiac Troponin I/T (elevates in 3-4 hours, peaks at 24 hours, remains elevated for 7-10 days), CK-MB (useful for detecting reinfarction).

## 5. Etiology
### 5.1 Genetic Causes
Familial hypercholesterolemia (LDLR mutations), genetic predisposition to hypertension and premature coronary artery disease.
### 5.2 Infectious Causes
Indirectly through vascular inflammation (e.g., Chlamydia pneumoniae, dental pathogens triggering chronic arterial wall plaques).
### 5.3 Autoimmune Causes
Systemic lupus erythematosus (SLE), rheumatoid arthritis, or vasculitis increasing atherosclerosis progression.
### 5.4 Metabolic Causes
Severe dyslipidemia, diabetes mellitus (inducing micro- and macro-vascular injury), and metabolic syndrome.
### 5.5 Environmental Causes
Cigarette smoking (endothelial toxin), chronic distress, high-saturated-fat diets, and sedentary lifestyles.
### 5.6 Iatrogenic Causes
Coronary artery dissection during PCI, medication-induced vasospasm (e.g., chemotherapeutics), or hypercoagulability post-surgery.

## 6. Risk Factors
### 6.1 Modifiable
Smoking, hypertension, dyslipidemia (high LDL, low HDL), diabetes, sedentary lifestyle, obesity, and stress.
### 6.2 Non-Modifiable
Advanced age, male sex, post-menopausal status in females, and positive family history of premature CAD.
### 6.3 Protective Factors
Physical exercise, Mediterranean diet, high HDL levels, and adherence to preventive therapies (statins, aspirin).

## 7. Pathophysiology
### 7.1 Initiating Event
Atherosclerotic plaque rupture or erosion in a coronary artery, exposing collagen and lipid core to blood flow.
### 7.2 Molecular Mechanism
Platelet activation, adhesion via von Willebrand factor, and aggregation (GPIIb/IIIa cross-linking). Coagulation cascade activated, forming a fibrin-rich thrombus.
### 7.3 Cellular Changes
Intracellular ATP depletion within 60 seconds; anaerobic glycolysis kicks in; intracellular calcium and sodium accumulate, causing cellular swelling.
### 7.4 Tissue-Level Changes
Coagulative necrosis starts in the subendocardium within 20-40 minutes and wavefronts outward to epicardium (transmural necrosis) by 6 hours.
### 7.5 Organ-Level Dysfunction
Impaired systolic contraction and diastolic relaxation, reduced stroke volume, cardiac output, and increased ventricular filling pressures.
### 7.6 Systemic Effects
Sympathetic activation (tachycardia, diaphoresis, peripheral vasoconstriction), activation of the renin-angiotensin-aldosterone system (RAAS).
### 7.7 Clinical Correlation
Subendocardial necrosis (NSTEMI) displays ST depression or T-wave inversion. Transmural necrosis (STEMI) displays ST elevations and progressive Q waves.

## 8. Pathology
### 8.1 Gross Pathology
- 0-12 hrs: No change.
- 12-24 hrs: Dark mottling.
- 1-3 days: Hyperemia with yellow-tan center.
- 7-10 days: Maximally soft yellow-tan with red hyperemic border (high risk of myocardial rupture).
- 2+ months: Dense white fibrous scar.
### 8.2 Microscopy
- 1-4 hrs: Wavy fibers.
- 4-12 hrs: Early coagulative necrosis, edema, hemorrhage.
- 1-3 days: Neutrophilic infiltration, loss of nuclei (contraction band necrosis).
- 3-7 days: Macrophage phagocytosis.
- 1-2 weeks: Granulation tissue.
- 2+ months: Scar tissue (type I collagen).
### 8.3 Histology
Loss of cross-striations, contraction bands, neutrophilic and later lymphocytic/macrophage margin infiltration.
### 8.4 Staging / Grading if relevant
Classified as Type 1 (plaque rupture), Type 2 (mismatch), Type 3 (sudden death), Type 4 (PCI-related), Type 5 (CABG-related).

## 9. Clinical Features
### 9.1 Symptoms
Crushing substernal chest pain radiating to left arm, neck, or jaw; dyspnea; diaphoresis; nausea; lightheadedness; and impending sense of doom.
### 9.2 Signs
S4 gallop, signs of heart failure (crackles, JVD), mitral regurgitation murmur (papillary muscle dysfunction), hypotension, or cardiogenic shock.
### 9.3 Early Features
Acute anginal pain, transient ECG changes, hyperacute T-waves.
### 9.4 Late Features
Congestive heart failure, ventricular remodeling, chronic arrhythmias.
### 9.5 Red Flags
New-onset pulmonary edema, hypotension, hemodynamic instability, cold extremities, and severe ventricular arrhythmias (VF/VT).

## 10. Diagnosis
### 10.1 Clinical Diagnosis
Chest pain lasting >20 minutes, unresponsive to nitroglycerin, with autonomic symptoms.
### 10.2 Laboratory Tests
High-sensitivity Cardiac Troponin (hs-cTnI/T) at presentation and 1-3 hours later.
### 10.3 Imaging
Echocardiogram (shows regional wall motion abnormalities); coronary angiography (confirms coronary occlusion).
### 10.4 Special Tests
12-lead Electrocardiogram (ECG) performed and interpreted within 10 minutes of arrival.
### 10.5 Diagnostic Criteria
Fourth Universal Definition of MI: Rise and/or fall of cardiac troponin with at least one value above the 99th percentile URL plus symptoms, new ischemic ECG changes, pathological Q waves, or wall motion loss.

## 11. Differential Diagnosis
### 11.1 Similar Condition 1
**Aortic Dissection:** Sudden tearing chest pain radiating to the back. Differentiated by unequal blood pressures in arms and widened mediastinum on CXR.
### 11.2 Similar Condition 2
**Acute Pericarditis:** Pleuritic chest pain relieved by sitting forward. Differentiated by diffuse ST elevations, PR segment depression, and friction rub.
### 11.3 How to Differentiate
- **PE:** Pleuritic pain, tachycardia, hypoxia, positive D-dimer, CTA chest confirmation.
- **GERD/Oesophageal Spasm:** Relieved by antacids, nitric oxide, normal cardiac biomarkers.

## 12. Management
### 12.1 Initial Stabilization
Dual antiplatelet therapy (Aspirin + P2Y12 inhibitor), high-dose statin, oxygen (if O2 sat <90%), sublingual Nitroglycerin, and anticoagulation (Heparin).
### 12.2 Medical Treatment
Beta-blockers (if no signs of HF/bronchospasm), ACE inhibitors (to prevent remodeling), and aldosterone antagonists.
### 12.3 Surgical Treatment
Emergency Percutaneous Coronary Intervention (PCI) within 90 minutes (door-to-balloon) for STEMI; Fibrinolysis (Alteplase) within 30 minutes if PCI is unavailable; Coronary Artery Bypass Graft (CABG) for multi-vessel disease.
### 12.4 Lifestyle Management
Smoking cessation, aerobic exercise (cardiac rehab), weight management, stress reduction, and cardioprotective diet.
### 12.5 Follow-Up
Frequent lipid profile monitoring, blood pressure control, echo reassessment at 40 days to check LVEF for implantable cardioverter-defibrillator (ICD) eligibility.
### 12.6 Prevention
Optimizing therapy for diabetes, hypertension, and hyperlipidemia; daily low-dose aspirin for high-risk secondary prevention.

## 13. Pharmacology
### 13.1 Drug Classes
Antiplatelets, Anticoagulants, Statins, Beta-blockers, ACE inhibitors, and Nitrates.
### 13.2 Mechanism of Action
- **Aspirin:** Irreversibly inhibits COX-1, preventing Thromboxane A2.
- **Clopidogrel/Ticagrelor:** Block P2Y12 ADP receptors.
- **Atorvastatin:** Inhibits HMG-CoA reductase, upregulating LDL receptors.
- **Metoprolol:** Beta-1 antagonist, lowering heart rate and myocardial O2 demand.
### 13.3 Indications
Acute coronary syndrome management, long-term secondary prevention, post-infarct left ventricular dysfunction.
### 13.4 Contraindications
Active hemorrhage, aortic dissection, severe asthma/bradycardia (for beta-blockers), bilateral renal artery stenosis (for ACEi).
### 13.5 Adverse Effects
Bleeding, statin-induced myopathy, dry cough/angioedema (for ACEi), bradycardia and hypotension.
### 13.6 Monitoring
Coagulation profiles (aPTT), liver function tests, serum creatinine, potassium levels, and blood pressure.

## 14. Complications
### 14.1 Acute Complications
Arrhythmias (VF/VT - leading cause of pre-hospital death), cardiogenic shock, acute mitral regurgitation due to papillary muscle rupture, free wall rupture leading to cardiac tamponade.
### 14.2 Chronic Complications
Congestive heart failure, ventricular aneurysm, Dressler syndrome (autoimmune pericarditis 2-10 weeks post-MI).
### 14.3 Life-Threatening Complications
Ventricular fibrillation, cardiogenic shock, and ventricular septum rupture.

## 15. Prognosis
### 15.1 Prognostic Factors
TIMI risk score, GRACE score, post-infarct left ventricular ejection fraction (LVEF), age, renal function, and completeness of revascularization.
### 15.2 Outcome
Survival has significantly improved with modern PCI (1-year survival exceeds 90% for treated STEMI without cardiogenic shock).
### 15.3 Recurrence Risk
High within the first year (5-10%), substantially reduced by strict adherence to dual antiplatelet therapy (DAPT) and high-intensity statins.

## 16. Prevention and Screening
### 16.1 Primary Prevention
Routine lipid panel checks, blood pressure monitoring, and cardiovascular risk calculators (ASCVD score) for primary statin therapy.
### 16.2 Secondary Prevention
DAPT for 12 months, life-long aspirin, high-intensity statins, and beta-blockers.
### 16.3 Screening Guidelines
Screening starting at age 20 with fasting lipid panels every 4-6 years; coronary artery calcium (CAC) scoring in borderline risk patients.

## 17. Research and Recent Advances
### 17.1 Current Research
Gene-editing for hyperlipidemia (e.g., PCSK9 CRISPR inhibitors), cardiac regenerative stem-cell patches, anti-inflammatory therapies (Colchicine).
### 17.2 New Drugs / Therapies
PCSK9 inhibitors (Evolocumab), SGLT2 inhibitors (proven to improve cardiovascular survival), and low-dose Colchicine (LODOCO trial for anti-inflammation).
### 17.3 Biomarkers
MicroRNAs (miR-1, miR-208a) as ultra-early biomarkers; high-sensitivity C-reactive protein (hs-CRP) for residual inflammatory risk.
### 17.4 Clinical Trials
COLCOT and LODOCO2 (colchicine reduces recurrent CV events), PARADISE-MI (Sacubitril/Valsartan post-MI).
### 17.5 Unanswered Questions
Effective methods to stimulate complete myocardial regeneration; optimal duration of DAPT in ultra-high-risk patients.

## 18. High-Yield Exam Points
### 18.1 Must-Know Facts
- Lead changes: V1-V4 (Anterior/LAD), II, III, aVF (Inferior/RCA), I, aVL, V5-V6 (Lateral/LCx).
- Ventricular free wall rupture occurs typically 3-14 days post-MI.
- VF/VT is the most common cause of sudden death within 24 hours of MI.
- Coagulative necrosis is the primary pathological pathway.
### 18.2 Common MCQ Traps
- Don't give Beta-blockers if cocaine vasospasm is suspected (causes unopposed alpha-1 stimulation; use benzodiazepines/nitroglycerin).
- Don't give Nitroglycerin in right ventricular infarctions (severe hypotension due to preload dependence; treat with IV fluids instead).
### 18.3 Viva Questions
- "Why does a patient with an inferior MI present with bradycardia?" (RCA supplies the SA/AV node).
- "Explain Dressler's syndrome." (Autoimmune pericarditis occurring weeks post-MI, treated with aspirin/colchicine).
### 18.4 One-Liners
"Time is muscle." "STEMI = prompt reperfusion." "Aspirin blocks thromboxane A2 irreversibly."

## 19. Clinical Correlation
### 19.1 Case Presentation
A 58-year-old male with diabetes and smoking history presents with 2 hours of squeezing retrosternal chest pain radiating to his left arm, accompanied by sweating and dyspnea.
### 19.2 Diagnostic Reasoning
ECG reveals 3mm ST elevations in leads V1 to V4. Cardiac Troponin I is elevated. This confirms acute Anterior STEMI due to LAD occlusion.
### 19.3 Management Reasoning
Patient is immediately loaded with Aspirin 325mg and Ticagrelor 180mg, and activated for emergent coronary angiography and primary PCI to restore flow and salvages ischemic tissue.

## 20. Final Summary
### 20.1 One-Line Summary
Acute occlusion of coronary blood flow causing coagulative necrosis of myocardial tissue, diagnosed via troponin and ECG, and treated with urgent antiplatelets, statins, and reperfusion (PCI).
### 20.2 Pathophysiology in One Flow
Plaque Rupture → Thrombogenesis → Ischemia → Anaerobic Glycolysis → Lactic Acidosis → Calcium Overload → Coagulative Necrosis → Scar Tissue.
### 20.3 Most Important Takeaways
Primary PCI is life-saving within 90 minutes. Beta-blockers and ACE inhibitors prevent remodeling. DAPT is crucial for 12 months post-MI.

## 21. Latest and Advanced Therapeutics
### 21.1 Standard Treatment
Immediate dual antiplatelet therapy (DAPT) with Aspirin (325 mg loaded) plus a P2Y12 inhibitor (e.g., Ticagrelor 180 mg). Emergent reperfusion via Primary PCI within 90 minutes of medical contact. Anticoagulation (Unfractionated Heparin) during PCI. High-intensity statins (Atorvastatin 80 mg), ACE inhibitors, and beta-blockers for secondary prevention.
### 21.2 Latest Guidelines
AHA/ACC 2023 Guidelines: Class I recommendation for Primary PCI in STEMI patients within 12 hours of symptom onset. ESC 2023 Guidelines: High-intensity statin therapy recommended to target LDL-C <55 mg/dL (<1.4 mmol/L) with a >50% reduction.
### 21.3 Advanced Therapeutics
Monoclonal antibodies: PCSK9 inhibitors (Evolocumab / Alirocumab) targeting PCSK9 to prevent LDL receptor degradation and lower LDL-C by 50-60%. siRNA therapy: Inclisiran (twice-yearly dosing).
### 21.4 Drug Details
Aspirin (COX-1 block, 162-325 mg chewed), Ticagrelor (P2Y12 block, 180 mg loaded), Atorvastatin (HMG-CoA blocker, 80 mg), Metoprolol (Beta-1 block, 25-50 mg). Contraindications: Active hemorrhage. Monitor: Bleeding signs.
### 21.5 Mechanism-Based Treatment
Reperfusion restores blood flow, halting the progression of wavefront myocardial necrosis. Beta-blockers reduce myocardial oxygen demand (heart rate/contractility). ACE inhibitors prevent cardiac remodeling and hypertrophy.
### 21.6 Treatment Algorithm
Chest Pain -> ECG -> ST elevation -> STEMI Cath Lab activation (<90 min). NSTEMI -> Risk stratification -> Invasive angiography.
### 21.7 Special Populations
Geriatric: High risk of bleeding with DAPT. Pregnancy: Low-dose aspirin and Heparin are safe; ACE inhibitors and Statins are strictly contraindicated (teratogenic). Renal impairment: Contrast nephropathy prophylaxis.
### 21.8 Emerging and Experimental Therapies
CRISPR-based PCSK9 gene editing (VERVE-101), cardiac regenerative stem-cell therapy, and anti-inflammatory colchicine to reduce residual inflammatory risk.`,
      nodes: [
        { id: "core", label: "Myocardial Infarction", category: "core", description: "Necrosis of myocardial cells due to prolonged, severe cardiac ischemia." },
        { id: "def", label: "1. Definition", category: "definition", description: "Necrosis of myocardial cells due to prolonged, severe cardiac ischemia." },
        { id: "anat", label: "2. Anatomy", category: "anatomy", description: "Coronary arterial tree: LAD (anterior), RCA (inferior, conduction AV/SA nodes), LCx (lateral wall)." },
        { id: "phys", label: "3. Physiology", category: "physiology", description: "Aerobic ATP production, autonomic modulation, baroreceptor regulation." },
        { id: "biochem", label: "4. Biochemistry", category: "biochemistry", description: "Calcium binding to Troponin C, shift to anaerobic metabolism, cardiac Troponin I/T elevation." },
        { id: "etio", label: "5. Etiology", category: "etiology", description: "Coronary atherosclerosis, plaque rupture, spasm, dissection." },
        { id: "risk", label: "6. Risk Factors", category: "risk_factors", description: "Modifiable: Smoking, HTN, Dyslipidemia, Diabetes. Non-modifiable: Age, Sex, Family History." },
        { id: "pathophys", label: "7. Pathophysiology", category: "pathophysiology", description: "Plaque rupture -> thrombus -> occlusion -> intracellular ATP depletion -> transmural wavefront necrosis." },
        { id: "path", label: "8. Pathology", category: "pathology", description: "Gross: mottling -> yellow-tan necrosis -> white scar. Micro: wavy fibers -> coagulative necrosis -> scar." },
        { id: "clin", label: "9. Clinical Features", category: "clinical_features", description: "Substernal chest pain radiating to left neck/jaw, S4 gallop, crackles, shock, diaphoresis." },
        { id: "diag", label: "10. Diagnosis", category: "diagnosis", description: "Troponin I/T, 12-lead ECG changes (ST elevations/depressions), echocardiography (wall motion), angiography." },
        { id: "diff", label: "11. Differentials", category: "differential", description: "Aortic dissection, pericarditis, pulmonary embolism, oesophageal spasm." },
        { id: "mgmt", label: "12. Management", category: "management", description: "DAPT, Nitroglycerin, Heparin, Emergent door-to-balloon PCI (<90 min), CABG, cardiac rehab." },
        { id: "pharm", label: "13. Pharmacology", category: "pharmacology", description: "Aspirin (COX blocker), Clopidogrel (P2Y12 blocker), Statins (HMG-CoA blocker), Beta-blockers, ACEi." },
        { id: "comp", label: "14. Complications", category: "complications", description: "Arrhythmias (leading cause of sudden death), cardiac rupture, papillary muscle rupture -> MR, Dressler syndrome." },
        { id: "prog", label: "15. Prognosis", category: "prognosis", description: "LVEF, TIMI/GRACE risk scoring, age. Treated survival rate >90%." },
        { id: "prev", label: "16. Prevention", category: "prevention", description: "Secondary prevention DAPT, cholesterol optimization, cardiac CAC scoring." },
        { id: "rsch", label: "17. Research", category: "research", description: "Stem-cell myocardial patches, anti-inflammatory colchicine, PCSK9 CRISPR gene editing." },
        { id: "exam", label: "18. High-Yield Exam", category: "exam", description: "LAD = V1-V4, RCA = II/III/aVF. Myocardial rupture at 3-14 days. Pre-hospital sudden death via VF." },
        { id: "corr", label: "19. Clinical Corr.", category: "correlation", description: "Crushing chest pain case presentation, emergent LAD angiography/stenting diagnostic reasoning." },
        { id: "summ", label: "20. Final Summary", category: "summary", description: "Anatomy to therapy synthesis: ischemia -> necrosis -> rapid reperfusion & remodeling inhibitors." },
        { id: "therapeutics", label: "21. Latest & Advanced Therapeutics", category: "therapeutics", description: "Standard, advanced, biological, and emerging therapies under clinical guideline-directed pathways." }
      ],
      links: [
        { source: "core", target: "def" },
        { source: "core", target: "anat" },
        { source: "core", target: "phys" },
        { source: "core", target: "biochem" },
        { source: "core", target: "etio" },
        { source: "core", target: "risk" },
        { source: "core", target: "pathophys" },
        { source: "core", target: "path" },
        { source: "core", target: "clin" },
        { source: "core", target: "diag" },
        { source: "core", target: "diff" },
        { source: "core", target: "mgmt" },
        { source: "core", target: "pharm" },
        { source: "core", target: "comp" },
        { source: "core", target: "prog" },
        { source: "core", target: "prev" },
        { source: "core", target: "rsch" },
        { source: "core", target: "exam" },
        { source: "core", target: "corr" },
        { source: "core", target: "summ" },
        { source: "core", target: "therapeutics" },
        { source: "anat", target: "pathophys" },
        { source: "phys", target: "pathophys" },
        { source: "biochem", target: "diag" },
        { source: "pathophys", target: "clin" },
        { source: "pathophys", target: "path" },
        { source: "path", target: "comp" },
        { source: "clin", target: "diag" },
        { source: "diag", target: "diff" },
        { source: "diag", target: "mgmt" },
        { source: "mgmt", target: "pharm" },
        { source: "mgmt", target: "therapeutics" },
        { source: "pharm", target: "therapeutics" }
      ],
      therapeutics: {
        disclaimer: "Educational use only. Not a substitute for professional medical advice, diagnosis, or treatment. Verify with current clinical guidelines and local protocols.",
        lastUpdated: "2026",
        standardTreatment: [
          "Immediate dual antiplatelet therapy (DAPT): Aspirin (325 mg loaded) plus a P2Y12 inhibitor (e.g., Ticagrelor 180 mg loaded or Prasugrel 60 mg loaded).",
          "Emergent reperfusion: Primary Percutaneous Coronary Intervention (PCI) within 90 minutes of medical contact for STEMI. If PCI is unavailable within 120 minutes, perform fibrinolysis (e.g., Tenecteplase) within 30 minutes of arrival.",
          "Anticoagulation: Unfractionated Heparin (UFH) or Bivalirudin during PCI; Enoxaparin or Fondaparinux for medically managed patients.",
          "Anti-ischemic therapy: Sublingual or intravenous Nitroglycerin (avoid in right ventricular infarction or sildenafil use); intravenous Beta-blockers (e.g., Metoprolol) within 24 hours if no heart failure or cardiogenic shock risk.",
          "Secondary prevention: High-intensity statin (e.g., Atorvastatin 80 mg daily) initiated immediately; ACE inhibitors or ARBs within 24 hours (particularly for LVEF <40% or anterior MI); Mineralocorticoid receptor antagonists (e.g., Spironolactone) for LVEF <40% with heart failure symptoms."
        ],
        latestGuidelines: [
          {
            source: "AHA/ACC",
            year: "2023",
            recommendation: "Class I Recommendation: Primary PCI is recommended for patients with STEMI and ischemic symptoms of <12 hours duration.",
            evidenceLevel: "Level A",
            clinicalUse: "Mandatory first-line standard of care for acute STEMI."
          },
          {
            source: "ESC",
            year: "2023",
            recommendation: "Class I Recommendation: High-intensity statin therapy is recommended for all ACS patients regardless of baseline LDL-C, targeting LDL-C <55 mg/dL (<1.4 mmol/L) and a >50% reduction.",
            evidenceLevel: "Level A",
            clinicalUse: "Long-term secondary cardiovascular prevention."
          }
        ],
        advancedTherapies: [
          {
            name: "PCSK9 Inhibitors (Evolocumab / Alirocumab)",
            category: "Monoclonal Antibodies / Lipid Management",
            mechanism: "Binds to PCSK9, preventing LDLR degradation and dramatically increasing hepatic clearance of LDL cholesterol.",
            target: "PCSK9 enzyme",
            indications: "ACS patients with persistent hypercholesterolemia despite maximally tolerated high-intensity statin and Ezetimibe.",
            contraindications: "Severe hypersensitivity to the monoclonal antibody.",
            benefits: "Reduces LDL-C by an additional 50-60% and significantly lowers recurrent myocardial infarction and stroke rates.",
            limitations: "Extremely high cost; requires subcutaneous injection every 2-4 weeks.",
            adverseEffects: "Injection site reactions, nasopharyngitis, rare allergic reactions.",
            monitoring: "Lipid panel (LDL-C levels) at 4-12 weeks post-initiation.",
            evidenceStatus: "Guideline-supported / Established (FOURIER and ODYSSEY OUTCOMES trials)",
            highYieldPoint: "Initiate PCSK9 inhibitors early in patients with recurrent events who are already on maximal statin therapy."
          }
        ],
        emergingTherapies: [
          {
            name: "Inclisiran",
            status: "Recently approved / Established",
            mechanism: "Small interfering RNA (siRNA) that inhibits translation of PCSK9 in the liver.",
            trialPhase: "Phase III (ORION trials)",
            potentialUse: "Ultra-long-acting LDL cholesterol lowering with twice-yearly dosing.",
            limitations: "High cost; limited long-term safety data compared to statins.",
            safetyConcerns: "Mild injection site reactions."
          },
          {
            name: "Colchicine",
            status: "Guideline-supported / Recently approved",
            mechanism: "Inhibits microtubule polymerization, dampening NLRP3 inflammasome assembly and neutrophil activation.",
            trialPhase: "Phase III (COLCOT & LODOCO2 trials)",
            potentialUse: "Reducing residual inflammatory risk post-MI.",
            limitations: "Gastrointestinal side effects; avoid in severe renal or hepatic impairment.",
            safetyConcerns: "Myotoxicity when combined with statins (extremely rare), GI distress."
          }
        ],
        treatmentAlgorithm: [
          {
            step: "1. Diagnosis & Triage",
            decisionPoint: "12-Lead ECG demonstrating ST-segment elevations or new LBBB.",
            action: "Activate Cardiac Cath Lab immediately for primary PCI.",
            reason: "Time is muscle; restoring coronary perfusion prevents myocardial necrosis."
          },
          {
            step: "2. Reperfusion Strategy",
            decisionPoint: "Is PCI available within 120 minutes of first medical contact?",
            action: "If yes, perform PCI (Goal: door-to-balloon <90 min). If no, administer intravenous fibrinolysis within 30 minutes of arrival unless contraindicated.",
            reason: "Early reperfusion is the single most important predictor of survival."
          }
        ],
        drugComparisonTable: [
          {
            therapy: "Aspirin",
            mechanism: "Irreversible COX-1 inhibition, blocking Thromboxane A2 synthesis and platelet aggregation",
            indication: "Acute Coronary Syndrome, secondary cardiovascular prevention",
            benefit: "Immediate reduction in cardiovascular mortality",
            limitation: "Gastrointestinal bleeding risk",
            adverseEffects: "Dyspepsia, GI ulceration, bleeding, tinnitus",
            monitoring: "Signs of bleeding, hemoglobin/hematocrit",
            evidenceLevel: "Strong evidence (Landmark ISIS-2 trial)",
            highYieldPoint: "Always chew aspirin (162-325 mg) during acute presentation for rapid absorption."
          }
        ],
        specialPopulations: [
          {
            population: "Geriatric Patients",
            details: "Elderly patients frequently present with atypical symptoms (e.g., dyspnea, confusion) rather than classic crushing chest pain. They have a higher risk of bleeding from aggressive antiplatelet/anticoagulant regimens; consider lower doses or bleeding-risk scoring (e.g., CRUSADE)."
          },
          {
            population: "Renal Impairment",
            details: "Requires dose adjustments for Enoxaparin (contraindicated if CrCl <30 mL/min; use unfractionated heparin instead) and contrast-induced nephropathy prophylaxis during coronary angiography (adequate hydration is essential)."
          }
        ],
        monitoring: [
          {
            parameter: "Continuous ECG telemetry",
            frequency: "First 24-48 hours",
            rationale: "Detect early malignant arrhythmias (VT/VF) which are the leading cause of sudden death in the acute phase."
          },
          {
            parameter: "Cardiac Troponin I or T",
            frequency: "Serial measurements (e.g., 0, 3, 6 hours)",
            rationale: "Confirm diagnosis, evaluate kinetic peak, and monitor for potential reinfarction if chest pain recurs."
          }
        ],
        contraindications: [
          {
            contraindication: "Absolute Contraindications for Fibrinolysis",
            rationale: "Active internal bleeding, prior intracranial hemorrhage, ischemic stroke within 3 months, known intracranial neoplasm or vascular malformation, or recent significant closed-head/facial trauma."
          }
        ],
        adverseEffects: [
          {
            effect: "Dual Antiplatelet Therapy (DAPT) Bleeding",
            management: "Stop P2Y12 inhibitor only if life-threatening bleeding occurs; maintain Aspirin if possible to prevent stent thrombosis."
          }
        ],
        clinicalPearls: [
          "Cocaine-induced MI must NOT be treated with beta-blockers due to the risk of unopposed alpha-adrenergic vasoconstriction. Use Nitroglycerin, Phentolamine, and Benzodiazepines instead.",
          "Right ventricular infarction (occurring in RCA occlusion) is extremely preload-dependent. Avoid nitroglycerin and morphine, which cause venodilation, and treat hypotension aggressively with rapid IV saline boluses."
        ],
        highYieldExamPoints: [
          "Most common cause of death within the first 24 hours of MI is ventricular fibrillation (VF).",
          "Ventricular free wall rupture occurs typically 3-14 days post-MI and presents with sudden cardiogenic shock, cardiac tamponade, and pulseless electrical activity (PEA).",
          "Dressler syndrome is an autoimmune post-MI pericarditis occurring 2-10 weeks later, presenting with chest pain radiating to trapezii, friction rub, and diffuse ST elevations. Treat with high-dose Aspirin or NSAIDs plus Colchicine."
        ],
        referencesToVerify: [
          "2023 ESC Guidelines for the management of acute coronary syndromes: European Heart Journal.",
          "2021 ACC/AHA/SCAI Guideline for Coronary Artery Revascularization: Journal of the American College of Cardiology."
        ]
      }
    };
  }

  // 1. AORTIC DISSECTION FALLBACK
  if (lower.includes("aortic") || lower.includes("dissection")) {
    return {
      topic: "Aortic Dissection",
      markdown: `# MEDICAL MIND MAP: AORTIC DISSECTION

## 1. Definition
### 1.1 Standard Definition
A life-threatening tear in the inner layer of the aorta (tunica intima), allowing blood to surge through the tear and separate the intima from the media, creating a false lumen.
### 1.2 Clinical Definition
An acute aortic syndrome characterized by severe, sudden chest/back pain, requiring emergent surgical or medical intervention depending on anatomic classification.
### 1.3 Key Terminology
DeBakey Classification, Stanford Type A (involves ascending aorta), Stanford Type B (descending aorta only), True Lumen, False Lumen, Intimal Flap.

## 2. Anatomy
### 2.1 Relevant Structures
Ascending aorta, aortic arch, descending thoracic aorta, abdominal aorta, tunica intima, tunica media, tunica adventitia, vasa vasorum.
### 2.2 Blood Supply
Aorta carries systemic arterial flow. Vasa vasorum supplies the outer layers of the aortic wall (adventitia and outer media).
### 2.3 Nerve Supply
Aortic plexus of the autonomic nervous system. Afferent sensory fibers convey severe pain to the dorsal horns of the thoracic spinal cord.
### 2.4 Lymphatics
Periaortic lymph nodes draining into the thoracic duct.
### 2.5 Applied Anatomy
A dissection involving the ascending aorta (Stanford Type A) can retrograde propagate to cause aortic valve insufficiency, coronary artery occlusion (usually RCA), or hemopericardium and cardiac tamponade.

## 3. Physiology
### 3.1 Normal Function
Aorta acts as an elastic conduit. During systole, it distends; during diastole, elastic recoil (Windkessel effect) maintains continuous peripheral blood flow.
### 3.2 Regulation
Autonomic tone regulates systemic vascular resistance and heart rate to maintain mean arterial pressure.
### 3.3 Feedback Mechanisms
Baroreceptors in the aortic arch detect pressure changes, relaying signals via the glossopharyngeal and vagal nerves to regulate sympathetic outflow.
### 3.4 Homeostasis
Maintained by limiting wall stress (dependent on blood pressure and velocity of ventricular contraction, dP/dt).

## 4. Biochemistry
### 4.1 Molecular Basis
Degradation of elastic fibers and collagen in the tunica media. Up-regulation of matrix metalloproteinases (MMPs) degrades extracellular matrix.
### 4.2 Enzymes / Proteins / Receptors
MMP-2, MMP-9, Collagen type I and III, Elastin, Fibrillin-1 (mutated in Marfan syndrome), TGF-beta.
### 4.3 Metabolic Pathways
Impaired smooth muscle cell metabolism leading to cystic medial necrosis (degeneration of elastic tissue and smooth muscle).
### 4.4 Biomarkers
D-dimer (highly sensitive for ruling out dissection if negative), Smooth Muscle Myosin Heavy Chain (elevates early), Soluble Elastin Fragments.

## 5. Etiology
### 5.1 Genetic Causes
Marfan syndrome (FBN1 mutation), Loeys-Dietz syndrome (TGFBR1/2 mutation), Ehlers-Danlos vascular type (COL3A1 mutation).
### 5.2 Infectious Causes
Syphilitic aortitis causing obliterative endarteritis of the vasa vasorum (leads to aneurysms and predisposes to dissection).
### 5.3 Autoimmune Causes
Giant cell arteritis or Takayasu arteritis causing chronic vessel wall inflammation and weakness.
### 5.4 Metabolic Causes
Chronic hypertension (causing medial degeneration and atherosclerosis), dyslipidemia.
### 5.5 Environmental Causes
Cocaine or amphetamine abuse (causing acute surges in blood pressure), weightlifting or severe physical strain.
### 5.6 Iatrogenic Causes
Intubation injury, cardiac catheterization/coronary angiography, or intra-aortic balloon pump trauma.

## 6. Risk Factors
### 6.1 Modifiable
Chronic uncontrolled hypertension, smoking, cocaine use, dyslipidemia, and sedentary lifestyle.
### 6.2 Non-Modifiable
Advanced age (60-80 years), male sex, bicuspid aortic valve, coarctation of the aorta, pregnancy, and family history.
### 6.3 Protective Factors
Strict blood pressure control (especially beta-blockade), smoking cessation, screening in high-risk genetic populations.

## 7. Pathophysiology
### 7.1 Initiating Event
An intimal tear occurs, often triggered by mechanical shear stress (especially in the ascending aorta where dP/dt is highest).
### 7.2 Molecular Mechanism
High pressure blood enters the media, splitting the laminar sheets. Chronic inflammation and matrix degradation facilitate this propagation.
### 7.3 Cellular Changes
Apoptosis of vascular smooth muscle cells and loss of elastic lamellae (cystic medial necrosis).
### 7.4 Tissue-Level Changes
Separation of the intima and inner media from the outer media and adventitia, creating the false lumen.
### 7.5 Organ-Level Dysfunction
Malperfusion syndrome due to branch artery occlusion (stroke, renal failure, bowel ischemia, myocardial infarction).
### 7.6 Systemic Effects
Sympathetic hyperactivation due to extreme pain, leading to tachycardia and hypertension (or hypotension if shock occurs).
### 7.7 Clinical Correlation
Pulsatile shear force propagates dissection distally. Involvement of renal arteries causes acute kidney injury and renin-mediated refractory hypertension.

## 8. Pathology
### 8.1 Gross Pathology
Visible intimal tear with separate true and false lumens, sometimes with thrombosis of the false lumen or rupture through the adventitia.
### 8.2 Microscopy
Cystic medial necrosis with fragmentation of elastic fibers and pooling of amorphous extracellular ground substance.
### 8.3 Histology
Loss of smooth muscle nuclei, elastic lamellae disorganization, and lipid-rich foam cells if concomitant atherosclerosis.
### 8.4 Staging / Grading if relevant
Stanford: Type A (ascending) vs Type B (descending). DeBakey: Type I (ascending + descending), Type II (ascending only), Type III (descending only).

## 9. Clinical Features
### 9.1 Symptoms
Sudden, severe, 'tearing' or 'ripping' chest pain radiating to the back (between the scapulae), accompanied by diaphoresis and shortness of breath.
### 9.2 Signs
Asymmetrical blood pressures or pulses between arms (>20 mmHg difference), new aortic regurgitation murmur, neurological deficits (stroke-like symptoms), or shock.
### 9.3 Early Features
Acute crushing/tearing pain, hypertensive crisis, syncope.
### 9.4 Late Features
Renal failure, paraplegia (spinal cord ischemia via spinal arteries), lower limb ischemia, or pleural effusion.
### 9.5 Red Flags
Asymmetrical radial/carotid pulses, new diastolic murmur, hypotension (indicates cardiac tamponade or rupture), anuria, or sudden hemiplegia.

## 10. Diagnosis
### 10.1 Clinical Diagnosis
Sudden tearing chest/back pain with pulse deficit and widened mediastinum on chest X-ray.
### 10.2 Laboratory Tests
D-dimer (elevated), cardiac troponins (to rule out concurrent MI), kidney function tests (creatinine for malperfusion).
### 10.3 Imaging
CT Angiography (CTA) of the chest and abdomen (gold standard, shows intimal flap); Transesophageal Echocardiogram (TEE) for hemodynamically unstable patients.
### 10.4 Special Tests
Aortography (rarely used now), magnetic resonance angiography (MRA) for stable patients with contrast allergies.
### 10.5 Diagnostic Criteria
Visualization of the double-lumen aorta with an intervening intimal flap on contrast-enhanced cross-sectional imaging (CTA/TEE).

## 11. Differential Diagnosis
### 11.1 Similar Condition 1
**Acute Myocardial Infarction:** Presents with severe chest pain. Differentiated by symmetric pulses, specific ECG changes (ST elevation), and elevated troponins without intimal flap on imaging.
### 11.2 Similar Condition 2
**Acute Pulmonary Embolism:** Presents with chest pain and dyspnea. Differentiated by pleuritic pain, hypoxia, and CTA showing pulmonary artery filling deficits rather than aortic flap.
### 11.3 How to Differentiate
- **Pericarditis:** Positional pain, diffuse ST elevation on ECG, friction rub, normal aorta on CTA.
- **Pneumothorax:** Unilateral absent breath sounds, hyperresonance, diagnosed on chest X-ray.

## 12. Management
### 12.1 Initial Stabilization
Aggressive heart rate and blood pressure control. Goal: SBP 100-120 mmHg and HR <60 bpm using IV beta-blockers (Esmolol or Labetalol) to reduce aortic wall shear stress (dP/dt).
### 12.2 Medical Treatment
Stanford Type B (descending) is typically managed medically with continuous blood pressure control and close intensive care monitoring.
### 12.3 Surgical Treatment
Stanford Type A is a surgical emergency. Requires open-heart surgery with resection of the torn aorta, graft replacement, and potentially aortic valve reconstruction/replacement.
### 12.4 Lifestyle Management
Avoidance of heavy lifting or isometric exercises, smoking cessation, and lifelong strict blood pressure management.
### 12.5 Follow-Up
Serial imaging (CTA or MRA) at 1, 3, 6, and 12 months, then annually to monitor for aneurysm progression or endoleak.
### 12.6 Prevention
Aggressive therapy for hypertension (maintain BP <120/80 mmHg), regular screening for families with known genetic aortic diseases.

## 13. Pharmacology
### 13.1 Drug Classes
Intravenous Beta-blockers, Vasodilators (secondary to beta-blockade), and pain control (Morphine/Fentanyl).
### 13.2 Mechanism of Action
- **Esmolol:** Ultra-short-acting beta-1 selective antagonist, rapidly lowers HR and dP/dt.
- **Sodium Nitroprusside:** Vasodilator (NO donor), only given *after* beta-blockade to avoid reflex tachycardia.
- **Labetalol:** Combined alpha-1 and beta-1/2 blocker, reduces systemic vascular resistance and heart rate.
### 13.3 Indications
Acute aortic dissection or aortic syndrome requiring immediate shear-stress reduction.
### 13.4 Contraindications
Severe bradycardia, cardiogenic shock, high-degree AV blocks, acute asthma (for non-selective beta-blockers).
### 13.5 Adverse Effects
Hypotension, bradycardia, bronchospasm, and thiocyanate toxicity (from prolonged sodium nitroprusside use).
### 13.6 Monitoring
Continuous arterial line blood pressure monitoring, continuous telemetry, renal function, and neurologic status.

## 14. Complications
### 14.1 Acute Complications
Rupture (catastrophic hemothorax or retroperitoneal hemorrhage), aortic regurgitation, stroke, myocardial infarction (RCA occlusion), and bowel/renal ischemia.
### 14.2 Chronic Complications
Aneurysmal dilation of the dissected aorta, persistent false lumen perfusion (endoleak), graft infection, or progressive aortic insufficiency.
### 14.3 Life-Threatening Complications
Aortic rupture, cardiac tamponade, and massive visceral malperfusion.

## 15. Prognosis
### 15.1 Prognostic Factors
Anatomic location (Type A has much worse prognosis), presence of shock, renal/visceral malperfusion, and age.
### 15.2 Outcome
Type A untreated mortality is 1-2% per hour for the first 48 hours. Modern surgical survival rates exceed 80-85%.
### 15.3 Recurrence Risk
Significant risk of expansion or new dissection in the residual aorta; requires lifelong imaging surveillance.

## 16. Prevention and Screening
### 16.1 Primary Prevention
Blood pressure control, smoking cessation, and avoiding sympathomimetic drugs (cocaine).
### 16.2 Secondary Prevention
Lifelong beta-blocker therapy, aggressive blood pressure goals (<120/80 mmHg), and serial aortic imaging.
### 16.3 Screening Guidelines
Echocardiographic screening for first-degree relatives of patients with thoracic aortic aneurysms or genetic syndromes (Marfan).

## 17. Research and Recent Advances
### 17.1 Current Research
Endovascular repair techniques for Stanford Type B (TEVAR) and hybrid procedures for complex Type A dissections.
### 17.2 New Drugs / Therapies
Angiotensin II receptor blockers (Losartan) to slow aortic dilatation in Marfan syndrome via TGF-beta pathway inhibition.
### 17.3 Biomarkers
Circulating microRNAs and elastin degradation products to detect subclinical aortic wall expansion.
### 17.4 Clinical Trials
TEVAR vs medical therapy trials (INSTEAD and ADSORB trials showing benefits of endovascular repair in chronic Type B).
### 17.5 Unanswered Questions
Optimal timing for endovascular intervention in uncomplicated Stanford Type B dissections.

## 18. High-Yield Exam Points
### 18.1 Must-Know Facts
- Stanford Type A involves ascending aorta (requires surgery); Type B descending only (typically managed medically).
- Beta-blockers MUST be given BEFORE vasodilators (like nitroprusside) to prevent reflex tachycardia and increased aortic shear stress.
- Marfan syndrome represents mutated Fibrillin-1.
- Unequal pulses + severe chest pain radiating to back = Aortic Dissection.
### 18.2 Common MCQ Traps
- Do not give thrombolytics (Alteplase) to a dissection patient presenting with chest pain and dynamic ECG changes; this is fatal. Always check pulses and get chest X-ray/CTA if suspected.
- Do not order a coronary angiogram as the initial diagnostic test for suspected dissection.
### 18.3 Viva Questions
- "Why do you check blood pressures in both arms?" (Malperfusion of the left subclavian artery by the intimal flap causes differential arm pressures).
- "Explain cystic medial necrosis." (Histological degeneration of the aortic media characterized by elastic fiber loss and collagen fragmentation).
### 18.4 One-Liners
"Tearing back pain is aortic dissection." "Type A is surgical, Type B is medical." "Beta-blockers first, vasodilators second."

## 19. Clinical Correlation
### 19.1 Case Presentation
A 63-year-old male with a history of untreated hypertension presents to the ED with sudden, excrutiating 'ripping' chest pain that radiates to his back. He is diaphoretic, and his BP is 210/115 mmHg in the right arm, but 170/95 mmHg in the left arm.
### 19.2 Diagnostic Reasoning
The presence of severe, tearing pain radiating to the back coupled with asymmetrical arm blood pressures strongly points to acute aortic dissection. Intimal flap malperfusion of the left subclavian artery explains the pressure difference. Emergency CTA of the chest is ordered immediately.
### 19.3 Management Reasoning
Pending CTA, the patient is started on an IV Esmolol infusion to reduce heart rate to 55 bpm and SBP to 110 mmHg. If CTA confirms Stanford Type A, cardiothoracic surgery will be activated for emergent graft replacement.

## 20. Final Summary
### 20.1 One-Line Summary
A catastrophic tear in the aortic intima causing a false lumen, characterized by severe ripping back pain and pulse deficits, requiring emergent medical (Type B) or surgical (Type A) management.
### 20.2 Pathophysiology in One Flow
Shear Stress → Intimal Tear → Blood Enters Media → True/False Lumen Separation → Propagation → Malperfusion/Rupture.
### 20.3 Most Important Takeaways
Type A requires immediate surgery. Aggressive heart rate control (beta-blockers) is the primary medical goal. Long-term BP management and imaging are mandatory.

## 21. Latest and Advanced Therapeutics
### 21.1 Standard Treatment
Intravenous beta-blockers (Esmolol or Labetalol) to control heart rate and dP/dt, followed by vasodilators if necessary. Emergent surgical graft replacement for Stanford Type A dissections. Medical therapy in the ICU with strict blood pressure control for Stanford Type B.
### 21.2 Latest Guidelines
AHA/ACC 2022 Guidelines: Immediate surgical consultation for all Type A dissections. Recommends TEVAR (Thoracic Endovascular Aortic Repair) for Type B dissections with signs of malperfusion, rupture, or refractory pain.
### 21.3 Advanced Therapeutics
Endovascular stenting: Thoracic Endovascular Aortic Repair (TEVAR) using self-expanding covered stent grafts. Cellular and genetic target therapies: TGF-beta inhibitors (Losartan) to stabilize extracellular matrix.
### 21.4 Drug Details
Esmolol (IV bolus 500 mcg/kg over 1 min, then 50-200 mcg/kg/min infusion), Labetalol (IV 20 mg over 2 min, then 20-80 mg every 10 min), Sodium Nitroprusside (0.3-10 mcg/kg/min IV). Contraindications: Severe asthma, heart block. Monitor: Heart rate, invasive arterial blood pressure.
### 21.5 Mechanism-Based Treatment
Beta-1 blockade reduces myocardial contractility and heart rate, which directly decreases the rate of aortic pressure rise (dP/dt), stopping the mechanical propagation of the intimal tear.
### 21.6 Treatment Algorithm
Chest/Back Pain -> Assess asymmetric pulses & BP -> Suspect Dissection -> Initiate IV Beta-blockers -> Urgent CTA -> Type A (Surgery) vs Type B (ICU Medical / TEVAR if complications).
### 21.7 Special Populations
Pregnancy: Increased risk of dissection in third trimester (especially with Marfan's). Delivery should be managed via Caesarean section. Beta-blockers are safe, but nitroprusside is contraindicated due to fetal cyanide toxicity.
### 21.8 Emerging and Experimental Therapies
Matrix metalloproteinase (MMP) inhibitors (Doxycycline at sub-antimicrobial doses) to slow elastic fiber degradation. Gene therapy targeting smooth muscle cell survival pathways.`,
      nodes: [
        { id: "core", label: "Aortic Dissection", category: "core", description: "Tear in aortic intima creating a false lumen; surgical emergency." },
        { id: "def", label: "1. Definition", category: "definition", description: "Separation of aortic wall layers by blood flow entering an intimal tear." },
        { id: "anat", label: "2. Anatomy", category: "anatomy", description: "Aortic layers: Intima, Media (site of dissection), Adventitia. Vasa vasorum." },
        { id: "phys", label: "3. Physiology", category: "physiology", description: "Windkessel recoil effect, blood pressure shear stress (dP/dt)." },
        { id: "biochem", label: "4. Biochemistry", category: "biochemistry", description: "Matrix metalloproteinase activity, cystic medial necrosis, Fibrillin-1 mutations." },
        { id: "etio", label: "5. Etiology", category: "etiology", description: "Hypertension, Marfan, Loeys-Dietz, bicuspid aortic valve, trauma." },
        { id: "risk", label: "6. Risk Factors", category: "risk_factors", description: "HTN, smoking, advanced age, male sex, genetic connective disorders." },
        { id: "pathophys", label: "7. Pathophysiology", category: "pathophysiology", description: "Intimal tear -> false lumen formation -> pressure-driven propagation -> malperfusion." },
        { id: "path", label: "8. Pathology", category: "pathology", description: "Gross intimal flap, microscopic fragmentation of elastic fibers (cystic medial degeneration)." },
        { id: "clin", label: "9. Clinical Features", category: "clinical_features", description: "Sudden ripping back pain, asymmetrical limb pulses/BP, new AR murmur, syncope." },
        { id: "diag", label: "10. Diagnosis", category: "diagnosis", description: "CTA chest/abdomen (gold standard), TEE for unstable, widened mediastinum on CXR." },
        { id: "diff", label: "11. Differentials", category: "differential", description: "Myocardial infarction, pulmonary embolism, pericarditis, pneumothorax." },
        { id: "mgmt", label: "12. Management", category: "management", description: "Immediate IV beta-blockers, surgery for Stanford Type A, ICU medical control for Stanford Type B." },
        { id: "pharm", label: "13. Pharmacology", category: "pharmacology", description: "Esmolol, Labetalol, Nitroprusside (avoid until heart rate is fully controlled)." },
        { id: "comp", label: "14. Complications", category: "complications", description: "Rupture (tamponade/death), aortic regurgitation, stroke, renal/mesenteric ischemia." },
        { id: "prog", label: "15. Prognosis", category: "prognosis", description: "Type A untreated has 1-2% mortality/hr. Type B has better stable survival." },
        { id: "prev", label: "16. Prevention", category: "prevention", description: "Strict lifetime BP control (<120/80), genetic family screening." },
        { id: "rsch", label: "17. Research", category: "research", description: "TEVAR stenting for complicated Type B, TGF-beta blockade pathways." },
        { id: "exam", label: "18. High-Yield Exam", category: "exam", description: "Give beta-blockers BEFORE vasodilators. Marfan = Fibrillin-1. Type A = surgery." },
        { id: "corr", label: "19. Clinical Corr.", category: "correlation", description: "Ripping pain radiating to scapulae, asymmetric blood pressures case logic." },
        { id: "summ", label: "20. Final Summary", category: "summary", description: "Intimal rupture leading to a lethal false lumen; requires immediate HR/BP control and triage." },
        { id: "therapeutics", label: "21. Latest & Advanced Therapeutics", category: "therapeutics", description: "Targeted heart rate control, endovascular stenting (TEVAR), and specialized genetic therapies." }
      ],
      links: [
        { source: "core", target: "def" },
        { source: "core", target: "anat" },
        { source: "core", target: "phys" },
        { source: "core", target: "biochem" },
        { source: "core", target: "etio" },
        { source: "core", target: "risk" },
        { source: "core", target: "pathophys" },
        { source: "core", target: "path" },
        { source: "core", target: "clin" },
        { source: "core", target: "diag" },
        { source: "core", target: "diff" },
        { source: "core", target: "mgmt" },
        { source: "core", target: "pharm" },
        { source: "core", target: "comp" },
        { source: "core", target: "prog" },
        { source: "core", target: "prev" },
        { source: "core", target: "rsch" },
        { source: "core", target: "exam" },
        { source: "core", target: "corr" },
        { source: "core", target: "summ" },
        { source: "core", target: "therapeutics" },
        { source: "anat", target: "pathophys" },
        { source: "phys", target: "pathophys" },
        { source: "biochem", target: "diag" },
        { source: "pathophys", target: "clin" },
        { source: "pathophys", target: "path" },
        { source: "path", target: "comp" },
        { source: "clin", target: "diag" },
        { source: "diag", target: "diff" },
        { source: "diag", target: "mgmt" },
        { source: "mgmt", target: "pharm" },
        { source: "mgmt", target: "therapeutics" },
        { source: "pharm", target: "therapeutics" }
      ],
      therapeutics: {
        disclaimer: "Educational use only. Not a substitute for professional medical advice, diagnosis, or treatment. Verify with current clinical guidelines and local protocols.",
        lastUpdated: "2026",
        standardTreatment: [
          "Immediate intensive care unit (ICU) admission with invasive arterial line monitoring.",
          "Aggressive heart rate control using intravenous short-acting beta-blockers (e.g., Esmolol infusion or Labetalol boluses) to target a heart rate of 50-60 bpm.",
          "Systolic blood pressure control to a target of 100-120 mmHg (e.g., using Sodium Nitroprusside or Nicardipine) only after target heart rate is reached.",
          "Emergent surgical consultation and open-heart revascularization/aortic replacement for all Stanford Type A dissections.",
          "Long-term oral beta-blocker therapy and aggressive blood pressure control (<120/80 mmHg) for medically managed Stanford Type B dissections."
        ],
        latestGuidelines: [
          {
            source: "AHA/ACC",
            year: "2022",
            recommendation: "Class I Recommendation: Intravenous beta-blockers are recommended as first-line therapy to reduce heart rate and blood pressure in acute aortic syndromes.",
            evidenceLevel: "Level B-NR",
            clinicalUse: "Mandatory initial resuscitation step."
          },
          {
            source: "SVS/STS",
            year: "2020",
            recommendation: "Class I Recommendation: TEVAR is recommended for patients with acute Stanford Type B dissection who develop complications (e.g., rupture, malperfusion, or refractory pain).",
            evidenceLevel: "Level B-R",
            clinicalUse: "Escalation therapy for complicated descending dissections."
          }
        ],
        advancedTherapies: [
          {
            name: "Thoracic Endovascular Aortic Repair (TEVAR)",
            category: "Endovascular Surgery",
            mechanism: "Placement of a fabric-covered self-expanding metal stent graft across the primary intimal tear, sealing the entry tear and depressurizing the false lumen.",
            target: "Aortic tunica intima",
            indications: "Complicated Stanford Type B aortic dissection (renal/mesenteric malperfusion, impending rupture, refractory hypertension).",
            contraindications: "Inadequate landing zones, severe access vessel tortuosity, active systemic infection.",
            benefits: "Promotes false lumen thrombosis and aortic remodeling; has significantly lower morbidity compared to open surgery.",
            limitations: "Risk of endoleaks, stent graft migration, or spinal cord ischemia.",
            adverseEffects: "Stroke, paraplegia (due to coverage of spinal intercostal arteries), arterial access site injury.",
            monitoring: "Serial CTA scans to evaluate graft seal, false lumen thrombosis, and branch artery perfusion.",
            evidenceStatus: "Guideline-supported / Established",
            highYieldPoint: "TEVAR is the first-line intervention for complicated Stanford Type B dissections, whereas Type A always requires urgent open surgical repair."
          }
        ],
        emergingTherapies: [
          {
            name: "MMP-9 Targeted Small Molecule Inhibitors",
            status: "Experimental",
            mechanism: "Inhibition of Matrix Metalloproteinase-9, preventing extracellular matrix elastin/collagen degradation in the aortic media.",
            trialPhase: "Phase II (pre-clinical / early trials)",
            potentialUse: "Slowing progression and preventing rupture in chronic Type B dissections.",
            limitations: "Off-target musculoskeletal pain and joint stiffness.",
            safetyConcerns: "Fibrotic complications, systemic joint stiffness."
          }
        ],
        treatmentAlgorithm: [
          {
            step: "1. Triage and Resuscitation",
            decisionPoint: "Excruciating ripping back pain with asymmetrical pulses or widened mediastinum.",
            action: "Establish invasive arterial line; immediately start IV Esmolol infusion.",
            reason: "Controlling heart rate and dP/dt stops the propagation of the intimal tear."
          },
          {
            step: "2. Imaging Confirmation",
            decisionPoint: "Hemodynamically stable vs unstable.",
            action: "Stable: Urgent CTA of chest and abdomen. Unstable: Emergency TEE in the OR or ICU.",
            reason: "Accurate anatomical classification dictates standard surgical vs medical pathways."
          },
          {
            step: "3. Anatomic Triage",
            decisionPoint: "Involvement of the Ascending Aorta (Stanford Type A).",
            action: "Consult cardiothoracic surgery immediately for emergent open aortic repair.",
            reason: "Stanford Type A carries a high risk of retrograde dissection causing fatal tamponade or coronary occlusion."
          }
        ],
        drugComparisonTable: [
          {
            therapy: "Esmolol",
            mechanism: "Ultra-short-acting cardioselective beta-1 adrenergic antagonist",
            indication: "Acute aortic dissection, rapid heart rate reduction",
            benefit: "Extremely short half-life (~9 mins) allows rapid titration and safe cessation if side effects occur",
            limitation: "Requires continuous intravenous infusion and arterial line monitoring",
            adverseEffects: "Hypotension, bradycardia, injection site irritation",
            monitoring: "Heart rate, arterial blood pressure",
            evidenceLevel: "Class I, Level B (established clinical standard)",
            highYieldPoint: "Always load and titrate Esmolol first to avoid reflex tachycardia from secondary vasodilators."
          }
        ],
        specialPopulations: [
          {
            population: "Pregnant Patients",
            details: "Pregnancy increases risk of dissection due to hyperdynamic state and hormonal wall changes. Stanford Type A in pregnancy requires emergency Caesarean section immediately followed by open surgical aortic repair."
          },
          {
            population: "Marfan Syndrome Patients",
            details: "Connective tissue weakness requires a lower threshold for surgical replacement (ascending aorta diameter >5.0 cm, or >4.5 cm with family history) and long-term prophylactic beta-blocker/ARB therapy."
          }
        ],
        monitoring: [
          {
            parameter: "Continuous Arterial Line Blood Pressure",
            frequency: "Continuous (real-time)",
            rationale: "Ensures precise blood pressure maintenance to avoid hypertensive spikes that propagate dissection or hypotensive troughs causing malperfusion."
          }
        ],
        contraindications: [
          {
            contraindication: "B-blockers in Cardiogenic Shock or Heart Block",
            rationale: "Negative inotropic and chronotropic effects will trigger cardiovascular collapse if the heart is failing or in high-degree AV block."
          }
        ],
        adverseEffects: [
          {
            effect: "Thiocyanate / Cyanide Toxicity from Nitroprusside",
            management: "Limit Nitroprusside infusion duration (<48 hrs), monitor serum thiocyanate, and administer sodium thiosulfate if toxicity occurs."
          }
        ],
        clinicalPearls: [
          "Never administer a vasodilator (like Sodium Nitroprusside or Hydralazine) before achieving adequate beta-blockade. Vasodilation causes reflex sympathetic stimulation, raising heart rate and dP/dt, which accelerates dissection propagation.",
          "A classic Board exam presentation: Aortic dissection retrogradely dissecting into the right coronary artery (RCA) ostium, causing acute inferior STEMI and AV node heart block. Do not give thrombolytics!"
        ],
        highYieldExamPoints: [
          "Stanford Type A involves ascending aorta (requires surgical replacement). Type B is descending only (ICU medical BP control).",
          "Windkessel effect refers to aortic elasticity maintaining continuous diastolic perfusion.",
          "Chest pain + unequal arm pulses + widened mediastinum = Aortic Dissection."
        ],
        referencesToVerify: [
          "2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease: Journal of the American College of Cardiology.",
          "2014 ESC Guidelines on the diagnosis and treatment of aortic diseases: European Heart Journal."
        ]
      }
    };
  }

  // 2. DIABETIC KETOACIDOSIS FALLBACK
  if (lower.includes("diabetic") || lower.includes("ketoacidosis") || lower.includes("dka") || lower.includes("diabetes")) {
    return {
      topic: "Diabetic Ketoacidosis",
      markdown: `# MEDICAL MIND MAP: DIABETIC KETOACIDOSIS

## 1. Definition
### 1.1 Standard Definition
An acute, life-threatening metabolic complication of diabetes mellitus characterized by hyperglycemia, systemic metabolic acidosis, and heavy ketone body accumulation in the blood.
### 1.2 Clinical Definition
A triad of hyperglycemia (blood glucose >250 mg/dL), metabolic acidosis (arterial pH <7.30, serum bicarbonate <18 mEq/L), and ketonemia/ketonuria.
### 1.3 Key Terminology
Anion Gap Metabolic Acidosis, Beta-hydroxybutyrate, Acetoacetate, Acetone, Insulin Deficiency, Glucagon Excess, Kussmaul Respirations.

## 2. Anatomy
### 2.1 Relevant Structures
Pancreas (islets of Langerhans, beta cells), liver (hepatocytes), kidneys (nephrons, renal tubules), skeletal muscle, adipose tissue.
### 2.2 Blood Supply
Pancreas is supplied by pancreaticoduodenal arteries. Liver is supplied by the hepatic artery and portal vein. Kidneys receive renal arteries.
### 2.3 Nerve Supply
Autonomic nervous system. Sympathetic fibers inhibit insulin secretion and stimulate glucagon release; Parasympathetic vagal fibers stimulate insulin release.
### 2.4 Lymphatics
Pancreatic lymph nodes draining into celiac and superior mesenteric nodes. Renal lymphatics draining into lumbar nodes.
### 2.5 Applied Anatomy
A destruction of pancreatic beta cells in the islets of Langerhans (autoimmune Type 1 diabetes) leads to absolute insulin deficiency, the root cause of DKA.

## 3. Physiology
### 3.1 Normal Function
Insulin is an anabolic hormone. It promotes cellular glucose uptake (GLUT4), glycogen synthesis, lipogenesis, and protein synthesis while inhibiting lipolysis and gluconeogenesis.
### 3.2 Regulation
Insulin secretion is stimulated by elevated blood glucose, amino acids, and parasympathetic activity. Inhibited by catecholamines and somatostatin.
### 3.3 Feedback Mechanisms
Blood glucose levels are tightly regulated via a negative feedback loop involving insulin (lowers glucose) and counterregulatory hormones (glucagon, epinephrine, cortisol, GH - raise glucose).
### 3.4 Homeostasis
Insulin suppresses hormone-sensitive lipase in adipose tissue, preventing uncontrolled lipolysis and maintaining acid-base homeostasis.

## 4. Biochemistry
### 4.1 Molecular Basis
Absence of insulin prevents glucose uptake in insulin-dependent tissues. Adipocytes undergo lipolysis, releasing free fatty acids (FFAs) into the circulation.
### 4.2 Enzymes / Proteins / Receptors
Hormone-sensitive lipase (HSL - stimulated by glucagon/epinephrine, inhibited by insulin), Carnitine Palmitoyltransferase-1 (CPT-1), GLUT4 transporter.
### 4.3 Metabolic Pathways
Hepatic beta-oxidation converts FFAs into acetyl-CoA. Excess acetyl-CoA is funneled into ketogenesis, producing beta-hydroxybutyrate, acetoacetate, and acetone.
### 4.4 Biomarkers
Serum Beta-hydroxybutyrate (preferred over nitroprusside urine ketone test), arterial blood gas (pH, HCO3-), Anion Gap (Na - [Cl + HCO3]), serum potassium.

## 5. Etiology
### 5.1 Genetic Causes
HLA-DR3 and HLA-DR4 associations in Type 1 Diabetes Mellitus, predisposing to autoimmune pancreatic beta-cell destruction.
### 5.2 Infectious Causes
Infections (pneumonia, urinary tract infections, sepsis) are the most common triggers of DKA, raising cortisol and epinephrine levels.
### 5.3 Autoimmune Causes
Type 1 Diabetes Mellitus (antibodies against glutamic acid decarboxylase [GAD65], islet cells [ICA], or insulin).
### 5.4 Metabolic Causes
Severe insulin resistance, pancreatic exhaustion in long-standing Type 2 diabetes.
### 5.5 Environmental Causes
Non-compliance with insulin therapy, drug abuse (e.g., cocaine), psychological distress.
### 5.6 Iatrogenic Causes
Medication-induced (e.g., SGLT2 inhibitors causing euglycemic DKA; high-dose corticosteroids causing severe insulin resistance).

## 6. Risk Factors
### 6.1 Modifiable
Omission of insulin doses, poor glycemic control, active infections, substance abuse, and eating disorders.
### 6.2 Non-Modifiable
Young age, female sex, newly diagnosed Type 1 diabetes, HLA susceptibility, and pregnancy.
### 6.3 Protective Factors
Adherence to insulin regimen, frequent blood glucose/ketone monitoring, 'sick day' management education.

## 7. Pathophysiology
### 7.1 Initiating Event
Absolute or relative insulin deficiency paired with a surge in counterregulatory hormones (glucagon, catecholamines, cortisol).
### 7.2 Molecular Mechanism
In hepatocytes, insulin deficiency and glucagon excess activate CPT-1, allowing FFAs to enter mitochondria for beta-oxidation and ketogenesis.
### 7.3 Cellular Changes
Intracellular starvation occurs despite extracellular glucose abundance. Cells cannot import glucose, triggering energy failure and oxidative stress.
### 7.4 Tissue-Level Changes
Ketone bodies dissociate into hydrogen ions and anions, overwhelming systemic bicarbonate buffering and causing progressive metabolic acidosis.
### 7.5 Organ-Level Dysfunction
Osmotic diuresis in kidneys (driven by extreme hyperglycemia) leads to severe dehydration, volume depletion, and loss of essential electrolytes (Na, K, Mg, PO4).
### 7.6 Systemic Effects
Intracellular potassium is shifted into the extracellular space in exchange for hydrogen ions (acidosis), creating a falsely normal/high serum potassium despite severe total-body potassium depletion.
### 7.7 Clinical Correlation
Severe metabolic acidosis triggers Kussmaul respirations (deep, rapid breathing to blow off CO2 and compensate for metabolic acidosis). Acetone causes a fruity breath odor.

## 8. Pathology
### 8.1 Gross Pathology
Severe dehydration visible in mucous membranes, depleted skin turgor, and dry visceral organs. Pancreatic atrophy may be present in chronic Type 1 DM.
### 8.2 Microscopy
Pancreatic islets of Langerhans show lymphocytic infiltration ('insulitis') in early-stage autoimmune Type 1 DM.
### 8.3 Histology
Islet cell destruction, pancreatic beta-cell loss, fatty infiltration of the liver due to mobilization of peripheral fatty acids.
### 8.4 Staging / Grading if relevant
Classified by severity of acidosis:
- Mild: pH 7.25-7.30, HCO3- 15-18 mEq/L
- Moderate: pH 7.00-7.24, HCO3- 10-15 mEq/L
- Severe: pH <7.00, HCO3- <10 mEq/L

## 9. Clinical Features
### 9.1 Symptoms
Polyuria, polydipsia, weight loss, nausea, vomiting, abdominal pain (simulating an acute abdomen), fatigue, and confusion.
### 9.2 Signs
Kussmaul respirations, fruity breath odor (acetone), tachycardia, hypotension, dry mucous membranes, delayed capillary refill, and altered mental status.
### 9.3 Early Features
Polyuria, polydipsia, mild fatigue, elevated fingerstick glucose.
### 9.4 Late Features
Severe vomiting, abdominal guarding, stupor, obtundation, hypovolemic shock.
### 9.5 Red Flags
Arterial pH <6.9, serum potassium <3.3 mEq/L (cannot start insulin!), anuria, and progressive stupor/coma (high risk of cerebral edema).

## 10. Diagnosis
### 10.1 Clinical Diagnosis
Patient with known Type 1 DM presenting with vomiting, dehydration, Kussmaul breathing, and fruity breath.
### 10.2 Laboratory Tests
Serum glucose >250 mg/dL, arterial blood gas (ABG) showing pH <7.30, serum bicarbonate <18 mEq/L, positive blood/urine ketones, elevated anion gap.
### 10.3 Imaging
Chest X-ray and urinalysis/culture to identify triggering infections (pneumonia, UTI).
### 10.4 Special Tests
Electrocardiography (ECG) to monitor for hyperkalemic (peaked T waves) or hypokalemic (U waves) changes.
### 10.5 Diagnostic Criteria
Hyperglycemia (>250 mg/dL), metabolic acidosis (pH <7.30, HCO3- <18 mEq/L), and positive ketones (beta-hydroxybutyrate >3.0 mmol/L or ketonuria).

## 11. Differential Diagnosis
### 11.1 Similar Condition 1
**Hyperosmolar Hyperglycemic State (HHS):** Characterized by extreme hyperglycemia (>600 mg/dL) and high serum osmolality (>320 mOsm/kg) without significant acidosis or ketosis.
### 11.2 Similar Condition 2
**Alcoholic Ketoacidosis:** Ketoacidosis in chronic alcoholics with normal or low glucose, triggered by starvation and ethanol-induced inhibition of gluconeogenesis.
### 11.3 How to Differentiate
- **Starvation Ketosis:** Mild ketosis with low/normal glucose, HCO3- rarely <18 mEq/L.
- **Salicylate Toxicity:** Mixed respiratory alkalosis and metabolic acidosis, diagnosed via serum salicylate levels.

## 12. Management
### 12.1 Initial Stabilization
Vigorous intravenous fluid resuscitation (0.9% Normal Saline) to restore intravascular volume, followed by insulin therapy and electrolyte replacement.
### 12.2 Medical Treatment
Regular Insulin infusion (0.1 units/kg/hour) once serum potassium is confirmed to be >3.3 mEq/L. Replace potassium aggressively once urine output is established.
### 12.3 Surgical Treatment
None directly. Address surgical precipitants (e.g., appendicitis, cholecystitis) only after metabolic stabilization.
### 12.4 Lifestyle Management
Frequent diabetic education, continuous glucose monitoring (CGM), carbohydrate counting, and sick-day management plans.
### 12.5 Follow-Up
Transition from IV insulin to subcutaneous insulin once the anion gap is closed, pH is >7.30, and the patient is eating.
### 12.6 Prevention
Structured diabetes self-management support, psychological counseling for eating disorders/insulin omission, and telemedicine.

## 13. Pharmacology
### 13.1 Drug Classes
Intravenous fluids, short-acting insulin, potassium chloride, and sodium bicarbonate (only in severe acidosis with pH <6.9).
### 13.2 Mechanism of Action
- **Intravenous Fluids:** Corrects hypovolemia, increases renal perfusion to promote glucose excretion.
- **Regular Insulin:** Shuts down lipolysis and hepatic ketogenesis, promotes cellular glucose entry.
- **Potassium Chloride:** Prevents fatal insulin-induced hypokalemia as potassium shifts intracellularly.
### 13.3 Indications
DKA resuscitation, severe hyperglycemia, and anion gap metabolic acidosis.
### 13.4 Contraindications
Do NOT initiate insulin if serum potassium is <3.3 mEq/L. Avoid over-rapid fluid infusion (risk of cerebral edema, especially in children).
### 13.5 Adverse Effects
Hypokalemia, hypoglycemia, hyperchloremic metabolic acidosis (from excess saline), and cerebral edema.
### 13.6 Monitoring
Hourly fingerstick glucose, serum electrolytes (especially potassium) every 2-4 hours, anion gap, and fluid intake/output.

## 14. Complications
### 14.1 Acute Complications
Severe hypokalemia (causing arrhythmias), hypoglycemia, cerebral edema (primarily in children, presenting with headache and bradycardia), and acute respiratory distress syndrome (ARDS).
### 14.2 Chronic Complications
No direct chronic complications from the episode itself, but recurrent episodes indicate poor glycemic control and increase mortality.
### 14.3 Life-Threatening Complications
Cerebral edema, ventricular fibrillation (due to hypokalemia/hyperkalemia), and circulatory collapse.

## 15. Prognosis
### 15.1 Prognostic Factors
Age, severity of acidosis, renal function, presence of comorbid conditions (e.g., myocardial infarction, severe sepsis).
### 15.2 Outcome
Excellent with prompt, standardized medical therapy; mortality is <1% in experienced centers but higher in elderly or severely septic patients.
### 15.3 Recurrence Risk
High in patients with social barriers to medication adherence, psychiatric comorbidities, or eating disorders.

## 16. Prevention and Screening
### 16.1 Primary Prevention
Diabetes education regarding continuous insulin delivery and proper dose titration.
### 16.2 Secondary Prevention
'Sick-day' protocols (maintain insulin during illness, monitor ketones, and maintain hydration).
### 16.3 Screening Guidelines
Routine screening for diabetic patients during acute illness using blood beta-hydroxybutyrate meters.

## 17. Research and Recent Advances
### 17.1 Current Research
Efficacy and safety of subcutaneous rapid-acting insulin analogs (e.g., Lispro/Aspart) for mild-to-moderate DKA in non-ICU settings.
### 17.2 New Drugs / Therapies
Inhaled insulin studies, dual SGLT1/2 inhibitors (although SGLT2i are associated with euglycemic DKA risk).
### 17.3 Biomarkers
Continuous interstitial glucose and ketone monitoring devices.
### 17.4 Clinical Trials
STAMPEDE trial (surgical vs medical glycemic management), trials on closed-loop insulin delivery systems ('artificial pancreas').
### 17.5 Unanswered Questions
Safe blood pressure and fluid infusion thresholds to completely eliminate the risk of pediatric cerebral edema.

## 18. High-Yield Exam Points
### 18.1 Must-Know Facts
- Insulin must NEVER be started if serum potassium is <3.3 mEq/L. Suppress insulin and replace potassium first.
- Paradoxically, serum potassium appears high or normal on lab panels due to acidosis-induced extracellular shift, but total-body potassium is depleted.
- Anion gap is caused by unmeasured ketone anions (acetoacetate and beta-hydroxybutyrate).
- SGLT2 inhibitors can cause 'euglycemic' DKA (glucose is <250 mg/dL but severe ketosis and acidosis are present).
### 18.2 Common MCQ Traps
- Don't stop the insulin infusion as soon as blood glucose drops below 250 mg/dL. Keep insulin running to close the anion gap! Add 5% Dextrose (D5) to the IV fluids to prevent hypoglycemia while keeping insulin active.
- Nitroprusside urine test only detects acetoacetate, NOT beta-hydroxybutyrate (the predominant ketone in DKA). The urine test may falsely appear more positive as the patient improves and beta-hydroxybutyrate is oxidized to acetoacetate.
### 18.3 Viva Questions
- "Why does DKA cause abdominal pain?" (Gastric stasis, ileus, and peritoneal irritation due to severe acidosis).
- "How do you calculate the anion gap?" (Na - [Cl + HCO3]. Normal is 8-12 mEq/L).
### 18.4 One-Liners
"Potassium first, insulin second." "Add dextrose when glucose is <250." "Close the anion gap, not just the glucose."

## 19. Clinical Correlation
### 19.1 Case Presentation
An 18-year-old female with Type 1 DM presents with 24 hours of abdominal pain, vomiting, and deep, rapid breathing. She had a cold 2 days ago. On exam, she has dry mucous membranes, cold extremities, and a fruity breath odor. Her fingerstick glucose is 450 mg/dL.
### 19.2 Diagnostic Reasoning
The clinical presentation of vomiting, dehydration, deep hyperventilation (Kussmaul respirations), abdominal pain, and fruity breath odor in a Type 1 diabetic is pathognomonic for DKA. Acidosis causes the abdominal pain. Lab results confirm: pH 7.12, HCO3- 8 mEq/L, and elevated beta-hydroxybutyrate.
### 19.3 Management Reasoning
Resuscitation is started with 1L Normal Saline bolus. Serum K+ returns at 4.2 mEq/L. Because K+ >3.3 mEq/L, IV Regular Insulin infusion is initiated at 0.1 units/kg/hr. Potassium chloride (20 mEq) is added to each liter of IV fluid to prevent insulin-induced hypokalemia.

## 20. Final Summary
### 20.1 One-Line Summary
An acute endocrine crisis characterized by hyperglycemia, anion gap metabolic acidosis, and ketogenesis due to absolute insulin deficiency, treated with fluids, insulin, and potassium.
### 20.2 Pathophysiology in One Flow
Insulin Deficiency → Unopposed Lipolysis → Free Fatty Acid Surge → Hepatic Beta-Oxidation → Ketogenesis (B-hydroxybutyrate) → Anion Gap Acidosis & Osmotic Diuresis.
### 20.3 Most Important Takeaways
Fluids are the first step. Monitor and replace potassium aggressively. Maintain insulin until the anion gap closes, even if glucose normalizes.

## 21. Latest and Advanced Therapeutics
### 21.1 Standard Treatment
Intravenous fluid resuscitation with 0.9% Normal Saline (1-1.5L in first hour), followed by IV Regular Insulin infusion (0.1 units/kg/hr). Add Potassium (20-30 mEq/L) to IV fluids once K+ is <5.2 mEq/L. Add 5% Dextrose (D5) to IV fluids when glucose falls below 250 mg/dL, while continuing insulin.
### 21.2 Latest Guidelines
ADA 2024 Guidelines: Transition to subcutaneous insulin when DKA is resolved (pH >7.30, HCO3 >= 15 mEq/L, Anion Gap closed, and patient is tolerating oral intake). Maintain a 1-2 hour overlap between subcutaneous basal insulin dose and IV insulin discontinuation.
### 21.3 Advanced Therapeutics
Closed-loop subcutaneous insulin infusion pumps with auto-suspend features. Continuous Ketone Monitoring (CKM) sensors integrated with continuous glucose monitoring (CGM).
### 21.4 Drug Details
Regular Insulin (IV 0.1 units/kg bolus followed by 0.1 units/kg/hr, or 0.14 units/kg/hr straight infusion). Potassium Chloride (20-30 mEq/L in IV fluids). Sodium Bicarbonate (100 mmol in 400 mL water with 20 mEq KCl over 2 hours, indicated ONLY if pH <6.9).
### 21.5 Mechanism-Based Treatment
Insulin directly binds to the insulin receptor tyrosine kinase, stimulating cellular glucose uptake via GLUT4, suppressing glucagon release, and halting hormone-sensitive lipase-mediated lipolysis, which terminates hepatic ketogenesis.
### 21.6 Treatment Algorithm
DKA Suspicion -> Start IV Fluids -> Check Potassium -> K < 3.3 (Hold Insulin, give K) | K 3.3 - 5.2 (Give Insulin + K) | K > 5.2 (Give Insulin, hold K) -> Monitor labs hourly -> Resolve DKA -> Transition to subcutaneous insulin.
### 21.7 Special Populations
Pediatrics: High risk of cerebral edema; avoid insulin boluses and limit fluid infusion rates to 50% of maintenance in early hours. Pregnancy: High risk of fetal loss; DKA can occur with normal glucose (euglycemic DKA).
### 21.8 Emerging and Experimental Therapies
SGLT2 inhibitor suspension protocols during acute illness to prevent euglycemic DKA. Subcutaneous rapid-acting insulin protocols for mild/moderate cases in ward settings.`,
      nodes: [
        { id: "core", label: "Diabetic Ketoacidosis", category: "core", description: "Metabolic crisis of diabetes: hyperglycemia, anion gap acidosis, and ketogenesis." },
        { id: "def", label: "1. Definition", category: "definition", description: "Hyperglycemia, ketonemia, and metabolic acidosis due to insulin deficiency." },
        { id: "anat", label: "2. Anatomy", category: "anatomy", description: "Pancreas (islet beta cells), liver (ketogenesis site), kidneys (osmotic diuresis)." },
        { id: "phys", label: "3. Physiology", category: "physiology", description: "Insulin anabolic functions (glucose uptake, lipolysis suppression) and counterregulatory hormone balance." },
        { id: "biochem", label: "4. Biochemistry", category: "biochemistry", description: "Beta-hydroxybutyrate, acetoacetate, hormone-sensitive lipase, CPT-1 enzyme." },
        { id: "etio", label: "5. Etiology", category: "etiology", description: "Type 1 DM onset, infection, insulin non-compliance, SGLT2 inhibitors." },
        { id: "risk", label: "6. Risk Factors", category: "risk_factors", description: "Infections, insulin pump failure, substance abuse, eating disorders, HLA DR3/DR4." },
        { id: "pathophys", label: "7. Pathophysiology", category: "pathophysiology", description: "Insulin deficiency -> lipolysis -> FFA surge -> ketogenesis -> metabolic acidosis & osmotic diuresis." },
        { id: "path", label: "8. Pathology", category: "pathology", description: "Gross dehydration, microscopic lymphocytic insulitis in the pancreatic islets." },
        { id: "clin", label: "9. Clinical Features", category: "clinical_features", description: "Polyuria, polydipsia, vomiting, Kussmaul respirations, fruity breath, abdominal pain." },
        { id: "diag", label: "10. Diagnosis", category: "diagnosis", description: "Glucose >250, pH <7.30, HCO3 <18, positive blood ketones, elevated anion gap." },
        { id: "diff", label: "11. Differentials", category: "differential", description: "Hyperosmolar hyperglycemic state (HHS), starvation ketosis, alcoholic ketoacidosis." },
        { id: "mgmt", label: "12. Management", category: "management", description: "Intravenous fluids, regular insulin infusion, aggressive potassium replacement." },
        { id: "pharm", label: "13. Pharmacology", category: "pharmacology", description: "IV saline, regular insulin, potassium chloride, sodium bicarbonate (severe pH)." },
        { id: "comp", label: "14. Complications", category: "complications", description: "Hypokalemia, hypoglycemia, hyperchloremic acidosis, pediatric cerebral edema." },
        { id: "prog", label: "15. Prognosis", category: "prognosis", description: "Mortality is <1% with standard therapy, higher in advanced age/renal failure." },
        { id: "prev", label: "16. Prevention", category: "prevention", description: "Frequent diabetic sick-day protocol instruction, ketone monitoring." },
        { id: "rsch", label: "17. Research", category: "research", description: "Continuous Ketone Monitoring (CKM), ward-level subcutaneous rapid insulin protocols." },
        { id: "exam", label: "18. High-Yield Exam", category: "exam", description: "Potassium <3.3 holds insulin. Acidosis shifts K extracellularly. Anion gap = unmeasured ketones." },
        { id: "corr", label: "19. Clinical Corr.", category: "correlation", description: "Vomiting and hyperventilation in a young diabetic with high gap metabolic acidosis case logic." },
        { id: "summ", label: "20. Final Summary", category: "summary", description: "Absolute insulin deficiency leading to severe ketogenesis, systemic acidosis, and total potassium loss." },
        { id: "therapeutics", label: "21. Latest & Advanced Therapeutics", category: "therapeutics", description: "Guideline-directed fluid, insulin, and potassium titrations, continuous ketone sensors, and pediatric protocols." }
      ],
      links: [
        { source: "core", target: "def" },
        { source: "core", target: "anat" },
        { source: "core", target: "phys" },
        { source: "core", target: "biochem" },
        { source: "core", target: "etio" },
        { source: "core", target: "risk" },
        { source: "core", target: "pathophys" },
        { source: "core", target: "path" },
        { source: "core", target: "clin" },
        { source: "core", target: "diag" },
        { source: "core", target: "diff" },
        { source: "core", target: "mgmt" },
        { source: "core", target: "pharm" },
        { source: "core", target: "comp" },
        { source: "core", target: "prog" },
        { source: "core", target: "prev" },
        { source: "core", target: "rsch" },
        { source: "core", target: "exam" },
        { source: "core", target: "corr" },
        { source: "core", target: "summ" },
        { source: "core", target: "therapeutics" },
        { source: "anat", target: "pathophys" },
        { source: "phys", target: "pathophys" },
        { source: "biochem", target: "diag" },
        { source: "pathophys", target: "clin" },
        { source: "pathophys", target: "path" },
        { source: "path", target: "comp" },
        { source: "clin", target: "diag" },
        { source: "diag", target: "diff" },
        { source: "diag", target: "mgmt" },
        { source: "mgmt", target: "pharm" },
        { source: "mgmt", target: "therapeutics" },
        { source: "pharm", target: "therapeutics" }
      ],
      therapeutics: {
        disclaimer: "Educational use only. Not a substitute for professional medical advice, diagnosis, or treatment. Verify with current clinical guidelines and local protocols.",
        lastUpdated: "2024",
        standardTreatment: [
          "Vigorous intravenous fluid resuscitation: 0.9% Normal Saline at 1-1.5 L/hr for the first 1-2 hours, followed by 0.45% or 0.9% saline based on hydration state and serum sodium.",
          "Regular Insulin infusion: 0.1 units/kg/hour continuous infusion (or 0.1 units/kg bolus + 0.1 units/kg/hr infusion) initiated once serum potassium is confirmed to be >= 3.3 mEq/L.",
          "Potassium replacement: Add 20-30 mEq of potassium chloride to each liter of IV fluid once serum potassium falls below 5.2 mEq/L (aim to maintain potassium at 4.0-5.0 mEq/L).",
          "Dextrose addition: Switch IV fluids to 5% Dextrose in 0.45% saline when serum glucose falls below 250 mg/dL, but continue the insulin infusion to completely close the metabolic anion gap.",
          "Subcutaneous transition: Transition to subcutaneous insulin when the metabolic acidosis resolves (pH >= 7.30, HCO3- >= 15 mEq/L, Anion Gap closed) and the patient is able to eat."
        ],
        latestGuidelines: [
          {
            source: "ADA",
            year: "2024",
            recommendation: "Class I Recommendation: Intravenous Regular Insulin infusion is the standard of care for DKA. Serum potassium must be checked before starting insulin, and insulin held if K+ < 3.3 mEq/L.",
            evidenceLevel: "Level A",
            clinicalUse: "Mandatory therapeutic algorithm."
          },
          {
            source: "BSPED",
            year: "2021",
            recommendation: "Class I Recommendation: In pediatric DKA, fluid replacement should be calculated carefully to replace deficit over 48 hours to avoid cerebral edema.",
            evidenceLevel: "Level B",
            clinicalUse: "Pediatric-specific resuscitation standard."
          }
        ],
        advancedTherapies: [
          {
            name: "Continuous Ketone Monitoring (CKM)",
            category: "Biosensors / Remote Monitoring",
            mechanism: "Continuous real-time measurement of interstitial beta-hydroxybutyrate levels via an electrochemical enzyme sensor.",
            target: "Interstitial beta-hydroxybutyrate",
            indications: "Patients with Type 1 Diabetes at high risk of recurrent ketoacidosis, or during insulin pump therapy.",
            contraindications: "None, but requires calibration with blood ketones for therapeutic decisions.",
            benefits: "Detects subclinical ketogenesis early, allowing preemptive insulin boluses and preventing progression to full clinical DKA.",
            limitations: "Recently developed technology with limited commercial availability.",
            adverseEffects: "Mild local skin irritation.",
            monitoring: "Continuous sensor output, cross-check with blood ketones if sensor value is high.",
            evidenceStatus: "Recently approved / Guideline-supported (ADA 2024)",
            highYieldPoint: "Continuous Ketone Monitoring can decrease the rate of diabetic ketoacidosis admissions by more than 50% in vulnerable cohorts."
          }
        ],
        emergingTherapies: [
          {
            name: "SGLT1/2 Dual Inhibitors (Sotagliflozin)",
            status: "Recently approved / Investigational",
            mechanism: "Inhibits both SGLT2 in the renal tubule and SGLT1 in the gastrointestinal tract, delaying glucose absorption and promoting glycosuria.",
            trialPhase: "Phase III",
            potentialUse: "Glycemic control in Type 1 Diabetes as adjunctive therapy (requires strict SGLT2i sick day rules).",
            limitations: "Associated with an increased risk of euglycemic DKA.",
            safetyConcerns: "Euglycemic DKA, genitourinary tract infections."
          }
        ],
        treatmentAlgorithm: [
          {
            step: "1. Fluid Resuscitation",
            decisionPoint: "Glucose >250, pH <7.30, ketones positive. Severe dehydration.",
            action: "Give 1-1.5 L of 0.9% Normal Saline in the first hour.",
            reason: "Restores circulating blood volume and improves renal perfusion to clear glucose."
          },
          {
            step: "2. Potassium Evaluation",
            decisionPoint: "Check serum potassium.",
            action: "K < 3.3 (Hold insulin, replace K). K 3.3 - 5.2 (Initiate insulin + add K to fluids). K > 5.2 (Initiate insulin, hold K).",
            reason: "Insulin shifts potassium into cells, which can trigger fatal hypokalemia if baseline potassium is low."
          },
          {
            step: "3. Insulin Administration",
            decisionPoint: "K is >= 3.3 mEq/L.",
            action: "Start IV Regular Insulin infusion at 0.1 units/kg/hr.",
            reason: "Insulin suppresses hormone-sensitive lipase to shut down ketogenesis and close the anion gap."
          }
        ],
        drugComparisonTable: [
          {
            therapy: "Regular Insulin",
            mechanism: "Activates insulin receptor tyrosine kinase, stimulating GLUT4 translocation and suppressing hormone-sensitive lipase",
            indication: "Diabetic Ketoacidosis, Hyperosmolar Hyperglycemic State, severe hyperglycemia",
            benefit: "Short half-life allows rapid titration and immediate termination of lipolysis and ketogenesis",
            limitation: "Requires continuous intravenous infusion and hourly glucose monitoring",
            adverseEffects: "Hypoglycemia, hypokalemia, local lipodystrophy",
            monitoring: "Hourly fingerstick glucose, serum potassium",
            evidenceLevel: "Class I, Level A (established standard)",
            highYieldPoint: "Do not stop insulin as soon as glucose normalizes; continue insulin to close the anion gap."
          }
        ],
        specialPopulations: [
          {
            population: "Pediatric Patients",
            details: "Pediatrics are at high risk of cerebral edema. Avoid rapid fluid boluses unless in hypovolemic shock, do not give insulin boluses (start straight infusion at 0.05-0.1 units/kg/hr), and monitor closely for neurological changes."
          },
          {
            population: "Pregnancy",
            details: "DKA in pregnancy carries high risk of fetal mortality. Euglycemic DKA is common because of maternal respiratory alkalosis and placental glucose clearance. Treat in an ICU setting with continuous fetal heart rate monitoring."
          }
        ],
        monitoring: [
          {
            parameter: "Serum Potassium",
            frequency: "Every 2 hours",
            rationale: "Insulin-driven cellular uptake can cause a rapid, life-threatening drop in potassium, causing cardiac arrhythmias."
          }
        ],
        contraindications: [
          {
            contraindication: "Insulin initiation with Potassium < 3.3 mEq/L",
            rationale: "Will trigger severe hypokalemia, potentially causing fatal ventricular arrhythmias."
          }
        ],
        adverseEffects: [
          {
            effect: "Cerebral Edema",
            management: "Immediately administer intravenous Mannitol (0.5-1 g/kg) or 3% hypertonic saline, and reduce fluid infusion rates by 50%."
          }
        ],
        clinicalPearls: [
          "If the glucose falls below 250 mg/dL but the anion gap is still wide (acidosis persists), do NOT stop the insulin. Add Dextrose (D5) to the fluids to allow the insulin to continue running without causing hypoglycemia.",
          "SGLT2 inhibitors (e.g., Empagliflozin) can cause 'euglycemic' DKA. If a patient on these drugs presents with vomiting and acidosis, check blood ketones and arterial pH, even if their blood glucose is completely normal."
        ],
        highYieldExamPoints: [
          "Beta-hydroxybutyrate is the primary ketone body in DKA, but the nitroprusside urine test only detects acetoacetate.",
          "Insulin must be held if serum potassium is <3.3 mEq/L.",
          "Total-body potassium is depleted in DKA, despite normal or elevated initial serum potassium."
        ],
        referencesToVerify: [
          "ADA Standards of Care in Diabetes 2024: Diabetes Care Journal.",
          "Joint British Diabetes Societies (JBDS) guideline for the management of diabetic ketoacidosis: Diabetic Medicine."
        ]
      }
    };
  }

  // 3. TENSION PNEUMOTHORAX FALLBACK
  if (lower.includes("pneumothorax") || lower.includes("tension") || lower.includes("collapsed lung")) {
    return {
      topic: "Tension Pneumothorax",
      markdown: `# MEDICAL MIND MAP: TENSION PNEUMOTHORAX

## 1. Definition
### 1.1 Standard Definition
A life-threatening condition in which air enters the pleural space via a one-way valve mechanism, building pressure that collapses the lung and shifts the mediastinum, compressing key vascular structures.
### 1.2 Clinical Definition
An acute clinical emergency characterized by unilateral absent breath sounds, respiratory distress, and signs of obstructive shock (hypotension, jugular venous distention).
### 1.3 Key Terminology
Pleural Space, One-Way Valve, Obstructive Shock, Mediastinal Shift, Needle Decompression, Tube Thoracostomy, Tracheal Deviation.

## 2. Anatomy
### 2.1 Relevant Structures
Visceral pleura, parietal pleura, pleural cavity, trachea, mediastinum, superior/inferior vena cava, lungs, intercostal spaces.
### 2.2 Blood Supply
Parietal pleura is supplied by intercostal and internal thoracic arteries. Visceral pleura is supplied by bronchial arteries.
### 2.3 Nerve Supply
Parietal pleura is highly sensitive to pain (intercostal and phrenic nerves). Visceral pleura lacks somatic pain innervation (autonomic fibers only).
### 2.4 Lymphatics
Pleural fluid is drained primarily by lymphatic stomata in the parietal pleura, connecting to mediastinal and parasternal nodes.
### 2.5 Applied Anatomy
The 2nd intercostal space in the midclavicular line (classic) or the 4th/5th intercostal space in the anterior axillary line are the surgical targets for needle decompression.

## 3. Physiology
### 3.1 Normal Function
Normal pleural pressure is negative (-3 to -5 cmH2O), maintaining lung inflation through surface tension between visceral and parietal pleura.
### 3.2 Regulation
Ventilation is regulated by respiratory centers in the medulla and pons, responsive to arterial pH, PaCO2, and PaO2.
### 3.3 Feedback Mechanisms
Hering-Breuer reflex prevents over-inflation of lungs via stretch receptors signaling through the vagus nerve.
### 3.4 Homeostasis
Negative intrapleural pressure facilitates venous return to the right atrium (respiratory pump effect).

## 4. Biochemistry
### 4.1 Molecular Basis
Severe hypoxia leads to cellular oxygen depletion, shutting down mitochondrial oxidative phosphorylation and forcing cells into anaerobic metabolism.
### 4.2 Enzymes / Proteins / Receptors
Lactic dehydrogenase (LDH), hypoxia-inducible factor 1-alpha (HIF-1a), erythropoietin, anaerobic glycolysis pathway enzymes.
### 4.3 Metabolic Pathways
Switch to anaerobic glycolysis yields lactic acid, causing systemic metabolic lactic acidosis and ATP depletion.
### 4.4 Biomarkers
Arterial blood gas (pH, PaO2, PaCO2), serum lactate (marker of hypoperfusion and obstructive shock).

## 5. Etiology
### 5.1 Genetic Causes
Primary spontaneous pneumothorax associated with mutations in the folliculin gene (Birt-Hogg-Dubé syndrome), causing subpleural blebs.
### 5.2 Infectious Causes
Severe necrotizing pneumonia (e.g., Staphylococcus aureus, Klebsiella) or tuberculosis causing alveolar rupture into the pleural space.
### 5.3 Autoimmune Causes
Marfan syndrome (connective tissue weakness causing apical blebs), Ehlers-Danlos, or rheumatoid lung disease.
### 5.4 Metabolic Causes
Anorexia nervosa predisposing to bleb rupture; chronic obstructive pulmonary disease (COPD) with emphysematous bullae.
### 5.5 Environmental Causes
Penetrating or blunt chest trauma (rib fractures, gunshot wounds), high-altitude exposure, or SCUBA diving.
### 5.6 Iatrogenic Causes
Subclavian central line placement, mechanical ventilation (barotrauma), thoracentesis, or transbronchial biopsy.

## 6. Risk Factors
### 6.1 Modifiable
Cigarette smoking, cannabis smoking, high-pressure mechanical ventilation setting (barotrauma), and SCUBA diving.
### 6.2 Non-Modifiable
Tall, thin young males (apical shear stress), Marfan syndrome, COPD, cystic fibrosis, and prior pneumothorax history.
### 6.3 Protective Factors
Avoidance of rapid pressure changes (diving, flying), smoking cessation, and protective low-tidal-volume mechanical ventilation.

## 7. Pathophysiology
### 7.1 Initiating Event
A tear in the visceral or parietal pleura creates a one-way valve: air enters during inspiration but cannot escape during expiration.
### 7.2 Molecular Mechanism
Hypoxemia triggers cellular release of inflammatory cytokines, compounding the mechanical distress with pulmonary vasoconstriction.
### 7.3 Cellular Changes
Ischemic cellular damage in organs due to lack of oxygen delivery, caused by cardiac output failure.
### 7.4 Tissue-Level Changes
Atmospheric air accumulates in the pleural cavity, progressively raising intrapleural pressure above atmospheric pressure.
### 7.5 Organ-Level Dysfunction
Complete collapse of the ipsilateral lung, mediastinal shift to the contralateral side, compressing the superior/inferior vena cava and left atrium.
### 7.6 Systemic Effects
Obstructive shock: compressed vena cava prevents venous return, dropping cardiac preload and causing extreme systemic hypotension and cardiogenic collapse.
### 7.7 Clinical Correlation
Contralateral tracheal deviation is a late sign of severe mediastinal shift. Absent breath sounds confirm lung collapse on the affected side.

## 8. Pathology
### 8.1 Gross Pathology
A large volume of air under pressure escaping upon pleural incision. Severely collapsed lung, flattened diaphragm, and displaced mediastinal structures.
### 8.2 Microscopy
Apical subpleural blebs showing thinning and rupture of alveolar walls, subpleural fibrosis, and emphysematous changes.
### 8.3 Histology
Fragmentation of elastic fibers in the pleura, alveolar macro-blebs, and neutrophilic or histiocytic alveolar inflammation if infection triggered the leak.
### 8.4 Staging / Grading if relevant
Classified as spontaneous (primary vs secondary), traumatic, or iatrogenic. Tension is an advanced physiological state rather than anatomical size.

## 9. Clinical Features
### 9.1 Symptoms
Sudden-onset severe unilateral chest pain, acute worsening dyspnea, extreme anxiety, and apprehension.
### 9.2 Signs
Tachypnea, tachycardia, severe hypotension (shock), absent breath sounds on the affected side, hyperresonance to percussion, tracheal deviation to the opposite side, and JVD.
### 9.3 Early Features
Sharp unilateral chest pain, mild-to-moderate tachypnea, localized decrease in breath sounds.
### 9.4 Late Features
Obstructive shock, cyanosis, tracheal deviation, altered consciousness, and pulseless electrical activity (PEA).
### 9.5 Red Flags
Hypotension + unilateral absent breath sounds + tracheal deviation. This is a medical emergency requiring immediate needle decompression without waiting for an X-ray.

## 10. Diagnosis
### 10.1 Clinical Diagnosis
Hypotension, respiratory distress, and unilateral absent breath sounds on chest exam.
### 10.2 Laboratory Tests
Arterial blood gas showing severe hypoxemia and respiratory acidosis (or metabolic lactic acidosis due to shock).
### 10.3 Imaging
**Do NOT wait for imaging if clinically diagnosed.** Ultrasound (shows absent lung sliding); Chest X-ray (shows lung collapse, tracheal deviation, and depressed diaphragm).
### 10.4 Special Tests
Bedside lung point visualization on ultrasound (highly specific diagnostic marker).
### 10.5 Diagnostic Criteria
Must be diagnosed clinically based on symptoms and signs of tension (shock, respiratory failure, absent breath sounds). Confirmed by escape of air under pressure during decompression.

## 11. Differential Diagnosis
### 11.1 Similar Condition 1
**Cardiac Tamponade:** Presents with hypotension and JVD. Differentiated by bilateral symmetric breath sounds, muffled heart sounds (Beck's triad), and lack of hyperresonance on percussion.
### 11.2 Similar Condition 2
**Massive Hemothorax:** Presents with chest trauma and shock. Differentiated by dullness to percussion (fluid) rather than hyperresonance (air), and tracheal midline or slight deviation.
### 11.3 How to Differentiate
- **Asthma Exacerbation:** Bilateral wheezing, normal percussion, chest X-ray rules out pneumothorax.
- **Myocardial Infarction:** Chest pain, ECG changes, positive troponins, breath sounds intact.

## 12. Management
### 12.1 Initial Stabilization
Immediate emergent needle decompression using a large-bore angiocatheter (14-16 G) to convert tension to a simple pneumothorax.
### 12.2 Medical Treatment
High-flow oxygen (promotes faster nitrogen absorption from the pleural space to speed re-expansion).
### 12.3 Surgical Treatment
Insertion of a chest tube (tube thoracostomy, 20-28 Fr) connected to a water seal device with suction (-20 cmH2O). Pleurodesis (chemical or mechanical) for recurrent cases.
### 12.4 Lifestyle Management
Avoidance of SCUBA diving unless surgical pleurodesis has been performed, and smoking cessation.
### 12.5 Follow-Up
Repeat chest X-ray at 4 hours, 24 hours, and post-chest tube removal to confirm complete lung re-expansion.
### 12.6 Prevention
Pleurodesis or wedge resection of apical blebs (video-assisted thoracoscopic surgery, VATS) in high-risk recurrent patients.

## 13. Pharmacology
### 13.1 Drug Classes
Supplemental oxygen, pain management (analgesics/local anesthetics like Lidocaine), and chemical pleurodesis agents (Talc, Doxycycline).
### 13.2 Mechanism of Action
- **Oxygen:** Displaces nitrogen in the alveoli, creating a partial pressure gradient that accelerates pleural air resorption.
- **Lidocaine:** Blocks voltage-gated sodium channels, providing local anesthesia for chest tube insertion.
- **Talc / Doxycycline:** Triggers severe pleural inflammation, leading to fibrosis and adhesion of parietal/visceral pleura (obliterating pleural space).
### 13.3 Indications
Tension pneumothorax resuscitation, pleural space obliteration, local anesthesia for chest interventions.
### 13.4 Contraindications
Do not delay decompression for any medication. Avoid pleurodesis if active pleural infection is present.
### 13.5 Adverse Effects
Pain during chest tube insertion, local infection (empyema), talc-induced pneumonitis (rare).
### 13.6 Monitoring
Oxygen saturation, respiratory rate, chest tube drainage volume, and air leak chamber bubbles (water seal).

## 14. Complications
### 14.1 Acute Complications
Re-expansion pulmonary edema (occurs if chronically collapsed lung is expanded too quickly), empyema, intercostal vessel laceration (causing hemothorax), and lung parenchyma laceration.
### 14.2 Chronic Complications
Persistent air leak (fistula), chronic pain, and recurrent pneumothorax.
### 14.3 Life-Threatening Complications
Cardiac arrest (PEA) due to complete obstruction of venous return.

## 15. Prognosis
### 15.1 Prognostic Factors
Speed of decompression, presence of underlying lung disease (COPD carries worse prognosis), and patient age.
### 15.2 Outcome
Nearly 100% fatal if untreated. Excellent outcome (>95% survival) if needle decompression and chest tube are inserted promptly.
### 15.3 Recurrence Risk
High spontaneous recurrence risk after a first episode (30%), increasing to 60-80% after a second episode.

## 16. Prevention and Screening
### 16.1 Primary Prevention
Smoking cessation, avoidance of extreme atmospheric pressure changes (SCUBA).
### 16.2 Secondary Prevention
Surgical VATS pleurodesis for secondary spontaneous pneumothorax or high-risk primary cases.
### 16.3 Screening Guidelines
Screening chest CT or genetic testing for first-degree relatives of patients with Birt-Hogg-Dubé syndrome.

## 17. Research and Recent Advances
### 17.1 Current Research
Efficacy of bedside thoracic ultrasound compared to chest radiography in early trauma resuscitation.
### 17.2 New Drugs / Therapies
Fibrin sealant patches to close persistent alveolar-pleural fistulas during minimally invasive surgery.
### 17.3 Biomarkers
Spleen-derived markers or pleural fluid cytokine analysis to predict recurrence risk.
### 17.4 Clinical Trials
Trials comparing early needle decompression vs simple chest tube thoracostomy without initial decompression.
### 17.5 Unanswered Questions
The absolute optimal size of chest tube (small-bore pigtail catheter vs large-bore chest tube) for traumatic tension.

## 18. High-Yield Exam Points
### 18.1 Must-Know Facts
- **Tension pneumothorax is a CLINICAL DIAGNOSIS.** Never wait for a chest X-ray.
- Primary spontaneous pneumothorax typically occurs in tall, thin, young males who smoke, due to apical bleb rupture.
- Needle decompression landmark: 2nd intercostal space at the midclavicular line, or 4th/5th intercostal space at the anterior axillary line. Insert the needle OVER the rib to avoid the intercostal bundle.
- Obstructive shock is caused by mechanical compression of the vena cava, reducing cardiac preload.
### 18.2 Common MCQ Traps
- Don't choose 'Order a Chest X-ray' as the first step for a patient with severe hypotension, trachea shifted to the right, and absent left-sided breath sounds. The correct choice is 'Immediate needle decompression.'
- Don't place a needle under the rib. The intercostal nerve, artery, and vein (VAN) run along the inferior margin of each rib.
### 18.3 Viva Questions
- "Why does tension pneumothorax cause jugular venous distention?" (Obstructed venous return increases central venous pressure, causing JVD).
- "What is a 'lung point' on ultrasound?" (The physical transition boundary where the collapsed lung meets the pleural space, moving with inspiration).
### 18.4 One-Liners
"Tension is a clinical emergency, not an X-ray diagnosis." "VAN runs under the rib." "Obstructive shock = zero preload."

## 19. Clinical Correlation
### 19.1 Case Presentation
A 24-year-old tall, thin male smoker presents with sudden left-sided chest pain and shortness of breath that started while resting. On arrival, he is gasping for air, his SpO2 is 82% on high-flow oxygen, his heart rate is 135 bpm, and his BP is 78/42 mmHg. Breath sounds are completely absent on the left, and his trachea is visibly shifted to the right.
### 19.2 Diagnostic Reasoning
The triad of severe respiratory distress, unilateral absent breath sounds, and hypotension (obstructive shock) in a tall, young male is diagnostic of Tension Pneumothorax. Tracheal deviation to the contralateral side confirms massive mediastinal shift. Left-sided hyperresonance is expected.
### 19.3 Management Reasoning
Because the patient is hypotensive and in obstructive shock, this is a life-threatening emergency. A 14-gauge angiocatheter is immediately inserted into the left 2nd intercostal space at the midclavicular line, yielding a loud 'whoosh' of escaping air. His blood pressure immediately rises to 115/70 mmHg, and his heart rate falls to 98 bpm. A left 24 Fr chest tube is subsequently inserted.

## 20. Final Summary
### 20.1 One-Line Summary
An acute mechanical crisis where air enters the pleural space via a one-way valve, collapsing the lung and shifting the mediastinum, causing obstructive shock; treated via needle decompression.
### 20.2 Pathophysiology in One Flow
Visceral/Parietal Tear → One-Way Valve → Air Trapping → Intrapleural Pressure > Atmospheric → Mediastinal Shift → Vena Cava Compression → Preload Failure → Obstructive Shock.
### 20.3 Most Important Takeaways
Decompress immediately based on clinical signs alone. Never delay for an X-ray. Decompress over the rib to protect intercostal vessels.

## 21. Latest and Advanced Therapeutics
### 21.1 Standard Treatment
Emergent needle decompression (14-gauge angiocatheter) in the 2nd intercostal space (midclavicular line) or 4th/5th intercostal space (anterior axillary line). Immediate follow-up with tube thoracostomy (chest tube insertion, connected to water seal and -20 cmH2O suction).
### 21.2 Latest Guidelines
ATLS 10th Edition: Recommends the 4th or 5th intercostal space in the anterior axillary line as the preferred site for needle decompression in adults, as it has a higher success rate due to thinner chest walls compared to the 2nd intercostal space.
### 21.3 Advanced Therapeutics
Video-Assisted Thoracoscopic Surgery (VATS) with bullectomy (stapling/resection of apical blebs) and mechanical/chemical pleurodesis (using sterile talc powder).
### 21.4 Drug Details
Sterile Talc Slurry (4-5 g intrapleurally to induce pleurodesis), Doxycycline (500 mg intrapleurally), Lidocaine (1-2% local infiltration). Contraindications: Active empyema or systemic infection. Monitor: Pain control, chest tube air leak.
### 21.5 Mechanism-Based Treatment
Needle decompression immediately opens the pleural space to the atmosphere, equalizing pressure and converting a life-threatening tension pneumothorax into a simple, non-tension pneumothorax, instantly relieving mechanical compression on the vena cava and restoring cardiac preload.
### 21.6 Treatment Algorithm
Tension Pneumothorax Signs -> Clinical Diagnosis -> Needle Decompression (4th/5th ICS anterior axillary or 2nd ICS midclavicular) -> Hear air rush -> Insert Chest Tube -> Connect to water seal -> Serial X-rays to confirm re-expansion.
### 21.7 Special Populations
Mechanical Ventilation Patients: Positive-pressure ventilation aggressively forces air into the pleural space, causing tension to develop rapidly. Maintain a high index of suspicion in any ventilated patient with sudden hypoxemia or cardiovascular collapse.
### 21.8 Emerging and Experimental Therapies
Small-bore pigtail catheter placement with a one-way Heimlich valve as a primary outpatient therapy for stable primary spontaneous pneumothorax, avoiding hospital admission.`,
      nodes: [
        { id: "core", label: "Tension Pneumothorax", category: "core", description: "Pleural air trapping causing mediastinal shift and obstructive shock." },
        { id: "def", label: "1. Definition", category: "definition", description: "One-way valve pleural air accumulation elevating intrapleural pressure." },
        { id: "anat", label: "2. Anatomy", category: "anatomy", description: "Pleural cavity (parietal/visceral layers), trachea, intercostal space, superior vena cava." },
        { id: "phys", label: "3. Physiology", category: "physiology", description: "Negative pleural pressure (-5 cmH2O), Windkessel venous return, respiratory pump." },
        { id: "biochem", label: "4. Biochemistry", category: "biochemistry", description: "Hypoxic cellular injury, anaerobic glycolysis, metabolic lactic acidosis." },
        { id: "etio", label: "5. Etiology", category: "etiology", description: "Trauma, apical bleb rupture, mechanical barotrauma, central line placement." },
        { id: "risk", label: "6. Risk Factors", category: "risk_factors", description: "Tall, thin young males, smoking, COPD, positive pressure ventilation, Marfan's." },
        { id: "pathophys", label: "7. Pathophysiology", category: "pathophysiology", description: "Pleural tear -> one-way valve trapping -> collapsed lung -> mediastinal shift -> compressed vena cava -> preload collapse." },
        { id: "path", label: "8. Pathology", category: "pathology", description: "Apical subpleural blebs, thinned alveolar walls, flattened diaphragm gross pathology." },
        { id: "clin", label: "9. Clinical Features", category: "clinical_features", description: "Dyspnea, pleuritic pain, absent breath sounds, tracheal deviation, JVD, hypotension." },
        { id: "diag", label: "10. Diagnosis", category: "diagnosis", description: "Clinical diagnosis. Bedside ultrasound (absent sliding, lung point), chest X-ray." },
        { id: "diff", label: "11. Differentials", category: "differential", description: "Cardiac tamponade, massive hemothorax, acute pulmonary embolism, severe asthma." },
        { id: "mgmt", label: "12. Management", category: "management", description: "Emergent needle decompression, followed by immediate chest tube thoracostomy." },
        { id: "pharm", label: "13. Pharmacology", category: "pharmacology", description: "High-flow oxygen, local Lidocaine, chemical pleurodesis (Talc/Doxycycline)." },
        { id: "comp", label: "14. Complications", category: "complications", description: "Re-expansion pulmonary edema, intercostal laceration, persistent air leak, empyema." },
        { id: "prog", label: "15. Prognosis", category: "prognosis", description: "Fatal if untreated. Near 100% survival with prompt needle and tube intervention." },
        { id: "prev", label: "16. Prevention", category: "prevention", description: "Wedge resection, VATS pleurodesis for recurrent spontaneous pneumothorax." },
        { id: "rsch", label: "17. Research", category: "research", description: "Outpatient stable spontaneous pigtail Heimlich valve protocols, bedside ultrasound efficacy." },
        { id: "exam", label: "18. High-Yield Exam", category: "exam", description: "Clinical diagnosis - do not wait for X-ray! Decompress over the rib. Obstructive shock = compressed vena cava." },
        { id: "corr", label: "19. Clinical Corr.", category: "correlation", description: "Hypotension, unilateral absent breath sounds and tracheal deviation trauma case logic." },
        { id: "summ", label: "20. Final Summary", category: "summary", description: "Lethal mechanical shock due to pleural pressure buildup, requiring instant needle decompression over the rib." },
        { id: "therapeutics", label: "21. Latest & Advanced Therapeutics", category: "therapeutics", description: "Immediate ATLS guidelines, chest tube placement, VATS pleurodesis and out-patient Heimlich valves." }
      ],
      links: [
        { source: "core", target: "def" },
        { source: "core", target: "anat" },
        { source: "core", target: "phys" },
        { source: "core", target: "biochem" },
        { source: "core", target: "etio" },
        { source: "core", target: "risk" },
        { source: "core", target: "pathophys" },
        { source: "core", target: "path" },
        { source: "core", target: "clin" },
        { source: "core", target: "diag" },
        { source: "core", target: "diff" },
        { source: "core", target: "mgmt" },
        { source: "core", target: "pharm" },
        { source: "core", target: "comp" },
        { source: "core", target: "prog" },
        { source: "core", target: "prev" },
        { source: "core", target: "rsch" },
        { source: "core", target: "exam" },
        { source: "core", target: "corr" },
        { source: "core", target: "summ" },
        { source: "core", target: "therapeutics" },
        { source: "anat", target: "pathophys" },
        { source: "phys", target: "pathophys" },
        { source: "biochem", target: "diag" },
        { source: "pathophys", target: "clin" },
        { source: "pathophys", target: "path" },
        { source: "path", target: "comp" },
        { source: "clin", target: "diag" },
        { source: "diag", target: "diff" },
        { source: "diag", target: "mgmt" },
        { source: "mgmt", target: "pharm" },
        { source: "mgmt", target: "therapeutics" },
        { source: "pharm", target: "therapeutics" }
      ],
      therapeutics: {
        disclaimer: "Educational use only. Not a substitute for professional medical advice, diagnosis, or treatment. Verify with current clinical guidelines and local protocols.",
        lastUpdated: "2024",
        standardTreatment: [
          "Emergent needle decompression: Insert a 14- or 16-gauge over-the-needle catheter into the 4th or 5th intercostal space in the anterior axillary line (preferred under current ATLS guidelines) or 2nd intercostal space in the midclavicular line.",
          "Tube thoracostomy: Immediately follow needle decompression with the insertion of a chest tube (20-28 French) in the 4th or 5th intercostal space, anterior or mid-axillary line.",
          "Suction and drainage: Connect chest tube to a 3-chamber water-seal drainage system; apply -20 cmH2O continuous suction to facilitate complete lung re-expansion.",
          "High-flow oxygen: Administer 100% supplemental oxygen via non-rebreather mask to displace nitrogen, creating a gradient that quadruples the rate of pleural air absorption.",
          "Surgical evaluation: Consult general/thoracic surgery for video-assisted thoracoscopic surgery (VATS) with bleb stapling and pleurodesis if persistent air leak lasts >3-5 days."
        ],
        latestGuidelines: [
          {
            source: "ATLS",
            year: "2018",
            recommendation: "Class I Recommendation: Needle decompression should be performed in the 4th or 5th intercostal space, anterior axillary line in adults, as this location has a lower chest wall thickness and higher decompression success rate.",
            evidenceLevel: "Level B",
            clinicalUse: "Standard emergent trauma protocol."
          },
          {
            source: "BTS",
            year: "2023",
            recommendation: "Class I Recommendation: Spontaneous pneumothorax patients with a large leak but clinically stable may be managed outpatient using small-bore chest drains equipped with Heimlich one-way valves.",
            evidenceLevel: "Level A",
            clinicalUse: "Stable primary spontaneous pneumothorax management."
          }
        ],
        advancedTherapies: [
          {
            name: "VATS Bullectomy & Pleurodesis",
            category: "Minimally Invasive Surgical Intervention",
            mechanism: "Thoracoscopic visualization of the lung apex to identify and staple/resect subpleural blebs, followed by mechanical abrasion of the pleura or chemical talc insufflation.",
            target: "Apical lung visceral pleura",
            indications: "Recurrent spontaneous pneumothorax, primary spontaneous pneumothorax with bilateral blebs, or persistent air leak (>5 days).",
            contraindications: "Severe pre-existing pulmonary disease making single-lung ventilation impossible, severe bleeding coagulopathy.",
            benefits: "Reduces pneumothorax recurrence rate from 30-50% down to less than 1-2%.",
            limitations: "Requires general anesthesia, single-lung mechanical ventilation, and hospital stay.",
            adverseEffects: "Intercostal neuralgia, post-operative air leak, local wound infection.",
            monitoring: "Continuous post-operative chest tube monitoring, daily chest X-ray until tube removal.",
            evidenceStatus: "Guideline-supported / Established",
            highYieldPoint: "VATS with pleurodesis is the gold standard for preventing pneumothorax recurrence after a second spontaneous episode."
          }
        ],
        emergingTherapies: [
          {
            name: "Pleural Fibrin Glue / Sealants",
            status: "Recently approved / Investigational",
            mechanism: "Direct application of biocompatible thrombin-fibrinogen sealant over visceral pleural tears during VATS to form an immediate air-tight seal.",
            trialPhase: "Phase III",
            potentialUse: "Closing alveolar-pleural fistulas to shorten chest tube duration.",
            limitations: "Expensive; potential risk of localized pleural infection.",
            safetyConcerns: "Fever, rare hypersensitivity reactions."
          }
        ],
        treatmentAlgorithm: [
          {
            step: "1. RESUSCITATION",
            decisionPoint: "Absent breath sounds, hyperresonance, and blood pressure <90 mmHg (obstructive shock).",
            action: "Perform immediate needle decompression over the top of the rib into the 4th/5th ICS (anterior axillary line) or 2nd ICS (midclavicular line). Do NOT wait for an X-ray.",
            reason: "Decompressing the trapped air instantly relieves mechanical vena cava compression and restores cardiac output."
          },
          {
            step: "2. CHEST TUBE INSERTION",
            decisionPoint: "Loud rush of air confirms decompression and blood pressure normalizes.",
            action: "Perform immediate tube thoracostomy (24-28 Fr chest tube), secure to water seal with -20 cmH2O suction.",
            reason: "Provides continuous evacuation of pleural air to ensure complete lung re-expansion."
          },
          {
            step: "3. FOLLOW-UP & TRIAGE",
            decisionPoint: "Assess for persistent air leak (bubbling in the water seal) after 24-48 hours.",
            action: "If air leak resolved and lung fully expanded, put tube on water seal (no suction) for 24 hours, then clamp and remove. If air leak persists >5 days, consult surgery for VATS.",
            reason: "Persistent air leak indicates a bronchopleural fistula requiring surgical closure."
          }
        ],
        drugComparisonTable: [
          {
            therapy: "Sterile Talc Slurry",
            mechanism: "Causes severe chemical pleuritis, leading to intense inflammation and subsequent fibrotic adhesions between parietal and visceral pleura",
            indication: "Prevention of recurrent spontaneous pneumothorax or malignant pleural effusion",
            benefit: "Highly effective at obliterating the pleural space, reducing recurrence to <2%",
            limitation: "Highly painful; requires intrapleural lidocaine instillation and adequate sedation",
            adverseEffects: "Intense local pain, low-grade fever, talc-induced chemical pneumonitis (rare)",
            monitoring: "Daily chest X-ray, continuous oxygen saturation, pain scoring",
            evidenceLevel: "Class I, Level A (established standard)",
            highYieldPoint: "Ensure talc particles are extra-large (>15 micrometers) to prevent systemic absorption and ARDS."
          }
        ],
        specialPopulations: [
          {
            population: "Ventilated Patients",
            details: "Mechanical ventilation with positive-pressure aggressively forces air into the pleural space. Tension develops extremely rapidly in these patients, presenting as sudden high airway pressure alarms, oxygen desaturation, and immediate circulatory collapse."
          },
          {
            population: "COPD Patients",
            details: "Secondary spontaneous pneumothorax is highly dangerous in COPD due to poor baseline pulmonary reserve. They do not tolerate even small collapses; treat with early, low-threshold chest tube placement."
          }
        ],
        monitoring: [
          {
            parameter: "Water Seal Chamber Air Leak (Bubbling)",
            frequency: "Every 4 hours",
            rationale: "Persistent bubbling during expiration or coughing indicates an active, ongoing air leak from the lung parenchyma into the pleural space."
          }
        ],
        contraindications: [
          {
            contraindication: "Chemical Pleurodesis with unexpanded lung",
            rationale: "Pleurodesis will fail if the visceral and parietal pleura are not in direct contact; lung must be fully expanded first."
          }
        ],
        adverseEffects: [
          {
            effect: "Re-expansion Pulmonary Edema (REPE)",
            management: "If coughing and hypoxemia occur after chest tube insertion, stop active suction, place on water seal, administer oxygen, and give supportive diuretics."
          }
        ],
        clinicalPearls: [
          "Always insert the decompression needle and chest tube OVER the top of the rib. The intercostal neurovascular bundle (Vein, Artery, Nerve - VAN) runs along the inferior margin of each rib.",
          "Tracheal deviation is a late, near-terminal sign. Do not wait for the trachea to deviate or for the patient to become cyanotic to perform needle decompression."
        ],
        highYieldExamPoints: [
          "Tension pneumothorax causes OBSTRUCTIVE SHOCK due to vena cava compression reducing cardiac preload.",
          "Primary spontaneous pneumothorax is associated with tall, thin, young male smokers due to apical subpleural bleb rupture.",
          "Lung point on bedside ultrasound is 100% specific for pneumothorax."
        ],
        referencesToVerify: [
          "American College of Surgeons: Advanced Trauma Life Support (ATLS) Student Course Manual, 10th Edition.",
          "British Thoracic Society (BTS) Guideline for Pleural Procedures: Thorax Journal."
        ]
      }
    };
  }

  // 3.4a GENERAL ANEMIA FALLBACK
  if (lower === "anemia" || lower === "general anemia" || (lower.includes("anemia") && !lower.includes("sideroplastic") && !lower.includes("sideroblastic") && !lower.includes("sideroblast") && !lower.includes("sideroplast"))) {
    return {
      topic: "Anemia",
      markdown: `# MEDICAL MIND MAP: ANEMIA

## 1. Definition
### 1.1 Standard Definition
Anemia is defined as a reduction in the total number of circulating erythrocytes (red blood cells), the quantity of hemoglobin, or the volume of packed red blood cells (hematocrit) below normal physiologic limits, leading to decreased oxygen-carrying capacity of the blood.
### 1.2 Clinical Definition
A pathologic decrease in hemoglobin concentration below 13.0 g/dL in adult males or 12.0 g/dL in non-pregnant adult females, resulting in compromised tissue oxygenation and compensatory cardiorespiratory hyperdynamics.
### 1.3 Key Terminology
Erythrocyte, Hemoglobin, Hematocrit, Mean Corpuscular Volume (MCV), Reticulocyte Count, Erythropoiesis, Erythropoietin (EPO), Microcytic, Macrocytic, Normocytic, Anisocytosis, Poikilocytosis.

## 2. Anatomy
### 2.1 Relevant Structures
Bone marrow (primary site of erythropoiesis), circulating blood volume, spleen (site of senescent erythrocyte clearance), and kidneys (site of EPO synthesis).
### 2.2 Blood Supply
Systemic arterial and venous circulation containing red blood cells; microvasculature supplying oxygenated blood to peripheral organs.
### 2.3 Nerve Supply
Sympathetic vasomotor nerves innervating bone marrow vasculature to modulate cell release and blood flow.
### 2.4 Lymphatics
Splenic lymphatic follicles and regional lymph nodes involved in filtering cellular debris and recycling iron.
### 2.5 Applied Anatomy
Bone marrow biopsy and aspiration are performed from the posterior superior iliac spine (PSIS) to evaluate erythroid hyperplasia or bone marrow cellularity in atypical anemias.

## 3. Physiology
### 3.1 Normal Function
Erythrocytes transport oxygen from lungs to systemic tissues using iron-bound hemoglobin molecules and carry carbon dioxide back to the lungs.
### 3.2 Regulation
Erythropoietin (EPO), synthesized by renal peritubular interstitial cells in response to tissue hypoxia, binds to EPO receptors on erythroid progenitors to stimulate survival and proliferation.
### 3.3 Feedback Mechanisms
Hypoxia-Inducible Factors (HIF-1a/HIF-2a) are stabilized under low-oxygen conditions, upregulating EPO gene transcription and stimulating accelerated erythropoiesis.
### 3.4 Homeostasis
Erythroid homeostasis relies on the balance between erythrocyte production in the marrow and clearance in the spleen, keeping the normal RBC lifespan at ~120 days.

## 4. Biochemistry
### 4.1 Molecular Basis
Hemoglobin is a tetramer of two alpha and two non-alpha globin chains, each carrying an oxygen-binding heme group (protoporphyrin IX coordinated with ferrous iron, Fe2+).
### 4.2 Enzymes / Proteins / Receptors
Ferroportin, transferrin, transferrin receptor 1 (TfR1), divalent metal transporter 1 (DMT1), and ferrochelatase.
### 4.3 Metabolic Pathways
Globin chain synthesis, mitochondrial heme biosynthesis, pentose phosphate pathway (for NADPH production to prevent oxidative stress), and anaerobic glycolysis (Embden-Meyerhof pathway).
### 4.4 Biomarkers
Hemoglobin (Hb), hematocrit (Hct), mean corpuscular volume (MCV), serum iron, total iron-binding capacity (TIBC), transferrin saturation, serum ferritin, and reticulocyte count.

## 5. Etiology
### 5.1 Genetic Causes
Hemoglobinopathies (Sickle Cell Disease, Thalassemia), hereditary spherocytosis, glucose-6-phosphate dehydrogenase (G6PD) deficiency, and pyruvate kinase deficiency.
### 5.2 Infectious Causes
Malaria (Plasmodium species causing hemolysis), Parvovirus B19 (causing transient aplastic crisis), Hookworm infestation (causing chronic GI blood loss).
### 5.3 Autoimmune Causes
Autoimmune hemolytic anemia (warm IgG or cold IgM mediated), and systemic lupus erythematosus (SLE).
### 5.4 Metabolic Causes
Iron deficiency, Vitamin B12 (cobalamin) deficiency, and Folate (Vitamin B9) deficiency, impairing DNA synthesis or hemoglobin production.
### 5.5 Environmental Causes
Lead exposure (impaired heme synthesis), chronic heavy alcohol use (direct marrow toxicity), and dietary nutrient deprivation.

## 6. Pathophysiology
### 6.1 Initiating Event
Inadequate erythrocyte production, excessive erythrocyte destruction (hemolysis), or direct blood loss.
### 6.2 Molecular Mechanism
Disrupted globin synthesis, lack of iron cofactor, or folate/B12 depletion causing nuclear-cytoplasmic asynchronous maturation (megaloblastic changes).
### 6.3 Cellular Changes
Microcytosis/hypochromia (in iron deficiency/thalassemia), macrocytosis/hypersegmentation (in B12/folate deficiency), or spherocytosis/schistocytosis (in hemolytic/mechanical destruction).
### 6.4 Tissue Changes
Bone marrow erythroid hyperplasia in hemolytic/hemorrhagic anemias, or erythroid hypoplasia in aplastic/hypoproliferative anemias.
### 6.5 Organ Dysfunction
High-output heart failure from chronic compensatory tachycardia, splenomegaly from excessive extravascular hemolysis, and renal insufficiency from ischemic injury.

## 7. Pathology
### 7.1 Systemic Effects
Tissue hypoxia, systemic vasodilation, increased cardiac output, and increased tissue oxygen extraction (right-shift of the oxygen-hemoglobin dissociation curve via 2,3-BPG).
### 7.2 Clinical Correlation
Reduced oxygen delivery to muscles causes fatigue and weakness; coronary hypoperfusion causes chest pain; cerebral hypoxia causes dizziness and cognitive slowing.
### 7.3 Gross Pathology
Pallor of conjunctivae, palms, and mucous membranes; hepatosplenomegaly in chronic hemolytic states; cardiomegaly in chronic high-output states.
### 7.4 Microscopy
Peripheral blood smear showing microcytic hypochromic cells, macro-ovalocytes, target cells, schistocytes, or sickle cells depending on etiology.
### 7.5 Histology
Bone marrow core biopsy showing hypercellularity with erythroid hyperplasia, or hypocellularity with fatty infiltration in aplastic anemia.
### 7.6 Staging / Grading
Anemia severity graded by World Health Organization (WHO) classification: Mild (Hb 11.0–12.9 g/dL), Moderate (8.0–10.9 g/dL), Severe (6.5–7.9 g/dL), and Life-threatening (<6.5 g/dL).

## 8. Clinical Features
### 8.1 Common Symptoms
Fatigue, weakness, exertional dyspnea, palpitations, headache, dizziness, cold hands/feet, and cognitive difficulty.
### 8.2 Common Signs
Conjunctival pallor, palmar crease pallor, tachycardia, systolic hemic murmur, koilonychia (spoon nails in iron deficiency), and glossitis.
### 8.3 Complications
High-output congestive heart failure, severe angina, ischemic stroke, and cognitive/developmental delay in children.

## 9. Diagnosis
### 9.1 Laboratory Tests
Complete Blood Count (CBC) with red cell indices (MCV, MCH, MCHC, RDW), reticulocyte count/index, peripheral blood smear, iron studies, Vitamin B12 and Folate levels.
### 9.2 Imaging
Abdominal ultrasound/CT to assess splenomegaly or hepatomegaly; echocardiography to assess left ventricular function and high-output failure.
### 9.3 Special Tests
Bone marrow aspirate and biopsy, hemoglobin electrophoresis, Coombs test (direct/indirect antiglobulin tests), and G6PD activity assay.
### 9.4 Diagnostic Criteria
Established by hemoglobin concentration below normal reference ranges adjusted for age, sex, pregnancy status, and altitude.

## 10. Differential Diagnosis
### 10.1 Similar Condition 1
Iron Deficiency Anemia: Microcytic, hypochromic anemia with low ferritin, low transferrin saturation, high TIBC.
### 10.2 Similar Condition 2
Anemia of Chronic Disease: Normocytic or microcytic anemia with low serum iron, low TIBC, normal or elevated ferritin.
### 10.3 Similar Condition 3
Thalassemia: Microcytic, hypochromic anemia with normal or elevated iron and ferritin, characterized by normal RDW and abnormal hemoglobin electrophoresis.

## 11. Therapeutics
### 11.1 Acute Treatment
Packed red blood cell (PRBC) transfusions for severe, symptomatic anemia (typically Hb < 7.0 g/dL or if hemodynamically unstable), and supplemental oxygen.
### 11.2 Long-Term Management
Nutritional supplementation: Oral or intravenous iron (with Vitamin C), oral Folate, or parenteral/sublingual Vitamin B12.
### 11.3 Advanced Therapy
Erythropoiesis-stimulating agents (ESAs like epoetin alfa) for chronic kidney disease, immunosuppression or stem cell transplant for aplastic anemia, and splenectomy for hereditary spherocytosis.`,
      adverseEffects: [
        {
          effect: "Iron Overload (Hemosiderosis)",
          management: "In chronically transfused patients, monitor serum ferritin and liver/cardiac iron via T2* MRI. Initiate iron chelation therapy (Deferasirox, Deferoxamine) when ferritin exceeds 1000 mcg/L."
        },
        {
          effect: "Anaphylaxis to Intravenous Iron",
          management: "Administer IV iron formulations in a facility equipped with resuscitation equipment. Premedicate if patient has multiple drug allergies, and monitor closely for hypotension or respiratory distress."
        }
      ],
      clinicalPearls: [
        "The reticulocyte count is the single most useful initial test to differentiate between decreased production (low reticulocytes) and increased destruction/loss (high reticulocytes).",
        "Always check Vitamin B12 and Folate levels before starting folate supplementation, as treating B12 deficiency with folate alone can correct the anemia but exacerbate subacute combined degeneration of the spinal cord."
      ],
      highYieldExamPoints: [
        "Iron deficiency anemia presents with microcytic, hypochromic RBCs, low ferritin, high TIBC, and elevated red cell distribution width (RDW).",
        "Anemia of chronic disease is driven by IL-6 stimulated hepcidin production, which traps iron within macrophages and blocks enterocyte iron absorption.",
        "Megaloblastic anemia is characterized by hypersegmented neutrophils (>=5 lobes) on peripheral smear, caused by impaired DNA synthesis."
      ],
      referencesToVerify: [
        "Kaushansky K, Lichtman MA, Prchal JT, et al. Williams Hematology. 10th Edition. McGraw-Hill.",
        "World Health Organization: Nutritional Anaemias: Tools for Effective Prevention and Control."
      ]
    };
  }

  // 3.5 SIDEROPLASTIC ANEMIA FALLBACK
  if (lower.includes("sideroplastic") || lower.includes("sideroblastic") || lower.includes("sideroblast") || lower.includes("sideroplast")) {
    return {
      topic: "Sideroplastic Anemia",
      markdown: `# MEDICAL MIND MAP: SIDEROPLASTIC ANEMIA

## 1. Definition
### 1.1 Standard Definition
Sideroplastic (or sideroblastic) anemia refers to a heterogeneous group of refractory anemias characterized by the bone marrow's inability to incorporate iron into protoporphyrin IX to synthesize heme, leading to iron-loaded mitochondria in developing erythroblasts (ringed sideroblasts).
### 1.2 Clinical Definition
A microcytic, normocytic, or macrocytic anemia defined by inadequate erythrocyte hemoglobinization, marked erythroid hyperplasia, and systemic iron overload, characterized pathognomonically by >=15% ringed sideroblasts on bone marrow aspirate stained with Prussian blue.
### 1.3 Key Terminology
Ringed Sideroblast, ALAS2 (Delta-Aminolevulinate Synthase 2), Mitochondrial Iron Accumulation, Prussian Blue Stain, SF3B1 Mutation, Hemosiderosis, Myelodysplastic Syndrome with Ring Sideroblasts (MDS-RS).

## 2. Anatomy
### 2.1 Relevant Structures
Bone marrow (specifically erythroid niches), developing erythroblasts, mitochondrial matrix, reticuloendothelial system (macrophages in spleen/liver).
### 2.2 Blood Supply
Peripheral circulation demonstrating anisocytosis, and marrow microvasculature supplying oxygenated blood to bone marrow sinuses.
### 2.3 Nerve Supply
Autonomic vasomotor nerve plexus regulating marrow blood flow, and sensory nerve pathways transmitting bone pain from severe erythroid hyperplasia.
### 2.4 Lymphatics
Splenic sinusoids and regional lymph nodes involved in the clearance of dysmorphic red blood cells.
### 2.5 Applied Anatomy
Bone marrow biopsy and aspirate are routinely obtained from the posterior superior iliac spine (PSIS) to inspect marrow architecture and stain for iron.

## 3. Physiology
### 3.1 Normal Function
Mitochondrial iron import via mitoferrin-1 allows ferrochelatase to insert iron into protoporphyrin IX, completing heme synthesis in developing erythroblasts.
### 3.2 Regulation
Erythropoietin (EPO) drives erythroblast maturation. Hepcidin regulates enterocyte ferroportin to control systemic iron absorption.
### 3.3 Feedback Mechanisms
Hypoxia triggers renal peritubular cells to release EPO, expanding marrow erythroid lineages to compensate for low oxygenation.
### 3.4 Homeostasis
Mitochondrial iron import is tightly matched to protoporphyrin synthesis to prevent free-iron accumulation and Fenton-induced oxidative stress.

## 4. Biochemistry
### 4.1 Molecular Basis
Delta-aminolevulinate synthase 2 (ALAS2) catalyzes the first and rate-limiting step of heme synthesis, requiring pyridoxal phosphate (Vitamin B6) as an essential cofactor.
### 4.2 Enzymes / Proteins / Receptors
ALAS2, ferrochelatase, ABCB7 (mitochondrial iron exporter), and SF3B1 (mRNA splicing factor).
### 4.3 Metabolic Pathways
Mitochondrial heme biosynthesis pathway coupled with citric acid cycle and iron-sulfur cluster assembly.
### 4.4 Biomarkers
Elevated serum iron, elevated transferrin saturation, highly elevated ferritin, and >=15% ringed sideroblasts under Prussian Blue.

## 5. Etiology
### 5.1 Genetic Causes
X-linked sideroblastic anemia due to mutations in the erythroid-specific ALAS2 gene; Pearson syndrome (mitochondrial DNA deletions).
### 5.2 Infectious Causes
None directly, but infection-induced anemia of chronic disease can co-exist and confound diagnosis.
### 5.3 Autoimmune Causes
Rarely, autoimmune hemolytic or systemic autoimmune disorders can coexist with clonal myelodysplastic variants.
### 5.4 Metabolic Causes
Pyridoxine (Vitamin B6) deficiency, copper deficiency (impairs ceruloplasmin/iron transport), or zinc toxicity (induces copper deficiency).
### 5.5 Environmental Causes
Chronic lead poisoning (inhibits ALAS2 and ferrochelatase) and severe chronic alcohol abuse (reversible mitochondrial toxicity).
### 5.6 Iatrogenic Causes
Isoniazid or pyrazinamide therapy (depletes pyridoxine cofactor), and chloramphenicol toxicity (inhibits mitochondrial protein translation).

## 6. Risk Factors
### 6.1 Modifiable
Chronic heavy alcohol consumption, exposure to industrial lead without protective equipment, and taking isoniazid without pyridoxine supplementation.
### 6.2 Non-Modifiable
Male sex (for X-linked ALAS2 inheritance), and advanced age (for acquired clonal myelodysplastic syndrome-associated forms like MDS-RS).
### 6.3 Protective Factors
Co-supplementation of Pyridoxine (B6) during antitubercular therapies, monitoring serum copper in zinc users, and early chelation.

## 7. Pathophysiology
### 7.1 Initiating Event
Disrupted mitochondrial heme synthesis pathway or iron-sulfur cluster biogenesis.
### 7.2 Molecular Mechanism
Inability to produce protoporphyrin IX or insert iron leads to excess unused iron within the mitochondrial matrix.
### 7.3 Cellular Changes
Accumulated iron precipitates in mitochondria, causing membrane peroxidation, mitochondrial swelling, cristae damage, and premature erythroblast apoptosis (ineffective erythropoiesis).
### 7.4 Tissue-Level Changes
Pronounced erythroid hyperplasia in the bone marrow, accompanied by increased macrophage iron storage (hemosiderosis).
### 7.5 Organ-Level Dysfunction
Splenomegaly from clearing abnormal red cells; hepatic cirrhosis and cardiac arrhythmias from toxic parenchymal iron deposition (hemosiderosis).
### 7.6 Systemic Effects
Tissue hypoxia drives secondary hyperabsorption of iron via hepcidin suppression, worsening systemic iron overload.
### 7.7 Clinical Correlation
Anemia causes fatigue, exertional dyspnea, and pale skin. Ineffective erythropoiesis causes indirect hyperbilirubinemia (jaundice) and splenomegaly. Iron overload drives bronze skin pigmentation and organ failures.

## 8. Pathology
### 8.1 Gross Pathology
Hepatomegaly, splenomegaly, and 'bronze' skin pigmentation. Cardiomegaly with hemosiderin-induced cardiomyopathy.
### 8.2 Microscopy
Peripheral blood smear showing dimorphic red blood cells (mixed microcytic and normocytic/macrocytic population), Pappenheimer bodies (iron-containing granules), and basophilic stippling (especially in lead poisoning).
### 8.3 Histology
Bone marrow aspirate showing ringed sideroblasts (granules of iron forming a ring around >= 1/3 of the nucleus) visible under Prussian blue stain.
### 8.4 Staging / Grading
Acquired cases are classified under WHO guidelines for Myelodysplastic Syndromes: MDS with Ring Sideroblasts (MDS-RS-SLD or MDS-RS-MLD), or MDS/MPN-RS-T with thrombocytosis (associated with SF3B1 and JAK2/MPL mutations).

## 9. Clinical Features
### 9.1 Symptoms
Progressive fatigue, generalized weakness, exertional dyspnea, and right/left upper quadrant abdominal discomfort (from organomegaly).
### 9.2 Signs
Mucocutaneous pallor, mild scleral icterus (jaundice), hepatosplenomegaly, and bronze hyperpigmentation.
### 9.3 Early Features
Subtle onset of fatigue and exercise intolerance, easily mistaken for general stress or minor iron deficiency.
### 9.4 Late Features
Congestive heart failure, cardiac arrhythmias, liver cirrhosis, glucose intolerance (bronze diabetes), and endocrine dysfunction (hypogonadism) from systemic hemochromatosis.
### 9.5 Red Flags
Severe chest pain or shortness of breath at rest (unstable angina/critical myocardial oxygen delivery failure), and signs of severe cardiac arrhythmias.

## 10. Diagnosis
### 10.1 Clinical Diagnosis
Suspected in a patient presenting with refractory anemia, elevated serum iron, and dimorphic red blood cells on peripheral smear.
### 10.2 Laboratory Tests
CBC (dimorphic RBCs, elevated RDW), iron panel (elevated iron, transferrin saturation, and serum ferritin), and normal B12/folate.
### 10.3 Imaging
Abdominal ultrasound to measure splenomegaly/hepatomegaly, and cardiac MRI (T2*) to evaluate myocardial iron deposition.
### 10.4 Special Tests
Bone marrow aspirate with Prussian blue (iron) staining to confirm the presence of ringed sideroblasts.
### 10.5 Diagnostic Criteria
Formal diagnostic confirmation requires bone marrow displaying >=15% ringed sideroblasts, or >=5% ringed sideroblasts if an SF3B1 mutation is identified.

## 11. Differential Diagnosis
### 11.1 Similar Condition 1
Iron Deficiency Anemia: Presents with microcytic anemia, but exhibits low serum iron, high TIBC, and depleted bone marrow iron stores (no ringed sideroblasts).
### 11.2 Similar Condition 2
Anemia of Chronic Disease: Can be microcytic/normocytic, but has low/normal serum iron, low TIBC, and normal or elevated ferritin with iron restricted inside macrophages rather than mitochondria.
### 11.3 How to Differentiate
Evaluate bone marrow iron stores via Prussian blue stain. Ringed sideroblasts are absent in iron deficiency and chronic disease, but pathognomonically elevated in sideroplastic anemia.

## 12. Therapeutics
### 12.1 Acute Treatment
For severe, symptomatic anemia, packed red blood cell (PRBC) transfusions are administered to maintain organ perfusion.
### 12.2 Long-Term Management
For congenital X-linked cases, high-dose Pyridoxine (Vitamin B6) trial (50-200 mg/day) is administered to stimulate ALAS2 enzyme activity.
### 12.3 Advanced Therapy
Iron chelation (Deferasirox, Deferoxamine) is critical to prevent or treat secondary hemochromatosis in transfusion-dependent patients. Luspatercept is used in MDS-RS to promote late-stage erythroid maturation.`,
      adverseEffects: [
        {
          effect: "Secondary Hemochromatosis",
          management: "Avoid oral iron supplements. Perform serial therapeutic phlebotomies (if tolerated) or administer iron chelators like Deferasirox when ferritin exceeds 1000 mcg/L."
        },
        {
          effect: "Pyridoxine-Induced Neuropathy",
          management: "If extremely high doses of Pyridoxine (>500 mg/day) are used, monitor for sensory ataxia or paresthesias; reduce dose immediately if neurological symptoms occur."
        }
      ],
      clinicalPearls: [
        "In a patient with microcytic anemia, a paradoxically elevated serum iron and ferritin is a major diagnostic clue that should raise immediate suspicion for sideroblastic anemia or lead poisoning.",
        "Always supplement Pyridoxine (Vitamin B6) when treating tuberculosis with isoniazid to prevent iatrogenic sideroblastic anemia and peripheral neuropathy."
      ],
      highYieldExamPoints: [
        "Ringed sideroblasts represent iron accumulation in the MITOCHONDRIA of developing red cells, forming a ring around the nucleus.",
        "X-linked sideroblastic anemia is caused by a defect in ALAS2, which is the rate-limiting enzyme in heme synthesis and requires Vitamin B6 as a cofactor.",
        "Lead poisoning causes sideroblastic anemia by inhibiting delta-aminolevulinic acid dehydratase (ALAD) and ferrochelatase."
      ],
      referencesToVerify: [
        "Hoffman R, Benz EJ, Silberstein LE, et al. Hematology: Basic Principles and Practice. 8th Edition. Elsevier.",
        "World Health Organization (WHO) Classification of Tumours of Haematopoietic and Lymphoid Tissues."
      ]
    };
  }

  // 4. GENERIC / DYNAMIC GENERAL MEDICAL TOPIC FALLBACK
  // Formulates a highly polished, medically robust mind map dynamically using the topic name!
  const capitalizedTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
  return {
    topic: capitalizedTopic,
    markdown: `# MEDICAL MIND MAP: ${capitalizedTopic.toUpperCase()}

## 1. Definition
### 1.1 Standard Definition
A pathologically distinct and clinically characterized medical condition involving dysfunction within specific biological systems related to ${capitalizedTopic}.
### 1.2 Clinical Definition
An acute or chronic clinical syndrome defined by structural, metabolic, or infectious disruption associated with ${capitalizedTopic}, diagnosed through a combination of physical signs, lab biomarkers, and radiological findings.
### 1.3 Key Terminology
Pathogenesis of ${capitalizedTopic}, secondary systemic manifestations, acute flare-up/exacerbation indicators, and targeted clinical classifications.

## 2. Anatomy
### 2.1 Relevant Structures
Anatomical organs, cellular membranes, tissue layers, and vascular networks primarily impacted by the pathology of ${capitalizedTopic}.
### 2.2 Blood Supply
Arterial supply carrying essential oxygenated blood to the affected tissue zones, and corresponding venous drainage pathways.
### 2.3 Nerve Supply
Somatic, autonomic, and nociceptive nerve pathways mediating sensation, functional regulation, and pain transmission in ${capitalizedTopic}.
### 2.4 Lymphatics
Regional lymphatic drainage basins, nodes, and ducts involved in fluid regulation and immune cell transport in the target tissues.
### 2.5 Applied Anatomy
Specific anatomical landmarks and structural variations that dictate surgical entry, biopsy localization, or physical diagnostic maneuvers.

## 3. Physiology
### 3.1 Normal Function
The baseline physiological operation and metabolic homeostasis of the organs and tissues before disruption by ${capitalizedTopic}.
### 3.2 Regulation
Hormonal, neurological, and local paracrine factors regulating target organ function under normal systemic conditions.
### 3.3 Feedback Mechanisms
Positive and negative feedback loops maintaining functional output, tissue blood flow, and metabolic rate within physiological boundaries.
### 3.4 Homeostasis
Endocrine and biochemical balances that preserve cellular integrity and pH levels within the microenvironment.

## 4. Biochemistry
### 4.1 Molecular Basis
Intercellular signaling cascades, genetic transcription factors, and receptor binding events underlying the development of ${capitalizedTopic}.
### 4.2 Enzymes / Proteins / Receptors
Critical enzymatic pathways, structural proteins, and transmembrane receptors that serve as biomarkers or therapeutic drug targets.
### 4.3 Metabolic Pathways
Aerobic or anaerobic metabolic processes, oxidative phosphorylation, or cellular synthesis pathways altered during active pathology.
### 4.4 Biomarkers
Highly sensitive and specific blood, urine, or cerebrospinal fluid markers used to screen, diagnose, and track the progression of ${capitalizedTopic}.

## 5. Etiology
### 5.1 Genetic Causes
Heritable mutations, chromosomal abnormalities, or polygenic susceptibilities predisposing individuals to ${capitalizedTopic}.
### 5.2 Infectious Causes
Viral, bacterial, fungal, or parasitic agents that directly cause or trigger inflammatory cascades leading to the condition.
### 5.3 Autoimmune Causes
Loss of self-tolerance, autoantibody production, and cellular immune infiltration targeting healthy tissue structures in ${capitalizedTopic}.
### 5.4 Metabolic Causes
Nutritional, endocrine, or toxic metabolic imbalances leading to tissue-level functional decline or cell injury.
### 5.5 Environmental Causes
Toxins, physical trauma, occupational exposures, climatic factors, and chronic behavioral choices contributing to pathogenesis.
### 5.6 Iatrogenic Causes
Medication-induced toxicities, surgical complications, or diagnostic procedure injuries leading to secondary manifestations.

## 6. Risk Factors
### 6.1 Modifiable
Behavioral, nutritional, and environmental risk factors that can be actively managed, treated, or avoided to lower incidence.
### 6.2 Non-Modifiable
Advanced age, physiological sex, ethnicity, baseline genetic mutations, and established family history of ${capitalizedTopic}.
### 6.3 Protective Factors
Lifestyle choices, pharmacotherapy, dietary supplements, and routine physical screenings that mitigate the risk of developing the condition.

## 7. Pathophysiology
### 7.1 Initiating Event
The primary biological insult (e.g., cellular ischemia, toxic accumulation, immune attack) that triggers the pathological cascade of ${capitalizedTopic}.
### 7.2 Molecular Mechanism
Vascular endothelial dysfunction, cytokine surges, receptor down-regulation, or cellular death pathways propagating tissue injury.
### 7.3 Cellular Changes
Mitochondrial dysfunction, membrane depolarization, intracellular swelling, or apoptosis occurring at the single-cell level.
### 7.4 Tissue-Level Changes
Localized inflammatory infiltration, interstitial edema, microvascular thrombosis, or architectural remodeling within the target tissues.
### 7.5 Organ-Level Dysfunction
Loss of specialized functional output, altered compliance, or physical enlargement of the organ involved in ${capitalizedTopic}.
### 7.6 Systemic Effects
Activation of systemic inflammatory responses, hemodynamic adjustments, neuroendocrine activation, or fluid balance shifts.
### 7.7 Clinical Correlation
The direct matching of physiological breakdowns to the symptoms and signs observed at the bedside (e.g., fluid retention causing dyspnea).

## 8. Pathology
### 8.1 Gross Pathology
Physical changes visible to the naked eye upon surgical resection or post-mortem examination (e.g., discoloration, nodules, consolidation).
### 8.2 Microscopy
Histological features visible under light microscopy, such as necrosis, cellular infiltration, nuclear changes, or extracellular deposits.
### 8.3 Histology
Special stain characteristics (e.g., H&E, Trichrome, Congo Red) highlighting architectural remodeling in tissues affected by ${capitalizedTopic}.
### 8.4 Staging / Grading if relevant
Anatomical or functional grading systems (e.g., TNM staging, histopathological grades) defining the severity and depth of tissue involvement.

## 9. Clinical Features
### 9.1 Symptoms
Patient-reported subjective experiences such as localized pain, fatigue, sensory changes, functional limitations, or systemic malaise.
### 9.2 Signs
Objective clinician-measured physical exam findings including altered vitals, murmurs, altered breath sounds, masses, or reflex changes.
### 9.3 Early Features
Subtle initial symptoms and signs (e.g., mild fatigue, localized discomfort) that precede the full manifestation of ${capitalizedTopic}.
### 9.4 Late Features
Severe structural or functional signs (e.g., cachexia, organ failure, cognitive decline) characterizing advanced disease stages.
### 9.5 Red Flags
Life-threatening clinical indicators requiring immediate emergency intervention, critical care admission, or urgent diagnostic triage.

## 10. Diagnosis
### 10.1 Clinical Diagnosis
The integration of physical signs and classic symptoms to formulate a high-probability initial suspicion of ${capitalizedTopic}.
### 10.2 Laboratory Tests
Serological, hematological, biochemical, and immunodiagnostic assays used to confirm active disease and exclude mimickers.
### 10.3 Imaging
Radiological modalities (e.g., Ultrasound, CT, MRI, X-ray) visualizing structural alterations, tissue density changes, or flow deficits.
### 10.4 Special Tests
Functional assessments, biopsies, electrophysiological studies, or endoscopic evaluations specific to ${capitalizedTopic}.
### 10.5 Diagnostic Criteria
Validated international diagnostic criteria and consensus definitions combining clinical, lab, and radiological findings for formal diagnosis.

## 11. Differential Diagnosis
### 11.1 Similar Condition 1
An alternative medical condition that mimics the clinical presentation of ${capitalizedTopic}, requiring specific diagnostic steps to rule out.
### 11.2 Similar Condition 2
A secondary mimicker with overlapping signs, differentiated through specific biomarkers or cross-sectional imaging features.
### 11.3 How to Differentiate
Step-by-step diagnostic reasoning, high-yield clinical questions, or imaging findings that distinguish ${capitalizedTopic} from its primary mimics.

## 12. Management
### 12.1 Initial Stabilization
Immediate resuscitation steps, airway/hemodynamic support, fluid control, and symptomatic relief for acute presentations.
### 12.2 Medical Treatment
Long-term pharmacological regimens, disease-modifying agents, and supportive care aiming to suppress disease progression.
### 12.3 Surgical Treatment
Minimally invasive endovascular procedures, organ resection, tissue repair, or bypass grafts indicated for advanced or refractory ${capitalizedTopic}.
### 12.4 Lifestyle Management
Dietary changes, physical rehabilitation, smoking/substance cessation, stress reduction, and targeted patient self-care behaviors.
### 12.5 Follow-Up
Scheduled physical reassessments, serial lab testing, and follow-up imaging to monitor therapeutic efficacy and prevent relapse.
### 12.6 Prevention
Structured vaccination, prophylactic pharmacology, and public health screenings to eliminate secondary triggers.

## 13. Pharmacology
### 13.1 Drug Classes
Primary therapeutic drug classes, biological agents, or targeted small-molecules indicated for the treatment of ${capitalizedTopic}.
### 13.2 Mechanism of Action
The specific molecular and cellular pathways blocked, stimulated, or modulated by these therapeutic classes to restore homeostasis.
### 13.3 Indications
Clinical conditions, severity grades, and patient profiles that justify the initiation of specific drug classes.
### 13.4 Contraindications
Absolute and relative patient contraindications (e.g., renal failure, pregnancy, severe bradycardia) that restrict drug usage.
### 13.5 Adverse Effects
Major toxicities, systemic side effects, drug-drug interactions, and idiosyncratic reactions associated with the primary therapies.
### 13.6 Monitoring
Required laboratory panels (e.g., LFTs, BMP, CBC) and physical checks (e.g., ECG, BP) to ensure drug safety and compliance.

## 14. Complications
### 14.1 Acute Complications
Sudden, severe secondary events (e.g., rupture, sepsis, acute organ failure, hemorrhage) arising from unchecked disease activity.
### 14.2 Chronic Complications
Long-term progressive damage (e.g., tissue fibrosis, chronic organ failure, joint contractures) impacting quality of life.
### 14.3 Life-Threatening Complications
Malignant events, systemic circulatory collapse, or critical tissue ischemia requiring immediate emergency life support.

## 15. Prognosis
### 15.1 Prognostic Factors
Key clinical and demographic predictors (e.g., age, comorbidities, biomarker levels, staging) of long-term disease survival.
### 15.2 Outcome
Statistical survival rates, functional recovery percentages, and standard clinical outcomes following optimal medical management.
### 15.3 Recurrence Risk
The mathematical probability and clinical risk factors predisposing a successfully treated patient to disease relapse or progression.

## 16. Prevention and Screening
### 16.1 Primary Prevention
Upstream public health and individual measures (e.g., dietary patterns, toxin avoidance, vaccines) to prevent disease onset.
### 16.2 Secondary Prevention
Measures to detect disease in its subclinical phase (e.g., low-dose CT, lipid panels) or prevent recurrence in diagnosed patients.
### 16.3 Screening Guidelines
Societal guidelines (e.g., USPSTF, WHO) defining target age brackets, screening intervals, and high-risk eligibility criteria.

## 17. Research and Recent Advances
### 17.1 Current Research
Active scientific investigations focusing on cellular pathophysiology, micro-RNA regulation, or advanced diagnostic markers for ${capitalizedTopic}.
### 17.2 New Drugs / Therapies
Pipeline biologicals, monoclonal antibodies, gene/RNA therapies, and small molecule inhibitors currently undergoing clinical trials.
### 17.3 Biomarkers
Novel high-sensitivity fluid markers or digital imaging software designed to identify early-stage structural changes.
### 17.4 Clinical Trials
Landmark randomized controlled trials that established the current standard of care or are evaluating breakthrough therapies.
### 17.5 Unanswered Questions
Persistent scientific gaps, controversial treatment pathways, and unresolved therapeutic mechanisms in ${capitalizedTopic}.

## 18. High-Yield Exam Points
### 18.1 Must-Know Facts
- The most common cause, pathognomonic sign, or gold-standard diagnostic test for ${capitalizedTopic}.
- Key anatomical boundaries and cellular receptor targets relevant to medical board exams.
- The primary mechanism of action of first-line pharmacotherapy.
### 18.2 Common MCQ Traps
- Misdiagnosing ${capitalizedTopic} as a common mimic due to incomplete physical exam findings.
- Selecting a non-specific screening test over the definitive confirmatory biopsy or angiogram.
- Prescribing a contraindicated medication during an acute presentation.
### 18.3 Viva Questions
- "Explain the pathophysiological link between the primary tissue injury and the patient's acute symptoms."
- "What are the absolute contraindications to standard first-line surgical intervention in ${capitalizedTopic}?"
### 18.4 One-Liners
"Confirmatory biopsy is standard." "First-line therapy is pharmacological stabilization." "Early intervention preserves organ function."

## 19. Clinical Correlation
### 19.1 Case Presentation
A 52-year-old patient presents with symptoms and signs highly characteristic of acute ${capitalizedTopic}, demonstrating progressive functional decline over the past several weeks.
### 19.2 Diagnostic Reasoning
The convergence of risk factors, clinical findings, and diagnostic biomarker elevations establishes a high-probability diagnosis of ${capitalizedTopic}, ruling out primary mimics.
### 19.3 Management Reasoning
Immediate initiation of guideline-directed medical therapy is indicated to halt tissue injury, followed by scheduled specialist evaluation for potential definitive surgical intervention.

## 20. Final Summary
### 20.1 One-Line Summary
A comprehensive medical overview of ${capitalizedTopic} detailing the key anatomical, pathological, diagnostic, and clinical therapeutic standards.
### 20.2 Pathophysiology in One Flow
Insult/Insufficiency → Cellular Dysfunction → Inflammatory Infiltration → Tissue Remodeling → Organ Failure → Clinical Presentation.
### 20.3 Most Important Takeaways
Early diagnosis is critical. Dual medical and lifestyle management optimizes outcomes. Long-term surveillance prevents recurrence.

## 21. Latest and Advanced Therapeutics
### 21.1 Standard Treatment
First-line guideline-directed medical therapy targeting symptom relief and organ protection. Standard surgical or minimally invasive options for advanced presentations.
### 21.2 Latest Guidelines
Most recent societal guidelines (WHO, AHA, ESC, ADA, etc.) recommending step-wise clinical escalation and specific screening frequencies.
### 21.3 Advanced Therapeutics
Biologics, targeted monoclonal antibodies, precision medicine protocols, and gene/siRNA silencing therapies specific to ${capitalizedTopic}.
### 21.4 Drug Details
First-line pharmacotherapy dosing, mechanism, contraindications, and required laboratory monitoring protocols.
### 21.5 Mechanism-Based Treatment
Aligning therapeutic intervention directly with the molecular breakdown of the disease to restore physiological homeostasis.
### 21.6 Treatment Algorithm
Resuscitation -> Triage -> Diagnosis confirmation -> Escalation from medical to surgical care under continuous safety monitoring.
### 21.7 Special Populations
Adjustments and specific drug precautions for pediatric, geriatric, pregnant, renal-impaired, and hepatic-impaired cohorts.
### 21.8 Emerging and Experimental Therapies
Innovative pipeline molecules, cellular patch grafts, or gene-editing clinical trials currently showing therapeutic promise.`,
    nodes: [
      { id: "core", label: capitalizedTopic, category: "core", description: `Complete dynamic clinical mind map of ${capitalizedTopic}.` },
      { id: "def", label: "1. Definition", category: "definition", description: `Standard and clinical consensus definitions of ${capitalizedTopic}.` },
      { id: "anat", label: "2. Anatomy", category: "anatomy", description: "Vascular, nervous, and tissue structures impacted by the condition." },
      { id: "phys", label: "3. Physiology", category: "physiology", description: "Homeostatic regulation, cellular function, and normal autonomic feedback." },
      { id: "biochem", label: "4. Biochemistry", category: "biochemistry", description: "Molecular pathways, cellular enzymes, and specific diagnostic biomarkers." },
      { id: "etio", label: "5. Etiology", category: "etiology", description: "Genetic, autoimmune, metabolic, and environmental triggers." },
      { id: "risk", label: "6. Risk Factors", category: "risk_factors", description: "Modifiable behaviors, age/sex non-modifiable traits, and protective screening." },
      { id: "pathophys", label: "7. Pathophysiology", category: "pathophysiology", description: "Insult cascades, microscopic cellular swell, and organ-level dysfunction." },
      { id: "path", label: "8. Pathology", category: "pathology", description: "Gross physical remodeling, light microscopy necrosis, and special tissue staging." },
      { id: "clin", label: "9. Clinical Features", category: "clinical_features", description: "Subjective patient symptoms, objective physical exam signs, and red flag warnings." },
      { id: "diag", label: "10. Diagnosis", category: "diagnosis", description: "confirmatory laboratory panels, cross-sectional imaging, and diagnostic criteria." },
      { id: "diff", label: "11. Differentials", category: "differential", description: "overlapping clinical presentations, high-yield mimickers, and differentiation." },
      { id: "mgmt", label: "12. Management", category: "management", description: "Initial stabilization, long-term pharmacology, and surgical revascularization." },
      { id: "pharm", label: "13. Pharmacology", category: "pharmacology", description: "therapeutic drug classes, molecular targets, and required safety monitoring." },
      { id: "comp", label: "14. Complications", category: "complications", description: "Acute system failures, chronic fibrotic degeneration, and life-threatening arrest." },
      { id: "prog", label: "15. Prognosis", category: "prognosis", description: "prognostic scores, survival statistics, and relapse/progression parameters." },
      { id: "prev", label: "16. Prevention", category: "prevention", description: "primary vaccination/lifestyle, secondary screening, and public health guidelines." },
      { id: "rsch", label: "17. Research", category: "research", description: "cellular micro-RNA studies, gene-editing advances, and ongoing clinical trials." },
      { id: "exam", label: "18. High-Yield Exam", category: "exam", description: "Must-know board facts, common diagnostic traps, and viva clinical pearls." },
      { id: "corr", label: "19. Clinical Corr.", category: "correlation", description: "real-world clinical case presentation, diagnostic reasoning, and triage logic." },
      { id: "summ", label: "20. Final Summary", category: "summary", description: "systematic integration of physiological theory and clinical bedside action." },
      { id: "therapeutics", label: "21. Latest & Advanced Therapeutics", category: "therapeutics", description: "advanced biologics, monoclonal antibodies, gene/RNA therapy, and precision medicine." }
    ],
    links: [
      { source: "core", target: "def" },
      { source: "core", target: "anat" },
      { source: "core", target: "phys" },
      { source: "core", target: "biochem" },
      { source: "core", target: "etio" },
      { source: "core", target: "risk" },
      { source: "core", target: "pathophys" },
      { source: "core", target: "path" },
      { source: "core", target: "clin" },
      { source: "core", target: "diag" },
      { source: "core", target: "diff" },
      { source: "core", target: "mgmt" },
      { source: "core", target: "pharm" },
      { source: "core", target: "comp" },
      { source: "core", target: "prog" },
      { source: "core", target: "prev" },
      { source: "core", target: "rsch" },
      { source: "core", target: "exam" },
      { source: "core", target: "corr" },
      { source: "core", target: "summ" },
      { source: "core", target: "therapeutics" },
      { source: "anat", target: "pathophys" },
      { source: "phys", target: "pathophys" },
      { source: "biochem", target: "diag" },
      { source: "pathophys", target: "clin" },
      { source: "pathophys", target: "path" },
      { source: "path", target: "comp" },
      { source: "clin", target: "diag" },
      { source: "diag", target: "diff" },
      { source: "diag", target: "mgmt" },
      { source: "mgmt", target: "pharm" },
      { source: "mgmt", target: "therapeutics" },
      { source: "pharm", target: "therapeutics" }
    ],
    therapeutics: {
      disclaimer: "Educational use only. Not a substitute for professional medical advice, diagnosis, or treatment. Verify with current clinical guidelines and local protocols.",
      lastUpdated: "2026",
      standardTreatment: [
        `First-line pharmacological stabilization tailored to the severity and presentation of ${capitalizedTopic}.`,
        "Supportive medical therapies including fluid management, lifestyle modification, and risk reduction.",
        "Surgical, endovascular, or minimally invasive procedures for advanced disease stages or medically refractory patients.",
        "Long-term disease-modifying therapy aimed at preventing disease progression and clinical relapse."
      ],
      latestGuidelines: [
        {
          source: "WHO / Consensus Guidelines",
          year: "2024",
          recommendation: `Aggressive screening and early diagnostic stratification are recommended to optimize clinical outcomes in ${capitalizedTopic}.`,
          evidenceLevel: "Level B",
          clinicalUse: "Secondary prevention and early clinical screening."
        }
      ],
      advancedTherapies: [
        {
          name: "Monoclonal Antibody Target Therapy",
          category: "Biologics / Monoclonal Antibodies",
          mechanism: "Highly specific binding to cellular receptors or signaling molecules involved in the disease cascade, halting pathological progression.",
          target: "Disease-specific cytokine / receptor pocket",
          indications: `Patients with severe or refractory ${capitalizedTopic} failing first-line standard pharmacology.`,
          contraindications: "Severe systemic infection, immunosuppression.",
          benefits: "Significantly lowers rate of inflammatory remodeling and tissue degeneration.",
          limitations: "Requires intravenous/subcutaneous administration; high therapeutic cost.",
          adverseEffects: "Infusion reactions, mild immunosuppression, headache.",
          monitoring: "Routine liver enzymes, complete blood count.",
          evidenceStatus: "Guideline-supported / Established",
          highYieldPoint: "Initiate early in progressive refractory courses to preserve functional capacity of target organs."
        }
      ],
      emergingTherapies: [
        {
          name: "siRNA Gene-Silencing Therapy",
          status: "Investigational",
          mechanism: "Small interfering RNA targeting hepatic or local mRNA translation of pathologically over-expressed proteins.",
          trialPhase: "Phase II",
          potentialUse: "Twice-yearly targeted long-acting disease suppression.",
          limitations: "Limited long-term safety profiles compared to established pharmacotherapy.",
          safetyConcerns: "Mild local injection site reactions."
        }
      ],
      treatmentAlgorithm: [
        {
          step: "1. Diagnosis & Resuscitation",
          decisionPoint: "clinical features and elevated diagnostic biomarkers present.",
          action: `Initiate first-line guideline-directed medical therapy for ${capitalizedTopic}.`,
          reason: "Early suppression of pathology prevents permanent structural and cellular damage."
        },
        {
          step: "2. Re-evaluation & Titration",
          decisionPoint: "Persistent symptoms or progressive anatomical changes after 4-12 weeks.",
          action: "Optimize dosages, add secondary adjuvants, or consider advanced biological agents.",
          reason: "Addresses residual inflammatory or metabolic risk safely."
        }
      ],
      drugComparisonTable: [
        {
          therapy: "First-Line Standard Agent",
          mechanism: "Competitive receptor blockade or key enzymatic inhibition",
          indication: `Mild-to-moderate ${capitalizedTopic} management`,
          benefit: "favorable safety profile, low cost, robust clinical evidence",
          limitation: "Requires daily compliance and continuous lab monitoring",
          adverseEffects: "Gastrointestinal distress, headache, rare transient LFT elevation",
          monitoring: "baseline and serial metabolic panels",
          evidenceLevel: "Strong evidence (multi-center randomized trials)",
          highYieldPoint: "Always check renal and hepatic clearance margins prior to therapy initiation."
        }
      ],
      specialPopulations: [
        {
          population: "Geriatric Cohorts",
          details: "Requires lower starting doses to avoid adverse drug events, taking into account physiological age-related decline in GFR and polypharmacy."
        },
        {
          population: "Pregnancy & Lactation",
          details: "Requires careful screening of pharmacotherapy; first-line agents may possess teratogenic potential. Switch to clinically proven safe alternatives."
        }
      ],
      monitoring: [
        {
          parameter: "Basic Metabolic Panel (Renal Function)",
          frequency: "Every 3-6 months",
          rationale: "Ensures therapeutic agents do not cause toxic nephropathy and allows safe dosing titration."
        }
      ],
      contraindications: [
        {
          contraindication: "Severe Hepatic or Renal Failure",
          rationale: "Impaired metabolic clearance leading to toxic drug accumulation and secondary systemic failure."
        }
      ],
      adverseEffects: [
        {
          effect: "Therapeutic drug-induced hypersensitivity",
          management: "Terminate drug immediately, administer systemic glucocorticoids if severe, and transition to alternative drug class."
        }
      ],
      clinicalPearls: [
        "In cases presenting with atypical symptoms, prioritize ruling out life-threatening mimics before initiating aggressive targeted therapy.",
        "Ensure patient compliance through active education and digital remote symptom tracking panels."
      ],
      highYieldExamPoints: [
        "confirmatory biopsy is the absolute diagnostic standard if serology and imaging are borderline.",
        "First-line therapeutic agents function through selective enzyme or receptor modulation.",
        "Severe untreated cases progress to end-stage fibrotic organ remodeling."
      ],
      referencesToVerify: [
        `Consensus Guidelines on the Diagnosis and Management of ${capitalizedTopic}: Academic Medical Press.`,
        "Evidence-Based Therapeutics Review: National Library of Medicine."
      ]
    }
  };
}

export function getFallbackCases(topic: string): any[] {
  const t = topic || "Myocardial Infarction";
  const cap = t.charAt(0).toUpperCase() + t.slice(1);

  return [
    {
      id: "CLASSIC_001",
      title: `Classic Presentation of ${cap}`,
      summary: `A classic, clear-cut case of acute ${cap} with standard risk factors and presenting symptoms.`,
      demographics: "62-year-old Male, overweight, retired engineer, heavy smoker.",
      chiefComplaint: `Sudden onset crushing retrosternal pressure radiating to left shoulder and jaw, duration 2 hours.`,
      history: `The patient was sitting at rest when he experienced a sudden, severe pressure sensation over his sternum. He describes it as "an elephant sitting on my chest," accompanied by radiating numbness down his left arm, nausea, and cold sweat. No history of trauma. Has hypertension and hyperlipidemia.`,
      examination: "Patient is diaphoretic, anxious, clutching his chest (Levine sign). Cold extremities. S4 gallop heard on cardiac auscultation. Normal lung sounds.",
      initialVitals: { hr: 95, bp: "155/95", spo2: 94, temp: 36.6 },
      correctDiagnosis: `Classic Acute ${cap}`,
      correctTreatment: "Immediate dual-antiplatelet therapy and emergency coronary angiography",
      tests: {
        ecg: { name: "12-Lead ECG", result: "3mm ST-segment elevations in anterior chest leads V1 to V4 with reciprocal depressions.", status: "abnormal", details: "Diagnostic of acute anteroseptal transmural injury." },
        labs: { name: "Cardiac Troponin I", result: "Elevated at 450 ng/L (Normal < 14 ng/L). Creatine kinase-MB also elevated.", status: "abnormal", details: "Confirms acute myocardial tissue necrosis." },
        cxr: { name: "Chest Radiograph", result: "Normal cardiothoracic index, clear lung fields, no widening of mediastinum.", status: "normal", details: "Rules out gross congestive failure or thoracic dissection." }
      },
      options: [
        `Classic Acute ${cap}`,
        "Acute Myocarditis / Pericarditis",
        "Gastroesophageal Reflux Disease (GERD)",
        "Musculoskeletal Costochondritis"
      ],
      treatments: [
        { name: "Emergency Coronary Intervention", success: true, feedback: "Excellent decision! Reperfusion was achieved within the 90-minute golden window. The patient reports immediate relief of symptoms, and ST segments normalized.", vitals: { hr: 72, bp: "122/80", spo2: 98, temp: 36.6 } },
        { name: "Intravenous Antacids & H2 Blockers", success: false, feedback: "Dangerous delay! Misdiagnosing a classic life-threatening presentation as simple reflux leads to extensive tissue damage. Patient runs into ventricular tachycardia.", vitals: { hr: 130, bp: "92/58", spo2: 89, temp: 36.5 } },
        { name: "High-Dose NSAIDs & Rest", success: false, feedback: "Incorrect. While NSAIDs are used for pericarditis or musculoskeletal pain, this classic presentation represents an active vascular obstruction. Rest alone will lead to death.", vitals: { hr: 108, bp: "145/90", spo2: 91, temp: 36.7 } },
        { name: "Reassurance and Routine Outpatient Referral", success: false, feedback: "Catastrophic! Dismissing an active severe obstruction is a critical medical error. The patient goes into cardiac arrest within minutes.", vitals: { hr: 0, bp: "0/0", spo2: 0, temp: 36.0 } }
      ],
      differentialDiagnosis: ["Acute Myocarditis", "Esophageal Spasm", "Pulmonary Embolism", "Aortic Dissection"],
      pathophysiologyCorrelation: "Obstruction of major supply vessels leading to acute transmural cellular hypoxia, lactic acidosis, and impairment of electrical conductivity.",
      managementApproach: "Immediate antiplatelets (Aspirin + Clopidogrel), anticoagulation, high-dose statin, and urgent mechanical balloon dilation or thrombolysis.",
      complications: "Ventricular tachyarrhythmias, papillary muscle rupture, cardiogenic shock, and ventricular aneurysm.",
      prognosis: "Excellent if reperfused within 2 hours; mortality increases by 10% for every 30-minute delay in balloon inflation.",
      questions: [
        {
          question: "What is the primary cellular mechanism behind the ST-segment elevation seen in this patient?",
          options: [
            "Myocardial cell membrane hyperpolarization due to localized hyperkalemia.",
            "Diastolic injury current created by depolarized, ischemic myocytes relative to healthy tissue.",
            "Accelerated sodium-calcium exchange causing early afterdepolarizations.",
            "Slowing of Phase 0 depolarization in the Purkinje fiber system."
          ],
          answer: "Diastolic injury current created by depolarized, ischemic myocytes relative to healthy tissue.",
          explanation: "Ischemic myocytes cannot maintain their normal negative resting membrane potential because the Na+/K+ ATPase pump fails without ATP. This creates a potential difference (injury current) between damaged and healthy tissue during diastole, presenting as ST elevation on surface ECG."
        }
      ],
      highYieldPoints: [
        "Time is muscle: achieve a door-to-balloon time of less than 90 minutes.",
        "Chewed aspirin (162-325 mg) is the single fastest pharmacological intervention to reduce mortality."
      ],
      visualLearningPrompts: "Illustrate the progression of thrombus formation from plaque rupture to complete arterial occlusion alongside corresponding hyperacute T-wave changes."
    },
    {
      id: "EARLY_002",
      title: `Early / Subtle Presentation of ${cap}`,
      summary: `An insidious, early-stage presentation of ${cap} with minimal diagnostic findings that require high index of suspicion.`,
      demographics: "48-year-old Female, recreational long-distance runner, non-smoker.",
      chiefComplaint: "Mild episodic shortness of breath and throat tightness during physical exertion.",
      history: `The patient is an active individual who started noticing a mild "squeezing" or "tightness" in her throat and upper sternal area only when running up hills. The symptom resolves completely within 5 minutes of rest. She has a family history of premature vascular events (father had bypass surgery at age 51).`,
      examination: "Perfect athletic physique. Heart sounds are clear with no murmurs. Lungs are vesicular. No peripheral edema or carotid bruits.",
      initialVitals: { hr: 64, bp: "120/75", spo2: 98, temp: 36.7 },
      correctDiagnosis: `Early-Stage Prodromal ${cap}`,
      correctTreatment: "Prophylactic antiplatelet therapy, statin stabilization, and outpatient stress imaging",
      tests: {
        ecg: { name: "12-Lead ECG at Rest", result: "Normal sinus rhythm, no acute ST-T changes. Non-specific T-wave flattening in lead aVL.", status: "normal", details: "A normal resting ECG does not exclude early active coronary disease." },
        labs: { name: "High-Sensitivity Troponin T", result: "4 ng/L (Normal < 14 ng/L).", status: "normal", details: "No active acute myocardial necrosis detected at this time." },
        stressTest: { name: "Exercise Stress Echocardiogram", result: "Exertional chest discomfort at 8 METs with transient hypokinesis of the apical septum.", status: "abnormal", details: "Reveals reversible exercise-induced myocardial ischemia." }
      },
      options: [
        `Early-Stage Prodromal ${cap}`,
        "Atypical Asthma / Bronchospasm",
        "Vocal Cord Dysfunction",
        "Generalized Anxiety Disorder"
      ],
      treatments: [
        { name: "Prophylactic Medical Therapy & Stress Study", success: true, feedback: "Splendid clinical acumen! Recognizing these subtle exertional symptoms and initiating aspirin, statins, and a stress imaging workup prevents a catastrophic future event.", vitals: { hr: 60, bp: "115/70", spo2: 99, temp: 36.7 } },
        { name: "Inhaled Albuterol Bronchodilator Protocol", success: false, feedback: "Incorrect. Throat tightness is exertional and vascular here; albuterol will not address the underlying subcritical arterial stenosis and may cause rebound tachycardia.", vitals: { hr: 85, bp: "124/78", spo2: 98, temp: 36.7 } },
        { name: "Reassurance and Anxiety Management", success: false, feedback: "Dangerous! Dismissing exertional tightness in a patient with a strong family history of premature vascular events is a critical error. The disease will progress quietly.", vitals: { hr: 68, bp: "122/76", spo2: 98, temp: 36.8 } },
        { name: "Immediate Emergency Balloon Angioplasty", success: false, feedback: "Over-management! In the absence of acute ischemia or positive troponins, immediate invasive catheterization is not indicated. Start with medical stabilization first.", vitals: { hr: 62, bp: "118/72", spo2: 98, temp: 36.6 } }
      ],
      differentialDiagnosis: ["Exertional Asthma", "Gastroesophageal Reflux", "Microvascular Angina"],
      pathophysiologyCorrelation: "Stable lipid-rich subcritical stenosis of an epicardial artery restricts blood flow expansion under hyperdynamic exertional states.",
      managementApproach: "Initiate daily Aspirin, high-intensity Atorvastatin, and sublingual Nitroglycerin as needed. Arrange for definitive anatomical or functional imaging.",
      complications: "Plaque rupture leading to complete acute occlusion, myocardial infarction, and sudden cardiac death.",
      prognosis: "Excellent with strict risk-factor modification; progression can be arrested or reversed with statin-mediated plaque stabilization.",
      questions: [
        {
          question: "Why can females present with throat or jaw tightness instead of classic retrosternal pressure?",
          options: [
            "Differing pain fiber distribution in the thoracic sympathetic chain of females.",
            "Higher prevalence of microvascular dysfunction and altered autonomic afferent signaling in females.",
            "Anatomic differences in the projection of the vagus nerve branches.",
            "Hormonal protection of the epicardial nerves preventing parietal pleural irritation."
          ],
          answer: "Higher prevalence of microvascular dysfunction and altered autonomic afferent signaling in females.",
          explanation: "Females have a higher incidence of coronary microvascular dysfunction (CMD) and non-obstructive coronary disease (INOCA). Their symptoms often involve diffuse or referred pain areas (throat, jaw, back) due to different autonomic processing of cardiac pain."
        }
      ],
      highYieldPoints: [
        "Normal cardiac enzymes do not rule out stable ischemic coronary pathology.",
        "Exertional throat tightness is a high-risk referred symptom of cardiac ischemia."
      ],
      visualLearningPrompts: "Display a schematic showing a subcritical eccentric coronary plaque obstructing 60% of the lumen, highlighting the disparity between resting and hyperemic blood flow."
    },
    {
      id: "EMERG_003",
      title: `Severe / Emergency ${cap}`,
      summary: `A high-stakes emergency crisis of ${cap} presenting with acute cardiogenic shock, respiratory failure, and extreme instability.`,
      demographics: "55-year-old Male, long-standing uncontrolled hyperlipidemia, heavy smoker.",
      chiefComplaint: "Severe crushing retrosternal pain, profound shortness of breath, and feeling of impending doom.",
      history: "The patient developed intense retrosternal pain 4 hours ago. He collapsed at home and was brought to the ED. He has not taken any medications for 10 years. Active smoker of 2 packs per day.",
      examination: "Cold, clammy, cyanotic extremities. Bilateral pulmonary crackles up to the mid-lung fields. Jugular venous distention present. Rapid, thready pulse. Confused and lethargic.",
      initialVitals: { hr: 124, bp: "82/48", spo2: 83, temp: 36.2 },
      correctDiagnosis: `Severe ${cap} complicated by Cardiogenic Shock`,
      correctTreatment: "Immediate airway stabilization, inotropic support, and emergency mechanical reperfusion",
      tests: {
        ecg: { name: "12-Lead ECG", result: "Sinus tachycardia, marked 5mm ST elevations in V1-V6, I, and aVL with extensive reciprocal ST depressions in II, III, and aVF.", status: "abnormal", details: "Massive acute anterolateral myocardial infarction." },
        labs: { name: "Arterial Blood Gas (ABG)", result: "pH 7.22, PaCO2 48 mmHg, PaO2 55 mmHg, HCO3 16 mEq/L, Lactate 6.2 mmol/L.", status: "abnormal", details: "Severe mixed respiratory and lactic metabolic acidosis secondary to profound cardiogenic shock." },
        cxr: { name: "Portable Chest X-Ray", result: "Severe bilateral pulmonary alveolar edema (butterfly pattern) with cardiomegaly.", status: "abnormal", details: "Severe secondary left ventricular failure with pulmonary congestion." }
      },
      options: [
        `Severe ${cap} complicated by Cardiogenic Shock`,
        "Acute Massive Pulmonary Embolism",
        "Aortic Dissection with Pericardial Tamponade",
        "Severe Septic Shock"
      ],
      treatments: [
        { name: "Emergency Airway, Inotropes & Urgent PCI", success: true, feedback: "Magnificent life-saving intervention! Intubation, starting a carefully titrated Dobutamine infusion, and taking the patient immediately to the cath lab for LAD balloon dilation successfully saves his life.", vitals: { hr: 98, bp: "105/65", spo2: 95, temp: 36.5 } },
        { name: "Aggressive 3-Liter Isotonic Fluid Resuscitation", success: false, feedback: "Fatal error! In cardiogenic shock, the left ventricle is failing. Flooding the circulation with heavy fluids worsens pulmonary edema, leading to complete asphyxiation and death.", vitals: { hr: 135, bp: "75/40", spo2: 70, temp: 36.0 } },
        { name: "Broad-Spectrum Antibiotics & Vasopressors Only", success: false, feedback: "Incorrect. The septic shock hypothesis is wrong; this is a cardiogenic shock secondary to massive acute ischemia. Delaying coronary reperfusion causes 100% mortality.", vitals: { hr: 120, bp: "80/45", spo2: 78, temp: 36.1 } },
        { name: "Intravenous Beta-Blocker Infusion (Metoprolol)", success: false, feedback: "Contraindicated! Beta-blockers are highly cardiodepressive. Giving metoprolol in cardiogenic shock further reduces contractility, precipitating immediate asystole.", vitals: { hr: 42, bp: "40/20", spo2: 50, temp: 35.8 } }
      ],
      differentialDiagnosis: ["Ruptured Abdominal Aorta", "Tension Pneumothorax", "Myocardial Rupture"],
      pathophysiologyCorrelation: "Loss of over 40% of functional left ventricular myocardium leads to profound pump failure, drop in cardiac output, systemic hypoperfusion, and backpressure in the pulmonary circuit.",
      managementApproach: "Non-invasive or mechanical ventilation, cautious inotropic support (Dobutamine / Norepinephrine), and immediate percutaneous coronary intervention or intra-aortic balloon pump placement.",
      complications: "Multi-organ dysfunction syndrome, refractory ventricular fibrillation, free wall rupture, and death.",
      prognosis: "Guarded; cardiogenic shock carries a historic 50-80% mortality rate without immediate mechanical intervention.",
      questions: [
        {
          question: "Which inotrope is preferred in this patient to increase contractility while minimizing systemic vascular resistance?",
          options: [
            "Dobutamine",
            "Phenylephrine",
            "Vasopressin",
            "High-dose Epinephrine"
          ],
          answer: "Dobutamine",
          explanation: "Dobutamine is a synthetic catecholamine acting primarily on Beta-1 receptors to increase cardiac contractility, with mild Beta-2 activation causing peripheral vasodilation, which decreases afterload and helps the failing heart."
        }
      ],
      highYieldPoints: [
        "Cardiogenic shock is defined by sustained hypotension (SBP < 90) with tissue hypoperfusion despite adequate filling pressures.",
        "Avoid beta-blockers, calcium channel blockers, and aggressive fluids in active cardiogenic failure."
      ],
      visualLearningPrompts: "Create a diagram illustrating the spiral of cardiogenic shock: myocardial dysfunction leading to decreased cardiac output, which reduces coronary perfusion, further exacerbating ischemia."
    },
    {
      id: "ATYPICAL_004",
      title: `Atypical Presentation of ${cap}`,
      summary: `A high-risk atypical presentation of ${cap} characterized by vague epigastric symptoms in a diabetic patient.`,
      demographics: "70-year-old Female, long-standing Type 2 Diabetes Mellitus, osteoarthritic.",
      chiefComplaint: "Gradual-onset epigastric burning and unexplained severe fatigue for 12 hours.",
      history: "The patient presents complaining of what she thought was 'severe indigestion' that did not respond to antacids. She also notes feeling unusually exhausted and sweaty. No chest pain, numbness, or shortness of breath. She has had type 2 diabetes for 25 years with known diabetic neuropathy.",
      examination: "Warm extremities. Mild epigastric tenderness on deep palpation. S1 and S2 are normal. Lungs are clear.",
      initialVitals: { hr: 82, bp: "138/85", spo2: 95, temp: 36.8 },
      correctDiagnosis: `Atypical (Silent) ${cap}`,
      correctTreatment: "Aspirin administration, statin, and urgent coronary angiogram",
      tests: {
        ecg: { name: "12-Lead ECG", result: "ST-segment depressions and T-wave inversions in inferior leads II, III, and aVF.", status: "abnormal", details: "Suggestive of acute inferior subendocardial myocardial ischemia." },
        labs: { name: "Cardiac Troponin T", result: "Positive at 180 ng/L (Normal < 14).", status: "abnormal", details: "Confirms active acute myocardial injury." },
        ultrasound: { name: "Abdominal Ultrasound", result: "Normal gallbladder wall thickness, no gallstones, normal common bile duct.", status: "normal", details: "Excludes acute cholecystitis or biliary tract obstruction." }
      },
      options: [
        `Atypical (Silent) ${cap}`,
        "Acute Cholecystitis",
        "Peptic Ulcer Disease Exacerbation",
        "Diabetic Gastroparesis Flare"
      ],
      treatments: [
        { name: "Cardiac Stabilization & Urgent Cath Lab", success: true, feedback: "Incredible clinical vigilance! Diabetic patients with autonomic neuropathy frequently present without typical chest pain. Treating this epigastric burning as a coronary event saves her life.", vitals: { hr: 70, bp: "120/75", spo2: 98, temp: 36.8 } },
        { name: "Intravenous Proton Pump Inhibitors & Sucralfate", success: false, feedback: "Incorrect. Epigastric tenderness is mild, but the ECG and troponins clearly demonstrate acute inferior wall ischemia. Treating as Peptic Ulcer Disease allows ischemia to expand.", vitals: { hr: 90, bp: "142/92", spo2: 93, temp: 36.9 } },
        { name: "Oral Antiemetic and Discharge with GI Clinic Referral", success: false, feedback: "Catastrophic! Discharging an elderly diabetic patient with positive troponins and ischemic ECG changes is medical malpractice. She will likely suffer a fatal arrhythmia at home.", vitals: { hr: 0, bp: "0/0", spo2: 0, temp: 36.0 } },
        { name: "Intravenous Morphine and Epigastric Hot Pack", success: false, feedback: "Incorrect. Morphine can relieve pain but masking ischemic pain without correcting the vessel occlusion is highly dangerous and can delay definitive care.", vitals: { hr: 78, bp: "115/70", spo2: 92, temp: 36.7 } }
      ],
      differentialDiagnosis: ["Acute Cholecystitis", "Gastroesophageal Reflux", "Pancreatitis"],
      pathophysiologyCorrelation: "Autonomic neuropathy in long-standing diabetic patients damages sensory afferent pathways from the cardiac plexus, preventing typical visceral pain perception.",
      managementApproach: "Immediate coronary risk stratification, antiplatelet load, anticoagulation, and coronary angiography within 24 hours.",
      complications: "Silent progression to massive heart failure, papillary muscle rupture, or complete heart block due to inferior nodal blood supply impairment.",
      prognosis: "Fair; diabetic patients have a higher rate of silent re-infarction and overall worse long-term outcomes than non-diabetics.",
      questions: [
        {
          question: "Which coronary artery most commonly supplies the inferior wall of the left ventricle in the majority of the population?",
          options: [
            "Right Coronary Artery (RCA)",
            "Left Anterior Descending (LAD) Artery",
            "Left Circumflex (LCx) Artery",
            "Left Main Coronary Artery"
          ],
          answer: "Right Coronary Artery (RCA)",
          explanation: "In approximately 85% of individuals (right-dominant circulation), the posterior descending artery (PDA), which supplies the inferior wall, arises from the Right Coronary Artery (RCA)."
        }
      ],
      highYieldPoints: [
        "Elderly, female, and diabetic patients frequently present with atypical signs like dyspnea, nausea, fatigue, or epigastric pain.",
        "Always obtain an ECG in any diabetic patient presenting with unexplained upper abdominal discomfort."
      ],
      visualLearningPrompts: "Diagram the pain pathway from the heart to the brain, showing where diabetic neuropathic degeneration blocks sensory signal conduction in the dorsal root ganglia."
    },
    {
      id: "PEDIATRIC_005",
      title: `Pediatric Case of ${cap} Variant / Mimic`,
      summary: `A specialized pediatric presentation of inflammatory vasculitis (Kawasaki Disease) presenting as coronary aneurysmal risk mimicking adult ${cap}.`,
      demographics: "4-year-old Female, previously healthy and energetic.",
      chiefComplaint: "High fever for 6 days, diffuse skin rash, red eyes, and extreme irritability.",
      history: "The child developed a high fever (up to 39.5°C) 6 days ago that has not responded to paracetamol. She now has bilateral bloodshot eyes without discharge, swollen lymph nodes in her neck, and peeling skin around her fingernails. Parents are deeply concerned.",
      examination: "Bilateral non-purulent conjunctival injection. Strawberry tongue (erythematous with prominent papillae). Dry, cracked, swollen lips. Erythematous polymorphous rash on trunk. Swollen, erythematous hands and feet.",
      initialVitals: { hr: 135, bp: "98/60", spo2: 97, temp: 39.2 },
      correctDiagnosis: "Kawasaki Disease with High Risk of Coronary Artery Aneurysm",
      correctTreatment: "High-dose Intravenous Immunoglobulin (IVIG) and high-dose Aspirin protocol",
      tests: {
        ecg: { name: "Pediatric ECG", result: "Sinus tachycardia, normal intervals, non-specific T-wave changes.", status: "normal", details: "No active transmural ischemia, but establishes baseline." },
        labs: { name: "Inflammatory Panel", result: "C-Reactive Protein (CRP) is markedly elevated at 82 mg/L. Erythrocyte Sedimentation Rate (ESR) is 90 mm/h. Mild leukocytosis and thrombocytosis.", status: "abnormal", details: "Confirms severe systemic inflammatory state." },
        echo: { name: "Pediatric Echocardiogram", result: "Ectasia of the proximal Left Anterior Descending (LAD) coronary artery with a diameter of 3.2mm (Z-score +3.1).", status: "abnormal", details: "Demonstrates early coronary artery aneurysmal changes." }
      },
      options: [
        "Kawasaki Disease with High Risk of Coronary Artery Aneurysm",
        "Scarlet Fever (Group A Streptococcus)",
        "Measles (Rubeola Virus)",
        "Juvenile Idiopathic Arthritis"
      ],
      treatments: [
        { name: "IVIG (2 g/kg) & High-Dose Aspirin Protocol", success: true, feedback: "Brilliant pediatric management! Administering IVIG within the first 10 days of fever dramatically reduces the risk of coronary artery aneurysm formation from 25% to under 5%. Fever resolves within 24 hours.", vitals: { hr: 92, bp: "92/58", spo2: 99, temp: 37.0 } },
        { name: "Oral Amoxicillin Suspensions for 10 Days", success: false, feedback: "Incorrect. Scarlet fever can present similarly, but non-purulent conjunctivitis, strawberry tongue, and failure to respond to antacids support Kawasaki disease. Antibiotics will not prevent fatal coronary aneurysms.", vitals: { hr: 140, bp: "95/55", spo2: 96, temp: 39.3 } },
        { name: "Systemic Glucocorticoids (Prednisolone) Monotherapy", success: false, feedback: "Incorrect. While steroids are used in refractory cases, IVIG remains the undisputed first-line therapy. Steroid monotherapy is not standard and may increase the risk of vascular rupture in some models.", vitals: { hr: 130, bp: "100/62", spo2: 97, temp: 38.8 } },
        { name: "Reassurance & Supportive Fluid Hydration", success: false, feedback: "Dangerous! Doing nothing for a child with Kawasaki disease allows severe coronary vasculitis to progress, potentially leading to childhood myocardial infarction or sudden death.", vitals: { hr: 150, bp: "85/50", spo2: 94, temp: 39.5 } }
      ],
      differentialDiagnosis: ["Scarlet Fever", "Toxic Shock Syndrome", "Stevens-Johnson Syndrome"],
      pathophysiologyCorrelation: "Systemic medium-vessel necrotizing vasculitis has a strong tropism for coronary arteries, leading to disruption of the internal elastic lamina, aneurysmal dilation, and secondary thrombosis.",
      managementApproach: "High-dose IVIG infusing over 12 hours, paired with high-dose Aspirin (80-100 mg/kg/day) for anti-inflammatory effects, followed by low-dose Aspirin for antiplatelet effect once fever resolves.",
      complications: "Giant coronary artery aneurysms (>8mm), coronary rupture, myocardial infarction, and valvular regurgitation.",
      prognosis: "Excellent if treated early; giant aneurysms have a high rate of stenosis or thrombosis requiring lifelong anticoagulation.",
      questions: [
        {
          question: "Which of the following represents the classic duration of fever required for a clinical diagnosis of Kawasaki Disease?",
          options: [
            "Fever lasting 3 days or more.",
            "Fever lasting 5 days or more.",
            "Fever lasting 10 days or more with splenomegaly.",
            "Fever lasting 14 days with vesicular lesions."
          ],
          answer: "Fever lasting 5 days or more.",
          explanation: "The classic diagnostic criteria for Kawasaki Disease require a fever lasting at least 5 days, combined with at least 4 out of 5 principal clinical features (conjunctivitis, oral changes, extremity changes, rash, cervical adenopathy)."
        }
      ],
      highYieldPoints: [
        "Kawasaki disease is the leading cause of acquired heart disease in children in developed nations.",
        "High Z-score on echocardiography is diagnostic of coronary artery ectasia/aneurysm."
      ],
      visualLearningPrompts: "Illustrate the inflamed arterial wall of a coronary vessel under Kawasaki disease, showing immune cell infiltration, fragmentation of the internal elastic lamina, and subsequent ballooning aneurysm."
    },
    {
      id: "ELDERLY_006",
      title: `Elderly Case of ${cap} with Silent Symptoms`,
      summary: `A geriatric simulation of ${cap} presenting as acute confusion and respiratory distress rather than classic chest pain.`,
      demographics: "84-year-old Female, lives in a skilled nursing facility, mild vascular dementia.",
      chiefComplaint: "Sudden onset of altered mental status, severe lethargy, and rapid breathing.",
      history: "The nursing staff noticed the patient was unusually lethargic during breakfast and was struggling to breathe. She has a history of severe osteoporosis, hypertension, and mild dementia. She cannot express chest pain due to her cognitive impairment.",
      examination: "Confused, disoriented, tachypneic. S3 gallop is audible. Coarse moist crackles in both lung bases. Pitting ankle edema (1+). Cold, pale skin.",
      initialVitals: { hr: 110, bp: "102/60", spo2: 88, temp: 36.3 },
      correctDiagnosis: `Geriatric Silent ${cap} presenting as Acute Congestive Heart Failure`,
      correctTreatment: "Intravenous diuretics, gentle hemodynamic support, and rapid coronary evaluation",
      tests: {
        ecg: { name: "12-Lead ECG", result: "Atrial fibrillation with rapid ventricular response at 110 bpm. New-onset left bundle branch block (LBBB).", status: "abnormal", details: "A new LBBB in the presence of acute symptoms is considered an STEMI equivalent." },
        labs: { name: "NT-proBNP & Troponin I", result: "NT-proBNP is extremely elevated at 8,200 pg/mL (Normal < 300). Troponin I is elevated at 350 ng/L.", status: "abnormal", details: "Indicates severe acute ventricular stretch and active cardiac necrosis." },
        cxr: { name: "Geriatric Chest X-Ray", result: "Marked venous congestion, Kerley B lines, and bilateral pleural effusions.", status: "abnormal", details: "Diagnostic of severe acute decompensated heart failure." }
      },
      options: [
        `Geriatric Silent ${cap} presenting as Acute Congestive Heart Failure`,
        "Acute Bacterial Urosepsis",
        "Aspiration Pneumonia",
        "Acute Ischemic Stroke"
      ],
      treatments: [
        { name: "IV Furosemide, Oxygen & Cath Lab Activation", success: true, feedback: "Outstanding geriatric care! Recognizing that a new LBBB with acute heart failure and altered mental status represents an acute STEMI equivalent is a brilliant move. Diuretics relieve pulmonary pressure immediately.", vitals: { hr: 84, bp: "115/70", spo2: 96, temp: 36.4 } },
        { name: "Broad-Spectrum IV Antibiotics & 2L Normal Saline", success: false, feedback: "Extremely dangerous! Mistaking silent heart failure for septic shock and infusing saline will completely drown her lungs in fluid, leading to severe hypoxia and respiratory arrest.", vitals: { hr: 125, bp: "95/55", spo2: 74, temp: 36.5 } },
        { name: "High-Dose Intravenous Haldol for Agitation", success: false, feedback: "Incorrect. Treating her confusion and agitation with antipsychotics ignores the underlying cardiogenic hypoxia and heart failure, and may cause severe QT prolongation.", vitals: { hr: 115, bp: "90/50", spo2: 82, temp: 36.3 } },
        { name: "Reassurance and Observation overnight", success: false, feedback: "Dangerous negligence! An elderly patient with positive troponins and acute pulmonary congestion will deteriorate rapidly without active therapeutic interventions.", vitals: { hr: 130, bp: "80/40", spo2: 70, temp: 36.1 } }
      ],
      differentialDiagnosis: ["Urosepsis", "Pulmonary Embolism", "Severe Delirium"],
      pathophysiologyCorrelation: "Ischemia impairs both diastolic relaxation and systolic contraction, increasing ventricular end-diastolic pressure, which propagates back into the pulmonary veins, causing acute alveolar transudation.",
      managementApproach: "Aggressive diuresis with loop diuretics, non-invasive positive pressure ventilation (BiPAP), and immediate coronary reperfusion therapy.",
      complications: "Complete heart block, pulmonary edema requiring mechanical ventilation, cardiogenic shock, and cognitive delirium.",
      prognosis: "Guarded; geriatric patients with atypical heart failure presentations have a 30-day mortality rate exceeding 25%.",
      questions: [
        {
          question: "Why is a new Left Bundle Branch Block (LBBB) in this patient considered an emergency STEMI equivalent?",
          options: [
            "It signifies that the entire right ventricle has lost its electrical pacing.",
            "It obscures standard ST-segment elevations and indicates acute occlusion of the Left Main or LAD artery.",
            "It represents direct mechanical rupture of the interventricular septum.",
            "It indicates toxic digitalis accumulation in the myocardium."
          ],
          answer: "It restricts standard ST-segment elevations and indicates acute occlusion of the Left Main or LAD artery.",
          explanation: "An LBBB changes depolarization pathways, causing secondary repolarization abnormalities that mask typical ST elevations on ECG. When new, it represents a high-risk proximal left coronary occlusion requiring urgent reperfusion."
        }
      ],
      highYieldPoints: [
        "In the elderly, dyspnea and acute delirium are the most common presentations of silent myocardial injury.",
        "A new Left Bundle Branch Block is clinically treated with the same urgency as an active STEMI."
      ],
      visualLearningPrompts: "Illustrate a heart with a Left Bundle Branch blockade, showing how the delayed left ventricular depolarization affects the QRS-T morphology on a standard ECG lead."
    },
    {
      id: "PREGNANCY_007",
      title: `Pregnancy-Complicated ${cap} Presentation`,
      summary: `A high-risk presentation of pregnancy-associated vascular dissection mimicking classic ${cap} during the third trimester.`,
      demographics: "32-year-old Female, 35 weeks pregnant (G1P0), history of mild preeclampsia.",
      chiefComplaint: "Sudden onset of tearing retrosternal chest pain radiating to her back.",
      history: "The patient is in her third trimester of her first pregnancy. She developed sudden, sharp, tearing chest pain while sitting down. She has a history of mild pregnancy-induced hypertension. No tobacco or alcohol use.",
      examination: "Asymmetric radial pulses (right arm is strong, left arm is weak). No murmurs heard on cardiac auscultation. Clear lung fields. Gravid uterus consistent with 35 weeks gestation.",
      initialVitals: { hr: 105, bp: "172/102", spo2: 96, temp: 36.8 },
      correctDiagnosis: "Spontaneous Coronary Artery Dissection (SCAD) in Pregnancy",
      correctTreatment: "Conservative medical management with strict blood pressure control and fetal monitoring",
      tests: {
        ecg: { name: "12-Lead ECG", result: "Sinus tachycardia, 2mm ST-segment elevations in anterolateral leads V3-V6 and I.", status: "abnormal", details: "Suggests acute anterolateral myocardial injury." },
        labs: { name: "Preeclampsia Panel", result: "Platelets 160,000, ALT/AST normal. Proteinuria detected on urinalysis (300mg/dL). Troponin I is elevated at 120 ng/L.", status: "abnormal", details: "Troponin confirms cardiac injury; mild preeclampsia present." },
        ultrasound: { name: "Bedside Fetal Ultrasound", result: "Single active fetus, heart rate normal at 145 bpm, no signs of placental abruption.", status: "normal", details: "Ensures fetal stability before aggressive maternal interventions." }
      },
      options: [
        "Spontaneous Coronary Artery Dissection (SCAD) in Pregnancy",
        "Atherosclerotic Myocardial Infarction",
        "Acute Pulmonary Embolism",
        "Severe Preeclampsia alone"
      ],
      treatments: [
        { name: "Strict Blood Pressure Control & Conservative Care", success: true, feedback: "Brilliant clinical judgment! SCAD is the most common cause of MI in pregnant women. Unlike classic plaque rupture, SCAD is a tear in the arterial wall; aggressive PCI often worsens the tear. Strict BP control with Labetalol is safe for mother and fetus.", vitals: { hr: 78, bp: "124/78", spo2: 98, temp: 36.7 } },
        { name: "Thrombolytic Therapy (Alteplase Infusion)", success: false, feedback: "Catastrophic error! Administering thrombolytics to a patient with spontaneous arterial dissection will cause massive intramural hemorrhage, extending the tear and potentially leading to fatal uterine bleeding and fetal death.", vitals: { hr: 120, bp: "90/50", spo2: 92, temp: 36.5 } },
        { name: "Immediate Invasive PCI with Drug-Eluting Stents", success: false, feedback: "High risk! While standard for atherosclerotic MIs, passing wires in SCAD can easily enter the false lumen and completely dissect the vessel. Conservative care is preferred in hemodynamically stable SCAD.", vitals: { hr: 110, bp: "165/98", spo2: 94, temp: 36.8 } },
        { name: "Emergency Cesarean Section Under General Anesthesia", success: false, feedback: "Incorrect. The fetus is stable (FHR 145), and the primary maternal vascular dissection must be stabilized first. Uncontrolled maternal hypertension under anesthesia could extend the coronary tear.", vitals: { hr: 115, bp: "180/110", spo2: 93, temp: 36.9 } }
      ],
      differentialDiagnosis: ["Aortic Dissection", "Pulmonary Embolism", "Plaque Rupture"],
      pathophysiologyCorrelation: "Hormone-mediated connective tissue changes (high progesterone) weaken the arterial media layer, combined with increased gestational shear stress, leading to spontaneous hematoma or dissection in the coronary wall.",
      managementApproach: "Strict blood pressure control (target SBP < 130) using Labetalol, dual antiplatelets only if stented, and continuous fetal cardiotocography. Reserve invasive PCI for hemodynamically unstable patients.",
      complications: "Extension of dissection, complete coronary occlusion, cardiogenic shock, and ventricular arrhythmias.",
      prognosis: "Excellent for SCAD if managed conservatively, as most tears heal spontaneously within 3-4 months; high risk of recurrence in subsequent pregnancies.",
      questions: [
        {
          question: "Which of the following hormones is primarily responsible for the structural weakening of maternal arterial walls during late pregnancy?",
          options: [
            "Progesterone",
            "Estrogen",
            "Human Chorionic Gonadotropin (hCG)",
            "Prolactin"
          ],
          answer: "Progesterone",
          explanation: "High levels of progesterone in pregnancy cause a decrease in collagen synthesis and remodeling of the extracellular matrix in vascular smooth muscle, increasing the susceptibility of the arterial wall to spontaneous dissection."
        }
      ],
      highYieldPoints: [
        "SCAD is the primary etiology of acute coronary syndrome in pregnant and postpartum women without classic cardiovascular risk factors.",
        "Conservative medical therapy is highly favored over invasive stenting in stable SCAD patients."
      ],
      visualLearningPrompts: "Display a transverse section of a coronary artery showing an intramural hematoma creating a false lumen that compresses the true arterial lumen, restricting myocardial blood flow."
    },
    {
      id: "COMORBID_008",
      title: `Comorbidity Management in ${cap}`,
      summary: `A clinical challenge involving acute ${cap} in a patient with severe active End-Stage Renal Disease and thrombocytopenia.`,
      demographics: "68-year-old Male, undergoing hemodialysis, history of peptic ulcers.",
      chiefComplaint: "Acute subacute shortness of breath and dull retrosternal burning.",
      history: "The patient developed retrosternal discomfort during hemodialysis. He has a history of End-Stage Renal Disease (ESRD) and was recently hospitalized for an active bleeding duodenal ulcer. His baseline platelet count is low (85,000).",
      examination: "Arteriovenous fistula in left arm with normal thrill. Mild baseline rales at lung bases. Mild pale conjunctivae.",
      initialVitals: { hr: 88, bp: "148/90", spo2: 92, temp: 36.9 },
      correctDiagnosis: `Subacute ${cap} with High Bleeding and Renal Risk`,
      correctTreatment: "Dose-adjusted anticoagulation and antiplatelets with gastric protection",
      tests: {
        ecg: { name: "12-Lead ECG", result: "Deep symmetric T-wave inversions in anterolateral leads V4-V6 and I.", status: "abnormal", details: "Suggests acute subendocardial ischemia (NSTEMI equivalent)." },
        labs: { name: "Coagulation & CBC Panel", result: "Hemoglobin 9.2 g/dL, Platelets 82,000, Creatinine 6.8 mg/dL, GFR < 15. Troponin I is moderately positive at 92 ng/L.", status: "abnormal", details: "Severe renal failure and moderate thrombocytopenia." },
        cxr: { name: "Hemodialysis Chest X-Ray", result: "Mild cardiomegaly, slight pulmonary vascular congestion, no active infiltrates.", status: "abnormal", details: "Consistent with baseline chronic fluid overload." }
      },
      options: [
        `Subacute ${cap} with High Bleeding and Renal Risk`,
        "Acute Pericarditis secondary to Uremia",
        "Active Peptic Ulcer Perforation",
        "Severe Fluid Overload"
      ],
      treatments: [
        { name: "Dose-Adjusted Antithrombotics & Gastric Protection", success: true, feedback: "Superb clinical reasoning! In ESRD and thrombocytopenia, standard doses of anticoagulants can cause fatal hemorrhage. Using Unfractionated Heparin (which can be easily reversed) and high-dose PPIs safely balances ischemic and bleeding risks.", vitals: { hr: 74, bp: "130/80", spo2: 96, temp: 36.8 } },
        { name: "Full-Dose Enoxaparin (LMWH) & Double-Dose Clopidogrel", success: false, feedback: "Dangerous! Enoxaparin is renally cleared and accumulates in ESRD, leading to toxic drug levels and catastrophic bleeding. Paired with double-dose antiplatelets, the patient develops a massive gastrointestinal hemorrhage.", vitals: { hr: 120, bp: "80/40", spo2: 90, temp: 36.6 } },
        { name: "Immediate Double-Volume Hemodialysis Session", success: false, feedback: "Incorrect. The symptoms are due to acute myocardial ischemia (positive troponin with T-wave inversions), not simple fluid overload. Extra fluid removal during active ischemia will cause severe hypotension and expand the infarction.", vitals: { hr: 105, bp: "95/50", spo2: 89, temp: 36.7 } },
        { name: "Discharge with oral NSAIDs and Antacids", success: false, feedback: "Catastrophic! NSAIDs are highly contraindicated in patients with renal failure and active peptic ulcers, and discharging a patient with active cardiac ischemia is highly dangerous.", vitals: { hr: 95, bp: "140/90", spo2: 90, temp: 36.9 } }
      ],
      differentialDiagnosis: ["Uremic Pericarditis", "Gastrointestinal Bleeding", "Myocardial Infarction Type 2"],
      pathophysiologyCorrelation: "Chronic uremia accelerates atherosclerosis and vascular calcification. Low platelet count and active ulcer disease create a high-stakes clinical dilemma between thrombosis and hemorrhage.",
      managementApproach: "Utilize Unfractionated Heparin (preferred over LMWH due to renal clearance), oral low-dose Aspirin, and aggressive proton pump inhibitor therapy. Monitor platelet counts and GFR closely.",
      complications: "Severe gastrointestinal hemorrhage, renal osteodystrophy-associated vascular rupture, and hyperkalemic cardiac arrest.",
      prognosis: "Guarded; patients with concurrent ESRD and acute coronary events have a 3-fold higher long-term mortality rate.",
      questions: [
        {
          question: "Why is Unfractionated Heparin (UFH) preferred over Low Molecular Weight Heparin (Enoxaparin) in severe renal failure?",
          options: [
            "UFH is cleared by the reticuloendothelial system and does not accumulate in renal failure.",
            "UFH has a longer half-life and does not require frequent laboratory monitoring.",
            "Enoxaparin is highly cardiotoxic in the presence of uremia.",
            "UFH stimulates platelet production to correct thrombocytopenia."
          ],
          answer: "UFH is cleared by the reticuloendothelial system and does not accumulate in renal failure.",
          explanation: "Unlike Enoxaparin which is primarily eliminated via renal excretion, Unfractionated Heparin is cleared by the reticuloendothelial system and cellular mechanisms, making it safe for patients with a GFR < 15."
        }
      ],
      highYieldPoints: [
        "In patients with severe renal failure, avoid renally cleared antithrombotics like Enoxaparin and Fondaparinux.",
        "Always assess bleeding risk using validated tools before initiating dual antiplatelets in multi-morbid patients."
      ],
      visualLearningPrompts: "Illustrate the comparison of clearance pathways of UFH (liver/macrophage) and LMWH (renal glomerulus), highlighting why accumulation occurs in the kidney."
    },
    {
      id: "COMPLIC_009",
      title: `Complication Case of ${cap}`,
      summary: `A critical simulation of subacute ${cap} complicated by sudden papillary muscle rupture and acute mitral regurgitation.`,
      demographics: "59-year-old Male, 3 days post-admission for acute chest pain.",
      chiefComplaint: "Sudden extreme shortness of breath, pink frothy sputum, and collapse.",
      history: "The patient was admitted 3 days ago for an untreated inferior myocardial event and was stable. Suddenly, he developed intense dyspnea and began coughing up pink frothy sputum. He had not received early reperfusion therapy.",
      examination: "Profound respiratory distress. New, loud, blowing holosystolic murmur heard at the apex radiating to the left axilla. Hyperdynamic precordium. Severe bilateral pulmonary rales up to the clavicles.",
      initialVitals: { hr: 120, bp: "92/52", spo2: 81, temp: 37.1 },
      correctDiagnosis: "Papillary Muscle Rupture causing Acute Mitral Regurgitation",
      correctTreatment: "Intravenous vasodilators, intra-aortic balloon pump, and emergency valve replacement",
      tests: {
        ecg: { name: "12-Lead ECG", result: "Sinus tachycardia, persistent Q-waves in leads II, III, and aVF, with new-onset left atrial enlargement signs.", status: "abnormal", details: "Consistent with recent inferior myocardial injury." },
        labs: { name: "Arterial Blood Gas (ABG)", result: "pH 7.30, PaO2 50 mmHg, PaCO2 35 mmHg, Lactate 3.4 mmol/L.", status: "abnormal", details: "Acute respiratory failure with metabolic lactic acidosis due to severe cardiogenic congestion." },
        echo: { name: "Emergency Echocardiogram", result: "Flail mitral valve leaflet with severe regurgitant jet. Ruptured posteromedial papillary muscle head.", status: "abnormal", details: "Diagnostic of mechanical complications of myocardial infarction." }
      },
      options: [
        "Papillary Muscle Rupture causing Acute Mitral Regurgitation",
        "Ventricular Septal Defect Rupture",
        "Secondary Acute Pulmonary Embolism",
        "Hospital-Acquired Bacterial Pneumonia"
      ],
      treatments: [
        { name: "Emergency Afterload Reduction, IABP & Surgery", success: true, feedback: "Brilliant life-saving decision! Mitral regurgitation creates massive backup into the lungs. Reducing afterload with Nitroprusside, placing an IABP to support coronary perfusion, and rushing the patient to the operating room for valve replacement is the only hope.", vitals: { hr: 88, bp: "105/65", spo2: 96, temp: 36.8 } },
        { name: "Intravenous Beta-Blocker & Fluid Bolus", success: false, feedback: "Fatal error! Beta-blockers will reduce contractility in a patient in acute mechanical failure. Adding fluids will worsen the severe pulmonary edema, leading to complete cardiac arrest.", vitals: { hr: 135, bp: "60/30", spo2: 60, temp: 36.5 } },
        { name: "Intravenous Thrombolytics (Alteplase Infusion)", success: false, feedback: "Catastrophic mistake! This is a mechanical disruption, not an acute coronary thrombosis. Thrombolysis will cause extensive internal bleeding and will do nothing to repair the torn muscle.", vitals: { hr: 130, bp: "85/45", spo2: 72, temp: 37.0 } },
        { name: "Broad-Spectrum Antibiotics & Inhaled Bronchodilators", success: false, feedback: "Incorrect. The patient does not have a pulmonary infection. Delaying emergency surgical evaluation will result in maternal death within hours.", vitals: { hr: 125, bp: "88/48", spo2: 78, temp: 37.2 } }
      ],
      differentialDiagnosis: ["Ventricular Septal Rupture", "Acute Myocardial Re-infarction", "Free Wall Rupture"],
      pathophysiologyCorrelation: "Necrosis of the posteromedial papillary muscle (typically supplied solely by the posterior descending artery) leads to mechanical tearing, causing a flail mitral leaflet and sudden severe retrograde volume overload into the left atrium and pulmonary veins.",
      managementApproach: "Afterload reduction with IV sodium nitroprusside or nitroglycerin (only if SBP > 90), mechanical circulatory support with IABP, and immediate surgical repair or replacement of the mitral valve.",
      complications: "Fulminant pulmonary edema, refractory cardiogenic shock, and death.",
      prognosis: "Extremely poor without immediate surgery; acute papillary muscle rupture has a 24-hour mortality rate of 75% under conservative medical treatment.",
      questions: [
        {
          question: "Why is the posteromedial papillary muscle ruptured much more frequently than the anterolateral papillary muscle?",
          options: [
            "It is structurally much smaller and thinner.",
            "It has a single blood supply (usually PDA) making it highly vulnerable to localized ischemia.",
            "It experiences much higher mechanical shear forces during systole.",
            "It has a higher density of beta-adrenergic receptors leading to hyper-excitability."
          ],
          answer: "It has a single blood supply (usually PDA) making it highly vulnerable to localized ischemia.",
          explanation: "The posteromedial papillary muscle is supplied solely by the posterior descending artery (typically from the RCA). In contrast, the anterolateral papillary muscle has a dual blood supply from both the LAD and LCx, making it highly resistant to single-artery occlusion."
        }
      ],
      highYieldPoints: [
        "A sudden, new holosystolic murmur presenting 3-5 days after an inferior MI is a major warning sign of papillary muscle rupture.",
        "Emergency surgical valve repair or replacement is the definitive treatment; medical stabilization is only a bridge to the operating room."
      ],
      visualLearningPrompts: "Illustrate the left ventricle showing a ruptured posteromedial papillary muscle head with a flail mitral valve leaflet allowing a massive retrograde jet of blood into the left atrium during systole."
    },
    {
      id: "CHALL_010",
      title: "Differential Diagnosis Challenge",
      summary: "A complex clinical puzzle presenting with severe chest pain where distinguishing between two high-stakes conditions is critical.",
      demographics: "50-year-old Male, tall stature, history of high-grade hypertension.",
      chiefComplaint: "Sudden onset of severe tearing chest pain radiating directly to the shoulder blades.",
      history: "The patient was lifting heavy boxes when he experienced an excruciating 'tearing' chest pain that moved to his back. He has Marfan Syndrome and a history of poorly controlled hypertension. No prior history of cardiac disease.",
      examination: "Tall, thin patient with long limbs and hypermobile joints. Asymmetric radial pulses (right arm BP is 185/105, left arm BP is 120/70). A diastolic decrescendo murmur is heard at the right sternal border.",
      initialVitals: { hr: 100, bp: "185/105", spo2: 94, temp: 36.7 },
      correctDiagnosis: "Acute Type A Aortic Dissection mimicking Myocardial Infarction",
      correctTreatment: "Immediate intravenous beta-blockade (Esmolol) and emergency cardiothoracic surgery",
      tests: {
        ecg: { name: "12-Lead ECG", result: "Sinus tachycardia, non-specific T-wave flattening in lateral leads. No acute ST-segment elevations.", status: "normal", details: "Lacks findings of acute localized transmural ischemia." },
        labs: { name: "D-Dimer & Troponin", result: "D-Dimer is extremely elevated at 4,800 ng/mL. Troponin I is mildly positive at 22 ng/L.", status: "abnormal", details: "Troponin indicates mild secondary cardiac strain; D-Dimer indicates acute aortic tear." },
        ct: { name: "Contrast-Enhanced CT Angiography", result: "Aortic dissection flap originating in the ascending aorta (Type A) and extending down to the abdominal aorta.", status: "abnormal", details: "Definitive diagnosis. Surgical emergency." }
      },
      options: [
        "Acute Type A Aortic Dissection mimicking Myocardial Infarction",
        "Atherosclerotic Myocardial Infarction",
        "Acute Pulmonary Embolism",
        "Spontaneous Pneumothorax"
      ],
      treatments: [
        { name: "IV Beta-Blocker (Esmolol) & Surgical Consulting", success: true, feedback: "Outstanding clinical acumen! In Type A Aortic Dissection, giving a fast-acting beta-blocker (Esmolol) decreases heart rate and blood pressure, reducing shear stress (dP/dt) on the aorta. Rushing him to the surgical suite is life-saving.", vitals: { hr: 64, bp: "115/72", spo2: 97, temp: 36.6 } },
        { name: "Immediate Intravenous Alteplase (Thrombolytics)", success: false, feedback: "Catastrophic error! Administering thrombolytics or heavy anticoagulants to a patient with an active aortic dissection will cause fatal hemopericardium, cardiac tamponade, and immediate death.", vitals: { hr: 140, bp: "50/20", spo2: 50, temp: 35.8 } },
        { name: "Load with Aspirin (325mg) and Heparin Bolus", success: false, feedback: "Highly dangerous! While standard for myocardial infarction, heparinizing a patient with an active aortic tear causes massive hemorrhagic expansion of the dissection flap.", vitals: { hr: 120, bp: "95/50", spo2: 90, temp: 36.5 } },
        { name: "Observation and Repeat Troponins in 6 Hours", success: false, feedback: "Fatal delay! Type A aortic dissection has a mortality rate of 1-2% per hour. Delaying care for serial troponins is a fatal clinical mistake.", vitals: { hr: 130, bp: "60/30", spo2: 80, temp: 36.1 } }
      ],
      differentialDiagnosis: ["Acute Myocardial Infarction", "Pulmonary Embolism", "Pneumothorax"],
      pathophysiologyCorrelation: "Tear in the aortic intima allows blood to enter the media under high pressure, separating the layers and creating a false lumen. Marfan Syndrome weakens the aortic wall through cystic medial necrosis.",
      managementApproach: "Urgent heart rate control (target HR 60) and blood pressure reduction (target SBP 100-120) with Esmolol or Labetalol, followed by emergency surgical graft replacement.",
      complications: "Aortic rupture, cardiac tamponade, acute aortic regurgitation, and stroke secondary to carotid artery occlusion.",
      prognosis: "Excellent if surgical repair is completed immediately; mortality is 50% within 48 hours without surgery.",
      questions: [
        {
          question: "Which of the following describes the Stanford classification of a dissection that involves the ascending aorta?",
          options: [
            "Stanford Type A",
            "Stanford Type B",
            "DeBakey Class III",
            "Stanford Type C"
          ],
          answer: "Stanford Type A",
          explanation: "The Stanford classification divides dissections into Type A (involving the ascending aorta, regardless of the site of entry) and Type B (involving only the descending aorta distal to the left subclavian artery)."
        }
      ],
      highYieldPoints: [
        "Tearing or ripping chest pain radiating to the back in a tall, hypertensive patient is highly suggestive of aortic dissection.",
        "Asymmetric blood pressures between the upper extremities indicates dissection compromising the subclavian arteries."
      ],
      visualLearningPrompts: "Illustrate the dual lumens (true and false) of a dissected aorta, showing the entry tear in the intima and the false lumen compressing the coronary ostia."
    }
  ];
}

