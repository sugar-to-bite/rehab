export type MeniscusClinicalRecord = {
  initialInfo: {
    age: string;
    sexAtBirth: string;
    heightWeightBmi: string;
    smoking: string;
    comorbidities: string;
    medicationsAndAllergies: string;
  };
  intervention: {
    date: string;
    knee: "destro" | "sinistro";
    meniscus: "mediale" | "laterale";
    procedure: string;
  };
  lesion: {
    pattern: string;
    zone: string;
    repairDetails: string;
    associatedProcedures: string;
  };
  surgeonInstructions: {
    loading: string;
    braceAndAids: string;
    movementLimits: string;
    reviewCriteria: string;
  };
  clinicalStatus: {
    painAtRest: string;
    painDuringActivity: string;
    swelling: string;
    symptoms: string;
  };
  functionalAssessment: {
    flexion: string;
    extension: string;
    quadricepsControl: string;
    walking: string;
  };
  goalAndContext: {
    personalGoal: string;
    previousActivity: string;
    availability: string;
    equipment: string;
  };
  assessedAt: string;
  assessedBy: string;
};

export type MeniscusPlanExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
  instructions: string;
};

export type MeniscusPlan = {
  version: number;
  status: "draft" | "published";
  phase: string;
  objective: string;
  restrictions: string[];
  exercises: MeniscusPlanExercise[];
  createdAt: string;
  publishedAt: string | null;
  effectiveFrom: string;
  approvedBy: string;
};

export type MeniscusPlanLogEntry = {
  id: string;
  occurredAt: string;
  author: string;
  title: string;
  detail: string;
};

export type MeniscusExerciseFeedback = {
  exerciseId: string;
  exerciseName: string;
  outcome: "completed" | "partial" | "skipped";
  painDuring: number;
  difficulty: "easy" | "adequate" | "hard";
  reason: string;
  note: string;
};

export type MeniscusSessionFeedback = {
  id: string;
  submittedAt: string;
  planVersion: number;
  exercises: MeniscusExerciseFeedback[];
  painAfter: number;
  swelling: "less" | "same" | "more";
  fatigue: number;
  note: string;
};

export type MeniscusDemoState = {
  clinicalRecord: MeniscusClinicalRecord;
  plan: MeniscusPlan;
  planLog: MeniscusPlanLogEntry[];
  feedbacks: MeniscusSessionFeedback[];
};

export const MENISCUS_DEMO_STORAGE_KEY = "rehab:meniscus-mvp-demo:v2";

