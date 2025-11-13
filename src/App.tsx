import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ChangeLog from "./pages/ChangeLog";
import Config from "./pages/Config";
import { Route, Routes, useLocation } from "react-router-dom";
import Main from "./pages/Main";



function App() {
    const location = useLocation();
  const isLoginPage = location.pathname === "/"; // Verifica se está na página de login

  return (
    <div className="app-container">
      {!isLoginPage && <Navbar />}{" "}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />} />{" "}
          <Route path="/changeLog" element={<ChangeLog />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
