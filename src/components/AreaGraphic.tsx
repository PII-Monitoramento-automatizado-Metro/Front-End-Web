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

type ChartData = {
  name: string; // Será "jan/24", "fev/25"...
  expectativa: number | null;
  real: number | null;
  fullDate: string; // Para tooltip detalhado
};

// --- LÓGICA DE GERAÇÃO DE DADOS ---
const generateRealData = (obra: ObraType): ChartData[] => {
  if (!obra.data_inicio) return [];

  // Normaliza datas
  const fixDate = (d: string) =>
    new Date(d.includes("T") ? d : d + "T00:00:00");

  const start = fixDate(obra.data_inicio);
  const now = new Date();
  const end = obra.data_final
    ? fixDate(obra.data_final)
    : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  if (isNaN(start.getTime())) return [];

  const data: ChartData[] = [];

  // Calcula duração total em meses
  const totalMonthsDuration =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const monthsToRender = Math.max(totalMonthsDuration + 2, 6);

  // Calcula progresso mensal
  const monthsPassedSinceStart =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  const currentProgress = obra.progresso_atual || 0;
  const progressPerMonth =
    monthsPassedSinceStart > 0 ? currentProgress / monthsPassedSinceStart : 0;

  let simulatedProgress = 0;

  for (let i = 0; i <= monthsToRender; i++) {
    const loopDate = new Date(start);
    loopDate.setMonth(start.getMonth() + i);

    // --- AQUI ESTÁ A MUDANÇA PARA "jan/26" ---
    // 1. Pega o mês curto (ex: "jan") e remove o ponto se houver (alguns browsers põem "jan.")
    const monthName = loopDate
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "");
    // 2. Pega os últimos 2 dígitos do ano (ex: "26")
    const yearShort = loopDate.getFullYear().toString().slice(-2);
    // 3. Monta a string
    const monthLabel = `${monthName}/${yearShort}`;

    let realVal: number | null = null;

    if (loopDate <= now) {
      if (i === 0) realVal = 0;
      else if (i === monthsPassedSinceStart) realVal = currentProgress;
      else realVal = Math.min(Math.round(simulatedProgress), currentProgress);

      simulatedProgress += progressPerMonth;
    }

    data.push({
      name: monthLabel,
      fullDate: loopDate.toLocaleDateString("pt-BR"),
      expectativa: null,
      real: realVal,
    });
  }

  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const itemReal = payload.find((p: any) => p.dataKey === "real");
    const fullDate = payload[0].payload.fullDate;

    return (
      <div className="custom-tooltip">
        <p className="tooltip-label" style={{ marginBottom: 5 }}>
          {label}
        </p>
        <p style={{ fontSize: "0.75rem", color: "#ccc", marginBottom: 10 }}>
          {fullDate}
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
      </div>
    );
  }
  return null;
};

export default function AreaGraphic() {
  const [obras, setObras] = useState<ObraType[]>([]);
  const [selectedObraId, setSelectedObraId] = useState<string>("");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const loadObras = async () => {
      try {
        const data = await listObrasRequest();
        setObras(data);
        if (data.length > 0) {
          setSelectedObraId(data[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar obras gráfico:", error);
      }
    };
    loadObras();
  }, []);

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

          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={selectedObraId}
              onChange={(e) => setSelectedObraId(e.target.value)}
              displayEmpty
              MenuProps={{
                disableScrollLock: true,
                style: { zIndex: 900 },
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
                  Nenhuma obra
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
            <span>Expectativa</span>
          </div>
        </div>
      </div>

      <div className="area-chart-wrapper">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
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
                // ADICIONE 'as any' NO FINAL DO OBJETO
                tick={
                  {
                    fill: "#888",
                    fontSize: 10,
                    angle: -45,
                    textAnchor: "end",
                  } as any
                }
                height={60}
                interval="preserveStartEnd"
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
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
                connectNulls
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
            Aguardando dados da obra...
          </div>
        )}
      </div>
    </div>
  );
}
