import type { UserProfile } from "./types";
import { LS_KEY } from "../config/constants";

export function saveUserLocally(user: UserProfile): void {
  localStorage.setItem(LS_KEY, JSON.stringify(user));
}

export function loadUserLocally(): UserProfile | null {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "null");
  } catch {
    return null;
  }
}
