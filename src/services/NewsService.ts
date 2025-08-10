import { apiFetch } from "./api";

export type News = {
  id: number;
  title: string;
  publisher: string;
  releaseDate: string;
  imageUrl: string;
  upvotes?: number;
};

export async function fetchNews(): Promise<News[]> {
  try {
    const res = await apiFetch("/api/news", { auth: false });

    // If server somehow returns HTML (e.g., SPA index.html), bail out safely
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("Unexpected content-type:", contentType);
      return [];
    }

    if (!res.ok) {
      console.error("HTTP error:", res.status);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}

// export async function fetchNews() {
//   return [
//     {
//       id: 1,
//       title: "Welcome to Modern News Portal",
//       description: "This is a sample article manually mocked.",
//       imageUrl: "https://placehold.co/600x400",
//       link: "https://example.com",
//       releaseDate: "2025-07-24",
//       publisher: "YourName",
//       category: "Technology",
//       upvotes: 0,
//     },
//   ];
// }
