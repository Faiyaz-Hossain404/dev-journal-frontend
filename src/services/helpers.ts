import { initialForm } from "../components/pages/AddNews";
import type { Comment } from "../types/Comment";
import type { NewsItem } from "../types/NewsItem";

export const handleformChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  setForm: React.Dispatch<React.SetStateAction<typeof initialForm>>
) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};

export const submitNews = async (
  form: typeof initialForm,
  setForm: React.Dispatch<React.SetStateAction<typeof initialForm>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const res = await fetch("http://localhost:5173/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Failed to submit news");
      return false;
    } else {
      setForm(initialForm);
      setError("");
      return true;
    }
  } catch (error) {
    setError("Failed to submit news");
    return false;
  }
};

//For Manage News page
// Filter news based on search term
export const filterNews = (newsList: NewsItem[], searchTerm: string) => {
  return newsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Handle news deletion
export const handleDeleteNews = async (
  id: number,
  token: string,
  setNewsList: React.Dispatch<React.SetStateAction<NewsItem[]>>
) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this news?"
  );
  if (!confirmed) return;

  const res = await fetch(`http://localhost:5173/api/news/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    setNewsList((prev) => prev.filter((n) => n.id !== id));
  }
};

//For Editing News
export const handleChange = (
  setForm: React.Dispatch<React.SetStateAction<NewsItem>>,
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};

export const handleSubmit = async (
  form: NewsItem,
  setError: React.Dispatch<React.SetStateAction<string>>,
  onUpdate: (updated: any) => void,
  onClose: () => void,
  e: React.FormEvent
) => {
  e.preventDefault();

  const res = await fetch(`http://localhost:5173/api/news/${form.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(form),
  });

  if (res.ok) {
    const updated = await res.json();
    onUpdate(updated);
    onClose();
  } else {
    setError("Failed to update news");
  }
};

// News Details
// Comment Submition
export const postComment = async (
  newsId: string,
  content: string,
  token?: string
): Promise<Comment> => {
  const headers: Record<string, string> = {
    "Content-type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`http://localhost:5173/api/news/${newsId}/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error("Failed to post comment");
  }

  return await res.json();
};

export const fetchComments = async (newsId: string): Promise<Comment[]> => {
  const res = await fetch(`http://localhost:5173/api/news/${newsId}/comments`);

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return await res.json();
};

//Upvote|NewsDetails

// export const upvoteNewsItem = async (id: string) => {
//   const res = await fetch(`http://localhost:3000/api/news/${id}/upvote`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to upvote");
//   }

//   return res.json();
// };
