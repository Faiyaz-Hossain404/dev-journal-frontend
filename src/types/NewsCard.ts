export type Props = {
  title: string;
  publisher: string;
  releaseDate: string | Date;
  imageUrl?: string;
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
  category?: string[];
  onUpvote?: () => void;
  onDownvote?: () => void;
  onCommentsClick?: () => void;
  disableUpvote?: boolean;
  disableDownvote?: boolean;
  className?: string;
};
