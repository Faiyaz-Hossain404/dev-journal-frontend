import { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import EditNewsModal from "../news/EditNewsModal";
import type { NewsItem } from "../../types/NewsItem";

export default function ManageNews() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchUserNews = async () => {
      const res = await fetch("http://localhost:5173/api/news/my-news", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setNewsList(data);
    };

    fetchUserNews();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this news?"
    );
    if (!confirmed) return;

    const res = await fetch(`http://localhost:3000/api/news/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      setNewsList((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const filteredNews = newsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0E1217] text-white px-4 py-6">
      <h1 className="text-2xl font-bold text-[#A8B3CF] mb-6">
        🛠 Manage Your News
      </h1>

      <div className="max-w-md mb-6">
        <Input
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or category..."
          className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>

      {filteredNews.length === 0 ? (
        <p className="text-gray-400">No news found.</p>
      ) : (
        <div className="space-y-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="bg-zinc-900 p-4 rounded-md border border-zinc-700 shadow-md space-y-2"
            >
              <h2 className="text-lg font-semibold text-[#A8B3CF]">
                {news.title}
              </h2>
              <p className="text-sm text-gray-400">{news.description}</p>
              <div className="text-xs text-gray-500">
                <span>
                  {news.publisher} • {news.category} • {news.releaseDate}
                </span>
              </div>
              <div className="flex gap-4 mt-2">
                <Button
                  className="bg-white text-black px-3 py-1 rounded hover:bg-gray-100"
                  onClick={() => setEditing(news)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(news.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditNewsModal
          news={editing}
          onClose={() => setEditing(null)}
          onUpdate={(updated) =>
            setNewsList((prev) =>
              prev.map((n) => (n.id === updated.id ? updated : n))
            )
          }
        />
      )}
    </div>
  );
}
