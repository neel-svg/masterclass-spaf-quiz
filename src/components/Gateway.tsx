import { useEffect, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { checkAlreadyPlayed } from "../lib/supabase";
import { isValidPhone, normalizePhone } from "../lib/quiz";
import { loadUserLocally, saveUserLocally } from "../lib/storage";
import { prewarmAudio } from "../lib/sound";
import { BrandLogo } from "./common/BrandLogo";
import type { UserProfile } from "../lib/types";

interface GatewayProps {
  quizId: number;
  cycleStart: string;
  onStart: (u: UserProfile) => void;
  onShowLeaderboard: () => void;
}

export function Gateway({ quizId, cycleStart, onStart, onShowLeaderboard }: GatewayProps) {
  const saved = loadUserLocally();
  const hasValidSavedProfile = !!(
    saved &&
    saved.name?.trim() &&
    saved.specialty?.trim() &&
    isValidPhone(saved.phone)
  );
  const [showForm] = useState(!hasValidSavedProfile);
  const [name, setName] = useState(saved?.name || "");
  const [phone, setPhone] = useState(saved?.phone || "");
  const [spec, setSpec] = useState(saved?.specialty || "");
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [checking, setChecking] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [checkedSavedPlay, setCheckedSavedPlay] = useState(!saved?.phone);

  useEffect(() => {
    if (saved?.phone) {
      checkAlreadyPlayed(saved.phone, quizId, cycleStart)
        .then((played) => played && setAlreadyPlayed(true))
        .finally(() => setCheckedSavedPlay(true));
    }
    trackEvent("gateway_view", quizId, saved
      ? { name: saved.name, specialty: saved.specialty, phone: saved.phone }
      : {},
    );
  }, [quizId, cycleStart, saved?.phone]);

  const go = async () => {
    const candidate = !showForm && saved ? saved : { name: name.trim(), phone: normalizePhone(phone), specialty: spec };
    const e: Record<string, boolean> = {};
    if (!candidate.name) e.name = true;
    if (!isValidPhone(candidate.phone)) e.phone = true;
    if (!candidate.specialty) e.spec = true;
    if (Object.keys(e).length) return setErrs(e);
    setChecking(true);
    const played = await checkAlreadyPlayed(candidate.phone, quizId, cycleStart);
    setChecking(false);
    if (played) return setAlreadyPlayed(true);
    saveUserLocally(candidate);
    await prewarmAudio(); // unlock AudioContext during this user gesture
    onStart(candidate);
  };

  const specs = ["General Medicine (MD/DNB)", "General Medicine (MBBS)", "Gastroenterology", "Hepatology", "Family Medicine", "General Surgery", "Pediatrics", "Cardiology", "ENT", "Neurology", "Other"];

  return <div className="s1"><div className="hero-top"><BrandLogo /><div className="su2 s1-sub">Take the SPAF Challenge.<br />5 clinical questions. One quick test of your AF knowledge</div></div>
    <div className="prize-card su2"><div className="prize-em">🏆</div><div><div className="prize-h">Test your knowledge across 5 clinical cases and see where you rank on the leaderboard.</div><div className="prize-p">Accuracy + speed = your leaderboard rank.</div></div></div>
    <div className="reset-strip su3"><div className="reset-strip-icon">🔄</div><div className="reset-strip-text">Complete the 5-question challenge and see where you stand among fellow Doctors</div></div>
    {alreadyPlayed && <div className="played-banner su3"><div className="played-icon">🎯</div><div className="played-h">You've already completed the challenge!</div><div className="played-p">Each challenge can only be played once per phone number.</div><button className="btn-lb" onClick={onShowLeaderboard}>🏅 View Leaderboard</button></div>}
    {!alreadyPlayed && checkedSavedPlay && saved?.phone && <div className="played-banner su3"><div className="played-icon">🆕</div><div className="played-h">The challenge is ready to play. Begin now.</div><div className="played-p">Your previous attempt does not block this challenge.</div></div>}
    {showForm && !alreadyPlayed && <div className="form-box su4"><input id="reg-name" name="name" autoComplete="name" className={`fi${errs.name ? " e" : ""}`} placeholder="👤  Your full name" value={name} onChange={(e) => setName(e.target.value)} />{errs.name && <div className="etxt">⚠ Please enter your name</div>}<input id="reg-phone" name="phone" autoComplete="tel" className={`fi${errs.phone ? " e" : ""}`} placeholder="📱  Mobile number (India)" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />{errs.phone && <div className="etxt">⚠ Enter a valid 10-digit Indian mobile number</div>}<select id="reg-specialty" name="specialty" className={`fi${errs.spec ? " e" : ""}`} value={spec} onChange={(e) => setSpec(e.target.value)}><option value="">🩺  Your specialty…</option>{specs.map((s) => <option key={s}>{s}</option>)}</select></div>}
    {!alreadyPlayed && <div className={`form-box ${showForm ? "" : "su4"}`}><button className="btn-go" onClick={go} disabled={checking}>{checking ? "Checking…" : "⏱ Start the Clock!"}</button></div>}</div>;
}
