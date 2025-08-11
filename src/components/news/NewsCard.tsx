import Card from "../common/Card";

type Props = {
  title: string;
  publisher: string;
  releaseDate: string | Date;
  imageUrl?: string;
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
  category?: string[];
};

export default function NewsCard({
  title,
  publisher,
  releaseDate,
  imageUrl,
  upvotes,
  downvotes = 0,
  commentsCount = 0,
  category,
}: Props) {
  const fallback =
    imageUrl?.trim() ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop";
  return (
    <Card className="bg-[#0E1217] border border-zinc-700 hover:border-zinc-500 transition-colors">
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={fallback}
            alt={title}
            className="rounded w-full h-40 object-cover"
            loading="lazy"
          />
          {category ? (
            <span className="absolute bottom-2 left-2 text-xs bg-white text-black px-2 py-0.5 rounded">
              {category}
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[#A8B3CF] text-base line-clamp-2">
          {title}
        </h3>

        {/* Meta */}
        <div className="text-xs text-gray-400 flex items-center justify-between">
          <span className="truncate">{publisher}</span>
          <span>{releaseDate}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-white">
            {/* Using “logo text” style for votes per your earlier requirement */}
            <span className="inline-flex items-center justify-center h-6 px-2 rounded bg-white text-black text-xs font-semibold">
              DEV+
            </span>
            <span className="text-[#A8B3CF]">Upvotes:</span>
            <span>{upvotes}</span>
          </div>

          <div className="flex items-center gap-1 text-white">
            <span className="inline-flex items-center justify-center h-6 px-2 rounded bg-white text-black text-xs font-semibold">
              DEV-
            </span>
            <span className="text-[#A8B3CF]">Downvotes:</span>
            <span>{downvotes}</span>
          </div>

          <div className="ml-auto flex items-center gap-1 text-gray-300">
            <span>💬</span>
            <span className="text-[#A8B3CF]">Comments:</span>
            <span>{commentsCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
