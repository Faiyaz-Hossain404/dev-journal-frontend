import { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import searchIcon from "../../assets/search.png";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

// import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // hydrate search box from URL on mount / route change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") ?? "";
    setSearch(q);
  }, [location.search]);

  // debounce URL updates when typing
  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (search.trim()) params.set("q", search.trim());
      else params.delete("q");

      const next = `/${params.toString() ? `?${params.toString()}` : ""}`;
      if (location.pathname + location.search !== next) {
        navigate(next, { replace: true });
      }
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#0E1217] text-white flex items-center justify-between p-4 border-b border-gray-200 shadow-sm">
      {/* Left: Logo + nav */}
      <div className="flex items-center gap-6 min-w-max">
        <span className="text-xl font-bold whitespace-nowrap">
          The Dev Journal
        </span>

        <Link to="/" className="text-sm text-[#A8B3CF] hover:underline">
          Home
        </Link>

        {user && (
          <>
            <Link to="/add" className="text-sm text-[#A8B3CF] hover:underline">
              Add News
            </Link>
            <Link
              to="/manage"
              className="text-sm text-[#A8B3CF] hover:underline"
            >
              Manage News
            </Link>
          </>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 relative px-4 max-w-xl mx-auto">
        <img
          src={searchIcon}
          alt="Search"
          className="absolute left-8 top-1/2 -translate-y-1/2 w-5 opacity-60 pointer-events-none"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search news..."
          className="w-full pl-12 pr-4 py-2 rounded-2xl bg-[#2D323D] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Right: Auth controls */}
      <div className="ml-4 flex items-center gap-2 min-w-max">
        {user ? (
          <Button
            onClick={handleLogout}
            className="bg-white text-black px-3 py-1 rounded"
          >
            Logout
          </Button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-[#A8B3CF] px-3 py-1 hover:underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm text-[#A8B3CF] px-3 py-1 hover:underline"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
