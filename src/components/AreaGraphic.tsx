import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Select, MenuItem, FormControl } from "@mui/material"; // Componentes do MUI
import "./AreaGraphic.css";

// --- DADOS POR ESTAÇÃO ---
// Define o tipo para evitar erros de TypeScript
type StationData = {
  name: string;
  expectativa: number;
  real: number | null;
};

const stationsData: Record<string, StationData[]> = {
  "Estação Consolação": [
    { name: "Jan", expectativa: 10, real: 12 },
    { name: "Fev", expectativa: 25, real: 22 },
    { name: "Mar", expectativa: 45, real: 40 },
    { name: "Abr", expectativa: 60, real: 55 },
    { name: "Mai", expectativa: 80, real: 78 },
    { name: "Jun", expectativa: 90, real: 92 },
    { name: "Jul", expectativa: 100, real: null },
  ],
  "Estação Luz": [
    { name: "Jan", expectativa: 15, real: 10 },
    { name: "Fev", expectativa: 30, real: 20 },
    { name: "Mar", expectativa: 50, real: 35 },
    { name: "Abr", expectativa: 70, real: 65 },
    { name: "Mai", expectativa: 85, real: 85 },
    { name: "Jun", expectativa: 95, real: 98 },
    { name: "Jul", expectativa: 100, real: null },
  ],
  "Estação Pinheiros": [
    { name: "Jan", expectativa: 20, real: 25 },
    { name: "Fev", expectativa: 40, real: 45 },
    { name: "Mar", expectativa: 60, real: 65 },
    { name: "Abr", expectativa: 80, real: 82 },
    { name: "Mai", expectativa: 90, real: 92 },
    { name: "Jun", expectativa: 95, real: 96 },
    { name: "Jul", expectativa: 100, real: null },
  ],
};

const stationNames = Object.keys(stationsData);

// --- TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const itemReal = payload.find((p: any) => p.dataKey === "real");
    const itemExpectativa = payload.find(
      (p: any) => p.dataKey === "expectativa"
    );

    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <div className="tooltip-item">
          <span className="dot" style={{ backgroundColor: "#0022ffff" }}></span>
          <span>
            Real:{" "}
            <strong>
              {itemReal?.value != null ? `${itemReal.value}%` : "N/A"}
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
  const [selectedStation, setSelectedStation] = useState("Estação Consolação");
  const currentData = stationsData[selectedStation];

  return (
    <div className="area-container-custom">
      <div className="area-header">
        <div className="header-left">
          <h3>Evolução da Obra</h3>

          {/* --- DROPDOWN DO MUI (CUSTOMIZADO) --- */}
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              displayEmpty
              // Estilização do Botão (Input)
              sx={{
                height: 40,
                borderRadius: "24px", // Borda redonda
                backgroundColor: "#fff",
                color: "#7f7f7f",
                border: "1px solid #c2c2c2",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow: "none",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#c2c2c2",
                  borderWidth: "1px",
                },

                // 2. Hover (Passar o mouse)
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#001388", // Azul
                },

                // 3. O SEGREDO: ESTADO FOCADO (Clicado)
                // Temos que mirar na classe .Mui-focused E NO FILHO .MuiOutlinedInput-notchedOutline
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#001388 !important", // Força a cor azul
                  borderWidth: "1px !important", // Força a espessura fina (o padrão do MUI é engrossar para 2px)
                },
                "& .MuiSvgIcon-root": {
                  color: "#808080ff",
                },
              }}
              // Estilização da Lista que abre (Menu)
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "12px",
                    marginTop: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)", // Sombra bonita
                    "& .MuiMenuItem-root": {
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      color: "#555",
                      padding: "10px 20px",
                      "&:hover": {
                        backgroundColor: "#f0f2ff", // Azulzinho claro no hover
                        color: "#001388",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#001388 !important", // Azul forte no selecionado
                        color: "#fff",
                      },
                    },
                  },
                },
              }}
            >
              {stationNames.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#001388" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#001388" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpectativa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9EA8E2" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9EA8E2" stopOpacity={0} />
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
              tick={{ fill: "#888", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#888", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#ccc", strokeDasharray: "5 5" }}
            />

            <Area
              type="monotone"
              dataKey="expectativa"
              stroke="#9EA8E2"
              fillOpacity={1}
              fill="url(#colorExpectativa)"
              strokeWidth={2}
              animationDuration={1000}
            />

            <Area
              type="monotone"
              dataKey="real"
              stroke="#001388"
              fillOpacity={1}
              fill="url(#colorReal)"
              strokeWidth={3}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
