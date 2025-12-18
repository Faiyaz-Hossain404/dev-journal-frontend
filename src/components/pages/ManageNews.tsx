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

  const onDelete = (id: string) => {
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

  const openDetails = (id: string) => navigate(`/news/${id}`);

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
          placeholder={`Search ${
            activeTab === "mine" ? "your" : "all"
          } news by title or category...`}
          className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filteredNews.length === 0 ? (
        <p className="text-gray-400">No news found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              role="button"
              tabIndex={0}
              onClick={() => openDetails(news.id)}
              onKeyDown={(e) => e.key === "Enter" && openDetails(news.id)}
              className="bg-zinc-900 p-4 rounded-md border border-zinc-700 shadow-md space-y-2 cursor-pointer hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              {news.imageUrl && (
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}

              <h2 className="text-lg font-semibold text-[#A8B3CF] line-clamp-2">
                {news.title}
              </h2>
              <p className="text-sm text-gray-400 line-clamp-3">
                {news.description}
              </p>
              <div className="text-xs text-gray-500">
                <span>
                  {news.publisher} • {news.category} • {news.releaseDate}
                </span>
              </div>

              <div className="flex gap-4 mt-2">
                <Button
                  className="bg-white text-black px-3 py-1 rounded hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation(); //prevent navigation
                    setEditing(news);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={(e) => {
                    e.stopPropagation(); //prevent navigation
                    onDelete(news.id);
                  }}
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
