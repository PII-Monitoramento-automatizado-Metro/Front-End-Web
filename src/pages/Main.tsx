import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import AreaGraphic from "../components/AreaGraphic";
import PieGraphic from "../components/PieGraphic";
import black from "./../assets/black.png";
import linha from "./../assets/linha.png";
import seta from "./../assets/seta.png";
import "./Main.css"; // Ajuste o caminho conforme sua estrutura
import { listObrasRequest } from "../services/httpsRequests";
import type { ObraType } from "../types/Obra"; // Se tiver um arquivo de tipos

// --- MOCK DATA ---
// Mock data para a lista de estações
const stations = [
  {
    name: "Estação Consolação",
    line: "Linha Verde",
    lineColor: "#00A859", // Exemplo de cor para a Linha Verde
    progress: 100,
  },
  {
    name: "Estação Luz",
    line: "Linha Azul",
    lineColor: "#007FFF", // Exemplo de cor para a Linha Azul
    progress: 100,
  },
  {
    name: "Estação Pinheiros",
    line: "Linha Amarela",
    lineColor: "#FFD700", // Exemplo de cor para a Linha Amarela
    progress: 100,
  },
  {
    name: "Estação Pinheiros",
    line: "Linha Vermelha",
    lineColor: "#FF0000", // Exemplo de cor para a Linha Vermelha
    progress: 25,
  },
  {
    name: "Estação Pinheiros",
    line: "Linha Vermelha",
    lineColor: "#FF0000", // Exemplo de cor para a Linha Vermelha
    progress: 25,
  },
  {
    name: "Estação Pinheiros",
    line: "Linha Vermelha",
    lineColor: "#FF0000", // Exemplo de cor para a Linha Vermelha
    progress: 25,
  },
  {
    name: "Estação Pinheiros",
    line: "Linha Vermelha",
    lineColor: "#FF0000", // Exemplo de cor para a Linha Vermelha
    progress: 25,
  },
  {
    name: "Estação Pinheiros",
    line: "Linha Vermelha",
    lineColor: "#FF0000", // Exemplo de cor para a Linha Vermelha
    progress: 25,
  },
];

// Mock data para o log de atividades
const logs = [
  {
    user: "Rodrigo",
    avatarChar: "R", // Use a primeira letra para o Avatar
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
  // 2. CRIAR O ESTADO PARA ARMAZENAR AS OBRAS
  const [obras, setObras] = useState<ObraType[]>([]);

  // 3. BUSCAR DADOS DO BACKEND AO CARREGAR A PÁGINA
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const dados = await listObrasRequest();
        setObras(dados);
      } catch (error) {
        console.error("Erro ao carregar obras:", error);
      }
    };

    fetchObras();
  }, []);

  return (
    <div className="main-container">
      {/* ----- COLUNA ESQUERDA ----- */}
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
              <button className="add-button">Adicionar</button>
            </div>

            <div className="tabela">
              <div className="contorno">
                <div className="conteudo-ltr">
                  <table className="tabela-passageiros">
                    <thead>
                      <tr>
                        <th>Obra</th> {/* Ajustei o título */}
                        <th>Progresso</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Verifica se tem obras */}
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
                          <tr key={obra.id}>
                            {/* CÉLULA 1: ESTAÇÃO E LINHA */}
                            <td>
                              <div className="linha-estacao">
                                <img src={linha} alt="" />
                                <div className="estacao">
                                  {/* AGORA USAMOS OS CAMPOS CERTOS DO SEU ARQUIVO .TS */}
                                  <h3>{obra.nome}</h3>
                                  <span>{obra.linha}</span>
                                </div>
                              </div>
                            </td>

                            {/* CÉLULA 2: PROGRESSO REAL DO BANCO */}
                            <td>
                              <div className="progress-wrapper">
                                <span className="progress-text">
                                  {obra.progresso_atual}%
                                </span>
                                <div className="progress-bar-container">
                                  <div
                                    className="progress-bar-fill"
                                    // Usa o valor dinâmico para definir a largura
                                    style={{
                                      width: `${obra.progresso_atual}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </td>

                            {/* CÉLULA 3: AÇÕES (Ícone e Seta) */}
                            <td>
                              <FaEllipsisV />
                            </td>
                            <td>
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

      {/* ----- COLUNA DIREITA (Mantida igual) ----- */}
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
    </div>
  );
}

export default MainPage;
