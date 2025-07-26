// import { useState } from "react";
import "./App.css";
// import Button from "./components/common/Button";
// import Card from "./components/common/Card";
// import Input from "./components/common/Input";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Sidebar />
    </AuthProvider>
  );
}
