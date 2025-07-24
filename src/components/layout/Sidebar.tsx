import { useState } from "react";
import Button from "../common/Button";
import openLogo from "../../assets/sidebarOpen.png";
import closeLogo from "../../assets/sidebarClose.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <div>
        <div>
          <img
            src={isOpen ? openLogo : closeLogo}
            alt="App logo"
            className={`${isOpen ? "w-32" : "w-6"}`}
          />
        </div>
        <Button onClick={() => setIsOpen(!isOpen)} variant="secondary">{isOpen ?  }</Button>
      </div>
    </div>
  );
}
