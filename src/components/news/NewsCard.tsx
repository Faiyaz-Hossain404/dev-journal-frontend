import Card from "../common/Card";
import Stat from "../common/Stat";
import upIcon from "../../assets/up.png";
import downIcon from "../../assets/down.png";
import commentIcon from "../../assets/comment.png";
import type { Props } from "../../types/NewsCard";

export default function NewsCard({
  title,
  publisher,
  releaseDate,
  imageUrl,
  upvotes,
  downvotes = 0,
  commentsCount = 0,
  category,
  onUpvote,
  onDownvote,
  onCommentsClick,
  disableUpvote = false,
  disableDownvote = false,
  className = "",
}: Props) {
  const fallback =
    imageUrl?.trim() ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop";

  const releaseText =
    typeof releaseDate === "string"
      ? releaseDate
      : releaseDate.toLocaleDateString();

  return (
    <Card
      className={`h-full bg-[#0E1217] border border-zinc-700 hover:border-zinc-500 transition-colors ${className}`}
    >
      <div className="flex flex-col h-full space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">
            {title}
          </h3>
          <div className="text-xs text-gray-400 flex items-center justify-between">
            <span className="truncate">{publisher}</span>
            <span>{releaseText}</span>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="relative">
          <img
            src={fallback}
            alt={title}
            className="w-full aspect-video object-cover rounded"
            loading="lazy"
          />
          {category?.length ? (
            <div className="absolute bottom-2 left-2 flex gap-2 max-w-[90%] overflow-x-auto hide-scrollbar pr-2">
              {category.map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-white text-black px-2 py-0.5 rounded whitespace-nowrap"
                >
                  {cat}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Actions / Stats */}
        <div className="mt-auto flex items-center gap-4 text-sm">
          <Stat
            icon={
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${
                  disableUpvote
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer hover:bg-green-400 hover:shadow-[0_0_30px_rgba(8,145,178,0.3)]"
                }`}
              >
                <img src={upIcon} alt="" className="w-4 h-4" />
              </div>
            }
            label="Upvotes"
            value={upvotes}
            onClick={() => !disableUpvote && onUpvote?.()}
            disabled={disableUpvote}
          />

          <Stat
            icon={
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${
                  disableDownvote
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer hover:bg-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                }`}
              >
                <img src={downIcon} alt="" className="w-4 h-4" />
              </div>
            }
            label="Downvotes"
            value={downvotes}
            onClick={() => !disableDownvote && onDownvote?.()}
            disabled={disableDownvote}
          />

          <Stat
            icon={
              <div className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:bg-cyan-500 hover:shadow-[0_0_10px_rgba(8,145,178,0.5)]">
                <img src={commentIcon} alt="" className="w-4 h-4" />
              </div>
            }
            label="Comments"
            value={commentsCount}
            className="ml-auto"
            onClick={() => onCommentsClick?.()}
          />
        </div>
      </div>
    </Card>
  );
}
