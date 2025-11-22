import { Avatar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
// Adicione FaEdit e FaTrash
import {
  FaEllipsisV,
  FaRegImage,
  FaSearch,
  FaTimes,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AreaGraphic from "../components/AreaGraphic";
import PieGraphic from "../components/PieGraphic";
import black from "./../assets/black.png";
import linhaImg from "./../assets/linha.png";
import seta from "./../assets/seta.png";
import "./Main.css";

// Importe a nova função de deletar
import {
  createObraRequest,
  listObrasRequest,
  deleteObraRequest,
} from "../services/httpsRequests";
import type { ObraType } from "../types/Obra";

// ... (Mantenha o array de logs igual) ...
const logs = [
  {
    user: "Rodrigo",

    avatarChar: "R",

    action: "adicionou uma nova foto em",

    target: "Estação Consolação.",
  },

  {
    user: "Mitchell",

    avatarChar: "M",

    action: "removeu uma nova foto em",

    target: "Estação Consolação.",
  },

  {
    user: "Taynah",

    avatarChar: "T",

    action: "adicionou uma nova foto em",

    target: "Estação Consolação.",
  },

  {
    user: "Henry",

    avatarChar: "H",

    action: "adicionou uma nova foto em",

    target: "Estação Consolação.",
  },

  {
    user: "Ramon",

    avatarChar: "R",

    action: "adicionou uma nova foto em",

    target: "Estação Consolação.",
  },
];

function MainPage() {
  const [obras, setObras] = useState<ObraType[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // --- ESTADO NOVO: Controla qual menu de obra está aberto (pelo ID) ---
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Estados do Formulário
  const [novoNome, setNovoNome] = useState("");
  const [novaLinha, setNovaLinha] = useState("");
  const [novoInicio, setNovoInicio] = useState("");
  const [novoPrazo, setNovoPrazo] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const carregarObras = async () => {
    try {
      const dados = await listObrasRequest();
      setObras(dados);
    } catch (error) {
      console.error("Erro ao carregar obras:", error);
    }
  };

  // --- FUNÇÕES DE AÇÃO ---
  const handleNavigate = (id: string) => {
    navigate(`/obra/${id}`);
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique propague (embora agora esteja separado)
    if (activeMenuId === id) {
      setActiveMenuId(null); // Fecha se já estiver aberto
    } else {
      setActiveMenuId(id); // Abre este
    }
  };

  const handleDeleteObra = async (id: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta obra e todos os seus registros?"
      )
    ) {
      try {
        await deleteObraRequest(id);
        alert("Obra excluída.");
        setActiveMenuId(null);
        carregarObras(); // Recarrega a lista
      } catch (error) {
        alert("Erro ao excluir obra.");
      }
    }
  };

  const handleEditObra = (id: string) => {
    alert(`Editar obra ${id} (Funcionalidade futura)`);
    setActiveMenuId(null);
  };

  // ... (Funções do Modal de Cadastro: handleClickOpen, handleClose, handleCadastrar... MANTENHA IGUAL) ...
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNovoNome("");
    setNovaLinha("");
    setNovoInicio("");
    setNovoPrazo("");
    setSelectedFiles([]);
  };
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setSelectedFiles(Array.from(event.target.files));
  };
  const handleCadastrar = async () => {
    if (!novoNome || !novaLinha || !novoInicio || !novoPrazo) {
      alert("Preencha todos os campos!");
      return;
    }
    try {
      await createObraRequest({
        nome: novoNome,
        linha: novaLinha,
        data_inicio: novoInicio,
        data_final: novoPrazo,
        arquivos: selectedFiles,
      });
      handleClose();
      await carregarObras();
      alert("Obra cadastrada!");
    } catch (error) {
      alert("Erro ao cadastrar.");
    }
  };

  useEffect(() => {
    carregarObras();
  }, []);

  // Fecha o menu se clicar fora (opcional, mas bom para UX)
  useEffect(() => {
    const closeMenu = () => setActiveMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="main-container">
      {/* ... (COLUNA ESQUERDA E CONTROLES IGUAL ANTES) ... */}
      <div className="main-left-column">
        <PieGraphic />
        <div className="controlsTabela-Scroll">
          <div className="Scroll"></div>
          <div className="controls-tabela">
            <div className="controls-section">
              <div className="search-bar-wrapper">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Pesquisar..." />
              </div>
              <button className="add-button" onClick={handleClickOpen}>
                Adicionar
              </button>
            </div>

            <div className="tabela">
              <div className="contorno">
                <div className="conteudo-ltr">
                  <table className="tabela-passageiros">
                    <thead>
                      <tr>
                        <th>Obra</th>
                        <th>Progresso</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {obras.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            Nenhuma obra encontrada.
                          </td>
                        </tr>
                      ) : (
                        obras.map((obra) => (
                          // REMOVI O onClick DO TR!
                          <tr key={obra.id}>
                            {/* CÉLULA 1: CLICÁVEL (Vai para detalhes) */}
                            <td
                              className="clickable-cell"
                              onClick={() => handleNavigate(obra.id)}
                            >
                              <div className="linha-estacao">
                                <img src={linhaImg} alt="" />
                                <div className="estacao">
                                  <h3>{obra.nome}</h3>
                                  <span>{obra.linha}</span>
                                </div>
                              </div>
                            </td>

                            {/* CÉLULA 2: CLICÁVEL (Vai para detalhes) */}
                            <td
                              className="clickable-cell"
                              onClick={() => handleNavigate(obra.id)}
                            >
                              <div className="progress-wrapper">
                                <span className="progress-text">
                                  {obra.progresso_atual}%
                                </span>
                                <div className="progress-bar-container">
                                  <div
                                    className="progress-bar-fill"
                                    style={{
                                      width: `${obra.progresso_atual}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </td>

                            {/* CÉLULA 3: AÇÕES (NÃO NAVEGA) */}
                            <td
                              className="action-cell"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                onClick={(e) => toggleMenu(obra.id, e)}
                                style={{
                                  display: "inline-block",
                                  padding: "5px",
                                }}
                              >
                                <FaEllipsisV />
                              </div>

                              {/* O MENU SUSPENSO */}
                              {activeMenuId === obra.id && (
                                <div className="table-action-menu">
                                  <div
                                    className="table-menu-item"
                                    onClick={() => handleEditObra(obra.id)}
                                  >
                                    <FaEdit /> Editar
                                  </div>
                                  <div
                                    className="table-menu-item danger"
                                    onClick={() => handleDeleteObra(obra.id)}
                                  >
                                    <FaTrash /> Deletar
                                  </div>
                                </div>
                              )}
                            </td>

                            <td
                              onClick={() => handleNavigate(obra.id)}
                              className="clickable-cell"
                            >
                              <img src={seta} alt="seta" />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ... (COLUNA DIREITA E MODAL IGUAL ANTES) ... */}
      <div className="main-right-column">
        <AreaGraphic />
        <div className="log-list-wrapper">
          <div className="log-list-header">
            <h2>Registros</h2>

            <span className="recent-tag">Mais Recentes</span>
          </div>
          <ul className="log-list">
            {logs.map((log, index) => (
              <li key={index} className="log-list-item">
                <img src={black} alt="" className="bars" />
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#001388",
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  {log.avatarChar}
                </Avatar>
                <p className="log-item-text">
                  <span className="log-user">{log.user}</span> {log.action}{" "}
                  <strong className="log-target">{log.target}</strong>
                </p>
                <img src={seta} alt="" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal de Cadastro (Mantido igual) */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* ... Campos do modal ... */}
            <div className="modal-header">
              <FaTimes className="close-icon" onClick={handleClose} />
              <h2 className="modal-title">Cadastro da Obra</h2>
            </div>
            <input
              type="text"
              className="modal-input"
              placeholder="Nome da obra"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
            />
            <input
              type="text"
              className="modal-input"
              placeholder="Linha"
              value={novaLinha}
              onChange={(e) => setNovaLinha(e.target.value)}
            />
            <input
              type="text"
              className="modal-input"
              placeholder="Data de Início"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              value={novoInicio}
              onChange={(e) => setNovoInicio(e.target.value)}
            />
            <input
              type="text"
              className="modal-input"
              placeholder="Data de Prazo"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              value={novoPrazo}
              onChange={(e) => setNovoPrazo(e.target.value)}
            />

            <div className="upload-area" onClick={handleUploadClick}>
              {selectedFiles.length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <FaRegImage
                    className="upload-icon"
                    style={{ color: "#001388" }}
                  />
                  <span
                    className="upload-text"
                    style={{ color: "#001388", fontWeight: "bold" }}
                  >
                    {selectedFiles.length} fotos selecionadas
                  </span>
                </div>
              ) : (
                <>
                  <FaRegImage className="upload-icon" />
                  <span className="upload-text">
                    Adicionar fotos
                    <br />
                    do modelo BIM
                  </span>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={handleFileChange}
                accept="image/*"
                multiple
              />
            </div>
            <button className="btn-cadastrar" onClick={handleCadastrar}>
              Cadastrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
