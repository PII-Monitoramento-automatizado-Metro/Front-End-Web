import { Avatar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  FaEllipsisV,
  FaRegImage,
  FaSearch,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AreaGraphic from "../components/AreaGraphic";
import PieGraphic from "../components/PieGraphic";
import black from "./../assets/black.png";
import linhaImg from "./../assets/linha.png";
import seta from "./../assets/seta.png";
import "./Main.css";

import {
  createObraRequest,
  listObrasRequest,
  deleteObraRequest,
  listLogsRequest,
} from "../services/httpsRequests";
import type { ObraType } from "../types/Obra";
import type { LogType } from "../types/log";

function MainPage() {
  const [obras, setObras] = useState<ObraType[]>([]);
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);

  // --- NOVO ESTADO PARA A PESQUISA ---
  const [searchTerm, setSearchTerm] = useState("");

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Estados do Formulário
  const [novoNome, setNovoNome] = useState("");
  const [novaLinha, setNovaLinha] = useState("");
  const [novoInicio, setNovoInicio] = useState("");
  const [novoPrazo, setNovoPrazo] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const dadosObras = await listObrasRequest();
      setObras(dadosObras);

      const dadosLogs = await listLogsRequest();
      setLogs(dadosLogs);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE FILTRO (A MÁGICA ACONTECE AQUI) ---
  // Cria uma lista nova filtrando pelo nome OU pela linha (ignorando maiúsculas/minúsculas)
  const obrasFiltradas = obras.filter((obra) => {
    const termo = searchTerm.toLowerCase();
    return (
      obra.nome.toLowerCase().includes(termo) ||
      obra.linha.toLowerCase().includes(termo)
    );
  });

  const handleNavigate = (id: string) => {
    navigate(`/obra/${id}`);
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
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
        carregarDados();
      } catch (error) {
        alert("Erro ao excluir obra.");
      }
    }
  };

  const handleEditObra = (id: string) => {
    alert(`Editar obra ${id} (Funcionalidade futura)`);
    setActiveMenuId(null);
  };

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
      await carregarDados();
      alert("Obra cadastrada!");
    } catch (error) {
      alert("Erro ao cadastrar.");
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    const closeMenu = () => setActiveMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="main-container">
      <div className="main-left-column">
        <PieGraphic />
        <div className="controlsTabela-Scroll">
          <div className="Scroll"></div>
          <div className="controls-tabela">
            <div className="controls-section">
              <div className="search-bar-wrapper">
                <FaSearch className="search-icon" />

                {/* --- INPUT CONECTADO AO ESTADO --- */}
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchTerm} // Valor vem do estado
                  onChange={(e) => setSearchTerm(e.target.value)} // Atualiza estado ao digitar
                />
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
                      {loading ? (
                        <tr>
                          <td
                            colSpan={3}
                            style={{ textAlign: "center", padding: "40px" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                color: "#001388",
                              }}
                            >
                              <FaSpinner
                                className="fa-spin"
                                style={{ animation: "spin 2s linear infinite" }}
                              />
                              <span>Carregando obras...</span>
                            </div>
                          </td>
                        </tr>
                      ) : obrasFiltradas.length === 0 ? (
                        // USAMOS obrasFiltradas.length AO INVÉS DE obras.length
                        <tr>
                          <td
                            colSpan={3}
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            {/* Mensagem dinâmica */}
                            {obras.length === 0
                              ? "Nenhuma obra encontrada. Clique em Adicionar para começar."
                              : "Nenhuma obra encontrada com este nome."}
                          </td>
                        </tr>
                      ) : (
                        // MAPEAR A LISTA FILTRADA
                        obrasFiltradas.map((obra) => (
                          <tr key={obra.id}>
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

      <div className="main-right-column">
        <AreaGraphic />
        <div className="log-list-wrapper">
          <div className="log-list-header">
            <h2>Registros</h2>
            <span className="recent-tag">Mais Recentes</span>
          </div>
          <ul className="log-list">
            {logs.length === 0 ? (
              <li
                className="log-list-item"
                style={{ justifyContent: "center", color: "#999" }}
              >
                {loading ? "Atualizando..." : "Nenhuma atividade recente."}
              </li>
            ) : (
              logs.slice(0, 5).map((log) => (
                <li key={log.id} className="log-list-item">
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
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
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
