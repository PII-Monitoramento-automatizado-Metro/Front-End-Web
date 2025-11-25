import React, { useState, useEffect } from "react";
import metroLogo from "../assets/metro-logo.png";
import userAvatar from "../assets/user-avatar.png";
// 1. ADICIONEI useLocation AQUI
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

import { getUserDataRequest } from "../services/httpsRequests";

function Navbar() {
  const navigate = useNavigate();
  // 2. INICIALIZAÇÃO DO LOCATION
  const location = useLocation();

  const [nomeUsuario, setNomeUsuario] = useState("Visitante");

  useEffect(() => {
    const carregarUsuario = async () => {
      const nomeSalvo = localStorage.getItem("nome_usuario");
      const funcionalSalvo = localStorage.getItem("user_funcional");

      if (nomeSalvo && nomeSalvo !== "undefined" && nomeSalvo !== "null") {
        setNomeUsuario(nomeSalvo);
      } else if (funcionalSalvo) {
        try {
          const dados = await getUserDataRequest(funcionalSalvo);
          if (dados && dados.nome) {
            setNomeUsuario(dados.nome);
            localStorage.setItem("nome_usuario", dados.nome);
          }
        } catch (error) {
          console.error("Não foi possível carregar o nome do usuário.");
        }
      }
    };
    carregarUsuario();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("nome_usuario");
      localStorage.removeItem("user_funcional");
      console.log("Logout realizado.");
      navigate("/");
    } catch (error) {
      alert("Ocorreu um erro ao sair.");
      console.error(error);
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <a href="/main" className="navbar-logo-link">
          <img src={metroLogo} alt="Metrô Logo" className="navbar-logo" />
        </a>
      </div>

      <ul className="navbar-links">
        <li>
          {/* 3. LÓGICA CONDICIONAL PARA CLASSE ACTIVE */}
          <Link
            to="/main"
            className={
              location.pathname.startsWith("/main") ||
              location.pathname.startsWith("/obra")
                ? "active"
                : ""
            }
          >
            Página inicial
          </Link>
        </li>
        <li>
          <Link
            to="/changeLog"
            className={location.pathname === "/changeLog" ? "active" : ""}
          >
            Registro de alterações
          </Link>
        </li>
        <li>
          <Link
            to="/config"
            className={location.pathname === "/config" ? "active" : ""}
          >
            Configurações
          </Link>
        </li>
      </ul>

      <div className="navbar-right">
        <div className="user-profile">
          <div className="user-avatar-info">
            <img src={userAvatar} alt="Avatar" className="user-avatar" />
            <div className="user-info">
              <span>Olá!</span>
              <strong>{nomeUsuario || "Visitante"}</strong>
            </div>
          </div>
        </div>
        <button type="submit" className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
