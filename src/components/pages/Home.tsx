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

  useEffect(() => {
    fetchNews().then(setNewsList);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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
