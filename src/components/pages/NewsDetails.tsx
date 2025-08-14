import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchComments,
  handleDownvoteNewsItem,
  postComment,
  upvoteNewsItem,
} from "../../services/helpers";
import Input from "../common/Input";
import Button from "../common/Button";
import type { Comment } from "../../types/Comment";
import type { NewsItem } from "../../types/NewsItem";
import { apiFetch } from "../../services/api";
import upIcon from "../../assets/up.png";
import downIcon from "../../assets/down.png";
import commentIcon from "../../assets/comment.png";

export default function NewsDetails() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  //Fetching news details and comments from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const newsRes = await fetch(`http://localhost:3000/api/news/${id}`);
        if (!newsRes.ok) throw new Error("Failed to fetch news");
        const newsData = await newsRes.json();
        setNews(newsData);

        const commentsData = await fetchComments(id!);
        setComments(commentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  //Fetching upvote stat
  useEffect(() => {
    const checkUserUpvoted = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !id) return;

        const res = await apiFetch(`/api/news/upvotes/${id}/upvotes`, {
          method: "GET",
        });
        if (res.ok) {
          const data = await res.json();
          setHasUpvoted(!!data.hasUpvoted);
        }
      } catch {}
    };
    checkUserUpvoted();
  }, [id]);

  //Fetching downvote stat
  useEffect(() => {
    const checkUserDownvoted = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !id) return;

        const res = await apiFetch(`/api/news/downvotes/${id}/downvotes`, {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();
          setHasDownvoted(!!data.hasDownvoted);
        }
      } catch {}
    };
    checkUserDownvoted();
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
      const res = await upvoteNewsItem(id!); // { ok, status, data }
      if (res.ok) {
        const serverCount = res.data?.upvotes;
        setNews((prev) =>
          prev ? { ...prev, upvotes: serverCount ?? prev.upvotes + 1 } : prev
        );
        setHasUpvoted(true);
        return;
      }
      if (res.status === 400) {
        setHasUpvoted(true);
        return;
      }
      setError(res.data?.error || "Failed to upvote");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upvote");
    }
  };

  const handleDownvote = () => {
    if (!id) return;
    handleDownvoteNewsItem(id, setNews, setHasDownvoted, setError); // POST /api/news/downvotes/:id/downvote
  };

  if (isLoading) return <div className="text-white p-6">Loading...</div>;
  if (!news) return <div className="text-white p-6">News not found</div>;

  return (
    <div className="min-h-screen bg-[#0E1217] text-white px-4 py-6">
      <h1 className="text-2xl font-bold text-[#A8B3CF] mb-4">{news.title}</h1>

      {news.imageUrl && (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full max-w-3xl rounded mb-4 object-cover"
        />
      )}

      <p className="text-gray-300 mb-4">{news.description}</p>

      <div className="text-sm text-gray-400 mb-6">
        <span>
          {/* {news.publisher} • {news.category} • {news.releaseDate} */}
          {news.publisher} •{" "}
          {Array.isArray(news.category)
            ? news.category.join(", ")
            : news.category}{" "}
          • {news.releaseDate}
        </span>
      </div>

      {/* Actions */}
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
          <img src={upIcon} alt="" className="w-4 h-4" />
          <span className="text-sm">Upvote ({news.upvotes})</span>
        </Button>

        <Button
          onClick={handleDownvote}
          className={`flex items-center gap-2 px-3 py-1 rounded ${
            hasDownvoted
              ? "bg-red-600 text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
          disabled={hasDownvoted}
        >
          <img src={downIcon} alt="" className="w-4 h-4" />
          <span className="text-sm">Downvote ({news.downvotes || 0})</span>
        </Button>

        <div className="flex items-center gap-2 ml-auto text-gray-300">
          <img src={commentIcon} alt="" className="w-4 h-4" />
          <span className="text-sm">Comments: {comments.length}</span>
        </div>

        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Visit Source
        </a>
      </div>

      {/* Comments */}
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
