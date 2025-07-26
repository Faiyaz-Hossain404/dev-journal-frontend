import { initialForm } from "../components/pages/AddNews";

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
