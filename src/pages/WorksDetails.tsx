import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaLayerGroup,
  FaRegImage,
  FaSpinner,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  analisarObraRequest,
  deleteRegistroRequest,
  getObraByIdRequest,
} from "../services/httpsRequests";
// Importando os tipos atualizados (FotoType é essencial agora)
import type { FotoType, ObraType, RegistroType } from "../types/Obra";
import AIIcon from "./../assets/ai-icon.png";
import "./Main.css";
import "./WorksDetails.css";

const BASE_URL = "http://127.0.0.1:8000/";

function WorksDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [obra, setObra] = useState<ObraType | null>(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE CONTROLE ---
  const [currentRegistro, setCurrentRegistro] = useState<RegistroType | null>(
    null
  );
  const [photoIndex, setPhotoIndex] = useState(0); // Índice da foto dentro do álbum

  // BIM
  const [bimModalOpen, setBimModalOpen] = useState(false);
  const [currentBimIndex, setCurrentBimIndex] = useState(0);

  // UI
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [registroDate, setRegistroDate] = useState("");

  // Upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- FUNÇÃO HELPER INTELIGENTE (ESSENCIAL) ---
  // Resolve a URL da imagem, seja string antiga ou objeto novo do Google Cloud
  const getImgSrc = (foto: string | FotoType): string => {
    let path = "";

    // 1. Se for objeto (formato novo), pega a public_url
    if (typeof foto === "object" && foto !== null) {
      path = foto.public_url;
    }
    // 2. Se for string (formato antigo), usa direto
    else if (typeof foto === "string") {
      path = foto;
    }

    // 3. Se já começa com http (Google Cloud), retorna direto
    if (path.startsWith("http")) {
      return path;
    }

    // 4. Se não, é local (uploads/...), adiciona o localhost
    return (BASE_URL + path).replace(/\\/g, "/");
  };

  // --- CARREGAMENTO ---
  const carregarDetalhes = async () => {
    if (!id) return;
    try {
      const dados = await getObraByIdRequest(id);
      setObra(dados);

      // Seleciona o último registro por padrão
      if (dados.registros && dados.registros.length > 0) {
        const ultimo = dados.registros[dados.registros.length - 1];
        setCurrentRegistro(ultimo);
        setPhotoIndex(0);
      } else {
        setCurrentRegistro(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  // --- NAVEGAÇÃO DENTRO DO ÁLBUM (REGISTROS) ---
  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentRegistro && currentRegistro.fotos.length > 1) {
      setPhotoIndex((prev) => (prev + 1) % currentRegistro.fotos.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentRegistro && currentRegistro.fotos.length > 1) {
      setPhotoIndex(
        (prev) =>
          (prev - 1 + currentRegistro.fotos.length) %
          currentRegistro.fotos.length
      );
    }
  };

  // --- NAVEGAÇÃO BIM ---
  const abrirBimModal = () => {
    if (obra?.fotos && obra.fotos.length > 0) {
      setCurrentBimIndex(0);
      setBimModalOpen(true);
    } else {
      alert("Nenhuma imagem do Modelo BIM foi cadastrada nesta obra.");
    }
  };

  const handleNextBim = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (obra?.fotos) {
      setCurrentBimIndex((prev) => (prev + 1) % obra.fotos!.length);
    }
  };

  const handlePrevBim = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (obra?.fotos) {
      setCurrentBimIndex(
        (prev) => (prev - 1 + obra.fotos!.length) % obra.fotos!.length
      );
    }
  };

  // --- AÇÕES ---
  const selecionarRegistro = (reg: RegistroType) => {
    setCurrentRegistro(reg);
    setPhotoIndex(0);
    setMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  const handleUploadRegistro = async () => {
    // Validação: verifica se tem data também
    if (selectedFiles.length === 0 || !id || !registroDate) {
      alert("Selecione uma data e pelo menos uma foto.");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Passa a data (registroDate) para a função
      await analisarObraRequest(id, selectedFiles, registroDate);

      alert("Análise concluída e registro salvo!");
      setOpenModal(false);
      setSelectedFiles([]);
      setRegistroDate("");
      carregarDetalhes();
    } catch (error) {
      console.error(error);
      alert("Erro ao processar imagens.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteRegistro = async () => {
    if (!id || !currentRegistro) return;
    if (window.confirm("Excluir este Registro inteiro?")) {
      try {
        await deleteRegistroRequest(id, currentRegistro.id);
        alert("Registro excluído.");
        setMenuOpen(false);
        carregarDetalhes();
      } catch {
        alert("Erro ao excluir.");
      }
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Carregando...</div>;
  if (!obra) return <div style={{ padding: 40 }}>Obra não encontrada.</div>;

  // Variáveis auxiliares de renderização
  const temFotos = currentRegistro && currentRegistro.fotos.length > 0;

  // AQUI USAMOS O HELPER getImgSrc:
  const fotoAtualUrl = temFotos
    ? getImgSrc(currentRegistro!.fotos[photoIndex])
    : "";

  const ehAlbumMultiplo = temFotos && currentRegistro!.fotos.length > 1;
  const temFotosBim = obra.fotos && obra.fotos.length > 0;
  const temMaisDeUmaFotoBim = obra.fotos && obra.fotos.length > 1;

  return (
    <div className="details-container">
      {/* HEADER */}
      <div className="details-header">
        <button
          onClick={() => navigate("/main")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#333",
            fontSize: "1.2rem",
            marginRight: "10px",
          }}
          title="Voltar para lista"
        >
          <FaArrowLeft />
        </button>
        <h1>{obra.nome}</h1>
        <span className="tag-obra">Obra</span>
      </div>

      <div className="details-content">
        {/* ESQUERDA: GALERIA */}
        <div className="left-gallery">
          <div className="main-image-container">
            {temFotos ? (
              <>
                <img
                  src={fotoAtualUrl}
                  alt="Destaque"
                  className="main-image"
                  onClick={() => setZoomImage(fotoAtualUrl)}
                  title="Clique para ampliar"
                />
                <div className="image-overlay-date">
                  {currentRegistro?.data
                    ? new Date(currentRegistro.data).toLocaleDateString("pt-BR")
                    : ""}
                  {ehAlbumMultiplo &&
                    ` (${photoIndex + 1}/${currentRegistro!.fotos.length})`}
                </div>

                {/* Botão de Opções */}
                <div
                  className="image-options-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(!menuOpen);
                  }}
                >
                  <FaEllipsisV />
                </div>
                {menuOpen && (
                  <div className="options-menu">
                    <div
                      className="menu-item danger"
                      onClick={handleDeleteRegistro}
                    >
                      <FaTrash /> Excluir Registro
                    </div>
                  </div>
                )}

                {/* Setas de Navegação do Álbum */}
                {ehAlbumMultiplo && (
                  <>
                    <button
                      className="lightbox-nav-btn lightbox-prev"
                      onClick={handlePrevPhoto}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="lightbox-nav-btn lightbox-next"
                      onClick={handleNextPhoto}
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  background: "#eee",
                }}
              >
                <FaCamera
                  size={50}
                  style={{ opacity: 0.3, marginBottom: 10 }}
                />
                <p>Nenhum registro selecionado</p>
              </div>
            )}
          </div>

          {/* MINIATURAS DOS REGISTROS (TIMELINE) */}
          <div className="thumbnail-list">
            {obra.registros?.map((reg, index) => {
              // Capa do registro (primeira foto) usando o helper
              const capaUrl =
                reg.fotos.length > 0 ? getImgSrc(reg.fotos[0]) : "";
              const isSelected = currentRegistro?.id === reg.id;

              return (
                <div key={reg.id} style={{ position: "relative" }}>
                  <img
                    src={capaUrl}
                    alt={`Registro ${reg.data}`}
                    className={`thumb-item ${isSelected ? "active" : ""}`}
                    onClick={() => selecionarRegistro(reg)}
                    title={`Data: ${reg.data}`}
                  />
                  {reg.fotos.length > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 8,
                        right: 5,
                        color: "white",
                        background: "rgba(0,0,0,0.6)",
                        borderRadius: 3,
                        padding: "2px 4px",
                        fontSize: "0.7rem",
                      }}
                    >
                      <FaLayerGroup />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DIREITA: SIDEBAR */}
        <div className="right-sidebar">
          <div className="assistant-header">
            <img src={AIIcon} alt="" width={25} />
            <h2 className="assistant-title">Metro Assistant</h2>
            <span className="tag-obra" style={{ marginLeft: "auto" }}>
              {obra.nome}
            </span>
          </div>
          <p className="date-text">
            {currentRegistro?.data
              ? new Date(currentRegistro.data).toLocaleDateString("pt-BR")
              : "Sem registros"}
          </p>
          <p className="description-text">
            {currentRegistro?.analise?.descricao ? (
              // CASO 1: Tem análise da IA, mostra a descrição
              currentRegistro.analise.descricao
            ) : (
              // CASO 2: Não tem análise (ou nenhum registro selecionado), mostra dados gerais
              <>
                Acompanhamento da linha: <strong>{obra.linha}</strong>
                <br />
                Início: {obra.data_inicio} | Fim: {obra.data_final}
                <br />
                <br />
                <span
                  style={{
                    color: "#999",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                  }}
                >
                  (Selecione um registro com análise para ver os detalhes da IA)
                </span>
              </>
            )}
          </p>
          <div className="action-buttons">
            <button
              className="btn-atualizar"
              onClick={() => setOpenModal(true)}
            >
              Atualizar obra
            </button>
            <button className="btn-modelo" onClick={abrirBimModal}>
              Ver Modelo BIM
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="progress-footer">
        <div className="progress-info">
          <h3>Progresso:</h3>
          <span className="progress-percent">{obra.progresso_atual}%</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${obra.progresso_atual}%` }}
          ></div>
        </div>
      </div>

      {/* MODAL DE UPLOAD */}
      {openModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ height: "auto" }}>
            <div className="modal-header">
              <FaTimes
                className="close-icon"
                onClick={() => setOpenModal(false)}
              />
              <h2 className="modal-title">Novo Registro</h2>
            </div>
            <div style={{ marginBottom: 15 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 5,
                  fontSize: "0.9rem",
                  color: "#333",
                }}
              >
                Data do Registro:
              </label>
              <input
                type="date"
                className="modal-input"
                value={registroDate}
                onChange={(e) => setRegistroDate(e.target.value)}
              />
            </div>
            <div
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedFiles.length > 0 ? (
                <div className="upload-container">
                  <FaRegImage
                    className="upload-icon"
                    style={{
                      color: "#001388",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  />
                  <span
                    className="upload-text"
                    style={{
                      color: "#001388",
                      fontWeight: "bold",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {selectedFiles.length} fotos selecionadas
                  </span>
                </div>
              ) : (
                <>
                  <FaRegImage className="upload-icon" />
                  <span className="upload-text">
                    Clique para adicionar fotos
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
            <button
              className="btn-cadastrar"
              onClick={handleUploadRegistro}
              disabled={isAnalyzing}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                opacity: isAnalyzing ? 0.7 : 1,
              }}
            >
              {isAnalyzing ? (
                <>
                  <FaSpinner className="fa-spin" /> Analisando...
                </>
              ) : (
                "Analisar e Salvar"
              )}
            </button>
          </div>
        </div>
      )}

      {/* LIGHTBOX ZOOM */}
      {zoomImage && (
        <div className="lightbox-overlay" onClick={() => setZoomImage(null)}>
          <FaTimes
            className="lightbox-close"
            onClick={() => setZoomImage(null)}
          />
          <img
            src={zoomImage}
            alt="Zoom"
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* LIGHTBOX BIM */}
      {bimModalOpen && temFotosBim && (
        <div
          className="lightbox-overlay"
          onClick={() => setBimModalOpen(false)}
        >
          <FaTimes
            className="lightbox-close"
            onClick={() => setBimModalOpen(false)}
          />

          {temMaisDeUmaFotoBim && (
            <button
              className="lightbox-nav-btn lightbox-prev"
              onClick={handlePrevBim}
            >
              <FaChevronLeft />
            </button>
          )}

          <img
            // Usa o helper aqui também!
            src={getImgSrc(obra.fotos![currentBimIndex])}
            alt={`BIM ${currentBimIndex}`}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          {temMaisDeUmaFotoBim && (
            <button
              className="lightbox-nav-btn lightbox-next"
              onClick={handleNextBim}
            >
              <FaChevronRight />
            </button>
          )}

          {temMaisDeUmaFotoBim && (
            <div
              style={{
                position: "absolute",
                bottom: 30,
                color: "white",
                background: "rgba(0,0,0,0.5)",
                padding: "5px 10px",
                borderRadius: 15,
              }}
            >
              {currentBimIndex + 1} / {obra.fotos!.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WorksDetails;
