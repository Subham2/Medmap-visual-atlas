import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  Activity,
  Heart,
  Brain,
  ShieldAlert,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Stethoscope,
  Beaker,
  BookOpen,
  FileSpreadsheet,
  Download,
  Trash2,
  ExternalLink,
  Lock,
  Database,
  Network,
  Gauge,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import {
  PatientVitals,
  PatientCase,
  DrugInteraction,
  SymptomAnalysis
} from './types';
import PatientMonitor from './components/PatientMonitor';
import SymptomMapper from './components/SymptomMapper';

// Secondary tabs are code-split: React Flow, the quiz and the audit panel load only when opened.
const DrugMatrix = lazy(() => import('./components/DrugMatrix'));
const ObsidianMindMap = lazy(() => import('./components/ObsidianMindMap'));
const ClinicalQuiz = lazy(() => import('./components/ClinicalQuiz'));
const ComplianceAudit = lazy(() => import('./components/ComplianceAudit'));

/** localStorage can throw (quota exceeded, blocked storage); the journal must never crash a sync. */
function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[Storage] Could not persist ${key}`, err);
  }
}

const TabFallback = () => (
  <div className="h-full flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-mono text-slate-500 animate-pulse">
    LOADING MODULE…
  </div>
);
import {
  initAuth,
  googleSignIn,
  googleSignOut
} from './lib/firebaseAuth';
import { findExistingSpreadsheet } from './lib/sheetsService';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  const [rightTab, setRightTab] = useState<'simulator' | 'pharmacology' | 'mindmap' | 'quiz' | 'compliance'>('simulator');

  // API Availability Status
  const [isApiSimulated, setIsApiSimulated] = useState<boolean>(true);

  // Google Sheets Integration State
  const [sheetsUser, setSheetsUser] = useState<any>(null);
  const [sheetsToken, setSheetsToken] = useState<string | null>(null);
  const [isExportingToSheets, setIsExportingToSheets] = useState<boolean>(false);
  const [sheetsSpreadsheetId, setSheetsSpreadsheetId] = useState<string | null>(null);
  const [sheetsExportSuccess, setSheetsExportSuccess] = useState<boolean>(false);
  const [sheetsExportError, setSheetsExportError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem('medmap_last_sync_time');
    } catch {
      return null;
    }
  });
  const [localLogs, setLocalLogs] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('medmap_local_logs') || '[]');
    } catch {
      return [];
    }
  });

  // Symptom Analysis State
  const [symptomAnalysis, setSymptomAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isSymptomAnalyzing, setIsSymptomAnalyzing] = useState<boolean>(false);

  // Pharmacology State
  const [drugInteraction, setDrugInteraction] = useState<DrugInteraction | null>(null);
  const [isDrugChecking, setIsDrugChecking] = useState<boolean>(false);

  // Case Simulator State
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [activeCase, setActiveCase] = useState<PatientCase | null>(null);
  const [activeVitals, setActiveVitals] = useState<PatientVitals | null>(null);
  const [orderedDiagnostics, setOrderedDiagnostics] = useState<Record<string, boolean>>({});
  const [diagnosticProgress, setDiagnosticProgress] = useState<Record<string, boolean>>({});
  const [userSelectedDiagnosis, setUserSelectedDiagnosis] = useState<string>('');
  const [diagnosisCheckResult, setDiagnosisCheckResult] = useState<'correct' | 'incorrect' | null>(null);
  const [treatmentFeedback, setTreatmentFeedback] = useState<string | null>(null);
  const [selectedTreatmentName, setSelectedTreatmentName] = useState<string>('');

  // Dynamic Case Generation State
  const [activeTopic, setActiveTopic] = useState<string>('Myocardial Infarction');
  // Bumped whenever a topic is explicitly applied, so the symptom mapper rebuilds for it.
  const [topicVersion, setTopicVersion] = useState(0);
  const [generationTopic, setGenerationTopic] = useState('Myocardial Infarction');
  const [isGeneratingCases, setIsGeneratingCases] = useState(false);
  const [caseGenerationError, setCaseGenerationError] = useState<string | null>(null);
  const [generationSuccessMessage, setGenerationSuccessMessage] = useState<string | null>(null);

  // Educator Corner & Reasoning Quiz States
  const [showEducatorCorner, setShowEducatorCorner] = useState<boolean>(true);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  // Clock state
  const [currentTime, setCurrentTime] = useState<string>('');

  // Initialize data on mount
  useEffect(() => {
    // Clock
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Fetch cases and test server API status
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases');
        if (res.ok) {
          const data = await res.json();
          setCases(data);
        }
      } catch (err) {
        console.error('Failed to fetch cases:', err);
      }
    };

    const testApiStatus = async () => {
      try {
        // Fetch lightweight api status to see if gemini is configured on server
        const testRes = await fetch('/api/status');
        if (testRes.ok) {
          const testData = await testRes.json();
          setIsApiSimulated(testData.source !== 'gemini');
        }
      } catch (err) {
        setIsApiSimulated(true);
      }
    };

    fetchCases();
    testApiStatus();

    // Initialize Sheets Google Authentication
    const unsubscribeAuth = initAuth(
      (user, token) => {
        setSheetsUser(user);
        setSheetsToken(token);
        // Try to load any stored Spreadsheet ID from localStorage
        const savedId = localStorage.getItem('medmap_spreadsheet_id');
        if (savedId) {
          setSheetsSpreadsheetId(savedId);
        }
      },
      () => {
        setSheetsUser(null);
        setSheetsToken(null);
      }
    );

    return () => {
      clearInterval(interval);
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // Handler: Generate Case Studies dynamically
  const handleGenerateCases = async (topic: string) => {
    if (!topic.trim()) return;
    setIsGeneratingCases(true);
    setCaseGenerationError(null);
    setGenerationSuccessMessage(null);
    try {
      const res = await fetch('/api/generate-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload && Array.isArray(payload.data) && payload.data.length > 0) {
          setCases(payload.data);
          setActiveTopic(topic);
          setTopicVersion((v) => v + 1);
          setIsApiSimulated(payload.source !== 'gemini');
          // Stay on the catalogue so the learner can pick a case (auto-opening hid the success banner).
          setActiveCase(null);
          setActiveVitals(null);
          setGenerationSuccessMessage(
            payload.source === 'gemini'
              ? `Generated ${payload.data.length} AI case studies for "${topic}".`
              : `AI provider offline: loaded ${payload.data.length} curated offline case${payload.data.length === 1 ? '' : 's'} closest to "${topic}".`,
          );
        } else {
          throw new Error('The server returned no playable case studies.');
        }
      } else {
        throw new Error(`Server returned error: ${res.statusText}`);
      }
    } catch (err: any) {
      console.error(err);
      setCaseGenerationError(err?.message || 'Failed to generate case scenarios.');
    } finally {
      setIsGeneratingCases(false);
    }
  };

  const handleGlobalTopicApply = (newTopic: string) => {
    if (!newTopic.trim()) return;
    setActiveTopic(newTopic);
    setGenerationTopic(newTopic);
    handleGenerateCases(newTopic);
  };



  // Handler: Analyze Symptoms
  const handleAnalyzeSymptoms = async (selectedSyms: string[]): Promise<SymptomAnalysis | null> => {
    setIsSymptomAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: selectedSyms })
      });
      if (res.ok) {
        const body = await res.json();
        setSymptomAnalysis(body.data);
        setIsApiSimulated(body.source !== 'gemini');
        return body.data;
      }
    } catch (err) {
      console.error('Failed to analyze symptoms:', err);
    } finally {
      setIsSymptomAnalyzing(false);
    }
    return null;
  };

  // Handler: Check Drug Interaction
  const handleCheckDrugInteraction = async (drugA: string, drugB: string): Promise<DrugInteraction | null> => {
    setIsDrugChecking(true);
    try {
      const res = await fetch('/api/get-drug-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drugA, drugB })
      });
      if (res.ok) {
        const body = await res.json();
        setDrugInteraction(body.data);
        setIsApiSimulated(body.source !== 'gemini');
        return body.data;
      }
    } catch (err) {
      console.error('Failed to check drug interaction:', err);
    } finally {
      setIsDrugChecking(false);
    }
    return null;
  };

  // Handler: Case study load
  const handleLoadCase = (pCase: PatientCase) => {
    setActiveCase(pCase);
    setActiveVitals(pCase.initialVitals);
    setOrderedDiagnostics({});
    setDiagnosticProgress({});
    setUserSelectedDiagnosis('');
    setDiagnosisCheckResult(null);
    setTreatmentFeedback(null);
    setSelectedTreatmentName('');
    setShowEducatorCorner(true);
    setUserAnswers({});
  };

  // Handler: Order case diagnostic test with simulated processing timer
  const handleOrderDiagnostic = (testKey: string) => {
    if (diagnosticProgress[testKey] || orderedDiagnostics[testKey]) return;

    setDiagnosticProgress((prev) => ({ ...prev, [testKey]: true }));

    // Simulate clinical machine spinning
    setTimeout(() => {
      setDiagnosticProgress((prev) => ({ ...prev, [testKey]: false }));
      setOrderedDiagnostics((prev) => ({ ...prev, [testKey]: true }));
    }, 1500);
  };

  // Handler: Evaluate user diagnosis hypothesis
  const handleCheckDiagnosis = (selected: string) => {
    setUserSelectedDiagnosis(selected);
    const isCorrect = selected === activeCase?.correctDiagnosis;
    setDiagnosisCheckResult(isCorrect ? 'correct' : 'incorrect');
  };

  // Handler: Execute clinical treatment intervention
  const handleExecuteTreatment = (option: any) => {
    setSelectedTreatmentName(option.name);
    setTreatmentFeedback(option.feedback);

    // Apply vitals transformation in real-time on monitor!
    if (option.vitals) {
      setActiveVitals(option.vitals);
    }
  };

  // Google Sheets Authentication and Export Handlers
  const handleSheetsSignIn = async () => {
    try {
      setSheetsExportError(null);
      const result = await googleSignIn();
      if (result) {
        setSheetsUser(result.user);
        setSheetsToken(result.accessToken);
        // Refresh check for spreadsheet
        const existingId = await findExistingSpreadsheet(result.accessToken);
        if (existingId) {
          setSheetsSpreadsheetId(existingId);
          safeSetItem('medmap_spreadsheet_id', existingId);
        }
      }
    } catch (err: any) {
      console.error('Google Sheets Authentication failed:', err);
      setSheetsExportError(err.message || 'Authentication failed');
    }
  };

  const handleSheetsSignOut = async () => {
    try {
      await googleSignOut();
      setSheetsUser(null);
      setSheetsToken(null);
      setSheetsExportSuccess(false);
    } catch (err: any) {
      console.error('Google Sign-Out failed:', err);
    }
  };

  const handleExportToSheets = async () => {
    if (!activeCase || !activeVitals) {
      setSheetsExportError("No active simulation run to synchronize. Please complete a patient scenario first.");
      return;
    }

    setIsExportingToSheets(true);
    setSheetsExportError(null);
    setSheetsExportSuccess(false);

    // Format fields
    const orderedTestsList = Object.keys(activeCase.tests)
      .filter((key) => orderedDiagnostics[key])
      .map((key) => `${activeCase.tests[key].name}: ${activeCase.tests[key].result}`)
      .join(' | ') || 'None ordered';

    const vitalsBeforeStr = `HR: ${activeCase.initialVitals.hr} bpm, BP: ${activeCase.initialVitals.bp} mmHg, SpO2: ${activeCase.initialVitals.spo2}%, Temp: ${activeCase.initialVitals.temp}°C`;
    const vitalsAfterStr = `HR: ${activeVitals.hr} bpm, BP: ${activeVitals.bp} mmHg, SpO2: ${activeVitals.spo2}%, Temp: ${activeVitals.temp}°C`;
    
    const outcomeStatus = activeCase.treatments.find((t) => t.name === selectedTreatmentName)?.success
      ? 'STABILIZED (SUCCESSFUL INTERVENTION)'
      : 'CRITICAL STATE (COMPLICATED OUTCOME)';

    // Fallback data structure for local log saving
    const newLocalLog = {
      timestamp: new Date().toUTCString(),
      caseId: activeCase.id,
      caseTitle: activeCase.title,
      demographics: activeCase.demographics,
      presentingSymptoms: activeCase.summary,
      vitalsBefore: vitalsBeforeStr,
      diagnosticsOrdered: orderedTestsList,
      suspectedDiagnosis: userSelectedDiagnosis || 'Incomplete clinical workup',
      interventionChosen: selectedTreatmentName || 'None executed',
      vitalsAfter: vitalsAfterStr,
      outcome: outcomeStatus,
      attendingFeedback: outcomeStatus.includes('STABILIZED')
        ? `Excellent clinical performance. You successfully recognized the presenting symptoms and initiated the appropriate therapeutic measures.`
        : `Critique: The therapeutic intervention did not address the acute pathology. Closely evaluate diagnostic indicators to avoid fatal delays in care.`,
      learningPoints: outcomeStatus.includes('STABILIZED')
        ? `Early gold-standard therapy minimizes target organ injury and optimizes clinical outcomes.`
        : `Differentiating acute life-threatening situations from benign mimics is a core competency under pressure.`
    };

    // If Google token is missing, execute a GRACEFUL OFFLINE FALLBACK
    if (!sheetsToken) {
      const updatedLogs = [newLocalLog, ...localLogs];
      setLocalLogs(updatedLogs);
      safeSetItem('medmap_local_logs', JSON.stringify(updatedLogs));
      
      const syncTime = new Date().toLocaleTimeString();
      setLastSyncTime(syncTime);
      safeSetItem('medmap_last_sync_time', syncTime);
      
      setSheetsExportSuccess(true);
      setIsExportingToSheets(false);
      return;
    }

    try {
      // POST to secure backend endpoint
      const response = await fetch("/api/sync-to-sheets", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${sheetsToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          spreadsheetId: sheetsSpreadsheetId,
          caseId: activeCase.id,
          caseTitle: activeCase.title,
          demographics: activeCase.demographics,
          presentingSymptoms: activeCase.summary,
          vitalsBefore: vitalsBeforeStr,
          diagnosticsOrdered: orderedTestsList,
          suspectedDiagnosis: userSelectedDiagnosis || 'Incomplete clinical workup',
          interventionChosen: selectedTreatmentName || 'None executed',
          vitalsAfter: vitalsAfterStr,
          outcome: outcomeStatus
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          // Expired Google token: drop it so the next attempt prompts a fresh sign-in.
          setSheetsToken(null);
          setSheetsUser(null);
          sessionStorage.removeItem('medmap_sheets_token');
        }
        throw new Error(errData.error || `Sync failed (HTTP ${response.status})`);
      }

      const result = await response.json();

      // Set spreadsheet ID and save
      if (result.spreadsheetId) {
        setSheetsSpreadsheetId(result.spreadsheetId);
        safeSetItem('medmap_spreadsheet_id', result.spreadsheetId);
      }

      // Overwrite feedback and learning points with high-quality Gemini ones from backend
      newLocalLog.attendingFeedback = result.attendingFeedback || newLocalLog.attendingFeedback;
      newLocalLog.learningPoints = result.learningPoints || newLocalLog.learningPoints;
      newLocalLog.timestamp = result.timestamp || newLocalLog.timestamp;

      // Save to local logs for history viewing
      const updatedLogs = [newLocalLog, ...localLogs];
      setLocalLogs(updatedLogs);
      safeSetItem('medmap_local_logs', JSON.stringify(updatedLogs));

      const syncTime = new Date().toLocaleTimeString();
      setLastSyncTime(syncTime);
      safeSetItem('medmap_last_sync_time', syncTime);

      setSheetsExportSuccess(true);
    } catch (err: any) {
      console.error('Google Sheets export failed:', err);
      setSheetsExportError(err.message || 'Synchronization failed.');
    } finally {
      setIsExportingToSheets(false);
    }
  };

  const handleDownloadCSV = () => {
    if (localLogs.length === 0) return;
    const headers = [
      "Timestamp (UTC)", "Case ID", "Patient Demographics", "Presenting Symptoms",
      "Vitals Before Intervention", "Diagnostics Ordered", "Suspected Diagnosis",
      "Intervention Chosen", "Vitals After Intervention", "Outcome", "Attending Feedback", "Learning Points"
    ];
    const csvContent = [
      headers.join(","),
      ...localLogs.map(log => [
        `"${log.timestamp}"`,
        `"${log.caseId}"`,
        `"${(log.demographics || '').replace(/"/g, '""')}"`,
        `"${(log.presentingSymptoms || '').replace(/"/g, '""')}"`,
        `"${(log.vitalsBefore || '').replace(/"/g, '""')}"`,
        `"${(log.diagnosticsOrdered || '').replace(/"/g, '""')}"`,
        `"${(log.suspectedDiagnosis || '').replace(/"/g, '""')}"`,
        `"${(log.interventionChosen || '').replace(/"/g, '""')}"`,
        `"${(log.vitalsAfter || '').replace(/"/g, '""')}"`,
        `"${(log.outcome || '').replace(/"/g, '""')}"`,
        `"${(log.attendingFeedback || '').replace(/"/g, '""')}"`,
        `"${(log.learningPoints || '').replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MedMap_Clinical_Simulation_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearLocalLogs = () => {
    const confirmed = window.confirm("Are you sure you want to clear your local simulation run history? This action cannot be undone.");
    if (confirmed) {
      setLocalLogs([]);
      localStorage.removeItem('medmap_local_logs');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* 1. Header Navigation Bar */}
      <header className="px-6 py-4 bg-slate-950 border-b border-slate-900 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Activity className="w-5.5 h-5.5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-md font-bold tracking-wider font-display text-slate-100 uppercase">
                MEDMAP VISUAL ATLAS
              </h1>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                v1.2-LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-0.5">
              FULL-SPECTRUM PHYSIOLOGICAL PATHWAYS & CLINICAL EMERGENCY SIM LAB
            </p>
          </div>
        </div>

        {/* Global Focus Topic Selection Widget */}
        <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 w-full sm:w-auto sm:min-w-[340px] shadow-inner">
          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded tracking-widest shrink-0">
            ACTIVE CLINICAL FOCUS
          </span>
          <input
            type="text"
            value={activeTopic}
            onChange={(e) => setActiveTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGlobalTopicApply(activeTopic)}
            placeholder="Type clinical focus topic..."
            className="bg-transparent text-xs font-mono text-slate-100 focus:outline-none w-full placeholder:text-slate-600"
          />
          <button 
            onClick={() => handleGlobalTopicApply(activeTopic)}
            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-mono font-bold rounded-lg transition-colors cursor-pointer"
          >
            APPLY
          </button>
        </div>

        {/* Global Metadata & API indicator */}
        <div className="flex items-center gap-5 font-mono text-[10px]">
          {/* UTC Clock */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime || 'LOADING...'}</span>
          </div>

          {/* Model connection status */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isApiSimulated ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
            <span>
              API STATE: <strong className={isApiSimulated ? 'text-amber-400' : 'text-emerald-400'}>
                {isApiSimulated ? 'LOCAL OFFLINE' : 'GEMINI ADVANCED'}
              </strong>
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 max-w-[1600px] w-full mx-auto overflow-hidden">
        
        {/* ================= LEFT SIDEBAR/COLUMN ================= */}
        <section className="lg:col-span-4 flex flex-col gap-4 h-full min-h-[600px] overflow-hidden">
          {/* Tab Contents Left */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <SymptomMapper 
              onStatusChange={(simulated) => setIsApiSimulated(simulated)} 
              activeTopic={activeTopic}
              setActiveTopic={setActiveTopic}
              topicVersion={topicVersion}
            />
          </div>
        </section>

        {/* ================= RIGHT MAIN AREA ================= */}
        <section className="lg:col-span-8 flex flex-col gap-4 h-full min-h-[600px] overflow-hidden">
          {/* Tab Control Right */}
          <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1.5 shrink-0">
            <button
              id="right-tab-simulator"
              onClick={() => setRightTab('simulator')}
              className={`py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                rightTab === 'simulator'
                  ? 'bg-slate-950 text-slate-100 shadow-md border-b-2 border-rose-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              SIMULATOR
            </button>
            <button
              id="right-tab-mindmap"
              onClick={() => setRightTab('mindmap')}
              className={`py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                rightTab === 'mindmap'
                  ? 'bg-slate-950 text-slate-100 shadow-md border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              MIND MAP
            </button>
            <button
              id="right-tab-pharmacology"
              onClick={() => setRightTab('pharmacology')}
              className={`py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                rightTab === 'pharmacology'
                  ? 'bg-slate-950 text-slate-100 shadow-md border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Beaker className="w-3.5 h-3.5 text-amber-400" />
              PHARMACOLOGY
            </button>
            <button
              id="right-tab-quiz"
              onClick={() => setRightTab('quiz')}
              className={`py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                rightTab === 'quiz'
                  ? 'bg-slate-950 text-slate-100 shadow-md border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              CLINICAL QUIZ
            </button>
            <button
              id="right-tab-compliance"
              onClick={() => setRightTab('compliance')}
              className={`py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                rightTab === 'compliance'
                  ? 'bg-slate-950 text-slate-100 shadow-md border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              AUDIT & COMPLIANCE
            </button>
          </div>

          {/* Tab Contents Right */}
          <div className="flex-1 flex flex-col min-h-0">
            {rightTab === 'simulator' && (
              <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {!activeCase ? (
                  /* View A: Case Catalogue */
                  <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                        HIGH-STAKES CLINICAL EMERGENCY CASE STUDIES
                      </h3>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Choose a case to enter the emergency ward and coordinate live diagnostics and therapeutic interventions
                      </p>
                    </div>

                    {/* Dynamic Case Generation Panel */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                            AI CLINICAL SIMULATOR GENERATOR
                          </h4>
                          <p className="text-[9px] text-slate-500 font-sans mt-0.5">
                            Enter any medical condition, syndromic topic, or anatomical region to construct a custom suite of 10 clinical case profiles
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={generationTopic}
                          onChange={(e) => setGenerationTopic(e.target.value)}
                          placeholder="e.g., Myocardial Infarction, Aortic Dissection, Asthma..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                        />
                        <button
                          onClick={() => handleGenerateCases(generationTopic)}
                          disabled={isGeneratingCases || !generationTopic.trim()}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-450 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {isGeneratingCases ? 'GENERATING...' : '⚡ GENERATE'}
                        </button>
                      </div>

                      {caseGenerationError && (
                        <p className="text-[9px] text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                          ✗ ERROR: {caseGenerationError}
                        </p>
                      )}

                      {generationSuccessMessage && (
                        <p className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                          ✓ SUCCESS: {generationSuccessMessage}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cases.length === 0 ? (
                        // Loader if cases are coming
                        <div className="col-span-2 p-12 text-center text-slate-500 font-mono text-xs">
                          LOADING WARDS DATABASE...
                        </div>
                      ) : (
                        cases.map((pCase) => (
                          <div
                            key={pCase.id}
                            id={`case-card-${pCase.id}`}
                            className="bg-slate-950 border border-slate-850 hover:border-emerald-500/30 p-5 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all duration-300"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 text-[8px] font-mono font-bold rounded uppercase tracking-wide border border-rose-500/20">
                                  LEVEL 1 CODE RED
                                </span>
                                <span className="text-[9px] font-mono text-slate-500 font-bold">
                                  {pCase.id}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-200 leading-snug">
                                {pCase.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                                {pCase.summary}
                              </p>
                            </div>

                            <button
                              id={`load-case-btn-${pCase.id}`}
                              onClick={() => handleLoadCase(pCase)}
                              className="w-full py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded-lg text-[10px] uppercase font-mono tracking-wide transition-all shadow-md cursor-pointer"
                            >
                              ENTER EMERGENCY LAB
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  /* View B: Active Case Simulator */
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Active Case Banner */}
                    <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          id="exit-case-btn"
                          onClick={() => {
                            setActiveCase(null);
                            setActiveVitals(null);
                          }}
                          className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <div className="text-[8px] font-mono tracking-widest text-rose-400 uppercase">
                            ACTIVE ADMISSION
                          </div>
                          <h4 className="text-xs font-bold text-slate-200">
                            {activeCase?.title?.toUpperCase() || ""}
                          </h4>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-rose-500/15 text-rose-400 px-2 py-1 rounded-md border border-rose-500/20 animate-pulse">
                        MONITORING ACTIVE
                      </span>
                    </div>

                    {/* Simulation Console Dashboard */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                      {/* 1. ICU Vital Monitor */}
                      {activeVitals && (
                        <PatientMonitor
                          vitals={activeVitals}
                          title={activeCase.id}
                          patientName={activeCase.title}
                          isStElevation={diagnosisCheckResult === 'correct'}
                        />
                      )}                      {/* Google Sheets Integration Card */}
                      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                        
                        {/* Title and Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                              <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-400" />
                            </div>
                            <div>
                              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                                CLINICAL SHEETS SYNC
                              </span>
                              <span className="text-[8.5px] font-sans text-slate-400">
                                Secure real-time ledger & automated Gemini case evaluation
                              </span>
                            </div>
                          </div>
                          
                          {sheetsUser && (
                            <button
                              id="sheets-disconnect-btn"
                              onClick={handleSheetsSignOut}
                              className="text-[9px] font-mono text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              DISCONNECT
                            </button>
                          )}
                        </div>

                        {/* Connection Status Panel */}
                        <div className="p-3.5 bg-slate-950/80 border border-slate-850 rounded-lg space-y-3 shadow-inner">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                              CONNECTION STATUS:
                            </span>
                            {sheetsUser ? (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                SECURE ONLINE SYNC
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-400 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                LOCAL LOGGING ONLY
                              </div>
                            )}
                          </div>

                          {sheetsUser ? (
                            <div className="text-[10px] font-mono text-slate-300 space-y-1">
                              <div className="flex justify-between">
                                <span className="text-slate-500">OPERATOR:</span>
                                <span className="text-emerald-400 font-bold">{sheetsUser.email}</span>
                              </div>
                              {sheetsSpreadsheetId && (
                                <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded mt-1 border border-slate-800">
                                  <span className="text-[8px] text-slate-400 font-mono truncate max-w-[140px]">
                                    SPREADSHEET ID: {sheetsSpreadsheetId}
                                  </span>
                                  <a
                                    href={`https://docs.google.com/spreadsheets/d/${sheetsSpreadsheetId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300 font-bold text-[8.5px] uppercase flex items-center gap-1 hover:underline shrink-0"
                                  >
                                    OPEN LEDGER <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                                Google Sheets integration is currently disconnected. Patient trials will be saved to your local browser ledger. Connect your Google account to automatically sync runs and generate AI-driven clinical grading.
                              </p>
                              
                              <button
                                id="google-sheets-signin-btn"
                                onClick={handleSheetsSignIn}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] font-mono font-bold rounded-lg text-slate-200 transition-all shadow hover:shadow-emerald-500/5 cursor-pointer"
                              >
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                </svg>
                                <span>SIGN IN WITH GOOGLE</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Interactive Sync Action area */}
                        <div className="space-y-2">
                          <button
                            id="google-sheets-export-btn"
                            onClick={handleExportToSheets}
                            disabled={isExportingToSheets}
                            className={`w-full py-2.5 rounded-lg font-mono font-bold text-[10px] uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
                              isExportingToSheets
                                ? 'bg-slate-900 border-emerald-500/20 text-emerald-400 animate-pulse'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 cursor-pointer shadow-md'
                            }`}
                          >
                            {isExportingToSheets ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                SYNCHRONIZING PATIENT TRIAL...
                              </>
                            ) : sheetsUser ? (
                              <>
                                <Database className="w-3.5 h-3.5" />
                                SYNC ACTIVE TRIAL TO GOOGLE SHEETS
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                SAVE ACTIVE TRIAL TO LOCAL JOURNAL
                              </>
                            )}
                          </button>

                          {/* Feedback Alert banners */}
                          {sheetsExportSuccess && (
                            <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[9.5px] text-emerald-400 font-mono text-center flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              {sheetsUser 
                                ? "✓ CLINICAL RUN SYNCHRONIZED SECURELY TO GOOGLE SHEETS!" 
                                : "✓ RUN REGISTERED SUCCESSFULLY TO LOCAL JOURNAL"}
                            </div>
                          )}

                          {sheetsExportError && (
                            <div className="p-2 bg-rose-500/5 border border-rose-500/20 rounded-lg text-[9.5px] text-rose-400 font-mono text-center flex items-center justify-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              ERROR: {sheetsExportError}
                            </div>
                          )}

                          {/* Last Sync Indicator */}
                          {lastSyncTime && (
                            <div className="text-[8.5px] font-mono text-slate-500 flex justify-between items-center bg-slate-950/40 p-1.5 rounded border border-slate-850">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-600" /> LAST SYNC TIME: {lastSyncTime}</span>
                              <span className="text-[8px] uppercase tracking-wider text-slate-500">
                                {sheetsUser ? "ONLINE LEDGER ACTIVE" : "OFFLINE BACKUP"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Local Journal / History Section */}
                        {localLogs.length > 0 && (
                          <div className="space-y-2 mt-2 pt-3 border-t border-slate-850">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                                CLINICAL RECORD JOURNAL ({localLogs.length})
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={handleDownloadCSV}
                                  className="text-[8.5px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 hover:border-emerald-500/30 transition-all font-bold"
                                >
                                  <Download className="w-2.5 h-2.5" /> CSV
                                </button>
                                <button
                                  onClick={handleClearLocalLogs}
                                  className="text-[8.5px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10 hover:border-rose-500/30 transition-all font-bold"
                                >
                                  <Trash2 className="w-2.5 h-2.5" /> CLEAR
                                </button>
                              </div>
                            </div>

                            {/* Scrollable Clinical Logs list */}
                            <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                              {localLogs.map((log, idx) => (
                                <div key={idx} className="p-3 bg-slate-950/90 border border-slate-850 rounded-lg space-y-2 relative overflow-hidden">
                                  {/* Item Header */}
                                  <div className="flex justify-between items-start gap-1">
                                    <div>
                                      <span className="text-[9px] font-mono font-bold text-slate-300 block">
                                        {log.caseId} - {log.caseTitle}
                                      </span>
                                      <span className="text-[8px] font-mono text-slate-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <span className={`text-[7.5px] font-mono px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                                      log.outcome?.includes('STABILIZED')
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    }`}>
                                      {log.outcome?.includes('STABILIZED') ? 'STABILIZED' : 'CRITICAL'}
                                    </span>
                                  </div>

                                  {/* Treatment & Diagnosis details */}
                                  <div className="grid grid-cols-2 gap-2 text-[8.5px] font-mono text-slate-400 bg-slate-900/40 p-1.5 rounded border border-slate-900">
                                    <div>
                                      <span className="text-slate-600 block text-[7.5px]">DIAGNOSIS FORMULATED:</span>
                                      <span className="text-slate-300 truncate block">{log.suspectedDiagnosis}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-600 block text-[7.5px]">INTERVENTION EXECUTED:</span>
                                      <span className="text-emerald-500 font-bold truncate block">{log.interventionChosen}</span>
                                    </div>
                                  </div>

                                  {/* Dynamic Gemini Feedback and Learning Points */}
                                  <div className="space-y-1.5 pt-1">
                                    <div className="p-2 bg-slate-900/60 border border-slate-850 rounded text-[8.5px] leading-relaxed text-slate-300">
                                      <div className="flex items-center gap-1 font-bold text-slate-400 uppercase text-[7.5px] tracking-wider mb-0.5">
                                        <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                                        Attending Feedback
                                      </div>
                                      <p className="italic text-slate-300">"{log.attendingFeedback}"</p>
                                    </div>
                                    
                                    <div className="p-2 bg-slate-900/60 border border-slate-850 rounded text-[8.5px] leading-relaxed text-slate-300">
                                      <div className="flex items-center gap-1 font-bold text-slate-400 uppercase text-[7.5px] tracking-wider mb-0.5">
                                        <BookOpen className="w-2.5 h-2.5 text-emerald-400" />
                                        Educational Learning Points
                                      </div>
                                      <p className="text-slate-300">{log.learningPoints}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 2. Patient History Card */}
                      <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                          CLINICAL PRESENTATION & ANAMNESIS
                        </span>
                        <div className="text-[10px] space-y-1.5 font-sans leading-relaxed text-slate-300">
                          <div>
                            <strong className="text-slate-400">Demographics:</strong>{' '}
                            {activeCase.demographics}
                          </div>
                          <div>
                            <strong className="text-slate-400">HPI (History of Present Illness):</strong>{' '}
                            {activeCase.history}
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Clinical Educator Corner */}
                      {(activeCase.chiefComplaint || activeCase.examination || activeCase.pathophysiologyCorrelation || activeCase.managementApproach || activeCase.complications || activeCase.prognosis || activeCase.highYieldPoints || (activeCase.questions && activeCase.questions.length > 0)) && (
                        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3.5">
                          <button
                            onClick={() => setShowEducatorCorner(!showEducatorCorner)}
                            className="w-full flex justify-between items-center text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold"
                          >
                            <span className="flex items-center gap-1.5">🎓 CLINICAL EDUCATOR CORNER</span>
                            <span className="text-xs">{showEducatorCorner ? '▼' : '▶'}</span>
                          </button>

                          {showEducatorCorner && (
                            <div className="space-y-4 pt-2 border-t border-slate-850 text-[10px] leading-relaxed text-slate-300">
                              {activeCase.chiefComplaint && (
                                <div>
                                  <h5 className="font-bold text-slate-200 font-mono text-[9px] uppercase tracking-wide">Chief Complaint</h5>
                                  <p className="mt-0.5">{activeCase.chiefComplaint}</p>
                                </div>
                              )}
                              {activeCase.examination && (
                                <div>
                                  <h5 className="font-bold text-slate-200 font-mono text-[9px] uppercase tracking-wide">Physical Examination</h5>
                                  <p className="mt-0.5">{activeCase.examination}</p>
                                </div>
                              )}
                              {activeCase.pathophysiologyCorrelation && (
                                <div>
                                  <h5 className="font-bold text-slate-200 font-mono text-[9px] uppercase tracking-wide">Pathophysiology Correlation</h5>
                                  <p className="mt-0.5">{activeCase.pathophysiologyCorrelation}</p>
                                </div>
                              )}
                              {activeCase.managementApproach && (
                                <div>
                                  <h5 className="font-bold text-slate-200 font-mono text-[9px] uppercase tracking-wide">Management Guideline</h5>
                                  <p className="mt-0.5">{activeCase.managementApproach}</p>
                                </div>
                              )}
                              {activeCase.differentialDiagnosis && activeCase.differentialDiagnosis.length > 0 && (
                                <div>
                                  <h5 className="font-bold text-slate-200 font-mono text-[9px] uppercase tracking-wide">Differential Diagnosis Challenge</h5>
                                  <ul className="list-disc pl-4 mt-0.5 space-y-0.5 font-mono text-[9px] text-amber-400">
                                    {activeCase.differentialDiagnosis.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {activeCase.complications && (
                                <div>
                                  <h5 className="font-bold text-slate-200 font-mono text-[9px] uppercase tracking-wide">Acute & Chronic Complications</h5>
                                  <p className="mt-0.5 text-rose-400/90">{activeCase.complications}</p>
                                </div>
                              )}
                              {activeCase.prognosis && (
                                <div>
                                  <h5 className="font-bold text-slate-200 font-mono text-[9px] uppercase tracking-wide">Prognosis & Outcomes</h5>
                                  <p className="mt-0.5">{activeCase.prognosis}</p>
                                </div>
                              )}
                              {activeCase.highYieldPoints && activeCase.highYieldPoints.length > 0 && (
                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg">
                                  <h5 className="font-bold text-emerald-400 font-mono text-[9px] uppercase tracking-wide flex items-center gap-1.5">
                                    ⭐ HIGH-YIELD CLINICAL PEARLS
                                  </h5>
                                  <ul className="list-disc pl-4 mt-1.5 space-y-1 font-sans text-slate-200">
                                    {activeCase.highYieldPoints.map((point, i) => (
                                      <li key={i}>{point}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {activeCase.visualLearningPrompts && (
                                <div className="bg-cyan-500/5 border border-cyan-500/20 p-3 rounded-lg font-mono text-[9px] text-cyan-300">
                                  <strong>VISUAL LEARNING SCHEMATIC CONCEPT:</strong>
                                  <p className="mt-1 font-sans text-slate-300 leading-normal">{activeCase.visualLearningPrompts}</p>
                                </div>
                              )}

                              {activeCase.questions && activeCase.questions.length > 0 && (
                                <div className="space-y-4 pt-3 border-t border-slate-850">
                                  <h5 className="font-bold text-amber-400 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5">
                                    🧠 CLINICAL REASONING CHALLENGE
                                  </h5>
                                  <div className="space-y-4">
                                    {activeCase.questions.map((q, qIdx) => {
                                      const selectedAns = userAnswers[qIdx];
                                      return (
                                        <div key={qIdx} className="bg-slate-900/60 border border-slate-850 p-3 rounded-lg space-y-2.5">
                                          <p className="text-[10px] text-slate-200 font-semibold leading-relaxed">
                                            {qIdx + 1}. {q.question}
                                          </p>
                                          <div className="grid grid-cols-1 gap-1.5 font-mono text-[9px]">
                                            {q.options.map((opt, oIdx) => {
                                              const isSelected = selectedAns === opt;
                                              const isCorrect = opt === q.answer;
                                              return (
                                                <button
                                                  key={oIdx}
                                                  onClick={() => {
                                                    if (!selectedAns) {
                                                      setUserAnswers((prev) => ({ ...prev, [qIdx]: opt }));
                                                    }
                                                  }}
                                                  disabled={!!selectedAns}
                                                  className={`w-full text-left p-2 rounded leading-relaxed transition-all ${
                                                    selectedAns
                                                      ? isCorrect
                                                        ? 'bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 font-bold'
                                                        : isSelected
                                                        ? 'bg-rose-500/25 border border-rose-500/40 text-rose-200 font-bold'
                                                        : 'bg-slate-950 border border-slate-900 text-slate-500'
                                                      : 'bg-slate-950 border border-slate-850 text-slate-400 hover:border-emerald-500/30 hover:text-slate-200 cursor-pointer'
                                                  }`}
                                                >
                                                  {opt}
                                                </button>
                                              );
                                            })}
                                          </div>
                                          {selectedAns && (
                                            <div className="text-[9.5px] leading-relaxed p-2 bg-slate-950 rounded border border-slate-850 text-slate-400 font-sans">
                                              <span className={`font-bold font-mono text-[8px] uppercase tracking-wide block mb-0.5 ${
                                                selectedAns === q.answer ? 'text-emerald-400' : 'text-rose-400'
                                              }`}>
                                                {selectedAns === q.answer ? '✓ Correct Option' : `✗ Incorrect (Correct Answer: ${q.answer})`}
                                              </span>
                                              {q.explanation}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. Diagnostic Workup Bay */}
                      <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                          DIAGNOSTIC WORKUP ORDER BAY
                        </span>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.keys(activeCase.tests).map((testKey) => {
                            const test = activeCase.tests[testKey];
                            const isOrdered = orderedDiagnostics[testKey];
                            const isProcessing = diagnosticProgress[testKey];

                            return (
                              <button
                                key={testKey}
                                id={`order-test-btn-${testKey}`}
                                onClick={() => handleOrderDiagnostic(testKey)}
                                disabled={isOrdered || isProcessing}
                                className={`p-2.5 rounded-lg text-center font-mono text-[9px] font-bold border transition-all ${
                                  isOrdered
                                    ? 'bg-slate-900 border-slate-800 text-slate-500'
                                    : isProcessing
                                    ? 'bg-slate-950 border-cyan-500 text-cyan-400 animate-pulse'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 cursor-pointer'
                                }`}
                              >
                                {isOrdered ? (
                                  <span>✓ {test?.name?.toUpperCase() || ""}</span>
                                ) : isProcessing ? (
                                  <span>RUNNING...</span>
                                ) : (
                                  <span>ORDER {test?.name?.toUpperCase() || ""}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Diagnostic Results Outputs */}
                        <div className="space-y-2">
                          {Object.keys(activeCase.tests).map((testKey) => {
                            const test = activeCase.tests[testKey];
                            const isOrdered = orderedDiagnostics[testKey];
                            if (!isOrdered) return null;

                            return (
                              <div
                                key={testKey}
                                id={`test-result-box-${testKey}`}
                                className="bg-slate-900/60 border border-slate-850 rounded-xl p-3.5 space-y-1.5 animate-fade-in"
                              >
                                <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                                  <span className="text-[10px] font-bold text-slate-200">
                                    {test.name}
                                  </span>
                                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border ${
                                    test.status === 'abnormal'
                                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  }`}>
                                    {test.status}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-300 leading-normal font-sans">
                                  <strong className="text-slate-400 block font-mono text-[9px] uppercase tracking-wide">Findings:</strong>
                                  {test.result}
                                </div>
                                <div className="text-[9px] text-slate-500 font-sans italic">
                                  Clinical Note: {test.details}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4. Formulate Clinical Hypothesis (Diagnosis) */}
                      <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                          DIAGNOSTIC HYPOTHESIS FORMULATION
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {activeCase.options.map((option, idx) => (
                            <button
                              key={idx}
                              id={`select-diagnosis-btn-${idx}`}
                              onClick={() => handleCheckDiagnosis(option)}
                              disabled={!!diagnosisCheckResult}
                              className={`p-3 rounded-xl border text-left text-xs font-semibold leading-snug transition-all ${
                                userSelectedDiagnosis === option
                                  ? diagnosisCheckResult === 'correct'
                                    ? 'bg-emerald-500/15 border-emerald-500 text-slate-100 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                                    : 'bg-rose-500/15 border-rose-500 text-slate-100 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200 cursor-pointer'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>

                        {/* Diagnosis Check Feedback Box */}
                        {diagnosisCheckResult && (
                          <div className={`p-4 rounded-xl border flex items-start gap-2.5 ${
                            diagnosisCheckResult === 'correct'
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300/90'
                              : 'bg-rose-500/5 border-rose-500/20 text-rose-300/90'
                          }`}>
                            <div className="mt-0.5 shrink-0">
                              {diagnosisCheckResult === 'correct' ? (
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                              ) : (
                                <AlertCircle className="w-4.5 h-4.5 text-rose-400" />
                              )}
                            </div>
                            <div className="text-[10px] leading-relaxed">
                              {diagnosisCheckResult === 'correct' ? (
                                <p>
                                  <strong>HYPOTHESIS CONFIRMED:</strong> Excellent clinical work. The pathophysiology correlates beautifully. Proceed to choose your therapeutic protocols to preserve cellular perfusion and reverse further tissue necrosis.
                                </p>
                              ) : (
                                <p>
                                  <strong>HYPOTHESIS NOT SUPPORTED:</strong> The findings do not fit this diagnosis. Order the remaining investigations, review the Clinical Educator Corner, then reload the case to try again.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 5. Intervention / Therapeutic Protocols */}
                      {diagnosisCheckResult === 'correct' && (
                        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 animate-fade-in">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                            THERAPEUTIC PROTOCOLS SELECTOR
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {activeCase.treatments.map((option, idx) => (
                              <button
                                key={idx}
                                id={`select-treatment-btn-${idx}`}
                                onClick={() => handleExecuteTreatment(option)}
                                className={`p-3 rounded-xl border text-left text-xs font-semibold leading-snug transition-all ${
                                  selectedTreatmentName === option.name
                                    ? option.success
                                      ? 'bg-emerald-500/15 border-emerald-500 text-slate-100'
                                      : 'bg-rose-500/15 border-rose-500 text-slate-100'
                                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200 cursor-pointer'
                                }`}
                              >
                                {option.name}
                              </button>
                            ))}
                          </div>

                          {/* Treatment Feedback Log */}
                          {treatmentFeedback && (
                            <div className="space-y-4 pt-2">
                              <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
                                activeCase.treatments.find((t) => t.name === selectedTreatmentName)?.success
                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                              }`}>
                                <div className="text-[9px] font-mono uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                                  {activeCase.treatments.find((t) => t.name === selectedTreatmentName)?.success ? (
                                    <>✓ THERAPEUTIC OUTCOME: POSITIVE</>
                                  ) : (
                                    <>✗ THERAPEUTIC COMPLICATIONS: SEVERE</>
                                  )}
                                </div>
                                <p className="text-[10px] leading-relaxed">
                                  {treatmentFeedback}
                                </p>
                              </div>

                              {/* Congratulations Banner if successful */}
                              {activeCase.treatments.find((t) => t.name === selectedTreatmentName)?.success && (
                                <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2.5 shadow-xl">
                                  <h4 className="text-xs font-bold text-slate-100 font-display uppercase tracking-wider flex items-center justify-center gap-2">
                                    🌟 PATIENT FULLY STABILIZED 🌟
                                  </h4>
                                  <p className="text-[10px] text-slate-300 max-w-md mx-auto leading-relaxed">
                                    You have successfully navigated this clinical scenario. Perfusion was successfully restored to critical tissue systems. Excellent performance.
                                  </p>
                                  <button
                                    id="case-complete-exit-btn"
                                    onClick={() => {
                                      setActiveCase(null);
                                      setActiveVitals(null);
                                    }}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold uppercase rounded-lg shadow-md cursor-pointer"
                                  >
                                    DISMISS & ASSESS NEXT CASE
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Suspense fallback={<TabFallback />}>
            {rightTab === 'pharmacology' && (
              <div className="flex-1 min-h-0">
                <DrugMatrix
                  onCheckInteraction={handleCheckDrugInteraction}
                  isChecking={isDrugChecking}
                  interactionResult={drugInteraction}
                  activeTopic={activeTopic}
                />
              </div>
            )}

            {rightTab === 'mindmap' && (
              <div className="flex-1 min-h-0">
                <ObsidianMindMap 
                  activeTopic={activeTopic}
                  setActiveTopic={setActiveTopic}
                />
              </div>
            )}

            {rightTab === 'quiz' && (
              <div className="flex-1 min-h-0">
                <ClinicalQuiz activeTopic={activeTopic} />
              </div>
            )}

            {rightTab === 'compliance' && (
              <div className="flex-1 min-h-0">
                <ComplianceAudit
                  logs={localLogs}
                  onExportCsv={handleDownloadCSV}
                  onClearLogs={handleClearLocalLogs}
                  sheetsUser={sheetsUser}
                  sheetsToken={sheetsToken}
                  sheetsSpreadsheetId={sheetsSpreadsheetId}
                  onSignInSheets={handleSheetsSignIn}
                  onExportSheets={handleExportToSheets}
                  isExportingSheets={isExportingToSheets}
                  sheetsExportSuccess={sheetsExportSuccess}
                  sheetsExportError={sheetsExportError}
                  isApiSimulated={isApiSimulated}
                  activeTopic={activeTopic}
                />
              </div>
            )}
            </Suspense>
          </div>
        </section>
      </main>

      {/* 3. Global Footer bar */}
      <footer className="px-6 py-3.5 bg-slate-950 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 shrink-0">
        <div className="flex items-center gap-1.5 font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>REFERENCE STANDARD: ICD-10 MEDICAL PATHOLOGY PROTOCOLS</span>
        </div>
        <div className="font-mono text-[9px] text-slate-600">
          DESIGNED FOR PROFESSIONAL CLINICAL SIMULATIONS • STABLE MULTI-SYSTEM VECTORS
        </div>
      </footer>
    </div>
  );
}
