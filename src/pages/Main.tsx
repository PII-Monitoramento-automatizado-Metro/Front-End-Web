import { ChevronRight, DragHandle } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import linha from "./../assets/linha.png";
import black from "./../assets/black.png";
import seta from "./../assets/seta.png";
import PieGraphic from "../components/PieGraphic";
import "./Main.css"; // Ajuste o caminho conforme sua estrutura
import AreaGraphic from "../components/AreaGraphic";


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
  return (
    <div className="main-container">
      {" "}
      {/* Renomeei para main-container para evitar conflito com 'home' */}
      {/* ----- COLUNA ESQUERDA ----- */}
      <div className="main-left-column">
        {/* Placeholder de Vídeo */}
        <PieGraphic />
        <div className="controlsTabela-Scroll">
          <div className="Scroll"></div>
          <div className="controls-tabela">
            <div className="controls-section">
              <div className="search-bar-wrapper">
                {" "}
                {/* Novo wrapper para a barra de pesquisa */}
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Pesquisar..." />
              </div>
              <button className="add-button">Adicionar</button>
            </div>

            {/* Seção de Controles (Pesquisa e Adicionar) */}
            <div className="tabela">
              {/* Loading ou Tabela */}
              <div className="contorno">
                <div className="conteudo-ltr">
                  <table className="tabela-passageiros">
                    <thead>
                      <tr>
                        <th>Estação</th>
                        <th>Progresso</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* 1. O .map() cria o <tr> principal. Não adicione outro <tr>! */}
                      {stations.map((station, index) => (
                        <tr key={index}>
                          {/* CÉLULA 1: ESTAÇÃO */}
                          <div className="linha-estacao">
                            <img src={linha} alt="" />

                            <div className="estacao">
                              <h3>Estação Consolação</h3>

                              <span>Linha Verde</span>
                            </div>
                          </div>

                          {/* CÉLULA 2: PROGRESSO */}
                          <td>
                            <div className="progress-wrapper">
                              <span className="progress-text">
                                {station.progress}%
                              </span>
                              <div className="progress-bar-container">
                                <div
                                  className="progress-bar-fill"
                                  style={{ width: `${station.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <FaEllipsisV />
                          </td>
                          <td>
                            <img src={seta} alt="seta" />
                            {/* <FaPen
												style={{ cursor: 'pointer', color: '#888' }}
												onClick={() => {
												}}
											/> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ----- COLUNA DIREITA ----- */}
      <div className="main-right-column">
        {/* Placeholder de Vídeo */}
        <AreaGraphic />

        {/* Lista de Registros */}
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
                    bgcolor: "#001388", // Cor de fundo do Avatar
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
