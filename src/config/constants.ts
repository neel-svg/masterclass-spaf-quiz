import type { QuizQuestion } from "../lib/types";

export const LS_KEY = "spaf_user_v1";

// Universal kill switch — set to true to show "quiz ended" screen to all users
export const QUIZ_ENDED = false;

export const FALLBACK_QUESTIONS: QuizQuestion[] = [
  { emoji: "🦷", q: "What in your saliva is stronger than morphine as a painkiller?", opts: ["Histamine", "Opiorphin", "Amylase", "Lysozyme"], ans: 1, expl: "Opiorphin in saliva is significantly more potent than morphine. Chewing triggers a flood of it, bathing the throat. 🤯" },
  { emoji: "🤢", q: "What does the body do FIRST, right before vomiting?", opts: ["Stomach contractions", "Floods mouth with saliva", "Relaxes the sphincter", "Diaphragm spasms"], ans: 1, expl: "Saliva surges to coat your teeth — protecting enamel from stomach acid that's about to arrive. Smart body! 🦷" },
  { emoji: "🌀", q: "That rumble isn't hunger. What is it really?", opts: ["Acid pooling in stomach", "Migrating Motor Complex", "Gas pops in colon", "Gallbladder contracting"], ans: 1, expl: "It's the Migrating Motor Complex — a muscular cleaning wave that only activates during fasting. Your gut self-cleans! 🧹" },
  { emoji: "🦠", q: "What does new microbiome science say the appendix really does?", opts: ["Makes extra bile", "Safe-houses gut bacteria", "Synthesises Vitamin K", "Digests cellulose"], ans: 1, expl: "It's a bacterial bunker! Good bacteria shelter there during illness, then repopulate your gut once you recover. 🏠" },
  { emoji: "🧠", q: "What % of vagus nerve signals travel gut → brain (not brain → gut)?", opts: ["10%", "50%", "90%", "30%"], ans: 2, expl: "90%! The gut talks TO the brain — far more than the reverse. You have a literal second brain in your belly. 🤯" },
];
