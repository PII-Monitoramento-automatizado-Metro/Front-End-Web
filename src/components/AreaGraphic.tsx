import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Select, MenuItem, FormControl } from "@mui/material";
import { listObrasRequest } from "../services/httpsRequests";
import type { ObraType } from "../types/Obra";
import "./AreaGraphic.css";

// Tipo do dado do gráfico
type ChartData = {
  name: string; // Rótulo (ex: "jan/24")
  expectativa: number | null; // Nulo por enquanto (Reservado para IA)
  real: number | null; // Calculado linearmente (Histórico)
  fullDate: string; // Data completa para o tooltip
};

// --- FUNÇÃO PARA GERAR DADOS REAIS (SIMULAÇÃO LINEAR) ---
const generateRealData = (obra: ObraType): ChartData[] => {
  if (!obra.data_inicio) return [];

  // 1. Normalizar Datas (Garante formato correto e evita bugs de fuso)
  const fixDate = (d: string) =>
    new Date(d.includes("T") ? d : d + "T00:00:00");

  const start = fixDate(obra.data_inicio);
  const now = new Date();

  // Se não tiver data final, projeta 1 ano para frente a partir de hoje
  const end = obra.data_final
    ? fixDate(obra.data_final)
    : new Date(new Date().setFullYear(now.getFullYear() + 1));

  if (isNaN(start.getTime())) return [];

  const data: ChartData[] = [];

  // 2. Calcular duração total em meses para desenhar o eixo X completo
  const totalDurationMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  // Garante pelo menos 6 meses de gráfico para visualização
  const monthsToRender = Math.max(totalDurationMonths + 2, 6);

  // 3. Calcular ritmo de progresso (Média por mês do início até HOJE)
  const monthsPassedSinceStart =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  const currentProgress = obra.progresso_atual || 0;

  // Incremento médio por mês
  const progressPerMonth =
    monthsPassedSinceStart > 0 ? currentProgress / monthsPassedSinceStart : 0;

  let simulatedProgress = 0;

  // 4. Loop para gerar cada ponto do gráfico
  for (let i = 0; i <= monthsToRender; i++) {
    // Cria a data do mês atual do loop
    const loopDate = new Date(start);
    loopDate.setMonth(start.getMonth() + i);

    // Formata rótulo: "jan/24"
    // .replace('.', '') remove ponto abreviado que alguns navegadores colocam
    const monthName = loopDate
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "");
    const yearShort = loopDate.getFullYear().toString().slice(-2);
    const label = `${monthName}/${yearShort}`;

    let realVal: number | null = null;

    // Lógica de preenchimento da linha "Real":
    // Só preenche se a data do loop for anterior ou igual ao mês atual
    const isPastOrPresent =
      loopDate < now ||
      (loopDate.getMonth() === now.getMonth() &&
        loopDate.getFullYear() === now.getFullYear());

    if (isPastOrPresent) {
      if (i === 0) {
        realVal = 0; // Começa sempre em 0
      } else if (i >= monthsPassedSinceStart) {
        realVal = currentProgress; // No mês atual, usa o valor exato do banco
      } else {
        // Nos meses entre o início e hoje, cria a rampa linear
        realVal = Math.min(Math.round(simulatedProgress), currentProgress);
      }
      simulatedProgress += progressPerMonth;
    }

    data.push({
      name: label,
      expectativa: null, // Futuro (IA)
      real: realVal,
      fullDate: loopDate.toLocaleDateString("pt-BR"),
    });
  }

  return data;
};

// --- TOOLTIP CUSTOMIZADO (Mostra data completa) ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const itemReal = payload.find((p: any) => p.dataKey === "real");
    const dateInfo = payload[0]?.payload?.fullDate || label;

    return (
      <div className="custom-tooltip">
        <p className="tooltip-label" style={{ marginBottom: 5 }}>
          {dateInfo}
        </p>
        <div className="tooltip-item">
          <span className="dot" style={{ backgroundColor: "#001388" }}></span>
          <span>
            Real:{" "}
            <strong>
              {itemReal?.value != null ? `${itemReal.value}%` : "Futuro"}
            </strong>
          </span>
        </div>
        <div className="tooltip-item">
          <span className="dot" style={{ backgroundColor: "#9EA8E2" }}></span>
          <span>
            Expectativa: <strong>IA (Em breve)</strong>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function AreaGraphic() {
  const [obras, setObras] = useState<ObraType[]>([]);
  const [selectedObraId, setSelectedObraId] = useState<string>("");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // 1. Carrega todas as obras do banco ao iniciar
  useEffect(() => {
    const loadObras = async () => {
      try {
        const data = await listObrasRequest();
        setObras(data);
        if (data.length > 0) {
          // Seleciona a primeira obra automaticamente
          setSelectedObraId(data[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar obras gráfico:", error);
      }
    };
    loadObras();
  }, []);

  // 2. Recalcula o gráfico sempre que mudar a obra selecionada
  useEffect(() => {
    const obra = obras.find((o) => o.id === selectedObraId);
    if (obra) {
      const data = generateRealData(obra);
      setChartData(data);
    }
  }, [selectedObraId, obras]);

  return (
    <div className="area-container-custom">
      <div className="area-header">
        <div className="header-left">
          <h3>Evolução da Obra</h3>

          {/* Dropdown para selecionar a obra */}
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={selectedObraId}
              onChange={(e) => setSelectedObraId(e.target.value)}
              displayEmpty
              MenuProps={{
                disableScrollLock: true, // Impede que a página trave o scroll
                style: { zIndex: 900 }, // Fica abaixo da Navbar fixa
                PaperProps: {
                  sx: {
                    borderRadius: "12px",
                    marginTop: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  },
                },
              }}
              sx={{
                height: 40,
                borderRadius: "24px",
                backgroundColor: "#fff",
                color: "#555",
                border: "1px solid #c2c2c2",
                fontSize: "14px",
                fontWeight: 500,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#c2c2c2",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#001388",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#001388 !important",
                },
              }}
            >
              {obras.length === 0 ? (
                <MenuItem disabled value="">
                  Nenhuma obra cadastrada
                </MenuItem>
              ) : (
                obras.map((obra) => (
                  <MenuItem key={obra.id} value={obra.id}>
                    {obra.nome}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </div>

        <div className="area-legend-top">
          <div className="legend-item-top">
            <span className="dot" style={{ backgroundColor: "#001388" }}></span>
            <span>Real</span>
          </div>
          <div className="legend-item-top">
            <span className="dot" style={{ backgroundColor: "#9EA8E2" }}></span>
            <span>Expectativa (IA)</span>
          </div>
        </div>
      </div>

      <div className="area-chart-wrapper">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#001388" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#001388" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                // Correção do TS (as any) e rotação para caber anos
                tick={
                  {
                    fill: "#888",
                    fontSize: 10,
                    angle: -45,
                    textAnchor: "end",
                  } as any
                }
                height={60} // Altura extra para o texto inclinado
                interval="preserveStartEnd"
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]} // Eixo Y fixo de 0 a 100%
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#ccc", strokeDasharray: "5 5" }}
              />

              <Area
                type="monotone"
                dataKey="real"
                stroke="#001388"
                fillOpacity={1}
                fill="url(#colorReal)"
                strokeWidth={3}
                animationDuration={1500}
                connectNulls // Conecta os pontos se houver falha
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
            }}
          >
            {obras.length === 0
              ? "Cadastre uma obra para ver o gráfico."
              : "Carregando dados..."}
          </div>
        )}
      </div>
    </div>
  );
}
