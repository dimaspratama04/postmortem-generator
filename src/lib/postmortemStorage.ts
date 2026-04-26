import { PostmortemData } from "@/types/postmortem";

const KEY = "postmortem-data";

export function savePostmortem(data: PostmortemData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save:", e);
  }
}

export function loadPostmortem(): PostmortemData | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPostmortem() {
  localStorage.removeItem(KEY);
}
