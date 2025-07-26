import { Route, Routes } from "react-router-dom";
import Home from "../components/pages/Home";
import AddNews from "../components/pages/AddNews";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<AddNews />} />
    </Routes>
  );
}
