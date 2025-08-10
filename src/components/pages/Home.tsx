import { useEffect, useState } from "react";
import { fetchNews } from "../../services/NewsService";
import NewsCard from "../news/NewsCard";
import { Link } from "react-router-dom";

type News = {
  id: number;
  title: string;
  publisher: string;
  releaseDate: string;
  imageUrl: string;
  upvotes?: number;
};

export default function Home() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#0E1217] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {newsList.map((news) => (
        <Link to={`/news/${news.id}`}>
          <NewsCard
            key={news.id}
            title={news.title}
            publisher={news.publisher}
            releaseDate={news.releaseDate}
            imageUrl={news.imageUrl}
            upvotes={news.upvotes || 0}
          />
        </Link>
      ))}
    </div>
  );
}
