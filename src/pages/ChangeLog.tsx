import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Avatar,
  FormControl,
} from "@mui/material";
import { FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { listLogsRequest } from "../services/httpsRequests";
import type { LogType } from "../types/Log";
import "./ChangeLog.css";

// Helper para calcular "Há quanto tempo"
const timeSince = (dateString?: string) => {
  if (!dateString) return "recentemente";
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " anos atrás";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses atrás";
  interval = seconds / 86400;
  if (interval > 1) return "há " + Math.floor(interval) + " dias";
  interval = seconds / 3600;
  if (interval > 1) return "há " + Math.floor(interval) + " horas";
  interval = seconds / 60;
  if (interval > 1) return "há " + Math.floor(interval) + " minutos";
  return "há poucos segundos";
};

const ChangeLog = () => {
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Mais recente");
  const [filterStation, setFilterStation] = useState("Todas");
  const [filterUser, setFilterUser] = useState("Todos");

  // Carregar dados
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await listLogsRequest();
        setLogs(data);
      } catch (error) {
        console.error("Erro ao buscar logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // --- LÓGICA DE FILTRAGEM E ORDENAÇÃO ---

  const uniqueStations = [
    "Todas",
    ...new Set(logs.map((log) => log.target).filter(Boolean)),
  ];
  const uniqueUsers = [
    "Todos",
    ...new Set(logs.map((log) => log.user).filter(Boolean)),
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStation =
      filterStation === "Todas" || log.target === filterStation;
    const matchesUser = filterUser === "Todos" || log.user === filterUser;

    return matchesSearch && matchesStation && matchesUser;
  });

  // --- AQUI ESTÁ A MUDANÇA NA ORDENAÇÃO ---
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date((a as any).data_criacao || 0).getTime();
    const dateB = new Date((b as any).data_criacao || 0).getTime();

    if (sortOrder === "Mais recente") {
      return dateB - dateA; // Decrescente (Novo -> Velho)
    } else {
      return dateA - dateB; // Crescente (Velho -> Novo)
    }
  });

  // Estilos customizados
  const selectStyle = {
    height: 40,
    borderRadius: "8px",
    backgroundColor: "#fff",
    fontSize: "0.9rem",
    minWidth: "160px",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#001388" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#001388",
    },
  };

  return (
    <div className="changelog-container">
      {/* CABEÇALHO */}
      <div className="changelog-header">
        <h1>Registros de alterações</h1>
        <span className="tag-geral">Geral</span>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="search-area">
        <TextField
          fullWidth
          placeholder="Pesquisar..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch color="#999" />
              </InputAdornment>
            ),
            style: { backgroundColor: "white", borderRadius: 8 },
          }}
        />
      </div>

      {/* BARRA DE CONTROLES */}
      <div className="controls-bar">
        {/* Ordenar */}
        <div className="control-group">
          <span className="control-label">
            <FaSortAmountDown /> Ordenar:
          </span>
          <FormControl>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              displayEmpty
              sx={selectStyle}
              MenuProps={{ disableScrollLock: true, style: { zIndex: 900 } }} // Adicionei o fix de scroll aqui tb
            >
              <MenuItem value="Mais recente">Mais recente</MenuItem>
              <MenuItem value="Mais antigo">Mais antigo</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Filtrar */}
        <div className="filter-group">
          <div className="control-group">
            <span className="control-label">
              <FaFilter /> Filtrar por Estação:
            </span>
            <FormControl>
              <Select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                displayEmpty
                sx={selectStyle}
                MenuProps={{ disableScrollLock: true, style: { zIndex: 900 } }}
              >
                {uniqueStations.map((station) => (
                  <MenuItem key={station} value={station}>
                    {station}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="control-group">
            <span className="control-label">
              <FaFilter /> Filtrar por Usuário:
            </span>
            <FormControl>
              <Select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                displayEmpty
                sx={selectStyle}
                MenuProps={{ disableScrollLock: true, style: { zIndex: 900 } }}
              >
                {uniqueUsers.map((user) => (
                  <MenuItem key={user} value={user}>
                    {user}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {/* LISTA DE REGISTROS */}
      <div className="logs-list-container">
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#999" }}>
            Carregando histórico...
          </div>
        ) : sortedLogs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#999" }}>
            Nenhum registro encontrado.
          </div>
        ) : (
          sortedLogs.map((log) => (
            <div key={log.id} className="log-row">
              <div className="log-content">
                <Avatar
                  sx={{
                    bgcolor: "#001388",
                    width: 40,
                    height: 40,
                    fontSize: "1rem",
                  }}
                >
                  {log.avatarChar}
                </Avatar>
                <div className="log-text">
                  <span className="user-name">{log.user}</span>
                  {log.action}
                  <span className="target-name"> {log.target}</span>
                </div>
              </div>
              <div className="log-time">
                {timeSince((log as any).data_criacao)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChangeLog;
