import { useState } from "react";
import "./App.css";
import Button from "./components/common/Button";
import Card from "./components/common/Card";
import Input from "./components/common/Input";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

function App() {
  const [inputVal, setInputVal] = useState("");
  return (
    <>
      <div>
        <Navbar />
        <>Hello World</>
        <Button onClick={() => console.log("nope")}>Click Here</Button>
        <Card>This is the card</Card>
        <Input
          value={inputVal}
          onChange={(e) => {
            // console.log(e.target.value);
            setInputVal(e.target.value);
          }}
          placeholder="Type here..."
          type="text"
        />
        <Sidebar />
      </div>
    </>
  );
}

export default App;
