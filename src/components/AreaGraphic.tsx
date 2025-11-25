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
  name: string;
  expectativa: number | null;
  real: number | null;
  fullDate: string;
};

// Helper de data seguro
const parseDataSafe = (dataStr: string | undefined) => {
  if (!dataStr) return new Date();
  if (dataStr.includes("T") || dataStr.includes("-")) {
    const clean = dataStr.split("T")[0];
    const parts = clean.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  if (dataStr.includes("/")) {
    const parts = dataStr.split("/");
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }
  return new Date(dataStr);
};

const generateRealData = (obra: ObraType): ChartData[] => {
  if (!obra.data_inicio) return [];

  const start = parseDataSafe(obra.data_inicio);
  const now = new Date();
  now.setHours(0,0,0,0);

  // 1. Descobre a Data Limite Real (Hoje ou último registro futuro)
  let dataLimiteReal = now;
  if (obra.registros && obra.registros.length > 0) {
      obra.registros.forEach(reg => {
          const dataReg = parseDataSafe(reg.data);
          if (dataReg > dataLimiteReal) {
              dataLimiteReal = dataReg;
          }
      });
  }

  // 2. Define Fim Previsto
  const endPrevisao = obra.data_final ? parseDataSafe(obra.data_final) : new Date(new Date().setFullYear(now.getFullYear() + 1));
  
  // O eixo X vai até o mais distante (Previsão ou Real)
  const finalXAxis = endPrevisao > dataLimiteReal ? endPrevisao : dataLimiteReal;

  if (isNaN(start.getTime())) return [];

  const data: ChartData[] = [];

  // 3. Cálculos de Duração
  const totalDurationMonths = (finalXAxis.getFullYear() - start.getFullYear()) * 12 + (finalXAxis.getMonth() - start.getMonth());
  const monthsToRender = Math.max(totalDurationMonths + 2, 6); 

  const monthsPassedReal = (dataLimiteReal.getFullYear() - start.getFullYear()) * 12 + (dataLimiteReal.getMonth() - start.getMonth());
  
  // Garante no mínimo 1 mês de duração para evitar divisão por zero
  const diffMonthsProjected = (endPrevisao.getFullYear() - start.getFullYear()) * 12 + (endPrevisao.getMonth() - start.getMonth());
  const monthsDurationProjected = Math.max(diffMonthsProjected, 1);

  const currentProgress = obra.progresso_atual || 0;
  
  const progressPerMonthReal = monthsPassedReal > 0 ? currentProgress / monthsPassedReal : 0;
  const progressPerMonthIdeal = 100 / monthsDurationProjected; 

  let simulatedProgress = 0;

  // 4. Loop de Geração
  for (let i = 0; i <= monthsToRender; i++) {
      const loopDate = new Date(start);
      loopDate.setMonth(start.getMonth() + i);

      const monthName = loopDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
      const yearShort = loopDate.getFullYear().toString().slice(-2);
      const label = `${monthName}/${yearShort}`;

      let realVal: number | null = null;
      let idealVal: number | null = null;
      
      loopDate.setHours(0,0,0,0);

      // --- MUDANÇA AQUI: LINHA REAL CONTÍNUA ---
      
      if (loopDate <= dataLimiteReal) {
          // Se está no passado/presente (antes do último registro)
          if (i === 0) realVal = 0;
          else if (i >= monthsPassedReal) realVal = currentProgress;
          else realVal = Math.min(Math.round(simulatedProgress), currentProgress);
          
          simulatedProgress += progressPerMonthReal;
      } else {
          // Se está no futuro (depois do último registro),
          // MANTÉM O VALOR ATUAL (LINHA RETA) em vez de parar.
          realVal = currentProgress; 
      }

      // --- Linha Expectativa ---
      let calcIdeal = i * progressPerMonthIdeal;
      if (loopDate > endPrevisao) {
           calcIdeal = 100;
      }
      idealVal = Math.min(Math.round(calcIdeal), 100);

      data.push({
          name: label,
          expectativa: idealVal,
          real: realVal,
          fullDate: loopDate.toLocaleDateString('pt-BR')
      });
  }

  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const itemReal = payload.find((p: any) => p.dataKey === "real");
    const itemExpectativa = payload.find(
      (p: any) => p.dataKey === "expectativa"
    );
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
            Expectativa:{" "}
            <strong>
              {itemExpectativa?.value != null
                ? `${itemExpectativa.value}%`
                : "N/A"}
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
        if (data.length > 0) setSelectedObraId(data[0].id);
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
            <span>Expectativa</span>
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
                {/* Ajustei a opacidade da expectativa para ficar visível no fundo */}
                <linearGradient
                  id="colorExpectativa"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#9EA8E2" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#9EA8E2" stopOpacity={0.1} />
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

              {/* EXPECTATIVA (Fundo) - Agora aparece sempre */}
              <Area
                type="linear"
                dataKey="expectativa"
                stroke="#9EA8E2"
                fillOpacity={1}
                fill="url(#colorExpectativa)"
                strokeWidth={2}
                // strokeDasharray="5 5" // Removi o tracejado para ficar mais sólido e visível
                animationDuration={1500}
                activeDot={{ r: 4 }}
              />

              {/* REAL (Frente) */}
              <Area
                type="linear"
                dataKey="real"
                stroke="#001388"
                fillOpacity={1}
                fill="url(#colorReal)"
                strokeWidth={3}
                animationDuration={1500}
                connectNulls
                activeDot={{ r: 6 }}
                dot={{ r: 4, fill: "#001388", strokeWidth: 0 }}
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
