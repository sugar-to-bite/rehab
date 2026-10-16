"use client";

import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  History,
  Info,
  ListChecks,
  Milestone,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  MENISCUS_DEMO_STORAGE_KEY,
  initialMeniscusDemoState,
  meniscusPlanTemplate,
  mockMeniscusMilestones,
  mockWeek,
  type MeniscusClinicalRecord,
  type MeniscusDemoState,
  type MeniscusExerciseFeedback,
  type MeniscusPlan
} from "@/lib/meniscus-mvp-demo";

type RoleView = "therapist" | "patient";
type TherapistSection = "clinical" | "planInfo" | "weekly" | "progress" | "history" | "feedback";
type PatientSection = "today" | "plan" | "calendar";
type PlanEditorMode = "closed" | "create" | "planInfo" | "weekly";

const clinicalSections: Array<{
  key: keyof Omit<MeniscusClinicalRecord, "assessedAt" | "assessedBy">;
  title: string;
  fields: Array<{ key: string; label: string }>;
}> = [
  {
    key: "initialInfo",
    title: "Informazioni iniziali",
    fields: [
      { key: "age", label: "Età" },
      { key: "sexAtBirth", label: "Sesso alla nascita" },
      { key: "heightWeightBmi", label: "Altezza · peso · BMI" },
      { key: "smoking", label: "Fumo" },
      { key: "comorbidities", label: "Condizioni rilevanti" },
      { key: "medicationsAndAllergies", label: "Farmaci e allergie" }
    ]
  },
  {
    key: "intervention",
    title: "1. Intervento",
    fields: [
      { key: "date", label: "Data intervento" },
      { key: "knee", label: "Ginocchio" },
      { key: "meniscus", label: "Menisco" },
      { key: "procedure", label: "Procedura" }
    ]
  },
  {
    key: "lesion",
    title: "2. Lesione e procedure associate",
    fields: [
      { key: "pattern", label: "Pattern" },
      { key: "zone", label: "Zona" },
      { key: "repairDetails", label: "Dettagli riparazione" },
      { key: "associatedProcedures", label: "Procedure associate" }
    ]
  },
  {
    key: "surgeonInstructions",
    title: "3. Prescrizioni del chirurgo",
    fields: [
      { key: "loading", label: "Carico" },
      { key: "braceAndAids", label: "Tutore e ausili" },
      { key: "movementLimits", label: "Limiti di movimento" },
      { key: "reviewCriteria", label: "Revisione" }
    ]
  },
  {
    key: "clinicalStatus",
    title: "4. Stato clinico",
    fields: [
      { key: "painAtRest", label: "Dolore a riposo" },
      { key: "painDuringActivity", label: "Dolore in attività" },
      { key: "swelling", label: "Gonfiore / versamento" },
      { key: "symptoms", label: "Sintomi rilevanti" }
    ]
  },
  {
    key: "functionalAssessment",
    title: "5. Valutazione funzionale",
    fields: [
      { key: "flexion", label: "Flessione" },
      { key: "extension", label: "Estensione" },
      { key: "quadricepsControl", label: "Controllo quadricipite" },
      { key: "walking", label: "Cammino" }
    ]
  },
  {
    key: "goalAndContext",
    title: "6. Obiettivo e contesto",
    fields: [
      { key: "personalGoal", label: "Obiettivo personale" },
      { key: "previousActivity", label: "Attività precedente" },
      { key: "availability", label: "Disponibilità" },
      { key: "equipment", label: "Attrezzatura" }
    ]
  }
];

function cloneInitialState() {
  return JSON.parse(JSON.stringify(initialMeniscusDemoState)) as MeniscusDemoState;
}

function clonePlan(plan: MeniscusPlan) {
  return JSON.parse(JSON.stringify(plan)) as MeniscusPlan;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
}

function buildExerciseFeedbacks(plan: MeniscusPlan): MeniscusExerciseFeedback[] {
  return plan.exercises.map((exercise) => ({
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    outcome: "completed",
    painDuring: 0,
    difficulty: "adequate",
    reason: "",
    note: ""
  }));
}

