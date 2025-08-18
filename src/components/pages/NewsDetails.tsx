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
  deleteComment,
} from "../../services/helpers";
import Input from "../common/Input";
import Button from "../common/Button";
import type { Comment } from "../../types/Comment";
import type { NewsItem } from "../../types/NewsItem";
import { apiFetch } from "../../services/api";
import upIcon from "../../assets/up.png";
import downIcon from "../../assets/down.png";
import commentIcon from "../../assets/comment.png";
import { useAuth } from "../../context/AuthContext";

export default function NewsDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); // ✅ get logged in user

  const [news, setNews] = useState<NewsItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  // Helper to safely set counts
  const setCounts = (upvotes: number, downvotes: number) => {
    setNews((prev) => (prev ? { ...prev, upvotes, downvotes } : prev));
  };

  // Load details
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setIsLoading(true);

        const newsRes = await apiFetch(`/api/news/${id}`, { auth: false });
        if (!newsRes.ok) throw new Error("Failed to fetch news");
        const newsData: NewsItem = await newsRes.json();
        setNews(newsData);

        const commentsData = await fetchComments(id);
        setComments(commentsData);

        if (localStorage.getItem("token")) {
          const [u, d] = await Promise.all([
            getUpvoteStatus(id),
            getDownvoteStatus(id),
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

  // Votes
  const handleUpvote = async () => {
    if (!id) return;
    try {
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upvote");
    }
  };

  const handleDownvote = async () => {
    if (!id) return;
    try {
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to downvote");
    }
  };

  // Comments
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

  const handleDeleteComment = async (cid: string) => {
    try {
      await deleteComment(id!, cid); // cid is number
      setComments((prev) => prev.filter((c) => c.id !== cid));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete comment");
    }
  };

  if (isLoading) return <div className="text-white p-6">Loading...</div>;
  if (!news) return <div className="text-white p-6">News not found</div>;

  const safeReleaseDate =
    typeof news.releaseDate === "string"
      ? news.releaseDate
      : new Date(news.releaseDate as any).toLocaleDateString();

  return (
    <div className="min-h-screen bg-[#0E1217] flex item-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl bg-[#0E1217] text-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#A8B3CF] mb-4">{news.title}</h1>
        <div className="border border-zinc-700 rounded-lg p-4 space-y-4">
          {news.imageUrl && (
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full max-h-72 rounded mb-4 object-cover"
            />
          )}

          <p className="text-gray-300 mb-4">{news.description}</p>

          <div className="text-sm text-gray-400 mb-6">
            <span>
              {news.publisher} • {news.category} • {safeReleaseDate}
            </span>
          </div>

          {/* Vote actions */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={handleUpvote}
              className={`flex items-center gap-2 px-3 py-1 rounded transition cursor-pointer ${
                hasUpvoted
                  ? "bg-green-600 text-white"
                  : "bg-transparent border-green-600 text-gray-300 hover:bg-green-600 hover:text-white"
              } hover:shadow-lg hover:shadow-green-500/50`}
            >
              <img src={upIcon} alt="" className="w-4 h-4" />
              <span className="text-sm">Upvote ({news.upvotes || 0})</span>
            </Button>

            <Button
              onClick={handleDownvote}
              className={`flex items-center gap-2 px-3 py-1 rounded transition cursor-pointer ${
                hasDownvoted
                  ? "bg-red-600 text-white"
                  : "bg-transparent border-red-600 text-gray-300 hover:bg-red-600 hover:text-white"
              } hover:shadow-lg hover:shadow-red-500/50`}
            >
              <img src={downIcon} alt="" className="w-4 h-4" />
              <span className="text-sm">Downvote ({news.downvotes || 0})</span>
            </Button>

            <div className="flex items-center gap-2 ml-auto text-gray-300 cursor-pointer">
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
                className="mt-2 px-4 py-2 rounded cursor-pointer transition 
             bg-cyan-800 border border-cyan-600 text-gray-300 
             hover:bg-cyan-600 hover:text-white hover:shadow-lg hover:shadow-cyan-500/50"
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
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-white">{c.content}</p>
                      {c.user &&
                        user &&
                        String(c.user.id) === String(user.id) && (
                          <Button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer"
                          >
                            Delete
                          </Button>
                        )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(c.user?.name && c.user.name.trim()) || "Anonymous"} •{" "}
                      {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
