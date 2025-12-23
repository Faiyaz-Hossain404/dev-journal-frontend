import { useState } from "react";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Select from "../common/Select";
import Button from "../common/Button";
import {
  handleChange,
  handleFileUpload,
  handleSubmit,
} from "../../services/helpers";
import type { NewsItem } from "../../types/NewsItem";

type Props = {
  news: NewsItem;
  onClose: () => void;
  onUpdate: (updated: NewsItem) => void;
};

const categoryOptions = [
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "AI", value: "ai" },
  { label: "Finance", value: "finance" },
];

export default function EditNewsModal({ news, onClose, onUpdate }: Props) {
  const [form, setForm] = useState<NewsItem>(news);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white p-6 rounded-md w-full max-w-lg space-y-4 border border-zinc-700">
        <h2 className="text-xl font-bold text-[#A8B3CF]">✏️ Edit News</h2>

        <form
          onSubmit={(e) => handleSubmit(form, setError, onUpdate, onClose, e)}
          className="space-y-3"
        >
          <Input
            name="title"
            value={form.title}
            onChange={(e) => handleChange(setForm, e)}
            placeholder="Title"
            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
          />

          <Textarea
            name="description"
            value={form.description}
            onChange={(e) => handleChange(setForm, e)}
            placeholder="Description"
            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
          />

          <div>
            <label className="block text-sm text-[#A8B3CF] mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload(e, setForm, setUploading, setError)
              }
              className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-white file:text-black"
            />
            {uploading && <p className="text-gray-400 text-sm">Uploading...</p>}
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-32 mt-2 object-contain rounded-md border border-zinc-700"
              />
            )}
          </div>

          <Input
            name="link"
            value={form.link}
            onChange={(e) => handleChange(setForm, e)}
            placeholder="External Link"
            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
          />

          <Input
            name="releaseDate"
            type="date"
            value={form.releaseDate}
            onChange={(e) => handleChange(setForm, e)}
            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
          />

          <Input
            name="publisher"
            value={form.publisher}
            onChange={(e) => handleChange(setForm, e)}
            placeholder="Publisher"
            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
          />

          <Select
            name="category"
            value={form.category}
            onChange={(e) => handleChange(setForm, e)}
            options={categoryOptions}
            placeholder="Category"
            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end gap-4">
            <Button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 rounded text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
