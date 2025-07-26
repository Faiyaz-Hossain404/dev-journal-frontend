import Card from "../common/Card";

type Props = {
  title: string;
  publisher: string;
  releaseDate: string;
  imageUrl: string;
  upvotes: number;
};

export default function NewsCard({
  title,
  publisher,
  releaseDate,
  imageUrl,
  upvotes,
}: Props) {
  return (
    <Card>
      <div>
        <img
          src={imageUrl}
          alt={title}
          className="rounded w-full h-40 object-cover"
        />
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="text-sm text-gray-400 flex justify-between">
          <span>{publisher}</span>
          <span>{releaseDate}</span>
        </div>
        <div className="flex items-center gap-2 text-purple-400">
          <span>Upvotes: {upvotes}</span>
        </div>
      </div>
    </Card>
  );
}
