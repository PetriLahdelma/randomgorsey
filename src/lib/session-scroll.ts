const STORAGE_KEY = "rg:home:scroll";
const CURRENT_VERSION = 1;

export interface HomeScrollState {
  scrollY: number;
  expandedPosts: number[];
}

interface StoredState extends HomeScrollState {
  version: number;
}

export function saveHomeScroll(state: HomeScrollState): void {
  try {
    const stored: StoredState = { ...state, version: CURRENT_VERSION };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch { /* Storage unavailable */ }
}

export function loadHomeScroll(): HomeScrollState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed.version !== CURRENT_VERSION) return null;
    return { scrollY: parsed.scrollY, expandedPosts: parsed.expandedPosts };
  } catch { return null; }
}
