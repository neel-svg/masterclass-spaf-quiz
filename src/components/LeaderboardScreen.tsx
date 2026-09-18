import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";
import { LeaderboardView } from "./LeaderboardView";
import { CountdownWidget } from "./common/CountdownWidget";
import { HomeBtn } from "./common/HomeBtn";

interface LeaderboardScreenProps {
  quizId: number;
  cycleStart: string;
  endsAt: string;
  isAdmin: boolean;
  adminParam: string | null;
  onHome: () => void;
}

export function LeaderboardScreen({ quizId, cycleStart, endsAt, isAdmin, adminParam, onHome }: LeaderboardScreenProps) {
  useEffect(() => {
    trackEvent("leaderboard_view", quizId);
  }, [quizId]);

  return (
    <div className="s3">
      <HomeBtn onClick={onHome} />
      <div className="r-hero">
        <div className="r-trophy" style={{ fontSize: 48 }}>🏅</div>
        <div className="r-title">SPAF Masterclass - 2026<br /><span>Leaderboard</span></div>
      </div>
      <CountdownWidget endsAt={endsAt} />
      <LeaderboardView quizId={quizId} cycleStart={cycleStart} user={null} isAdmin={isAdmin} adminParam={adminParam} />
    </div>
  );
}
