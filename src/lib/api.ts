interface ViteEnv {
  VITE_API_BASE?: string;
  VITE_API_URL?: string;
  [key: string]: string | undefined;
}

export function getApiBase(): string {
  const env = (import.meta as unknown as { env: ViteEnv }).env;
  const explicit = env.VITE_API_BASE || env.VITE_API_URL;
  if (explicit && explicit.trim().length > 0) return explicit.replace(/\/$/, '');
  return '';
}

export function apiPath(path: string): string {
  const base = getApiBase();
  if (!base) return path.startsWith('/') ? path : `/${path}`;
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}

export async function apiJson<T = any>(path: string, init?: RequestInit): Promise<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const res = await fetch(apiPath(path), init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
