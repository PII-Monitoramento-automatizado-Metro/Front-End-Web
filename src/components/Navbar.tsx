import React, { useState, useEffect } from "react";
import metroLogo from "../assets/metro-logo.png";
import userAvatar from "../assets/user-avatar.png"; // O avatar azul com o símbolo do metrô
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  // --- 1. ESTADO PARA GUARDAR O NOME ---
  const [nomeUsuario, setNomeUsuario] = useState("Visitante");

  // --- 2. EFEITO QUE RODA AO CARREGAR A TELA ---
  useEffect(() => {
    // Busca o nome que salvamos na tela de Login
    const nomeSalvo = localStorage.getItem("nome_usuario");

    if (nomeSalvo) {
      setNomeUsuario(nomeSalvo);
    }
  }, []);

  const handleLogout = () => {
    try {
      console.log("Login bem-sucedido:");
      navigate("/");
    } catch (error) {
      alert("Ocorreu um erro ao fazer login. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <nav className="navbar-container">
      {/* Lado Esquerdo: Logo e Links */}
      <div className="navbar-left">
        <a href="/" className="navbar-logo-link">
          <img src={metroLogo} alt="Metrô Logo" className="navbar-logo" />
        </a>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/main" className="active">
            Página inicial
          </Link>
        </li>
        <li>
          <Link to="/changeLog">Registro de alterações</Link>
        </li>
        <li>
          <Link to="/config">Configurações</Link>
        </li>
      </ul>

      {/* Lado Direito: Perfil do Usuário e Botão de Logout */}
      <div className="navbar-right">
        <div className="user-profile">
          <div className="user-avatar-info">
            <img src={userAvatar} alt="Avatar" className="user-avatar" />
            <div className="user-info">
              <span>Olá!</span>
              <strong>{nomeUsuario}</strong>
            </div>
          </div>
          {/* Ícone de seta para baixo (dropdown) */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <button type="submit" className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
