import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import searchIcon from "../../assets/search.png";
// import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <nav className="bg-[#0E1217] text-white flex items-center justify-between p-4 border-b border-gray-200 shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center gap-4 min-w-max">
        <span className="text-xl font-bold whitespace-nowrap">
          The Dev Journal
        </span>

        {/* <NavLink to="/add">Home</NavLink> */}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 relative px-4 max-w-xl mx-auto">
        <img
          src={searchIcon}
          alt="Search"
          className="absolute left-8 top-1/2 transform -translate-y-1/2 h- w-5 opacity-60"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search news..."
          className="w-full pl-12 pr-4 py-2 rounded-2xl bg-[#2D323D] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Right: Filter Buttons */}
      <div className="flex items-center gap-2 min-w-max">
        <Button className="px-4 py-2 text-sm font-medium cursor-pointer text-[#A8B3CF]">
          Category
        </Button>
        <Button className="px-4 py-2 text-sm font-medium cursor-pointer text-[#A8B3CF]">
          Publisher
        </Button>
        <Button className="px-4 py-2 text-sm font-medium cursor-pointer text-[#A8B3CF]">
          Date
        </Button>
      </div>
    </nav>
  );
}
