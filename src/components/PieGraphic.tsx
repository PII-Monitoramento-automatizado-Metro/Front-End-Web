import { useCallback, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import "./PieGraphic.css";

// --- 1. GERADOR DE CORES ALEATÓRIAS ---
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// --- BANCO DE DADOS FAKE DE ESTAÇÕES ---
const stationNames = [
  "Estação Luz",
  "Estação Consolação",
  "Estação Pinheiros",
  "Estação Sé",
  "Estação Paraíso",
  "Estação Trianon-Masp",
  "Estação Vila Madalena",
  "Estação Barra Funda",
  "Estação Tatuapé",
  "Estação Brás",
];

// --- FUNÇÃO QUE GERA DADOS ---
const generateDataForTab = (tab: string) => {
  // ABA GERAL (Resumo Macro)
  if (tab === "Geral") {
    return [
      { name: "Concluídas", value: 7, fill: "#001388" },
      { name: "Em progresso", value: 4, fill: "#9EA8E2" },
      { name: "Atrasadas", value: 3, fill: "#D6DCFF" },
    ];
  }

  // ABAS ESPECÍFICAS (Estações)
  const numberOfStations = Math.floor(Math.random() * 4) + 4; // Gera entre 4 e 8 estações
  const newChartData = [];

  for (let i = 0; i < numberOfStations; i++) {
    const randomName =
      stationNames[Math.floor(Math.random() * stationNames.length)];
    newChartData.push({
      name: randomName,
      value: Math.floor(Math.random() * 50) + 10, // Tamanho da fatia (Peso da obra)
      fill: getRandomColor(),
      // Geramos uma porcentagem específica para o status desta estação
      statusPercent: Math.floor(Math.random() * 90) + 5,
    });
  }
  return newChartData;
};

// REMOVIDO "Concluídas" DA LISTA
const tabs = ["Geral", "Em progresso", "Atrasadas"];

// --- RENDERIZAÇÃO VISUAL ---
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-5}
        textAnchor="middle"
        fill="#000000"
        fontWeight={600}
        fontSize={28}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text
        x={cx}
        y={cy}
        dy={20}
        textAnchor="middle"
        fill="#000000"
        fontSize={12}
        fontWeight={400}
      >
        {payload.name.length > 15
          ? payload.name.substring(0, 12) + "..."
          : payload.name}
      </text>
      <Sector
        className="sector-animada"
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cursor="pointer"
        style={{ filter: "url(#shadow)" }}
      />
    </g>
  );
};

export default function PieGraphic() {
  const [chartData, setChartData] = useState(generateDataForTab("Geral"));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Geral");

  const activeIndex =
    lockedIndex !== null
      ? lockedIndex
      : hoverIndex !== null
      ? hoverIndex
      : undefined;
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setChartData(generateDataForTab(tab));
    setLockedIndex(null);
    setHoverIndex(null);
  };

  return (
    <div
      className="summary-container-custom"
      onClick={() => setLockedIndex(null)}
    >
      <div className="summary-header">
        <h3>Sumário</h3>
        <span className="graphic-tag">Gráfico de obras</span>
      </div>

      <div className="tabs-container" onClick={(e) => e.stopPropagation()}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="chart-content-wrapper">
        {/* GRÁFICO */}
        <div
          className="chart-wrapper"
          style={{ width: "50%", height: 300, position: "relative" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter
                  id="shadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="6"
                    floodColor="#000000"
                    floodOpacity="0.3"
                  />
                </filter>
              </defs>

              <Pie
                // @ts-expect-error: Recharts typing
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={125}
                dataKey="value"
                paddingAngle={2}
                stroke="none"
                animationDuration={500}
                animationBegin={0}
                onMouseEnter={(_, index) => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={(_, index, e) => {
                  e.stopPropagation();
                  setLockedIndex((prev) => (prev === index ? null : index));
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    style={{ outline: "none", transition: "opacity 0.3s" }}
                    opacity={
                      activeIndex !== undefined && activeIndex !== index
                        ? 0.6
                        : 1
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LEGENDA COM LÓGICA CONDICIONAL */}
        <div className="chart-details">
          {chartData.map((item: any, index) => {
            // Lógica para aba GERAL
            if (activeTab === "Geral") {
              const percentOfTotal = ((item.value / total) * 100).toFixed(0);
              return (
                <div
                  key={index}
                  className={`legend-item ${
                    index === activeIndex ? "active" : ""
                  }`}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLockedIndex((prev) => (prev === index ? null : index));
                  }}
                >
                  <div
                    className="legend-color"
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <div className="legend-info">
                    <div className="legend-name-value">
                      <span className="legend-name">{item.name}</span>
                      <span className="legend-value">{item.value} Obras</span>
                    </div>
                    <span className="legend-percent-right">
                      {percentOfTotal}%
                    </span>
                  </div>
                </div>
              );
            }

            // LÓGICA PARA ABAS "EM PROGRESSO" E "ATRASADAS"
            // Definimos o texto base (Progresso ou Atraso)
            const labelText =
              activeTab === "Em progresso" ? "Progresso" : "Atraso";

            return (
              <div
                key={index}
                className={`legend-item ${
                  index === activeIndex ? "active" : ""
                }`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setLockedIndex((prev) => (prev === index ? null : index));
                }}
              >
                <div
                  className="legend-color"
                  style={{ backgroundColor: item.fill }}
                ></div>

                {/* Layout Vertical: Nome em cima, Porcentagem embaixo */}
                <div className="legend-info-vertical">
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-subtext">
                    {labelText}: {item.statusPercent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
