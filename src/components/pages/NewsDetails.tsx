import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchComments,
  postComment,
  upvoteNewsItem,
} from "../../services/helpers";
import Input from "../common/Input";
import Button from "../common/Button";
import type { Comment } from "../../types/Comment";
import type { NewsItem } from "../../types/NewsItem";

export default function NewsDetails() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  //Fetching news details and comments from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const newsRes = await fetch(`http://localhost:3000/api/news/${id}`);
        if (!newsRes.ok) throw new Error("Failed to fetch news");
        setNews(await newsRes.json());

        const commentsData = await fetchComments(id!);
        setComments(commentsData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error occured");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  //Fetching upvote stat
  useEffect(() => {
    const checkUserUpvoted = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `http://localhost:3000/api/news/${id}/upvotes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setHasUpvoted(data.hasUpvoted);
        }
      } catch {}
    };
    checkUserUpvoted();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token") || undefined;
      const newEntry = await postComment(id!, newComment, token);

      setComments((prev) => [newEntry, ...prev]);
      setNewComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    }
  };

  const handleUpvote = async () => {
    try {
      await upvoteNewsItem(id!);
      setNews((prev) => (prev ? { ...prev, upvotes: prev.upvotes + 1 } : null));
      setHasUpvoted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upvote");
    }
  };

  if (isLoading) return <div className="text-white p-6">Loading...</div>;
  if (!news) return <div className="text-white p-6">News not found</div>;

  return (
    <div className="min-h-screen bg-[#0E1217] text-white px-4 py-6">
      <h1 className="text-2xl font-bold text-[#A8B3CF] mb-4">{news.title}</h1>

      <img
        src={news.imageUrl}
        alt={news.title}
        className="w-full max-w-3xl rounded mb-4"
      />

      <p className="text-gray-300 mb-4">{news.description}</p>

      <div className="text-sm text-gray-400 mb-4">
        <span>
          {news.publisher} • {news.category} • {news.releaseDate}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={handleUpvote}
          className={`flex items-center gap-2 px-3 py-1 rounded ${
            hasUpvoted
              ? "bg-green-600 text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
          disabled={hasUpvoted}
        >
          🚀 Upvote ({news.upvotes})
        </Button>
        <span className="text-white">💬 Comments: {comments.length}</span>
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Visit Source
        </a>
      </div>

      <div className="max-w-xl space-y-4">
        <form onSubmit={handleCommentSubmit}>
          <Input
            name="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
          />
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          <Button
            type="submit"
            className="mt-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-100"
          >
            Post Comment
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm">No comments yet!</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="bg-zinc-900 border border-zinc-700 p-3 rounded"
              >
                <p className="text-sm text-white">{c.content}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {c.user?.name || "Anonymous"} •{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
