import { useState } from "react";
import { initialForm } from "../components/pages/AddNews";
import type { Comment } from "../types/Comment";
import type { NewsItem } from "../types/NewsItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    const res = await fetch("http://localhost:3000/api/news", {
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

//For pic upload
export const uploadImage = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:3000/api/upload/image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Image upload failed");
  }
  return await res.json();
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

  const res = await fetch(`http://localhost:3000/api/news/${id}`, {
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

  const res = await fetch(`http://localhost:3000/api/news/${form.id}`, {
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

  const res = await fetch(`http://localhost:3000/api/news/${newsId}/comments`, {
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
  const res = await fetch(`http://localhost:3000/api/news/${newsId}/comments`);

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return await res.json();
};

//Upvote|NewsDetails

export const upvoteNewsItem = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/news/${id}/upvote`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to upvote");
  }

  return res.json();
};

//Auth Service
//login
export function useLoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        try {
          const { user, token } = await res.json();
          localStorage.setItem("token", token);
          setUser(user);
          navigate("/");
        } catch (jsonError) {
          setError("Invalid server response");
        }
      } else {
        const errText = await res.text();
        try {
          const err = JSON.parse(errText);
          setError(err.error || "Login failed");
        } catch {
          setError(errText || "Login failed");
        }
      }
    } catch (err) {
      setError("Network error or server unavailable");
    }
  };

  return { form, error, handleChange, handleSubmit };
}

//register
export function useRegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        navigate("/login");
      } else {
        const errText = await res.text();
        try {
          const err = JSON.parse(errText);
          setError(err.error || "Registration failed");
        } catch {
          setError(errText || "Registration failed");
        }
      }
    } catch (err) {
      setError("Network error or server unavailable");
    }
  };

  return { form, error, handleChange, handleSubmit };
}
