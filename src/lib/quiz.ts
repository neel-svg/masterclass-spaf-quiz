export function getAdminParam(): string | null {
  return new URLSearchParams(window.location.search).get("admin");
}

export function normalizePhone(raw: string): string {
  const stripped = raw.replace(/[\s\-()]/g, "");
  return stripped.replace(/^(\+91|91|0)/, "");
}

export function isValidPhone(raw: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizePhone(raw));
}

export function parseCountdown(s: number) {
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
