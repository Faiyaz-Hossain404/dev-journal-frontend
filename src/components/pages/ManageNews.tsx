import { useEffect, useMemo, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import EditNewsModal from "../news/EditNewsModal";
import type { NewsItem } from "../../types/NewsItem";
import { handleDeleteNews } from "../../services/helpers";
import { apiFetch } from "../../services/api";
import { useNavigate } from "react-router-dom";

type TabKey = "all" | "mine";

export default function ManageNews() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("mine");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        if (activeTab === "mine") {
          const res = await apiFetch("/api/news/my-news");
          const data = await res.json();
          setNewsList(data);
        } else {
          const res = await fetch("http://localhost:3000/api/news");
          const data = await res.json();
          setNewsList(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [activeTab]);

  const onDelete = (id: number) => {
    const token = localStorage.getItem("token") || "";
    handleDeleteNews(id, token, setNewsList);
  };

  // const filteredNews = newsList.filter(
  //   (item) =>
  //     item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.category.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredNews = useMemo(
    () =>
      newsList.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [newsList, searchTerm]
  );

  const openDetails = (id: number) => navigate(`/news/${id}`);

  return (
    <div className="min-h-screen bg-[#0E1217] text-white px-4 py-6">
      <h1 className="text-2xl font-bold text-[#A8B3CF] mb-6">🛠 Manage News</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => setActiveTab("mine")}
          className={`px-3 py-1 rounded-2xl ${
            activeTab === "mine" ? "bg-white text-black" : "text-[#A8B3CF]"
          }`}
        >
          My News
        </Button>
        <Button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1 rounded-2xl ${
            activeTab === "all" ? "bg-white text-black" : "text-[#A8B3CF]"
          }`}
        >
          All News
        </Button>
      </div>

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
              {news.imageUrl && (
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-24 h-24 object-cover rounded-md"
                />
              )}
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
                  onClick={() => onDelete(news.id)}
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
