import { sb } from "./supabase";

/** All meaningful events in the quiz funnel */
export type AnalyticsEvent =
  | "gateway_view"      // Doctor lands on the quiz page
  | "quiz_start"        // Doctor clicks "Start the Clock"
  | "question_answered" // Doctor answers one question
  | "quiz_complete"     // Doctor finishes all questions
  | "score_submitted"   // Score saved to DB (ok / duplicate / error)
  | "leaderboard_view"; // Doctor views the leaderboard

/** Doctor identity — merged into every event's payload when available */
export interface DocInfo {
  name?: string;
  specialty?: string;
  phone?: string;
}

/**
 * Every row in `analytics` has a single `payload` JSON object that contains:
 *  - doc fields: name, specialty, phone  (when the doctor is known)
 *  - event-specific extras: score, time_ms, question index, result, etc.
 *
 * Example payload for "question_answered":
 *   { "name": "Dr. Mehta", "specialty": "Gastroenterology", "phone": "9876543210",
 *     "qi": 2, "question": "Abdominal Pain", "correct": true }
 */
export async function trackEvent(
  event: AnalyticsEvent,
  quizId: number,
  doc: DocInfo = {},
  extras: Record<string, unknown> = {},
): Promise<void> {
  try {
    const payload: Record<string, unknown> = {};

    if (doc.name)      payload.name      = doc.name;
    if (doc.specialty) payload.specialty = doc.specialty;
    if (doc.phone)     payload.phone     = doc.phone;

    // Merge event-specific extras after doc fields
    Object.assign(payload, extras);

    await sb.from("analytics").insert([{
      event,
      quiz_id: quizId,
      payload: JSON.stringify(payload),
    }]);
  } catch {
    // no-op — analytics failures must never break the quiz flow
  }
}
