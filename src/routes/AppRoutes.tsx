import { Route, Routes } from "react-router-dom";
import Home from "../components/pages/Home";
import AddNews from "../components/pages/AddNews";
import ManageNews from "../components/pages/ManageNews";
import NewsDetails from "../components/pages/NewsDetails";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/add"
        element={
          <PrivateRoute>
            <AddNews />
          </PrivateRoute>
        }
      />
      <Route
        path="/manage"
        element={
          <PrivateRoute>
            <ManageNews />
          </PrivateRoute>
        }
      />
      <Route path="/news/:id" element={<NewsDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
