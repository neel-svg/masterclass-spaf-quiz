import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { fmt } from "../lib/format";
import { playCorrect, playWrong } from "../lib/sound";
import type { QuizQuestion, UserProfile } from "../lib/types";
import { HomeBtn } from "./common/HomeBtn";

interface QuizProps {
  quizId: number;
  user: UserProfile;
  questions: QuizQuestion[];
  onFinish: (timeMs: number, score: number) => void;
  onHome: () => void;
}

export function Quiz({ quizId, user, questions, onFinish, onHome }: QuizProps) {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [score, setScore] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const stopMsRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = performance.now();
    timerRef.current = window.setInterval(() => {
      setElapsedMs(Math.floor(performance.now() - startRef.current));
    }, 50);
    trackEvent("quiz_start", quizId, { name: user.name, specialty: user.specialty, phone: user.phone });
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [quizId, user.name]);

  const q = questions[qi];
  const letters = ["A", "B", "C", "D"];
  const isRight = done && sel === q.ans;

  const next = () => {
    const fs = score;
    if (qi + 1 >= questions.length) {
      if (stopMsRef.current === null) stopMsRef.current = Math.floor(performance.now() - startRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
      return onFinish(stopMsRef.current, fs);
    }
    setQi((c) => c + 1);
    setSel(null);
    setDone(false);
  };

  return <div className="s2"><HomeBtn onClick={onHome} /><div className="q-top"><div className="timer"><div className="tdot" />{fmt(elapsedMs)}</div><div className="clue-badge">Question {qi + 1} / {questions.length}</div></div><div className="pbar-wrap"><div className="pbar" style={{ width: `${(qi / questions.length) * 100}%` }} /></div><div className="q-body"><div className="q-icon"><span>{q.emoji}</span></div><div className="q-txt">{q.q}</div>
    {q.opts.map((opt, i) => { let cls = "opt"; if (done) cls += i === q.ans ? " correct" : i === sel ? " wrong" : " dimmed"; return <button key={i} className={cls} onClick={() => { if (done) return; if (qi + 1 >= questions.length) stopMsRef.current = Math.floor(performance.now() - startRef.current); setSel(i); setDone(true); const ok = i === q.ans; if (ok) { setScore((s) => s + 1); playCorrect(); } else playWrong(); trackEvent("question_answered", quizId,
  { name: user.name, specialty: user.specialty, phone: user.phone },
  { qi: qi + 1, correct: ok },
); }} disabled={done}><span className="oletter">{letters[i]}</span><span style={{ flex: 1 }}>{opt}</span></button>; })}
    {done && <div className={`fb ${isRight ? "ok" : "bad"}`}>{isRight ? <div className="fb-v">🎉 Excellent!</div> : <div className="fb-ca">Correct option is Option {letters[q.ans]}</div>}<button className="btn-next" onClick={next}>{qi + 1 >= questions.length ? "📋 See My Results" : "Next Question"}</button></div>}
  </div></div>;
}
