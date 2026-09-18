import { useState } from "react";

type ConfettiPiece = {
  id: number;
  left: number;
  color: string;
  dur: number;
  delay: number;
  size: number;
  round: boolean;
};

function createPieces(): ConfettiPiece[] {
  const cols = ["#e07b6a", "#3b82f6", "#16a34a", "#f59e0b", "#8b5cf6", "#06b6d4"];
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: cols[i % cols.length],
    dur: 2.4 + Math.random() * 2,
    delay: Math.random() * 1.4,
    size: 7 + Math.random() * 9,
    round: Math.random() > 0.5,
  }));
}

export function Confetti() {
  // Lazy initializer: runs once on mount, not on every render.
  const [pieces] = useState<ConfettiPiece[]>(() => createPieces());

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999, overflow: "hidden" }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-p"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size,
            borderRadius: p.round ? "50%" : "2px",
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
