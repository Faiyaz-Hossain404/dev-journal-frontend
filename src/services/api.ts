// const BASE_URL = "http://localhost:3000";
const BASE_URL = import.meta.env.VITE_API_URL;

type Options = RequestInit & { auth?: boolean };

export async function apiFetch(path: string, options: Options = {}) {
  if (!BASE_URL) {
    throw new Error("VITE_API_URL is not defined");
  }

  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute ? path : `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const shouldAuth = options.auth ?? true;
  const token = localStorage.getItem("token");
  if (shouldAuth && token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth:logout"));
  }

  return res;
}
