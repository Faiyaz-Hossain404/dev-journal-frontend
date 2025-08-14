import { useEffect, useState } from "react";
import { fetchNews } from "../../services/NewsService";
import NewsCard from "../news/NewsCard";
import { useNavigate } from "react-router-dom";
import { handleDownvoteNewsItem, upvoteNewsItem } from "../../services/helpers";
import type { NewsItem } from "../../types/NewsItem";

type News = {
  id: number;
  title: string;
  publisher: string;
  releaseDate: string;
  imageUrl: string;
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
  category?: string[];
};

export default function Home() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotedIds, setUpvotedIds] = useState<Set<number>>(new Set());
  const [downvotedIds, setDownvotedIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const data = await fetchNews();
      if (alive) {
        setNewsList(data);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#0E1217] text-white p-6" />;
  }

  if (newsList.length === 0) {
    return (
      <div className="min-h-screen bg-[#0E1217] text-white p-6">
        <p className="text-gray-400">No news yet...</p>
      </div>
    );
  }

  const openDetails = (id: number) => navigate(`/news/${id}`);
  const openComments = (id: number) => navigate(`/news/${id}#comments`);

  const onUpvote = async (id: number) => {
    if (upvotedIds.has(id)) return; // already handled for this card

    const res = await upvoteNewsItem(String(id)); // { ok, status, data }
    if (res.ok) {
      const serverCount = res.data?.upvotes;
      setNewsList((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, upvotes: serverCount ?? (n.upvotes || 0) + 1 }
            : n
        )
      );
      setUpvotedIds((s) => new Set(s).add(id));
      return;
    }
    if (res.status === 400) {
      // Already upvoted -> disable further clicks
      setUpvotedIds((s) => new Set(s).add(id));
      return;
    }
    // optionally toast: res.data?.error
  };

  const onDownvote = async (id: number) => {
    if (downvotedIds.has(id)) return;

    const res = await handleDownvoteNewsItem(
      String(id),
      // adapter for list updates: only update the matching item
      (updater: any) =>
        setNewsList((prev) => {
          const current = prev.find((p) => p.id === id);
          if (!current) return prev;
          const nextFromUpdater =
            typeof updater === "function"
              ? updater({ ...(current as unknown as NewsItem) })
              : updater;
          const nextDownvotes =
            nextFromUpdater?.downvotes ?? (current.downvotes || 0) + 1;
          return prev.map((p) =>
            p.id === id ? { ...p, downvotes: nextDownvotes } : p
          );
        }),
      () => {}, // no per-card flag in list view
      () => {}
    );

    if (res?.ok) {
      setDownvotedIds((s) => new Set(s).add(id));
      return;
    }
    if (res?.status === 400) {
      setDownvotedIds((s) => new Set(s).add(id));
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1217] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[360px] gap-6 p-6">
      {newsList.map((news) => (
        <div
          key={news.id}
          className="h-full max-w-sm w-full rounded-lg overflow-hidden cursor-pointer"
          onClick={() => openDetails(news.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && openDetails(news.id)}
        >
          <NewsCard
            title={news.title}
            publisher={news.publisher}
            releaseDate={news.releaseDate}
            imageUrl={news.imageUrl}
            upvotes={news.upvotes || 0}
            downvotes={news.downvotes || 0}
            commentsCount={news.commentsCount || 0}
            category={news.category}
            onUpvote={() => onUpvote(news.id)}
            onDownvote={() => onDownvote(news.id)}
            onCommentsClick={() => openComments(news.id)}
            disableUpvote={upvotedIds.has(news.id)}
            disableDownvote={downvotedIds.has(news.id)}
          />
        </div>
      ))}
    </div>
  );
}