export function MeniscusMvpDemo() {
  const [role, setRole] = useState<RoleView>("therapist");
  const [therapistSection, setTherapistSection] = useState<TherapistSection>("clinical");
  const [patientSection, setPatientSection] = useState<PatientSection>("today");
  const [state, setState] = useState<MeniscusDemoState>(cloneInitialState);
  const [clinicalDraft, setClinicalDraft] = useState<MeniscusClinicalRecord>(state.clinicalRecord);
  const [clinicalEditing, setClinicalEditing] = useState(false);
  const [planDraft, setPlanDraft] = useState<MeniscusPlan>(state.plan);
  const [planEditorMode, setPlanEditorMode] = useState<PlanEditorMode>("closed");
  const planActionTriggerRef = useRef<HTMLElement | null>(null);
  const [approvalChecked, setApprovalChecked] = useState(false);
  const [exerciseFeedbacks, setExerciseFeedbacks] = useState<MeniscusExerciseFeedback[]>(
    () => buildExerciseFeedbacks(state.plan)
  );
  const [painAfter, setPainAfter] = useState(0);
  const [swelling, setSwelling] = useState<"less" | "same" | "more">("same");
  const [fatigue, setFatigue] = useState(0);
  const [sessionNote, setSessionNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(MENISCUS_DEMO_STORAGE_KEY);

    if (!saved) return;

    const frame = window.requestAnimationFrame(() => {
      try {
        const next = JSON.parse(saved) as MeniscusDemoState;
        setState(next);
        setClinicalDraft(next.clinicalRecord);
        setPlanDraft(next.plan);
        setExerciseFeedbacks(next.publishedPlan ? buildExerciseFeedbacks(next.publishedPlan) : []);
      } catch {
        window.localStorage.removeItem(MENISCUS_DEMO_STORAGE_KEY);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(MENISCUS_DEMO_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const pendingFeedbackCount = state.feedbacks.length;
  const latestFeedback = state.feedbacks[0];
  const hasIncompleteSkippedReason = exerciseFeedbacks.some(
    (feedback) => feedback.outcome === "skipped" && feedback.reason.trim() === ""
  );
  const patientPlan = state.publishedPlan;
  const publishedSummary = patientPlan
    ? `${patientPlan.exercises.length} esercizi · piano v${patientPlan.version}`
    : "";

  function saveClinicalRecord() {
    const nextRecord = {
      ...clinicalDraft,
      assessedAt: new Date().toISOString().slice(0, 10),
      assessedBy: "Dott.ssa Giulia Bianchi"
    };
    setState((current) => ({
      ...current,
      clinicalRecord: nextRecord,
      planLog: [
        {
          id: `mock-log-clinical-${Date.now()}`,
          occurredAt: new Date().toISOString(),
          author: "Dott.ssa Giulia Bianchi",
          title: "Quadro clinico aggiornato",
          detail: "Salvata una modifica manuale alle informazioni cliniche del paziente."
        },
        ...current.planLog
      ]
    }));
    setClinicalDraft(nextRecord);
    setClinicalEditing(false);
    setMessage("Scheda clinica mock aggiornata.");
  }

  function updateClinicalField(section: string, field: string, value: string) {
    setClinicalDraft((current) => ({
      ...current,
      [section]: {
        ...(current[section as keyof MeniscusClinicalRecord] as Record<string, string>),
        [field]: value
      }
    }));
  }

  function updatePlanExercise(index: number, field: "sets" | "reps" | "instructions", value: string) {
    setPlanDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise, exerciseIndex) =>
        exerciseIndex === index
          ? { ...exercise, [field]: field === "instructions" ? value : Number(value) }
          : exercise
      )
    }));
  }

  function startPlanCreation() {
    planActionTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPlanDraft(clonePlan(meniscusPlanTemplate));
    setPlanEditorMode("create");
    setApprovalChecked(false);
  }

  function startPlanEdit(mode: "planInfo" | "weekly") {
    setPlanDraft(clonePlan(state.plan));
    setPlanEditorMode(mode);
    setApprovalChecked(false);
  }

  function cancelPlanEdit() {
    const shouldRestoreFocus = planEditorMode === "create";
    setPlanDraft(clonePlan(state.plan));
    setPlanEditorMode("closed");
    if (shouldRestoreFocus) {
      window.requestAnimationFrame(() => planActionTriggerRef.current?.focus());
    }
  }

  function savePlanDraft() {
    const creating = state.plan.status === "empty";
    const shouldRestoreFocus = planEditorMode === "create";
    const nextPlan: MeniscusPlan = {
      ...planDraft,
      status: "draft",
      createdAt: planDraft.createdAt || new Date().toISOString(),
      publishedAt: null,
      approvedBy: ""
    };

    setState((current) => ({
      ...current,
      plan: nextPlan,
      planLog: [
        {
          id: `mock-log-plan-${Date.now()}`,
          occurredAt: new Date().toISOString(),
          author: "Dott.ssa Giulia Bianchi",
          title: creating ? "Bozza del primo piano creata" : "Bozza del piano aggiornata",
          detail: creating
            ? "Salvate le informazioni del piano e gli esercizi della prima settimana."
            : "Salvate modifiche manuali al piano senza pubblicarle al paziente."
        },
        ...current.planLog
      ]
    }));
    setPlanDraft(nextPlan);
    setPlanEditorMode("closed");
    setApprovalChecked(false);
    setMessage("Bozza salvata. Il piano non è ancora visibile al paziente.");
    if (shouldRestoreFocus) {
      window.requestAnimationFrame(() => planActionTriggerRef.current?.focus());
    }
  }

  function publishPlan(planToPublish: MeniscusPlan) {
    if (!approvalChecked) return;
    const nextPlan: MeniscusPlan = {
      ...planToPublish,
      version: state.publishedPlan ? state.publishedPlan.version + 1 : 1,
      status: "published",
      createdAt: planToPublish.createdAt || new Date().toISOString(),
      approvedBy: "Dott.ssa Giulia Bianchi",
      publishedAt: new Date().toISOString(),
      effectiveFrom: "2026-10-19"
    };

    setState((current) => ({
      ...current,
      plan: nextPlan,
      publishedPlan: nextPlan,
      planLog: [
        {
          id: `mock-log-publish-${Date.now()}`,
          occurredAt: new Date().toISOString(),
          author: "Dott.ssa Giulia Bianchi",
          title: current.publishedPlan ? "Revisione del piano approvata e pubblicata" : "Piano iniziale approvato e pubblicato",
          detail: current.publishedPlan
            ? `Pubblicata la versione ${nextPlan.version} del piano.`
            : "Avviato il percorso RE.HAB con decorrenza 19 ottobre 2026."
        },
        ...current.planLog
      ]
    }));
    setPlanDraft(nextPlan);
    setExerciseFeedbacks(buildExerciseFeedbacks(nextPlan));
    setPlanEditorMode("closed");
    setApprovalChecked(false);
    setMessage(`Piano v${nextPlan.version} approvato e pubblicato al paziente.`);
  }

  function publishPlanRevision() {
    if (state.plan.status !== "draft") return;
    publishPlan(state.plan);
  }

  function publishPlanFromCreation() {
    publishPlan(planDraft);
  }

  function updateExerciseFeedback(index: number, patch: Partial<MeniscusExerciseFeedback>) {
    setExerciseFeedbacks((current) =>
      current.map((feedback, feedbackIndex) =>
        feedbackIndex === index ? { ...feedback, ...patch } : feedback
      )
    );
  }

  function submitSessionFeedback() {
    if (hasIncompleteSkippedReason) {
      setMessage("Indica il motivo per ogni esercizio saltato.");
      return;
    }

    const feedback = {
      id: `mock-feedback-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      planVersion: state.plan.version,
      exercises: exerciseFeedbacks,
      painAfter,
      swelling,
      fatigue,
      note: sessionNote
    };

    setState((current) => ({ ...current, feedbacks: [feedback, ...current.feedbacks] }));
    setMessage("Feedback mock inviato. Ora è visibile al fisioterapista.");
  }

  function resetDemo() {
    const next = cloneInitialState();
    setState(next);
    setClinicalDraft(next.clinicalRecord);
    setPlanDraft(next.plan);
    setExerciseFeedbacks([]);
    setPlanEditorMode("closed");
    setPainAfter(0);
    setSwelling("same");
    setFatigue(0);
    setSessionNote("");
    setMessage("Demo ripristinata.");
    window.localStorage.removeItem(MENISCUS_DEMO_STORAGE_KEY);
  }

  return (
    <main className="page meniscus-demo-page">
      <div className="shell">
        <header className="topbar">
          <Link className="brand" href="/">
            <span className="brand-mark"><Activity size={22} aria-hidden="true" /></span>
            <span>RE.HAB · MVP menisco</span>
          </Link>
          <button className="button ghost" onClick={resetDemo} type="button">
            <RotateCcw size={17} aria-hidden="true" /> Ripristina demo
          </button>
        </header>

        <div className="demo-disclaimer" role="note">
          <ShieldCheck size={20} aria-hidden="true" />
          <div>
            <strong>Demo con dati e piano fittizi</strong>
            <span>Nessun contenuto clinico è generato dalla KB. Il primo piano viene preparato e approvato manualmente dal fisioterapista.</span>
          </div>
        </div>

        <div className="role-switch" aria-label="Vista demo">
          <button className={role === "therapist" ? "active" : ""} onClick={() => setRole("therapist")} type="button">
            <Stethoscope size={18} aria-hidden="true" /> Fisioterapista
          </button>
          <button className={role === "patient" ? "active" : ""} onClick={() => setRole("patient")} type="button">
            <UserRound size={18} aria-hidden="true" /> Paziente
          </button>
        </div>

        {message ? <p className="form-success demo-message">{message}</p> : null}

        {role === "therapist" ? (
          <section className="demo-workspace">
            <aside className="demo-sidebar panel">
              <p className="eyebrow">Paziente fittizio</p>
              <h2>Marco Rossi</h2>
              <p className="muted">Sutura menisco mediale · ginocchio destro</p>
              <div className="pill-row">
                <span className={state.plan.status === "published" ? "pill green" : state.plan.status === "draft" && state.publishedPlan ? "pill blue" : state.plan.status === "draft" ? "pill amber" : "pill"}>
                  {state.plan.status === "published" ? "Percorso attivo" : state.plan.status === "draft" && state.publishedPlan ? "Revisione in bozza" : state.plan.status === "draft" ? "Bozza non pubblicata" : "Nessun piano"}
                </span>
                {state.plan.status === "published" ? <span className="pill">Piano v{state.plan.version}</span> : null}
              </div>
              <nav className="demo-section-nav" aria-label="Scheda paziente">
                <button className={therapistSection === "clinical" ? "active" : ""} onClick={() => setTherapistSection("clinical")} type="button">
                  <ClipboardList size={18} /> Quadro clinico
                </button>
                <button className={therapistSection === "planInfo" ? "active" : ""} onClick={() => setTherapistSection("planInfo")} type="button">
                  <Info size={18} /> Info piano
                </button>
                <button className={therapistSection === "weekly" ? "active" : ""} onClick={() => setTherapistSection("weekly")} type="button">
                  <ListChecks size={18} /> Esercizi settimana
                </button>
                <button className={therapistSection === "progress" ? "active" : ""} onClick={() => setTherapistSection("progress")} type="button">
                  <Milestone size={18} /> Avanzamento
                </button>
                <button className={therapistSection === "history" ? "active" : ""} onClick={() => setTherapistSection("history")} type="button">
                  <History size={18} /> Log modifiche
                </button>
                <button className={therapistSection === "feedback" ? "active" : ""} onClick={() => setTherapistSection("feedback")} type="button">
                  <Activity size={18} /> Feedback <span className="nav-count">{pendingFeedbackCount}</span>
                </button>
              </nav>
            </aside>

            <div className="demo-main">
              {planEditorMode === "create" ? (
                <PlanCreationDialog
                  approvalChecked={approvalChecked}
                  draft={planDraft}
                  onCancel={cancelPlanEdit}
                  onApprovalChange={setApprovalChecked}
                  onExerciseChange={updatePlanExercise}
                  onPublish={publishPlanFromCreation}
                  onSave={savePlanDraft}
                  onUpdate={setPlanDraft}
                />
              ) : null}
              {therapistSection === "clinical" ? (
                <ClinicalRecordPanel
                  draft={clinicalDraft}
                  editing={clinicalEditing}
                  onCancel={() => { setClinicalDraft(state.clinicalRecord); setClinicalEditing(false); }}
                  onEdit={() => setClinicalEditing(true)}
                  onFieldChange={updateClinicalField}
                  onSave={saveClinicalRecord}
                />
              ) : null}
              {therapistSection === "planInfo" ? (
                <PlanInfoPanel
                  approvalChecked={approvalChecked}
                  draft={planDraft}
                  editing={planEditorMode === "planInfo"}
                  hasPublishedPlan={Boolean(state.publishedPlan)}
                  onCancel={cancelPlanEdit}
                  onCreate={startPlanCreation}
                  onEdit={() => startPlanEdit("planInfo")}
                  onApprovalChange={setApprovalChecked}
                  onPublish={publishPlanRevision}
                  onSave={savePlanDraft}
                  onUpdate={setPlanDraft}
                  plan={state.plan}
                />
              ) : null}
              {therapistSection === "weekly" ? (
                <WeeklyExercisesPanel
                  draft={planDraft}
                  editing={planEditorMode === "weekly"}
                  hasPublishedPlan={Boolean(state.publishedPlan)}
                  onCancel={cancelPlanEdit}
                  onCreate={startPlanCreation}
                  onEdit={() => startPlanEdit("weekly")}
                  onExerciseChange={updatePlanExercise}
                  onSave={savePlanDraft}
                  plan={state.plan}
                />
              ) : null}
              {therapistSection === "progress" ? <ProgressPanel /> : null}
              {therapistSection === "history" ? <PlanHistoryPanel entries={state.planLog} /> : null}
              {therapistSection === "feedback" ? (
                <TherapistFeedbackPanel feedbacks={state.feedbacks} />
              ) : null}
            </div>
          </section>
        ) : (
          <section className="patient-demo-shell">
            <header className="patient-demo-header">
              <div>
                <p className="eyebrow">Ciao Marco</p>
                <h1>Il tuo recupero</h1>
              </div>
              <span className={patientPlan ? "pill green" : "pill amber"}>
                {patientPlan ? "Piano attivo" : "Piano in preparazione"}
              </span>
            </header>
            <nav className="patient-demo-nav" aria-label="App paziente">
              <button className={patientSection === "today" ? "active" : ""} onClick={() => setPatientSection("today")} type="button">Oggi</button>
              <button className={patientSection === "plan" ? "active" : ""} onClick={() => setPatientSection("plan")} type="button">Il mio piano</button>
              <button className={patientSection === "calendar" ? "active" : ""} onClick={() => setPatientSection("calendar")} type="button">Calendario</button>
            </nav>

            {patientSection === "today" && patientPlan ? (
              <PatientSession
                fatigue={fatigue}
                feedbacks={exerciseFeedbacks}
                hasSubmitted={Boolean(latestFeedback)}
                note={sessionNote}
                onExerciseChange={updateExerciseFeedback}
                onFatigueChange={setFatigue}
                onNoteChange={setSessionNote}
                onPainAfterChange={setPainAfter}
                onSubmit={submitSessionFeedback}
                onSwellingChange={setSwelling}
                painAfter={painAfter}
                plan={patientPlan}
                swelling={swelling}
              />
            ) : null}
            {patientSection === "today" && !patientPlan ? <PatientWaitingForPlan /> : null}
            {patientSection === "plan" ? (
              patientPlan ? <PatientPlan plan={patientPlan} publishedSummary={publishedSummary} /> : <PatientWaitingForPlan />
            ) : null}
            {patientSection === "calendar" && patientPlan ? <WeekCalendar /> : null}
            {patientSection === "calendar" && !patientPlan ? <PatientWaitingForPlan /> : null}
          </section>
        )}
      </div>
    </main>
  );
}

function ClinicalRecordPanel({
  draft,
  editing,
  onCancel,
  onEdit,
  onFieldChange,
  onSave
}: {
  draft: MeniscusClinicalRecord;
  editing: boolean;
  onCancel: () => void;
  onEdit: () => void;
  onFieldChange: (section: string, field: string, value: string) => void;
  onSave: () => void;
}) {
  return (
    <section className="panel clinical-record-panel">
      <div className="panel-header">
        <div><p className="eyebrow">Scheda menisco</p><h2>Quadro clinico</h2></div>
        {editing ? (
          <div className="actions compact"><button className="button ghost" onClick={onCancel} type="button">Annulla</button><button className="button primary" onClick={onSave} type="button"><Save size={17} /> Salva revisione</button></div>
        ) : <button className="button" onClick={onEdit} type="button">Modifica</button>}
      </div>
      <p className="muted">Valutazione del {formatDate(draft.assessedAt)} · {draft.assessedBy}</p>
      <div className="clinical-sections">
        {clinicalSections.map((section) => {
          const values = draft[section.key] as unknown as Record<string, string>;
          return (
            <article className="clinical-section" key={section.key}>
              <h3>{section.title}</h3>
              <div className="clinical-field-grid">
                {section.fields.map((field) => (
                  <div className="clinical-value" key={field.key}>
                    <span>{field.label}</span>
                    {editing ? (
                      <input aria-label={field.label} onChange={(event) => onFieldChange(section.key, field.key, event.target.value)} value={values[field.key]} />
                    ) : <strong>{values[field.key] || "Non valutato"}</strong>}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PlanInfoPanel({
  approvalChecked,
  draft,
  editing,
  hasPublishedPlan,
  onCancel,
  onCreate,
  onEdit,
  onApprovalChange,
  onPublish,
  onSave,
  onUpdate,
  plan
}: {
  approvalChecked: boolean;
  draft: MeniscusPlan;
  editing: boolean;
  hasPublishedPlan: boolean;
  onCancel: () => void;
  onCreate: () => void;
  onEdit: () => void;
  onApprovalChange: (checked: boolean) => void;
  onPublish: () => void;
  onSave: () => void;
  onUpdate: (plan: MeniscusPlan) => void;
  plan: MeniscusPlan;
}) {
  if (plan.status === "empty") {
    return <PlanEmptyState description="Crea il primo piano per definire obiettivo, restrizioni ed esercizi della prima settimana." onCreate={onCreate} title="Nessun piano ancora" />;
  }

  const visiblePlan = editing ? draft : plan;
  const published = plan.status === "published";

  return (
    <section className="panel plan-editor-panel">
      <div className="panel-header">
        <div><p className="eyebrow">Primo piano RE.HAB</p><h2>Informazioni generali</h2></div>
        {editing ? (
          <div className="actions compact"><button className="button ghost" onClick={onCancel} type="button">Annulla</button><button className="button primary" onClick={onSave} type="button"><Save size={17} /> Salva bozza</button></div>
        ) : (
          <div className="actions compact"><span className={published ? "pill green" : hasPublishedPlan ? "pill blue" : "pill amber"}>{published ? `Piano v${plan.version} attivo` : hasPublishedPlan ? "Revisione in bozza" : "Bozza non pubblicata"}</span><button className="button" onClick={onEdit} type="button"><Pencil size={16} /> Modifica</button></div>
        )}
      </div>
      <div className="source-note"><strong>Contenuto dimostrativo.</strong> È il primo piano del paziente: viene preparato manualmente e non è generato dalla KB.</div>
      {editing ? (
        <PlanInfoFields draft={draft} onUpdate={onUpdate} />
      ) : (
        <div className="plan-read-grid">
          <div className="read-value"><span>Fase iniziale</span><strong>{visiblePlan.phase}</strong></div>
          <div className="read-value"><span>Obiettivo del piano</span><strong>{visiblePlan.objective}</strong></div>
          <div className="read-value wide"><span>Restrizioni approvate</span><ul className="restriction-list">{visiblePlan.restrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul></div>
        </div>
      )}
      {!editing && published ? (
        <div className="form-success"><strong>Piano iniziale pubblicato.</strong> Il paziente può vedere piano, calendario e sessioni.</div>
      ) : null}
      {!editing && !published ? (
        <div className="approval-box">
          <label className="check-row"><input checked={approvalChecked} onChange={(event) => onApprovalChange(event.target.checked)} type="checkbox" /><span><strong>Ho verificato quadro clinico, restrizioni ed esercizi</strong><br /><span className="muted">Con questa approvazione inizia il primo percorso RE.HAB del paziente.</span></span></label>
          <button className="button primary" disabled={!approvalChecked} onClick={onPublish} type="button"><CheckCircle2 size={18} /> Approva e pubblica</button>
        </div>
      ) : null}
    </section>
  );
}

function WeeklyExercisesPanel({
  draft,
  editing,
  hasPublishedPlan,
  onCancel,
  onCreate,
  onEdit,
  onExerciseChange,
  onSave,
  plan
}: {
  draft: MeniscusPlan;
  editing: boolean;
  hasPublishedPlan: boolean;
  onCancel: () => void;
  onCreate: () => void;
  onEdit: () => void;
  onExerciseChange: (index: number, field: "sets" | "reps" | "instructions", value: string) => void;
  onSave: () => void;
  plan: MeniscusPlan;
}) {
  if (plan.status === "empty") {
    return <PlanEmptyState description="Crea il piano per aggiungere e configurare gli esercizi della prima settimana." onCreate={onCreate} title="Nessun esercizio programmato" />;
  }

  const visiblePlan = editing ? draft : plan;

  return (
    <section className="panel plan-editor-panel">
      <div className="panel-header">
        <div><p className="eyebrow">Settimana 1</p><h2>Esercizi proposti</h2></div>
        {editing ? (
          <div className="actions compact"><button className="button ghost" onClick={onCancel} type="button">Annulla</button><button className="button primary" onClick={onSave} type="button"><Save size={17} /> Salva bozza</button></div>
        ) : (
          <div className="actions compact"><span className={plan.status === "published" ? "pill green" : hasPublishedPlan ? "pill blue" : "pill amber"}>{plan.status === "published" ? "Approvati" : hasPublishedPlan ? "Revisione in bozza" : "Bozza non pubblicata"}</span><button className="button" onClick={onEdit} type="button"><Pencil size={16} /> Modifica</button></div>
        )}
      </div>
      <div className="source-note"><strong>Proposta mock dichiarata.</strong> Mostra come in futuro verranno considerati quadro clinico, informazioni iniziali e feedback. La logica clinica di generazione non è ancora implementata.</div>
      <div className="plan-input-summary">
        <span><strong>Quadro clinico</strong> dolore 2–4/10, flessione 82°, lieve versamento</span>
        <span><strong>Contesto</strong> 20 minuti, 5 giorni/settimana, attrezzatura domestica</span>
        <span><strong>Feedback precedenti</strong> nessuno: primo piano del percorso</span>
      </div>
      <div className="plan-exercise-editor-list">
        {visiblePlan.exercises.map((exercise, index) => (
          <article className="plan-exercise-editor" key={exercise.id}>
            <div><span className="pill">{index + 1}</span><h3>{exercise.name}</h3></div>
            {editing ? <ExerciseFields exercise={exercise} index={index} onExerciseChange={onExerciseChange} /> : <div className="exercise-read-grid"><div className="read-value"><span>Dosaggio</span><strong>{exercise.sets} serie × {exercise.reps} ripetizioni</strong></div><div className="read-value"><span>Recupero</span><strong>{exercise.restSeconds} secondi</strong></div><div className="read-value wide"><span>Istruzioni</span><p>{exercise.instructions}</p></div></div>}
          </article>
        ))}
      </div>
    </section>
  );
}

function PlanCreationDialog({
  approvalChecked,
  draft,
  onCancel,
  onApprovalChange,
  onExerciseChange,
  onPublish,
  onSave,
  onUpdate
}: {
  approvalChecked: boolean;
  draft: MeniscusPlan;
  onCancel: () => void;
  onApprovalChange: (checked: boolean) => void;
  onExerciseChange: (index: number, field: "sets" | "reps" | "instructions", value: string) => void;
  onPublish: () => void;
  onSave: () => void;
  onUpdate: (plan: MeniscusPlan) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    dialog.querySelector<HTMLInputElement>("input")?.focus();

    return () => dialog.close();
  }, []);

  return (
    <dialog aria-labelledby="create-plan-title" className="plan-creation-dialog" onCancel={(event) => { event.preventDefault(); onCancel(); }} ref={dialogRef}>
      <section className="plan-creation-editor">
        <div className="panel-header">
          <div><p className="eyebrow">Nuovo piano RE.HAB</p><h2 id="create-plan-title">Crea il primo piano</h2><p className="muted">Rivedi i dati precompilati, poi salva la bozza.</p></div>
          <div className="actions compact"><span className="pill amber">Non visibile al paziente</span><button aria-label="Chiudi creazione piano" className="icon-button" onClick={onCancel} type="button"><X size={20} /></button></div>
        </div>
        <div className="editor-section-heading"><span>1</span><div><h3>Informazioni del piano</h3><p>Obiettivo clinico e restrizioni da rispettare.</p></div></div>
        <PlanInfoFields draft={draft} onUpdate={onUpdate} />
        <div className="editor-section-heading"><span>2</span><div><h3>Esercizi della prima settimana</h3><p>Dosaggio e istruzioni iniziali per il paziente.</p></div></div>
        <div className="plan-exercise-editor-list">
          {draft.exercises.map((exercise, index) => (
            <article className="plan-exercise-editor" key={exercise.id}>
              <div><span className="pill">{index + 1}</span><h3>{exercise.name}</h3></div>
              <ExerciseFields exercise={exercise} index={index} onExerciseChange={onExerciseChange} />
            </article>
          ))}
        </div>
        <div className="approval-box">
          <label className="check-row"><input checked={approvalChecked} onChange={(event) => onApprovalChange(event.target.checked)} type="checkbox" /><span><strong>Ho verificato quadro clinico, restrizioni ed esercizi</strong><br /><span className="muted">Con questa approvazione il piano viene pubblicato e inizia il percorso RE.HAB del paziente.</span></span></label>
        </div>
        <div className="editor-actions"><button className="button ghost" onClick={onCancel} type="button">Annulla</button><button className="button" onClick={onSave} type="button"><Save size={17} /> Salva bozza</button><button className="button primary" disabled={!approvalChecked} onClick={onPublish} type="button"><CheckCircle2 size={18} /> Approva e pubblica</button></div>
      </section>
    </dialog>
  );
}

function PlanInfoFields({ draft, onUpdate }: { draft: MeniscusPlan; onUpdate: (plan: MeniscusPlan) => void }) {
  return (
    <div className="field-grid">
      <div className="field"><label htmlFor="plan-phase">Fase iniziale</label><input id="plan-phase" onChange={(event) => onUpdate({ ...draft, phase: event.target.value })} value={draft.phase} /></div>
      <div className="field"><label htmlFor="plan-objective">Obiettivo del piano</label><input id="plan-objective" onChange={(event) => onUpdate({ ...draft, objective: event.target.value })} value={draft.objective} /></div>
      <div className="field wide"><label htmlFor="plan-restrictions">Restrizioni approvate (una per riga)</label><textarea id="plan-restrictions" onChange={(event) => onUpdate({ ...draft, restrictions: event.target.value.split("\n") })} value={draft.restrictions.join("\n")} /></div>
    </div>
  );
}

function ExerciseFields({ exercise, index, onExerciseChange }: { exercise: MeniscusPlan["exercises"][number]; index: number; onExerciseChange: (index: number, field: "sets" | "reps" | "instructions", value: string) => void }) {
  return (
    <div className="dosage-grid">
      <div className="field"><label htmlFor={`sets-${exercise.id}`}>Serie</label><input id={`sets-${exercise.id}`} min={1} onChange={(event) => onExerciseChange(index, "sets", event.target.value)} type="number" value={exercise.sets} /></div>
      <div className="field"><label htmlFor={`reps-${exercise.id}`}>Ripetizioni</label><input id={`reps-${exercise.id}`} min={1} onChange={(event) => onExerciseChange(index, "reps", event.target.value)} type="number" value={exercise.reps} /></div>
      <div className="field wide"><label htmlFor={`instructions-${exercise.id}`}>Istruzioni</label><textarea id={`instructions-${exercise.id}`} onChange={(event) => onExerciseChange(index, "instructions", event.target.value)} value={exercise.instructions} /></div>
    </div>
  );
}

function PlanEmptyState({ description, onCreate, title }: { description: string; onCreate: () => void; title: string }) {
  return (
    <section className="panel plan-empty-panel">
      <div className="empty-state"><span className="empty-state-icon"><ClipboardList size={26} /></span><strong>{title}</strong><span>{description}</span><button className="button primary" onClick={onCreate} type="button"><Plus size={18} /> Crea piano</button></div>
    </section>
  );
}

function ProgressPanel() {
  return (
    <section className="panel progress-panel">
      <div className="panel-header"><div><p className="eyebrow">Logica di avanzamento</p><h2>Milestone teoriche</h2></div><span className="pill amber">Settimana post-op 2</span></div>
      <div className="source-note"><strong>Guida, non prescrizione.</strong> Tempi e criteri sono esempi da adattare a tipo di riparazione, indicazioni del chirurgo e risposta del paziente. Nessun avanzamento è automatico.</div>
      <div className="current-progress-card">
        <div><strong>Posizione attuale</strong><span>Giorno 10 dalla sutura · fase di protezione</span></div>
        <div className="progress-bar" aria-label="Avanzamento nella fase protetta"><span style={{ width: "24%" }} /></div>
        <p>Prossimo controllo: dolore e gonfiore, estensione, flessione consentita e indicazioni sul carico.</p>
      </div>
      <div className="milestone-list">
        {mockMeniscusMilestones.map((milestone) => (
          <article className={`milestone-row ${milestone.status}`} key={milestone.timeframe}>
            <span className="milestone-marker" aria-hidden="true" />
            <div><strong>{milestone.timeframe} · {milestone.title}</strong><p>{milestone.detail}</p></div>
          </article>
        ))}
      </div>
      <div className="evidence-note">
        <strong>Riferimenti per il mock</strong>
        <a href="https://www.massgeneral.org/assets/MGH/pdf/orthopaedics/sports-medicine/physical-therapy/rehabilitation-protocol-for-meniscus-repair.pdf" rel="noreferrer" target="_blank">Mass General Brigham · protocollo riabilitativo dopo riparazione meniscale</a>
        <span>Il dato sul fumo è raccolto come fattore contestuale; la letteratura specifica sul menisco non è uniforme.</span>
      </div>
    </section>
  );
}

function PlanHistoryPanel({ entries }: { entries: MeniscusDemoState["planLog"] }) {
  return (
    <section className="panel history-panel">
      <div className="panel-header"><div><p className="eyebrow">Tracciabilità</p><h2>Log delle modifiche</h2></div><History size={22} color="var(--teal)" /></div>
      <div className="history-list">
        {entries.map((entry) => (
          <article className="history-row" key={entry.id}>
            <span className="history-dot" aria-hidden="true" />
            <div><strong>{entry.title}</strong><p>{entry.detail}</p><small>{new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.occurredAt))} · {entry.author}</small></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TherapistFeedbackPanel({ feedbacks }: { feedbacks: MeniscusDemoState["feedbacks"] }) {
  return (
    <section className="panel">
      <div className="panel-header"><div><p className="eyebrow">Da controllare</p><h2>Feedback di Marco</h2></div><span className="pill coral">{feedbacks.length} ricevuti</span></div>
      {feedbacks.length === 0 ? <div className="empty-state"><Activity size={28} /><strong>Nessun feedback ancora</strong><span>Passa alla vista paziente e completa la sessione mock.</span></div> : (
        <div className="feedback-session-list">
          {feedbacks.map((feedback) => (
            <article className="feedback-session" key={feedback.id}>
              <div className="panel-header"><div><h3>Sessione · piano v{feedback.planVersion}</h3><p className="muted">{new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(feedback.submittedAt))}</p></div><span className={feedback.painAfter >= 4 ? "pill coral" : "pill green"}>Dolore dopo {feedback.painAfter}/10</span></div>
              {feedback.exercises.map((exercise) => (
                <div className="feedback-exercise-row" key={exercise.exerciseId}>
                  <div><strong>{exercise.exerciseName}</strong><span>{exercise.outcome === "completed" ? "Completato" : exercise.outcome === "partial" ? "Parziale" : "Saltato"}</span></div>
                  <div className="pill-row"><span className="pill">dolore {exercise.painDuring}/10</span><span className="pill">{exercise.difficulty}</span></div>
                  {exercise.reason || exercise.note ? <p>{[exercise.reason, exercise.note].filter(Boolean).join(" · ")}</p> : null}
                </div>
              ))}
              <div className="pill-row"><span className="pill">Fatica {feedback.fatigue}/10</span><span className="pill">Gonfiore {feedback.swelling === "more" ? "aumentato" : feedback.swelling === "less" ? "ridotto" : "invariato"}</span></div>
              {feedback.note ? <p>{feedback.note}</p> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function PatientSession({
  fatigue,
  feedbacks,
  hasSubmitted,
  note,
  onExerciseChange,
  onFatigueChange,
  onNoteChange,
  onPainAfterChange,
  onSubmit,
  onSwellingChange,
  painAfter,
  plan,
  swelling
}: {
  fatigue: number;
  feedbacks: MeniscusExerciseFeedback[];
  hasSubmitted: boolean;
  note: string;
  onExerciseChange: (index: number, patch: Partial<MeniscusExerciseFeedback>) => void;
  onFatigueChange: (value: number) => void;
  onNoteChange: (value: string) => void;
  onPainAfterChange: (value: number) => void;
  onSubmit: () => void;
  onSwellingChange: (value: "less" | "same" | "more") => void;
  painAfter: number;
  plan: MeniscusPlan;
  swelling: "less" | "same" | "more";
}) {
  return (
    <section className="patient-demo-stack">
      <div className="mobile-card today-card"><p className="eyebrow">Sessione mock</p><h2>Attivazione e mobilità</h2><p className="muted">Compila un feedback per ogni esercizio. Piano v{plan.version}.</p></div>
      {feedbacks.map((feedback, index) => {
        const exercise = plan.exercises.find((item) => item.id === feedback.exerciseId);
        if (!exercise) return null;
        return (
          <article className="mobile-card patient-exercise-feedback" key={feedback.exerciseId}>
            <div className="panel-header"><div><span className="pill">{index + 1}</span><h3>{exercise.name}</h3></div><strong>{exercise.sets} × {exercise.reps}</strong></div>
            <p>{exercise.instructions}</p>
            <div className="field"><label htmlFor={`outcome-${exercise.id}`}>Esito</label><select id={`outcome-${exercise.id}`} onChange={(event) => onExerciseChange(index, { outcome: event.target.value as MeniscusExerciseFeedback["outcome"] })} value={feedback.outcome}><option value="completed">Completato</option><option value="partial">Parziale</option><option value="skipped">Saltato</option></select></div>
            <div className="field-grid"><div className="field"><label htmlFor={`pain-${exercise.id}`}>Dolore durante</label><select id={`pain-${exercise.id}`} onChange={(event) => onExerciseChange(index, { painDuring: Number(event.target.value) })} value={feedback.painDuring}>{Array.from({ length: 11 }, (_, value) => <option key={value} value={value}>{value}/10</option>)}</select></div><div className="field"><label htmlFor={`difficulty-${exercise.id}`}>Difficoltà</label><select id={`difficulty-${exercise.id}`} onChange={(event) => onExerciseChange(index, { difficulty: event.target.value as MeniscusExerciseFeedback["difficulty"] })} value={feedback.difficulty}><option value="easy">Facile</option><option value="adequate">Adeguata</option><option value="hard">Difficile</option></select></div></div>
            {feedback.outcome === "skipped" ? <div className="field"><label htmlFor={`reason-${exercise.id}`}>Motivo dello stop *</label><input id={`reason-${exercise.id}`} onChange={(event) => onExerciseChange(index, { reason: event.target.value })} placeholder="Es. dolore, stanchezza, istruzioni non chiare" value={feedback.reason} /></div> : null}
            <div className="field"><label htmlFor={`note-${exercise.id}`}>Nota opzionale</label><input id={`note-${exercise.id}`} onChange={(event) => onExerciseChange(index, { note: event.target.value })} value={feedback.note} /></div>
          </article>
        );
      })}
      <section className="mobile-card session-summary-form"><h2>Fine sessione</h2><div className="field-grid"><div className="field"><label htmlFor="session-pain">Dolore dopo</label><select id="session-pain" onChange={(event) => onPainAfterChange(Number(event.target.value))} value={painAfter}>{Array.from({ length: 11 }, (_, value) => <option key={value} value={value}>{value}/10</option>)}</select></div><div className="field"><label htmlFor="session-fatigue">Fatica</label><select id="session-fatigue" onChange={(event) => onFatigueChange(Number(event.target.value))} value={fatigue}>{Array.from({ length: 11 }, (_, value) => <option key={value} value={value}>{value}/10</option>)}</select></div></div><div className="field"><label htmlFor="session-swelling">Gonfiore rispetto all'inizio</label><select id="session-swelling" onChange={(event) => onSwellingChange(event.target.value as "less" | "same" | "more")} value={swelling}><option value="less">Ridotto</option><option value="same">Invariato</option><option value="more">Aumentato</option></select></div><div className="field"><label htmlFor="session-note">Nota opzionale</label><textarea id="session-note" onChange={(event) => onNoteChange(event.target.value)} value={note} /></div><button className="button primary" onClick={onSubmit} type="button"><Save size={18} /> {hasSubmitted ? "Invia un nuovo feedback mock" : "Invia feedback"}</button></section>
    </section>
  );
}

function PatientPlan({ plan, publishedSummary }: { plan: MeniscusPlan; publishedSummary: string }) {
  if (plan.status === "draft") {
    return <PatientWaitingForPlan />;
  }

  return (
    <section className="patient-demo-stack">
      <div className="mobile-card patient-plan-hero"><p className="eyebrow">Il mio piano · {publishedSummary}</p><h2>{plan.phase}</h2><p>{plan.objective}</p></div>
      <div className="mobile-card"><h3>Restrizioni approvate</h3><ul className="restriction-list">{plan.restrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul></div>
      <div className="mobile-card"><div className="panel-header"><h3>Avvio del percorso</h3><span className="pill green">Dal {formatDate(plan.effectiveFrom)}</span></div><p>Questo è il tuo primo piano RE.HAB.</p><p className="muted">Approvato da {plan.approvedBy}</p></div>
      {plan.exercises.map((exercise) => <article className="mobile-card" key={exercise.id}><div className="panel-header"><h3>{exercise.name}</h3><span className="pill">{exercise.sets} × {exercise.reps}</span></div><p>{exercise.instructions}</p></article>)}
    </section>
  );
}

function PatientWaitingForPlan() {
  return (
    <section className="mobile-card patient-waiting-card">
      <ShieldCheck size={34} color="var(--teal)" aria-hidden="true" />
      <div><p className="eyebrow">Percorso RE.HAB</p><h2>Il fisioterapista sta preparando il tuo primo piano</h2><p className="muted">Calendario ed esercizi compariranno qui dopo l'approvazione manuale.</p></div>
    </section>
  );
}

function WeekCalendar() {
  return (
    <section className="week-calendar"><div className="panel-header"><div><p className="eyebrow">Calendario mock</p><h3>19–25 ottobre 2026</h3></div><CalendarDays size={20} color="var(--teal)" /></div><div className="week-grid">{mockWeek.map((day) => <div className={`week-day ${day.status}`} key={day.date}><strong>{day.day}</strong><span>{new Date(`${day.date}T12:00:00`).getDate()}</span><small>{day.status === "rest" ? "Riposo" : "Esercizi"}</small></div>)}</div></section>
  );
}
