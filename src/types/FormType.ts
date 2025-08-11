export type FormType = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  releaseDate: string;
  publisher: string;
  category: string[];
};

export const initialForm: FormType = {
  title: "",
  description: "",
  imageUrl: "",
  link: "",
  releaseDate: "",
  publisher: "",
  category: [],
};
