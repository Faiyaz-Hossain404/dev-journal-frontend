import { initialForm } from "../components/pages/AddNews";
import type { NewsItem } from "../components/pages/ManageNews";

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
export const filterNews = (
  newsList: NewsItem[],
  searchTerm: string
): NewsItem[] => {
  return newsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Handle news deletion
export const handleDeleteNews = async (
  id: string,
  setNewsList: React.Dispatch<React.SetStateAction<NewsItem[]>>
): Promise<void> => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this news?"
  );
  if (!confirmed) return;

  try {
    const res = await fetch(`http://localhost:3000/api/news/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      setNewsList((prev) => prev.filter((n) => n.id !== id));
    }
  } catch (error) {
    console.error("Failed to delete news:", error);
  }
};
