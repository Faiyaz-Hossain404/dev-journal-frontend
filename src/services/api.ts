//Standardizes HTTP request
const BASE_URL = "http://localhost:3000"; //Later use this in the rest helpers above

type Options = RequestInit & { auth?: boolean };

export async function apiFetch(path: string, options: Options = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = localStorage.getItem("token");
  if ((options.auth ?? true) && token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Unauthorized");
  }

  return res;
}
