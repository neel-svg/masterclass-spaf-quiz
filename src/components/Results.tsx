import { useEffect, useRef, useState } from "react";
import { RESERVE_SEAT_URL } from "../config/constants";
import { trackEvent } from "../lib/analytics";
import { fmt } from "../lib/format";
import { playFanfare } from "../lib/sound";
import { submitScore, type SubmitResult } from "../lib/supabase";
import type { UserProfile } from "../lib/types";
import { LeaderboardView } from "./LeaderboardView";
import { Confetti } from "./common/Confetti";
import { CountdownWidget } from "./common/CountdownWidget";
import { HomeBtn } from "./common/HomeBtn";

interface ResultsProps {
  quizId: number;
  user: UserProfile;
  timeMs: number;
  score: number;
  cycleStart: string;
  endsAt: string;
  onHome: () => void;
  isAdmin: boolean;
  adminParam: string | null;
}

export function Results({ quizId, user, timeMs, score, cycleStart, endsAt, onHome, isAdmin, adminParam }: ResultsProps) {
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    playFanfare();
    trackEvent("quiz_complete", quizId,
      { name: user.name, specialty: user.specialty, phone: user.phone },
      { score, time_ms: timeMs },
    );
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    submitScore({ quizId, name: user.name, specialty: user.specialty, phone: user.phone, score, timeMs, cycleStart })
      .then((result) => {
        setSubmitResult(result);
        trackEvent("score_submitted", quizId,
          { name: user.name, specialty: user.specialty, phone: user.phone },
          { score, time_ms: timeMs, result },
        );
      });
  }, [quizId, score, timeMs, cycleStart, user.name, user.phone, user.specialty]);

  const showLeaderboard = submitResult === "ok" || submitResult === "duplicate";

  return <div className="s3"><HomeBtn onClick={onHome} /><Confetti />
    <div className="r-hero"><div className="r-trophy">🏆</div><div className="r-tag">Case Closed!</div><div className="r-title">Well done,<br /><span>Dr. {user.name.trim().replace(/^(dr|mr|ms|mrs|prof)\.?\s+/i, "").split(/\s+/)[0]}!</span></div><div className="r-time">⏱ Completed in {fmt(timeMs)}</div><div className="stats"><div className="sbox"><div className="snum">{score}/5</div><div className="slbl">Correct</div></div><div className="sbox"><div className="snum">{fmt(timeMs)}</div><div className="slbl">Time</div></div></div></div>
    <div className="cta">
      <div className="cta-h">Take your clinical learning further</div>
      <div className="cta-p" style={{ marginBottom: 8 }}>5 AF dilemmas. And that's just the beginning.</div>
      <div className="cta-p">From post-stroke AF detection and DOAC switching to PCI and perioperative anticoagulation — discover how the experts navigate decisions beyond the obvious.</div>
      <div className="cta-date">SPAF Masterclass 2026 | 25 Sep | 8:00 PM IST</div>
      <a className="btn-cf" href={RESERVE_SEAT_URL} target="_blank" rel="noopener noreferrer">RESERVE YOUR SEAT →</a>
    </div>
    <CountdownWidget endsAt={endsAt} />
    {submitResult === "duplicate" && <div className="lb-loading" style={{ color: "#f59e0b" }}>ℹ️ You have already completed this challenge. Showing leaderboard.</div>}
    {submitResult === "error" && <div className="lb-loading" style={{ color: "#ef4444" }}>⚠️ Score could not be saved. Check your connection and try again.</div>}
    {showLeaderboard ? <LeaderboardView quizId={quizId} cycleStart={cycleStart} user={user} score={score} timeMs={timeMs} isAdmin={isAdmin} adminParam={adminParam} /> : !submitResult && <div className="lb-loading"><div className="spinner" />Submitting your score…</div>}
  </div>;
}
