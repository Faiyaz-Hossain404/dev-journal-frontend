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
    // fetchNews().then(setNewsList);
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

  // Navigate when the user clicks the card background (not the stat buttons)
  const openDetails = (id: number) => navigate(`/news/${id}`);
  const openComments = (id: number) => navigate(`/news/${id}#comments`);

  // Inline handlers that update list state after server calls
  const onUpvote = async (id: number) => {
    try {
      await upvoteNewsItem(String(id));
      setNewsList((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, upvotes: (n.upvotes || 0) + 1 } : n
        )
      );
    } catch {
      // optionally toast error
    }
  };

  const onDownvote = async (id: number) => {
    try {
      // Adapt helper signature to list state:
      await handleDownvoteNewsItem(
        String(id),
        (updater) =>
          setNewsList((prev) => {
            const current = prev.find((p) => p.id === id);
            if (!current) return prev;
            const next =
              typeof updater === "function"
                ? (updater as any)({ ...current } as unknown as NewsItem)
                : updater;
            const nextDownvotes =
              (next as any)?.downvotes ?? (current.downvotes || 0) + 1;
            return prev.map((p) =>
              p.id === id ? { ...p, downvotes: nextDownvotes } : p
            );
          }),
        // we don't maintain a per-card "hasDownvoted" flag in the list; no-op:
        () => {},
        () => {}
      );
    } catch {
      // optionally toast error
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1217] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[360px] gap-6 p-6">
      {newsList.map((news) => (
        <div
          key={news.id}
          className="h-full rounded-lg overflow-hidden cursor-pointer"
          onClick={() => openDetails(news.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && openDetails(news.id)}
        >
          {" "}
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
          />
        </div>
      ))}
    </div>
  );
}
