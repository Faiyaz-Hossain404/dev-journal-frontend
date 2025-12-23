const BASE_URL = "http://localhost:3000";

type Options = RequestInit & { auth?: boolean };

export async function apiFetch(path: string, options: Options = {}) {
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
