export type Screen = "loading" | "gateway" | "quiz" | "results" | "leaderboard" | "no_quiz";

export interface UserProfile {
  name: string;
  phone: string;
  specialty: string;
}

export interface QuizQuestion {
  emoji: string;
  q: string;
  opts: string[];
  ans: number;
  expl: string;
}

export interface ActiveQuiz {
  quizId: number;
  questions: QuizQuestion[];
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface LeaderboardRow {
  name: string;
  specialty: string;
  score: number;
  time_ms: number;
  phone?: string;
}
