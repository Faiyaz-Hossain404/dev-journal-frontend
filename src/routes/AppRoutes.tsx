import { Route, Routes } from "react-router-dom";
import Home from "../components/pages/Home";
import AddNews from "../components/pages/AddNews";
import ManageNews from "../components/pages/ManageNews";
import NewsDetails from "../components/pages/NewsDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<AddNews />} />
      <Route path="/manage" element={<ManageNews />} />
      <Route path="/news/:id" element={<NewsDetails />} />
    </Routes>
  );
}
