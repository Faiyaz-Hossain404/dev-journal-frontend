export type News = {
  id: string;
  title: string;
  publisher: string;
  releaseDate: string;
  imageUrl: string;
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
  category?: string[];
  categories?: { id: string; name: string }[];
  description?: string;
};
