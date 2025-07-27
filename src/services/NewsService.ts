// type News = {
//   id: string;
//   title: string;
//   publisher: string;
//   releaseDate: string;
//   imageUrl: string;
//   upvotes?: number;
// };

// export async function fetchNews(): Promise<News[]> {
//   try {
//     const res = await fetch("http://localhost:5173/api/news");
//     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//     const data = await res.json();
//     return Array.isArray(data) ? data : data.data;
//   } catch (error) {
//     console.error("Failed to fetch news:", error);
//     return [];
//   }
// }

export async function fetchNews() {
  return [
    {
      id: 1,
      title: "Welcome to Modern News Portal",
      description: "This is a sample article manually mocked.",
      imageUrl: "https://placehold.co/600x400",
      link: "https://example.com",
      releaseDate: "2025-07-24",
      publisher: "YourName",
      category: "Technology",
      upvotes: 0,
    },
  ];
}
