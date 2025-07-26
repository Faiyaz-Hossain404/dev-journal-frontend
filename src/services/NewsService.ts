type News = {
  id: string;
  title: string;
  publisher: string;
  releaseDate: string;
  imageUrl: string;
  upvotes?: number;
};

export async function fetchNews(): Promise<News[]> {
  try {
    const res = await fetch("http://localhost:5173/api/news");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    return Array.isArray(data) ? data : data.data;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}
