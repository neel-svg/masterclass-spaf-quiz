import { createClient } from "@supabase/supabase-js";
import { normalizePhone } from "./quiz";
import type { Database } from "./database.types";
import type { ActiveQuiz, LeaderboardRow, QuizQuestion } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error("Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then redeploy.");
}

export const sb = createClient<Database>(SUPABASE_URL ?? "", SUPABASE_ANON ?? "");

export async function verifyAdminSecret(secret: string): Promise<boolean> {
  const { data } = await sb.rpc("verify_admin_secret", { secret });
  return Boolean(data);
}

export async function fetchActiveQuiz(): Promise<ActiveQuiz | null> {
  const now = new Date().toISOString();

  // Try currently active quiz
  const { data: active } = await sb
    .from("quizzes")
    .select("quiz_id, questions, starts_at, ends_at")
    .lte("starts_at", now)
    .gte("ends_at", now)
    .limit(1)
    .single();

  if (active) {
    return {
      quizId: Number(active.quiz_id),
      questions: active.questions as unknown as QuizQuestion[],
      startsAt: active.starts_at as string,
      endsAt: active.ends_at as string,
      isActive: true,
    };
  }

  // Fall back to most recently ended quiz
  const { data: recent } = await sb
    .from("quizzes")
    .select("quiz_id, questions, starts_at, ends_at")
    .lt("ends_at", now)
    .order("ends_at", { ascending: false })
    .limit(1)
    .single();

  if (!recent) return null;

  return {
    quizId: Number(recent.quiz_id),
    questions: recent.questions as unknown as QuizQuestion[],
    startsAt: recent.starts_at as string,
    endsAt: recent.ends_at as string,
    isActive: false,
  };
}

export async function checkAlreadyPlayed(phone: string, quizId: number, cycleStart: string): Promise<boolean> {
  const { data } = await sb
    .from("responses")
    .select("id")
    .eq("quiz_id", quizId)
    .eq("cycle_start", cycleStart)
    .eq("phone", normalizePhone(phone))
    .limit(1);
  return !!data && data.length > 0;
}

export type SubmitResult = "ok" | "duplicate" | "error";

export async function submitScore(payload: {
  quizId: number; name: string; specialty: string; phone: string; score: number; timeMs: number; cycleStart: string;
}): Promise<SubmitResult> {
  const normalizedPhone = normalizePhone(payload.phone);

  await sb
    .from("users")
    .upsert(
      [{ phone: normalizedPhone, name: payload.name, specialty: payload.specialty, updated_at: new Date().toISOString() }],
      { onConflict: "phone" },
    );

  const { error } = await sb.from("responses").insert([{
    quiz_id: payload.quizId, name: payload.name, specialty: payload.specialty, phone: normalizedPhone,
    score: payload.score, time_ms: payload.timeMs, cycle_start: payload.cycleStart,
  }]);

  if (!error) return "ok";
  if (error.code === "23505") return "duplicate";
  return "error";
}

export async function fetchUserRank(quizId: number, score: number, timeMs: number, cycleStart: string): Promise<number | null> {
  const { count, error } = await sb
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq("quiz_id", quizId)
    .eq("cycle_start", cycleStart)
    .or(`score.gt.${score},and(score.eq.${score},time_ms.lt.${timeMs})`);
  if (error) return null;
  return (count ?? 0) + 1;
}

export async function fetchLeaderboard(quizId: number, cycleStart: string, adminSecret?: string | null): Promise<LeaderboardRow[] | null> {
  const canViewPhone = adminSecret ? await verifyAdminSecret(adminSecret) : false;
  const selectFields = canViewPhone ? "name, specialty, score, time_ms, phone" : "name, specialty, score, time_ms";
  const { data, error } = await sb
    .from("responses")
    .select(selectFields)
    .eq("quiz_id", quizId)
    .eq("cycle_start", cycleStart)
    .order("score", { ascending: false })
    .order("time_ms", { ascending: true })
    .limit(10);
  if (error || !data) return null;
  return data as unknown as LeaderboardRow[];
}
