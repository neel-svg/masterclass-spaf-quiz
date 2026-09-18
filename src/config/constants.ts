import type { QuizQuestion } from "../lib/types";

export const LS_KEY = "spaf_user_v1";

export const QUIZ_ENDED = false;

export const RESERVE_SEAT_URL = "https://medflix.app/discussion/a9b68a76-1b9c-4bf9-aa74-dfdc4a53bcb9";

export const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    emoji: "🫀",
    q: "A 78-year-old patient has an embolic stroke of undetermined source. Initial ECG and telemetry show sinus rhythm. What is the most appropriate next step to evaluate for occult AF?",
    opts: ["Start a DOAC empirically", "Undertake prolonged cardiac rhythm monitoring", "Start indefinite dual antiplatelet therapy", "No further cardiac evaluation"],
    ans: 1,
    expl: "",
  },
  {
    emoji: "💊",
    q: "A patient with AF is stable on a DOAC and is newly prescribed a strong P-glycoprotein/CYP3A4 inducer. What is the most appropriate approach?",
    opts: ["Continue the DOAC without modification", "Double the DOAC dose", "Assess the interaction because strong enzyme/P-gp induction can reduce DOAC exposure and increase thromboembolic risk", "Add aspirin to compensate for the reduced DOAC exposure"],
    ans: 2,
    expl: "",
  },
  {
    emoji: "🩺",
    q: "A patient with non-valvular AF taking a DOAC is scheduled for elective high-bleeding-risk surgery. The DOAC must be temporarily interrupted. Which statement is most appropriate?",
    opts: ["Routine LMWH bridging is not recommended", "LMWH bridging should routinely be used", "Bridging is required in all patients aged >75 years", "Bridging is required whenever CHA₂DS₂-VASc ≥3"],
    ans: 0,
    expl: "",
  },
  {
    emoji: "🧬",
    q: "A patient with AF undergoes PCI for ACS and requires long-term oral anticoagulation. He has a high bleeding risk. Which strategy is most consistent with current guideline principles?",
    opts: ["Continue triple therapy indefinitely", "Use a DOAC plus a P2Y12 inhibitor, with aspirin limited to the shortest appropriate duration", "Stop oral anticoagulation and continue DAPT", "Use aspirin alone"],
    ans: 1,
    expl: "",
  },
  {
    emoji: "⚖️",
    q: "An 82-year-old patient with AF has a high HAS-BLED score but no absolute contraindication to anticoagulation. What is the most appropriate approach?",
    opts: ["Withhold anticoagulation", "Use aspirin instead", "Address modifiable bleeding risks and anticoagulate according to thromboembolic risk", "Automatically reduce the DOAC dose"],
    ans: 2,
    expl: "",
  },
];

