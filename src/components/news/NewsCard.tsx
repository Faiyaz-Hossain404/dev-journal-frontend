import Card from "../common/Card";
import Stat from "../common/Stat";

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

  const releaseText =
    typeof releaseDate === "string"
      ? releaseDate
      : releaseDate.toLocaleDateString();

  return (
    <Card className="h-full bg-[#0E1217] border border-zinc-700 hover:border-zinc-500 transition-colors">
      <div className="h-full flex flex-col space-y-3">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={fallback}
            alt={title}
            className="rounded w-full h-40 object-cover"
            loading="lazy"
          />
          {category && category.length > 0 ? (
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
        {/* Title */}
        <h3 className="font-semibold text-[#A8B3CF] text-base line-clamp-2">
          {title}
        </h3>
        {/* Meta */}
        <div className="text-xs text-gray-400 flex items-center justify-between">
          <span className="truncate">{publisher}</span>
          <span>{releaseText}</span>
        </div>
        {/* Stats pinned to bottom */}
        <div className="mt-auto flex items-center gap-4 text-sm">
          <Stat
            icon={<img src={upIcon} alt="" className="w-4 h-4" />}
            label="Upvotes"
            value={upvotes}
          />
          <Stat
            icon={<img src={downIcon} alt="" className="w-4 h-4" />}
            label="Downvotes"
            value={downvotes}
          />
          <Stat
            icon={<img src={commentIcon} alt="" className="w-4 h-4" />}
            label="Comments"
            value={commentsCount}
            className="ml-auto"
          />
        </div>
      </div>
    </Card>
  );
}
