import { useState } from "react";
import {
  handleFileUpload,
  handleformChange,
  submitNews,
} from "../../services/helpers";
import Input from "../common/Input";
import Button from "../common/Button";
import Textarea from "../common/Textarea";
import Select from "../common/Select";
import { initialForm } from "../../types/FormType";

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
  const [uploading, setUploading] = useState(false);

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
    await submitNews(form, setForm, setError);
  };

  return (
    <div className="min-h-screen bg-[#0E1217] text-white px-4 py-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-xl font-bold text-[#A8B3CF] mb-6">📰 New post</h1>

        <div className="border border-gray-700 rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Unique title"
              className="w-full p-2 rounded-md bg-gray-800 text-white placeholder-[#A8B3CF]"
            />

            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a short description"
              className="w-full p-2 rounded-md bg-gray-800 text-white placeholder-[#A8B3CF] overflow-auto hide-scrollbar"
            />

            <div>
              <label className="block text-sm text-[#A8B3CF] mb-1">
                Upload Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload(e, setForm, setUploading, setError)
                }
                className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-white file:text-black"
              />
              {uploading && (
                <p className="text-gray-400 text-sm mt-1">Uploading...</p>
              )}
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-32 mt-2 rounded object-contain rounded-md border border-zinc-700"
                />
              )}
            </div>

            <Input
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="External news link"
              className="w-full p-2 rounded-md bg-gray-800 text-white placeholder-[#A8B3CF]"
            />

            <Input
              name="releaseDate"
              type="date"
              value={form.releaseDate}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-800 text-[#A8B3CF]"
            />

            <Input
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              placeholder="Publisher"
              className="w-full p-2 rounded-md bg-gray-800 text-white placeholder-[#A8B3CF]"
            />

            <Select
              name="category"
              value={form.category}
              onChange={handleChange}
              options={categoryOptions}
              placeholder="Select category"
              className="w-full p-2 rounded-md bg-gray-800 text-[#A8B3CF]"
            />

            {error && <p className="text-red-400">{error}</p>}

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-fuchsia-500 text-black font-semibold px-8 py-2 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-fuchsia-500/50 transition-shadow"
              >
                Post
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
