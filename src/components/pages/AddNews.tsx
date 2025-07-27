import { useState } from "react";
import { handleformChange, submitNews } from "../../services/helpers";
import Input from "../common/Input";
import Button from "../common/Button";
import Textarea from "../common/Textarea";
import Select from "../common/Select";

export const initialForm = {
  title: "",
  description: "",
  imageUrl: "",
  link: "",
  releaseDate: "",
  publisher: "",
  category: "",
};

const categoryOptions = [
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "AI", value: "ai" },
  { label: "Finance", value: "finance" },
  { label: "Startups", value: "startups" },
];

export default function AddNews() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    handleformChange(e, setForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", form);
    setError("");
    // await submitNews(form, setForm, setError);
  };

  return (
    <div className="min-h-screen bg-[#0E1217] text-white px-4 py-6">
      <h1 className="text-2xl font-bold text-[#A8B3CF] mb-6">
        📰 Add New News
      </h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Unique title"
          className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
        />

        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Write a short description"
          className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
        />

        <Input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Thumbnail image URL"
          className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
        />

        <Input
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="External news link"
          className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
        />

        <Input
          name="releaseDate"
          type="date"
          value={form.releaseDate}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
        />

        <Input
          name="publisher"
          value={form.publisher}
          onChange={handleChange}
          placeholder="Publisher"
          className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
        />

        <Select
          name="category"
          value={form.category}
          onChange={handleChange}
          options={categoryOptions}
          placeholder="Select category"
          className="w-full p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white"
        />

        {error && <p className="text-red-400">{error}</p>}

        <Button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100"
        >
          Submit News
        </Button>
      </form>
    </div>
  );
}
