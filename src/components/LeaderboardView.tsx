import { useEffect, useState } from "react";
import { fetchLeaderboard, fetchUserRank } from "../lib/supabase";
import { fmt } from "../lib/format";
import type { LeaderboardRow, UserProfile } from "../lib/types";

interface LeaderboardProps {
  quizId: number;
  cycleStart: string;
  user: UserProfile | null;
  score?: number;
  timeMs?: number;
  isAdmin: boolean;
  adminParam: string | null;
}

export function LeaderboardView({ quizId, cycleStart, user, score, timeMs, isAdmin, adminParam }: LeaderboardProps) {
  const [lbData, setLbData] = useState<LeaderboardRow[] | null>(null);
  const [lbError, setLbError] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  useEffect(() => { fetchLeaderboard(quizId, cycleStart, isAdmin ? adminParam : null).then((rows) => rows ? setLbData(rows) : (setLbError(true), setLbData([]))); }, [quizId, cycleStart, isAdmin, adminParam]);
  useEffect(() => { if (score !== undefined && timeMs !== undefined) fetchUserRank(quizId, score, timeMs, cycleStart).then(setUserRank); }, [quizId, score, timeMs, cycleStart]);
  const medals = ["🥇", "🥈", "🥉"];
  return <div className="lb-sec"><div className="lb-header"><div className="lb-h">SPAF Masterclass - 2026 Leaderboard</div>{!lbError && <div className="lb-live"><div className="lb-live-dot" />LIVE</div>}</div>
    {lbData === null && <div className="lb-loading"><div className="spinner" />Fetching live scores…</div>}
    {lbData?.map((row, i) => <div key={i} className={`lb-row${user && row.name === user.name && row.specialty === user.specialty && row.score === score && row.time_ms === timeMs ? " me" : ""}`}><div className="lb-med">{medals[i] || `#${i + 1}`}</div><div className="lb-av" style={{ background: "#1a3a6a" }}>{row.name.slice(0, 2).toUpperCase()}</div><div className="lb-inf"><div className="lb-n">{row.name}</div><div className="lb-sp">{row.specialty}{row.phone && <span style={{ marginLeft: 8, fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>📞 {row.phone}</span>}</div></div><div className="lb-rt"><div className="lb-t">{fmt(row.time_ms)}</div><div className="lb-sc">{row.score}/5</div></div></div>)}
    {!!userRank && userRank > 0 && <div style={{ textAlign: "center", padding: "4px 0 12px", fontSize: "13px", fontWeight: 800, color: "#3b82f6" }}>Your rank: #{userRank}</div>}
  </div>;
}
