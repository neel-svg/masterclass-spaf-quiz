import { useEffect, useState } from "react";
import { parseCountdown } from "../../lib/quiz";

interface CountdownProps {
  endsAt: string;
}

export function CountdownWidget({ endsAt }: CountdownProps) {
  const getSecsLeft = () => Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
  const [secs, setSecs] = useState(getSecsLeft);
  useEffect(() => {
    const id = setInterval(() => setSecs(getSecsLeft()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  const { d, h, m, s } = parseCountdown(secs);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="countdown-card">
      <div className="cd-label">CHALLENGE CLOSES IN</div>
      {secs === 0 ? (
        <div className="cd-title">The challenge is closed.</div>
      ) : (
        <>
          <div className="cd-blocks">
            <div className="cd-block"><div className="cd-num">{d}</div><div className="cd-unit">Days</div></div>
            <div className="cd-block"><div className="cd-num">{pad(h)}</div><div className="cd-unit">Hrs</div></div>
            <div className="cd-block"><div className="cd-num">{pad(m)}</div><div className="cd-unit">Min</div></div>
            <div className="cd-block"><div className="cd-num">{pad(s)}</div><div className="cd-unit">Sec</div></div>
          </div>
          <div className="cd-sub">Complete the challenge before the masterclass and secure your place on the leaderboard.</div>
        </>
      )}
    </div>
  );
}
