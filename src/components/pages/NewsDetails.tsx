import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchComments,
  postComment,
  getUpvoteStatus,
  getDownvoteStatus,
  upvoteNewsItem,
  undoUpvoteNewsItem,
  downvoteNewsItem,
  undoDownvoteNewsItem,
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

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        // ✅ Use apiFetch for the news detail request
        //    auth:false because this endpoint is public (avoids sending token / logout side-effects on 401)
        const newsRes = await apiFetch(`/api/news/${id}`, { auth: false });
        if (!newsRes.ok) throw new Error("Failed to fetch news");
        const newsData: NewsItem = await newsRes.json();
        setNews(newsData);

        // keep using your existing helpers for comments/status (you can refactor them to apiFetch later)
        const commentsData = await fetchComments(id!);
        setComments(commentsData);

        const token = localStorage.getItem("token");
        if (token) {
          const [u, d] = await Promise.all([
            getUpvoteStatus(id!),
            getDownvoteStatus(id!),
          ]);
          setHasUpvoted(!!u.hasUpvoted);
          setHasDownvoted(!!d.hasDownvoted);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error occurred");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const setCounts = (upvotes: number, downvotes: number) => {
    setNews((prev) => (prev ? { ...prev, upvotes, downvotes } : prev));
  };

  const handleUpvote = async () => {
    if (!id) return;
    if (hasUpvoted) {
      const r = await undoUpvoteNewsItem(id);
      setCounts(r.upvotes, r.downvotes);
      setHasUpvoted(false);
    } else {
      const r = await upvoteNewsItem(id);
      setCounts(r.upvotes, r.downvotes);
      setHasUpvoted(true);
      setHasDownvoted(false);
    }
  };

  const handleDownvote = async () => {
    if (!id) return;
    if (hasDownvoted) {
      const r = await undoDownvoteNewsItem(id);
      setCounts(r.upvotes, r.downvotes);
      setHasDownvoted(false);
    } else {
      const r = await downvoteNewsItem(id);
      setCounts(r.upvotes, r.downvotes);
      setHasDownvoted(true);
      setHasUpvoted(false);
    }
  };

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

  if (isLoading) return <div className="text-white p-6">Loading...</div>;
  if (!news) return <div className="text-white p-6">News not found</div>;

  return (
    /* ...your existing JSX stays the same... */
    // (no changes needed below this point)
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
        >
          <img src={upIcon} alt="" className="w-4 h-4" />
          <span className="text-sm">Upvote ({news.upvotes || 0})</span>
        </Button>
        <Button
          onClick={handleDownvote}
          className={`flex items-center gap-2 px-3 py-1 rounded ${
            hasDownvoted
              ? "bg-red-600 text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
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
      <div id="comments" className="max-w-xl space-y-4">
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
                <div className="text-xs text-gray-500 mt-1">
                  {c.user?.name || "Anonymous"} •{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <p className="text-sm text-white mt-2">{c.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
