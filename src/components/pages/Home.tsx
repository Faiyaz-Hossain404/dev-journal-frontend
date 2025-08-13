import { useEffect, useState } from "react";
import { fetchNews } from "../../services/NewsService";
import NewsCard from "../news/NewsCard";
import { Link, useNavigate } from "react-router-dom";

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
    return <div className="min-h-screen bg-[#0E1217] text-white p-6"></div>;
  }

  if (newsList.length === 0) {
    return (
      <div className="min-h-screen bg-[#0E1217] text-white p-6">
        <p className="text-gray-400">No news yet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1217] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[360px] gap-6 p-6">
      {newsList.map((news) => (
        <Link key={news.id} to={`/news/${news.id}`} className="h-full block">
          <div className="h-full overflow-hidden rounded-lg">
            {" "}
            <NewsCard
              title={news.title}
              publisher={news.publisher}
              releaseDate={news.releaseDate}
              imageUrl={news.imageUrl}
              upvotes={news.upvotes || 0}
              commentsCount={news.commentsCount || 0}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
