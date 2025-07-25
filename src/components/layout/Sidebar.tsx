import { useState } from "react";
import Button from "../common/Button";
import expandLogo from "../../assets/sidebarOpen.png"; // This should show when sidebar is open
import collapseLogo from "../../assets/sidebarClose.png"; // This should show when sidebar is closed

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`bg-white text-black h-screen transition-all duration-300 border-r border-gray-200 ${
        isOpen ? "w-64" : "w-16"
      }`} //overflow hidden
    >
      <div
        className={`flex items-center p-4 border-b border-gray-200 ${
          isOpen ? "justify-end" : "justify-start"
        }`}
      >
        <Button
          onClick={toggleSidebar}
          className="focus:outline-none p-1 rounded-md transition-all duration-200 hover:bg-gray-100 hover:ring-2 hover:ring-gray-300"
        >
          <img
            src={isOpen ? collapseLogo : expandLogo}
            alt="Sidebar logo"
            className="h-5 w-auto cursor-pointer"
          />
        </Button>
      </div>
      <div className="p-4">
        {isOpen ? (
          <div>Expanded sidebar content</div>
        ) : (
          <div>Collapsed content/icons</div>
        )}
      </div>
    </div>
  );
}
