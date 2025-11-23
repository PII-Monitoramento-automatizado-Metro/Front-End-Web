import { useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { listObrasRequest } from "../services/httpsRequests"; // Importe sua requisição
import type { ObraType } from "../types/Obra"; // Importe a tipagem
import "./PieGraphic.css";

// --- TIPAGEM DO DADO DO GRÁFICO ---
type ChartDataPoint = {
  name: string;
  value: number;
  fill: string;
  statusPercent?: number;
};

// --- GERADOR DE CORES ALEATÓRIAS ---
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

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
  const [obras, setObras] = useState<ObraType[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeTab, setActiveTab] = useState("Geral");

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);

  const activeIndex =
    lockedIndex !== null
      ? lockedIndex
      : hoverIndex !== null
      ? hoverIndex
      : undefined;

  // Total soma os valores (value) de todos os itens
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // 1. Buscar dados do banco
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const dados = await listObrasRequest();
        setObras(dados);
      } catch (error) {
        console.error("Erro ao buscar obras para o gráfico:", error);
      }
    };
    fetchObras();
  }, []);

  // 2. Processar dados
  useEffect(() => {
    if (obras.length === 0) return;

    const hoje = new Date();

    const parseData = (dataStr: string) => {
      if (!dataStr) return new Date(8640000000000000);
      if (dataStr.includes("/")) {
        const parts = dataStr.split("/");
        return new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0])
        );
      }
      return new Date(dataStr);
    };

    const concluidas = obras.filter((o) => o.progresso_atual >= 100);
    const atrasadas = obras.filter((o) => {
      const dataPrazo = parseData(o.data_final);
      return o.progresso_atual < 100 && dataPrazo < hoje;
    });
    const emProgresso = obras.filter((o) => {
      const dataPrazo = parseData(o.data_final);
      return o.progresso_atual < 100 && dataPrazo >= hoje;
    });

    let dataTemp: ChartDataPoint[] = [];

    if (activeTab === "Geral") {
      // Aba Geral: Value = Quantidade de obras (Contagem)
      dataTemp = [
        { name: "Concluídas", value: concluidas.length, fill: "#001388" },
        { name: "Em progresso", value: emProgresso.length, fill: "#9EA8E2" },
        { name: "Atrasadas", value: atrasadas.length, fill: "#D6DCFF" },
      ];
      dataTemp = dataTemp.filter((d) => d.value > 0);
    } else if (activeTab === "Em progresso") {
      // Aba Em Progresso: Value = Porcentagem de Progresso (Peso visual)
      dataTemp = emProgresso.map((o) => ({
        name: o.nome,
        // Se for 0, colocamos 1 para aparecer uma fatia mínima clicável, senão usa o progresso real
        value: o.progresso_atual > 0 ? o.progresso_atual : 1,
        fill: getRandomColor(),
        statusPercent: o.progresso_atual,
      }));
    } else if (activeTab === "Atrasadas") {
      // Aba Atrasadas: Value = Porcentagem de Progresso
      dataTemp = atrasadas.map((o) => ({
        name: o.nome,
        value: o.progresso_atual > 0 ? o.progresso_atual : 1,
        fill: getRandomColor(),
        statusPercent: o.progresso_atual,
      }));
    } else if (activeTab === "Concluídas") {
      // Aba Concluídas: Todas são 100%, então fatias iguais
      dataTemp = concluidas.map((o) => ({
        name: o.nome,
        value: 100,
        fill: "#001388",
        statusPercent: 100,
      }));
    }

    setChartData(dataTemp);
    setLockedIndex(null);
  }, [activeTab, obras]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
        <div
          className="chart-wrapper"
          style={{ width: "50%", height: 300, position: "relative" }}
        >
          {chartData.length > 0 ? (
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
                  // @ts-expect-error: Bug de tipagem do Recharts
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
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#999",
              }}
            >
              Sem dados nesta categoria
            </div>
          )}
        </div>

        <div className="chart-details">
          {chartData.map((item, index) => {
            let subText = "";
            let valueText = "";

            if (activeTab === "Geral") {
              // Aba Geral: Calcula a % com base na quantidade total de obras
              const percentOfTotal =
                total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
              valueText = `${item.value} Obras`;
              subText = `${percentOfTotal}%`;
            } else {
              // Abas Específicas: O value aqui JÁ É o progresso (peso da fatia)
              // Então mostramos o statusPercent direto
              valueText = "Progresso:";
              subText = `${item.statusPercent}%`;
            }

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

                {activeTab === "Geral" ? (
                  <div className="legend-info">
                    <div className="legend-name-value">
                      <span className="legend-name">{item.name}</span>
                      <span className="legend-value">{valueText}</span>
                    </div>
                    <span className="legend-percent-right">{subText}</span>
                  </div>
                ) : (
                  <div className="legend-info-vertical">
                    <span className="legend-name">{item.name}</span>
                    <span className="legend-subtext">
                      {valueText} <strong>{subText}</strong>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
