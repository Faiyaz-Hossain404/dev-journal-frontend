import { useEffect, useState } from "react";
// import { fetchNews } from "../../services/NewsService";
import NewsCard from "../news/NewsCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  upvoteNewsItem,
  undoUpvoteNewsItem,
  downvoteNewsItem,
  undoDownvoteNewsItem,
  getUpvoteStatus,
  getDownvoteStatus,
  filterNews,
} from "../../services/helpers";
import { apiFetch } from "../../services/api";
import type { News } from "../../types/HomeNews";
// import type { NewsItem } from "../../types/NewsItem";

export default function Home() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [statuses, setStatuses] = useState<
    Record<string, { up: boolean; down: boolean }>
  >({});
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);

      const res = await apiFetch(
        `/api/news${q ? `?q=${encodeURIComponent(q)}` : ""}`,
        { auth: false }
      );
      if (!res.ok) {
        setNewsList([]);
        setLoading(false);
        return;
      }
      const data: News[] = await res.json();
      if (!alive) return;

      const filtered = q ? filterNews(data as any, q) : data;
      setNewsList(filtered);

      const token = localStorage.getItem("token");
      if (token && filtered.length) {
        const pairs = await Promise.all(
          filtered.map(async (n: News) => {
            const [u, d] = await Promise.all([
              getUpvoteStatus(n.id),
              getDownvoteStatus(n.id),
            ]);
            return [
              n.id,
              { up: !!u.hasUpvoted, down: !!d.hasDownvoted },
            ] as const;
          })
        );
        const map: Record<string, { up: boolean; down: boolean }> = {};
        pairs.forEach(([id, s]) => (map[id] = s));
        setStatuses(map);
      } else {
        setStatuses({});
      }

      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [q]);

  const setCounts = (id: string, upvotes: number, downvotes: number) => {
    setNewsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, upvotes, downvotes } : n))
    );
  };

  const onUpvote = async (id: string) => {
    const s = statuses[id] || { up: false, down: false };
    if (s.up) {
      const r = await undoUpvoteNewsItem(id);
      setCounts(id, r.upvotes, r.downvotes);
      setStatuses((p) => ({ ...p, [id]: { ...p[id], up: false } }));
      return;
    }
    const r = await upvoteNewsItem(id);
    setCounts(id, r.upvotes, r.downvotes);
    setStatuses((p) => ({ ...p, [id]: { up: true, down: false } }));
  };

  const onDownvote = async (id: string) => {
    const s = statuses[id] || { up: false, down: false };
    if (s.down) {
      const r = await undoDownvoteNewsItem(id);
      setCounts(id, r.upvotes, r.downvotes);
      setStatuses((p) => ({ ...p, [id]: { ...p[id], down: false } }));
      return;
    }
    const r = await downvoteNewsItem(id);
    setCounts(id, r.upvotes, r.downvotes);
    setStatuses((p) => ({ ...p, [id]: { up: false, down: true } }));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0E1217] text-white p-6"></div>;
  }

  if (newsList.length === 0) {
    return (
      <div className="min-h-screen bg-[#0E1217] text-white p-6">
        <p className="text-gray-400">No news found{q ? ` for "${q}"` : ""}…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1217] p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-[280px]">
        {newsList.map((n) => (
          <div
            key={n.id}
            role="button"
            onClick={() => navigate(`/news/${n.id}`)}
            className="block cursor-pointer"
          >
            <NewsCard
              title={n.title}
              publisher={n.publisher}
              releaseDate={n.releaseDate}
              imageUrl={n.imageUrl}
              upvotes={n.upvotes || 0}
              downvotes={n.downvotes || 0}
              commentsCount={n.commentsCount || 0}
              onUpvote={() => onUpvote(n.id)}
              onDownvote={() => onDownvote(n.id)}
              onCommentsClick={() => navigate(`/news/${n.id}#comments`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