export const initialMeniscusDemoState: MeniscusDemoState = {
  clinicalRecord: {
    initialInfo: {
      age: "34 anni",
      sexAtBirth: "Maschile",
      heightWeightBmi: "178 cm · 78 kg · BMI 24,6",
      smoking: "Non fumatore",
      comorbidities: "Nessuna riferita",
      medicationsAndAllergies: "Terapia post-operatoria prescritta · nessuna allergia riferita"
    },
    intervention: {
      date: "2026-10-05",
      knee: "destro",
      meniscus: "mediale",
      procedure: "Sutura meniscale artroscopica"
    },
    lesion: {
      pattern: "Longitudinale",
      zone: "Non disponibile",
      repairDetails: "Due punti all-inside (dato dimostrativo)",
      associatedProcedures: "Nessuna riferita"
    },
    surgeonInstructions: {
      loading: "Carico parziale con due stampelle",
      braceAndAids: "Tutore articolato e due stampelle",
      movementLimits: "Flessione fino a 90°",
      reviewCriteria: "Rivalutazione del chirurgo a 4 settimane"
    },
    clinicalStatus: {
      painAtRest: "2/10",
      painDuringActivity: "4/10",
      swelling: "Lieve versamento",
      symptoms: "Rigidità mattutina; nessun blocco riferito"
    },
    functionalAssessment: {
      flexion: "82°",
      extension: "-4°",
      quadricepsControl: "Attivazione presente con lieve ritardo",
      walking: "Con due stampelle, carico parziale"
    },
    goalAndContext: {
      personalGoal: "Tornare a camminare senza ausili",
      previousActivity: "Corsa amatoriale 2 volte/settimana",
      availability: "20 minuti, 5 giorni/settimana",
      equipment: "Tappetino, asciugamano, sedia"
    },
    assessedAt: "2026-10-15",
    assessedBy: "Dott.ssa Giulia Bianchi"
  },
  plan: {
    version: 0,
    status: "draft",
    phase: "Fase iniziale protetta — esempio dimostrativo",
    objective: "Controllare i sintomi e recuperare l'attivazione del quadricipite",
    restrictions: [
      "Non superare 90° di flessione",
      "Mantenere il carico parziale con gli ausili prescritti",
      "Interrompere e contattare il fisioterapista in caso di dolore acuto"
    ],
    exercises: [
      {
        id: "mock-quad-set",
        name: "Contrazione isometrica del quadricipite",
        sets: 3,
        reps: 10,
        restSeconds: 30,
        instructions: "Mantieni la contrazione per 5 secondi senza sollevare il tallone."
      },
      {
        id: "mock-heel-slide",
        name: "Scivolamento del tallone assistito",
        sets: 2,
        reps: 8,
        restSeconds: 45,
        instructions: "Fletti lentamente senza superare il limite indicato dal fisioterapista."
      },
      {
        id: "mock-ankle-pump",
        name: "Mobilizzazione della caviglia",
        sets: 2,
        reps: 20,
        restSeconds: 20,
        instructions: "Alterna punta e tallone mantenendo la gamba rilassata."
      }
    ],
    createdAt: "2026-10-15T09:00:00+02:00",
    publishedAt: null,
    effectiveFrom: "2026-10-19",
    approvedBy: ""
  },
  planLog: [
    {
      id: "mock-log-clinical",
      occurredAt: "2026-10-15T08:45:00+02:00",
      author: "Dott.ssa Giulia Bianchi",
      title: "Quadro clinico registrato",
      detail: "Completate le informazioni iniziali e le sei sezioni della valutazione menisco."
    },
    {
      id: "mock-log-plan-draft",
      occurredAt: "2026-10-15T09:00:00+02:00",
      author: "Dott.ssa Giulia Bianchi",
      title: "Bozza del primo piano creata",
      detail: "Piano mock preparato manualmente per l'avvio del percorso RE.HAB."
    }
  ],
  feedbacks: []
};

export const mockMeniscusMilestones = [
  {
    timeframe: "0–6 settimane",
    title: "Protezione della riparazione",
    detail: "Controllo di dolore e gonfiore, estensione completa e flessione entro il limite indicato dal chirurgo.",
    status: "current" as const
  },
  {
    timeframe: "6–9 settimane",
    title: "Cammino e mobilità",
    detail: "Progressione del carico autorizzata, cammino senza compensi e recupero graduale del movimento.",
    status: "future" as const
  },
  {
    timeframe: "9–12 settimane",
    title: "Forza e controllo funzionale",
    detail: "Esercizi in carico e controllo monopodalico senza aumento reattivo di dolore o gonfiore.",
    status: "future" as const
  },
  {
    timeframe: "3–5 mesi",
    title: "Eventuale ritorno alla corsa",
    detail: "Solo dopo criteri funzionali, assenza di dolore o gonfiore e autorizzazione clinica.",
    status: "future" as const
  },
  {
    timeframe: "6+ mesi",
    title: "Ritorno progressivo allo sport",
    detail: "Test di forza e funzione, tolleranza al carico e via libera del team clinico.",
    status: "future" as const
  }
];

export const mockWeek = [
  { date: "2026-10-19", day: "Lun", status: "scheduled" as const },
  { date: "2026-10-20", day: "Mar", status: "rest" as const },
  { date: "2026-10-21", day: "Mer", status: "scheduled" as const },
  { date: "2026-10-22", day: "Gio", status: "rest" as const },
  { date: "2026-10-23", day: "Ven", status: "scheduled" as const },
  { date: "2026-10-24", day: "Sab", status: "scheduled" as const },
  { date: "2026-10-25", day: "Dom", status: "rest" as const }
];
