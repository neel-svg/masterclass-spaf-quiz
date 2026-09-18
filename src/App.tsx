import { useEffect, useState } from "react";
import { FALLBACK_QUESTIONS, QUIZ_ENDED } from "./config/constants";
import { Gateway } from "./components/Gateway";
import { LeaderboardScreen } from "./components/LeaderboardScreen";
import { LeaderboardView } from "./components/LeaderboardView";
import { Quiz } from "./components/Quiz";
import { Results } from "./components/Results";
import { getAdminParam } from "./lib/quiz";
import { fetchActiveQuiz, verifyAdminSecret } from "./lib/supabase";
import type { ActiveQuiz, Screen, UserProfile } from "./lib/types";

function AppLoader() {
  return <div className="app-loader"><div className="app-loader-emoji">🫀</div><div className="spinner" style={{ margin: 0 }} /><div className="app-loader-txt">Loading challenge…</div></div>;
}

export default function App() {
  const adminParam = getAdminParam();
  const [screen, setScreen] = useState<Screen>("loading");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [res, setRes] = useState<{ timeMs: number; score: number } | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      if (adminParam) setIsAdmin(await verifyAdminSecret(adminParam));
      const quiz = await fetchActiveQuiz();
      if (quiz && quiz.questions.length) {
        setActiveQuiz(quiz);
      } else if (quiz) {
        setActiveQuiz({ ...quiz, questions: FALLBACK_QUESTIONS });
      } else {
        setActiveQuiz(null);
      }
      setScreen(quiz?.isActive ? "gateway" : "no_quiz");
    })();
  }, [adminParam]);

  const cycleStart = activeQuiz?.startsAt.slice(0, 10) ?? "";
  const endsAt = activeQuiz?.endsAt ?? "";
  const quizId = activeQuiz?.quizId ?? 0;

  const goHome = () => { setScreen(activeQuiz?.isActive ? "gateway" : "no_quiz"); setUser(null); setRes(null); };

  if (screen === "loading") return <div className="shell"><AppLoader /></div>;

  if (QUIZ_ENDED) {
    return (
      <div className="shell">
        <div className="s1">
          <div className="hero-top">
            <div className="big-emoji">🫀</div>
            <div className="su s1-title">Atrial Fibrillation<br /><span>Masterclass</span></div>
            <div className="su2 s1-sub">The SPAF Masterclass challenge has ended. Thank you for playing!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      {screen === "no_quiz" && (
        <div className="s1">
          <div className="hero-top">
            <div className="big-emoji">🫀</div>
            <div className="su s1-title">Atrial Fibrillation<br /><span>Masterclass</span></div>
            <div className="su2 s1-sub">No active challenge right now — check back soon! 🕐</div>
          </div>
          {activeQuiz && <LeaderboardView quizId={quizId} cycleStart={cycleStart} user={null} isAdmin={isAdmin} adminParam={adminParam} />}
        </div>
      )}
      {screen === "gateway" && activeQuiz && <Gateway quizId={quizId} cycleStart={cycleStart} onStart={(u) => { setUser(u); setScreen("quiz"); }} onShowLeaderboard={() => setScreen("leaderboard")} />}
      {screen === "quiz" && user && activeQuiz && <Quiz quizId={quizId} user={user} questions={activeQuiz.questions} onHome={goHome} onFinish={(timeMs, score) => { setRes({ timeMs, score }); setScreen("results"); }} />}
      {screen === "results" && user && res && activeQuiz && <Results quizId={quizId} user={user} timeMs={res.timeMs} score={res.score} cycleStart={cycleStart} endsAt={endsAt} onHome={goHome} isAdmin={isAdmin} adminParam={adminParam} />}
      {screen === "leaderboard" && activeQuiz && <LeaderboardScreen quizId={quizId} cycleStart={cycleStart} endsAt={endsAt} onHome={goHome} isAdmin={isAdmin} adminParam={adminParam} />}
    </div>
  );
}
