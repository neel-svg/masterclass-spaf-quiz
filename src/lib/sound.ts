let audioContext: AudioContext | null = null;

function getAC(): AudioContext {
  if (!audioContext) audioContext = new window.AudioContext();
  return audioContext;
}

/**
 * Call this during a user-gesture (e.g. "Start" button click) to create and
 * resume the AudioContext while the browser allows it.  Without this, the
 * context starts in "suspended" state and the first answer sound is silent.
 */
export async function prewarmAudio(): Promise<void> {
  try {
    const ctx = getAC();
    if (ctx.state === "suspended") await ctx.resume();
  } catch {
    // audio unavailable — safe to ignore
  }
}

export function playCorrect() {
  try {
    const ctx = getAC();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      g.gain.linearRampToValueAtTime(0.28, ctx.currentTime + i * 0.1 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
      o.start(ctx.currentTime + i * 0.1);
      o.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  } catch {} // audio may be unavailable (e.g. autoplay policy)
}

export function playWrong() {
  try {
    const ctx = getAC();
    [220, 180, 150].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = "sawtooth";
      o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.22);
      o.start(ctx.currentTime + i * 0.12);
      o.stop(ctx.currentTime + i * 0.12 + 0.25);
    });
  } catch {} // audio may be unavailable (e.g. autoplay policy)
}

export function playFanfare() {
  try {
    const ctx = getAC();
    [{ f: 523, t: 0, d: 0.18 }, { f: 659, t: 0.16, d: 0.18 }, { f: 784, t: 0.32, d: 0.18 }, { f: 659, t: 0.48, d: 0.12 }, { f: 523, t: 0.58, d: 0.12 }, { f: 784, t: 0.68, d: 0.22 }, { f: 1047, t: 0.88, d: 0.45 }].forEach(({ f, t, d }) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = "triangle";
      o.frequency.setValueAtTime(f, ctx.currentTime + t);
      g.gain.setValueAtTime(0, ctx.currentTime + t);
      g.gain.linearRampToValueAtTime(0.3, ctx.currentTime + t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + d);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + d + 0.05);
    });
  } catch {} // audio may be unavailable (e.g. autoplay policy)
}
