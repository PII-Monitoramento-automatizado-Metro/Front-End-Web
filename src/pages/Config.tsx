import React, { useState, useEffect } from "react";
import {
  FaPen,
  FaLock,
  FaBell,
  FaChevronRight,
  FaPencilAlt,
} from "react-icons/fa";
import { Switch } from "@mui/material"; // Para o botão de notificação
import userAvatar from "../assets/user-avatar.png"; // Use seu avatar padrão
import "./Config.css";

export default function Config() {
  const [nomeUsuario, setNomeUsuario] = useState("Visitante");
  const [notificacoes, setNotificacoes] = useState(false);

  // Carrega o nome do usuário salvo no login
  useEffect(() => {
    const nomeSalvo = localStorage.getItem("nome_usuario");
    if (nomeSalvo) {
      setNomeUsuario(nomeSalvo);
    }
  }, []);

  // Funções de clique (placeholders para lógica futura)
  const handleEditName = () => {
    const novoNome = prompt("Digite o novo nome:", nomeUsuario);
    if (novoNome) {
      setNomeUsuario(novoNome);
      localStorage.setItem("nome_usuario", novoNome);
    }
  };

  const handleChangePassword = () => {
    alert("Redirecionar para tela de alterar senha...");
  };

  const toggleNotifications = () => {
    setNotificacoes(!notificacoes);
  };

  return (
    <div className="config-container">
      {/* --- HEADER AZUL --- */}
      <div className="config-header">
        <div className="avatar-wrapper">
          <img src={userAvatar} alt="Avatar" className="config-avatar" />
          {/* Botãozinho de editar na foto */}
          <button className="edit-avatar-btn" title="Alterar foto">
            <FaPencilAlt />
          </button>
        </div>

        <div className="user-details">
          <h2>{nomeUsuario}</h2>
          <span>Funcionário</span>
        </div>
      </div>

      {/* --- LISTA DE OPÇÕES --- */}
      <div className="config-content">
        {/* Seção Conta */}
        <div className="section-title">Conta</div>

        <div className="config-item" onClick={handleEditName}>
          <div className="item-left">
            <FaPen className="item-icon" />
            <span className="item-text">Editar Nome</span>
          </div>
          <div className="item-right">
            <FaChevronRight />
          </div>
        </div>

        <div className="config-item" onClick={handleChangePassword}>
          <div className="item-left">
            <FaLock className="item-icon" />
            <span className="item-text">Alterar Senha</span>
          </div>
          <div className="item-right">
            <FaChevronRight />
          </div>
        </div>

        {/* Seção Preferências */}
        <div className="section-title">Preferências</div>

        <div className="config-item" onClick={toggleNotifications}>
          <div className="item-left">
            <FaBell className="item-icon" />
            <span className="item-text">Notificações</span>
          </div>
          <div className="item-right">
            {/* Switch do Material UI */}
            <Switch
              checked={notificacoes}
              onChange={toggleNotifications}
              inputProps={{ "aria-label": "controlled" }}
              color="primary" // Usa a cor padrão (azul) ou customize no CSS
            />
          </div>
        </div>
      </div>
    </div>
  );
}
