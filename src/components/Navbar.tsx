import React, { useState, useEffect } from "react";
import metroLogo from "../assets/metro-logo.png";
import userAvatar from "../assets/user-avatar.png";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

// IMPORTANTE: Importe a função que busca os dados do usuário
// Ajuste o caminho "../requests/..." se necessário
import { getUserDataRequest } from "../services/httpsRequests";

function Navbar() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("Visitante");

  // --- EFEITO: CARREGA O NOME AO INICIAR ---
  useEffect(() => {
    const carregarUsuario = async () => {
      // 1. Tenta pegar o nome direto do localStorage (mais rápido)
      const nomeSalvo = localStorage.getItem("nome_usuario");

      // 2. Tenta pegar o funcional salvo no Login
      const funcionalSalvo = localStorage.getItem("user_funcional");

      if (nomeSalvo) {
        // Se já tem o nome salvo, usa ele
        setNomeUsuario(nomeSalvo);
      } else if (funcionalSalvo) {
        // Se NÃO tem nome, mas tem o funcional, busca no Banco de Dados
        try {
          const dados = await getUserDataRequest(funcionalSalvo);
          setNomeUsuario(dados.nome);
          // Opcional: Salva o nome para não precisar buscar de novo no próximo refresh
          localStorage.setItem("nome_usuario", dados.nome);
        } catch (error) {
          console.error("Não foi possível carregar o nome do usuário.");
        }
      }
    };

    carregarUsuario();
  }, []);

  const handleLogout = () => {
    try {
      // Limpa os dados ao sair
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
      {/* Lado Esquerdo */}
      <div className="navbar-left">
        <a href="/" className="navbar-logo-link">
          <img src={metroLogo} alt="Metrô Logo" className="navbar-logo" />
        </a>
      </div>

      {/* Links Centrais */}
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

      {/* Lado Direito: Perfil */}
      <div className="navbar-right">
        <div className="user-profile">
          <div className="user-avatar-info">
            <img src={userAvatar} alt="Avatar" className="user-avatar" />
            <div className="user-info">
              <span>Olá!</span>
              {/* AQUI O NOME SERÁ EXIBIDO DINAMICAMENTE */}
              <strong>{nomeUsuario}</strong>
            </div>
          </div>

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
