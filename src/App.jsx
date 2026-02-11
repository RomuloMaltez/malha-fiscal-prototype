import { useState, useEffect, useCallback, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area, ComposedChart } from "recharts";
import { Search, Filter, Download, ChevronRight, ChevronLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Eye, BarChart3, Target, Users, FileText, ArrowUpRight, ArrowDownRight, Zap, Shield, Activity, Layers, Clock, Building2, CreditCard, FileCheck, AlertOctagon, ChevronDown, X, Home, LayoutGrid, GitMerge, Flag, Menu } from "lucide-react";

// ============================================================
// MOCK DATA GENERATOR
// ============================================================
const CNAES = [
  { code: "6201-5/01", desc: "Desenvolvimento de software", tipo: "servico", aliq: 0.05 },
  { code: "6311-9/00", desc: "Tratamento de dados e hosting", tipo: "servico", aliq: 0.05 },
  { code: "8630-5/01", desc: "Atividade médica ambulatorial", tipo: "servico", aliq: 0.03 },
  { code: "8640-2/01", desc: "Laboratórios de análises clínicas", tipo: "servico", aliq: 0.03 },
  { code: "7112-0/00", desc: "Engenharia e construção civil", tipo: "servico", aliq: 0.03 },
  { code: "8610-1/01", desc: "Atividades hospitalares", tipo: "servico", aliq: 0.03 },
  { code: "4520-0/01", desc: "Oficinas mecânicas (serv/com)", tipo: "misto", aliq: 0.05 },
  { code: "4751-2/01", desc: "Assist. técnica informática (serv/com)", tipo: "misto", aliq: 0.05 },
  { code: "6550-2/00", desc: "Planos de saúde e congêneres", tipo: "servico", aliq: 0.05 },
  { code: "8550-3/02", desc: "Atividades de ensino", tipo: "servico", aliq: 0.03 },
  { code: "6422-1/00", desc: "Serviços bancários e financeiros", tipo: "servico", aliq: 0.05 },
  { code: "6190-6/01", desc: "Provedores de internet", tipo: "servico", aliq: 0.05 },
  { code: "8011-1/01", desc: "Vigilância e segurança privada", tipo: "servico", aliq: 0.05 },
  { code: "4399-1/01", desc: "Administração de obras", tipo: "servico", aliq: 0.03 },
  { code: "8121-4/00", desc: "Limpeza e conservação predial", tipo: "servico", aliq: 0.05 },
  { code: "5510-8/01", desc: "Hotéis", tipo: "servico", aliq: 0.03 },
];

// Cada empresa com índice do CNAE correspondente
const EMPRESAS = [
  { razao: "TECH SOLUTIONS PORTO VELHO LTDA", cnaeIdx: 0 },        // Desenvolvimento de software
  { razao: "NORTE DIGITAL SERVICOS DE TI", cnaeIdx: 1 },           // Tratamento de dados e hosting
  { razao: "CLINICA SAO LUCAS LTDA", cnaeIdx: 2 },                 // Atividade médica ambulatorial
  { razao: "LABORATORIO AMAZONIA ANALISES CLINICAS", cnaeIdx: 3 },  // Laboratórios de análises clínicas
  { razao: "ARQPLAN PROJETOS E CONSTRUCOES", cnaeIdx: 4 },          // Engenharia e construção civil
  { razao: "HOSPITAL PORTO VELHO SAUDE LTDA", cnaeIdx: 5 },         // Atividades hospitalares
  { razao: "AUTO CENTER MADEIRA MARMORE LTDA", cnaeIdx: 6 },        // Oficinas mecânicas (misto)
  { razao: "INFOTECH COMERCIO E SERVICOS", cnaeIdx: 7 },            // Assist. técnica informática (misto)
  { razao: "UNIMED NORTE COOPERATIVA MEDICA", cnaeIdx: 8 },         // Planos de saúde
  { razao: "COLEGIO NOVA GERACAO LTDA", cnaeIdx: 9 },               // Atividades de ensino
  { razao: "BANCO DO NORTE S.A.", cnaeIdx: 10 },                    // Serviços bancários e financeiros
  { razao: "VELOX INTERNET FIBRA OTICA", cnaeIdx: 11 },             // Provedores de internet
  { razao: "SEGURANCA PATRIMONIAL NORTE LTDA", cnaeIdx: 12 },       // Vigilância e segurança privada
  { razao: "CONSTRUTORA GUAPORE LTDA", cnaeIdx: 4 },                // Engenharia e construção civil
  { razao: "LIMPEZA URBAN SERVICOS GERAIS", cnaeIdx: 14 },          // Limpeza e conservação predial
  { razao: "AMAZON WEB CONSULTORIA LTDA", cnaeIdx: 0 },             // Desenvolvimento de software
  { razao: "HOTEL PALACE LTDA", cnaeIdx: 15 },                // Hotéis
  { razao: "CLINICA ODONTO EXCELLENCE LTDA", cnaeIdx: 2 },          // Atividade médica ambulatorial
  { razao: "ACADEMIA FITNESS CENTER LTDA", cnaeIdx: 14 },           // Limpeza → serviços pessoais
  { razao: "ADVOCACIA SILVA E ASSOCIADOS", cnaeIdx: 1 },            // Tratamento de dados → serviços prof.
  { razao: "ENGENHARIA MADEIRA MAMORE LTDA", cnaeIdx: 4 },          // Engenharia e construção civil
  { razao: "CLINICA VETERINARIA PET LIFE", cnaeIdx: 2 },            // Atividade médica (veterinária ~ saúde)
  { razao: "SEGURANCA SENTINELA LTDA", cnaeIdx: 12 },               // Vigilância e segurança privada
  { razao: "LIMPA MAIS CONSERVACAO PREDIAL", cnaeIdx: 14 },         // Limpeza e conservação predial
  { razao: "ESCRITORIO CONTABIL RONDONIA", cnaeIdx: 1 },            // Tratamento de dados
  { razao: "CONSTRUTORA DELTA ENGENHARIA", cnaeIdx: 13 },           // Administração de obras
  { razao: "GRAFICA EXPRESSA PORTO VELHO", cnaeIdx: 0 },            // Software/serviços gráficos
  { razao: "LABORATORIO BIOCLIN DIAGNOSTICOS", cnaeIdx: 3 },        // Laboratórios de análises clínicas
  { razao: "IMOBILIARIA CAPITAL DO OESTE", cnaeIdx: 1 },            // Serviços de intermediação
  { razao: "CENTRO DIAGNOSTICO IMAGEM LTDA", cnaeIdx: 3 },          // Laboratórios/diagnóstico
  { razao: "AUTOESCOLA PRIMAVERA LTDA", cnaeIdx: 9 },               // Atividades de ensino
  { razao: "LOCADORA VEICULOS RONDONIA", cnaeIdx: 6 },              // Oficinas/locação (misto)
  { razao: "TELECOMUNICACOES NORTE LTDA", cnaeIdx: 11 },            // Provedores de internet
  { razao: "AGENCIA PUBLICIDADE CRIATIVA", cnaeIdx: 0 },            // Software/publicidade
  { razao: "SERVICOS AMBIENTAIS AMAZONIA", cnaeIdx: 14 },           // Limpeza e conservação
  { razao: "CARTORIO 1 OFICIO PORTO VELHO", cnaeIdx: 1 },          // Serviços de registro
  { razao: "COOPERATIVA MEDICA UNISAUDE", cnaeIdx: 8 },             // Planos de saúde
  { razao: "PROVEDOR NET AMAZONIA LTDA", cnaeIdx: 11 },             // Provedores de internet
  { razao: "ESCOLA DE IDIOMAS GLOBAL LTDA", cnaeIdx: 9 },           // Atividades de ensino
  { razao: "ESCRITORIO ENGENHARIA DELTA", cnaeIdx: 4 },             // Engenharia e construção civil
  { razao: "CLINICA DERMATOLOGICA PELE SANA", cnaeIdx: 2 },         // Atividade médica ambulatorial
  { razao: "HOSPITAL SANTA CASA LTDA", cnaeIdx: 5 },                // Atividades hospitalares
  { razao: "LAVANDERIA INDUSTRIAL LIMPAX", cnaeIdx: 14 },           // Limpeza e conservação
  { razao: "ASSESSORIA EMPRESARIAL FOCUS", cnaeIdx: 1 },            // Tratamento de dados/consultoria
  { razao: "BANCO AMAZONIA INVESTIMENTOS S.A.", cnaeIdx: 10 },      // Serviços bancários
  { razao: "PLANO SAUDE NORTE LTDA", cnaeIdx: 8 },                  // Planos de saúde
  { razao: "PROVEDOR FIBRA MAX LTDA", cnaeIdx: 11 },                // Provedores de internet
  { razao: "CONSTRUTORA JAMARI LTDA", cnaeIdx: 13 },                // Administração de obras
  { razao: "VIGILANCIA RONDONIA LTDA", cnaeIdx: 12 },               // Vigilância e segurança privada
  { razao: "CLINICA OFTALMOLOGICA VISAO LTDA", cnaeIdx: 2 },        // Atividade médica ambulatorial
];

function generateCNPJ(i) {
  const base = String(10000000 + i * 7331).padStart(8, "0");
  return `${base.slice(0,2)}.${base.slice(2,5)}.${base.slice(5,8)}/0001-${String(10+i%89).padStart(2,"0")}`;
}

function generateMockData() {
  // Calibração: R$850M total cartão, divergência média ~45%
  // Distribuição: poucos grandes (bancos, telecom, energia) + muitos médios/pequenos
  const FAIXAS = [
    { min: 80000000, max: 200000000, count: 4 },
    { min: 20000000, max: 79000000, count: 8 },
    { min: 5000000, max: 19000000, count: 12 },
    { min: 1000000, max: 4900000, count: 14 },
    { min: 200000, max: 999000, count: 12 },
  ];

  return EMPRESAS.map((emp, i) => {
    const cnae = CNAES[emp.cnaeIdx];
    const razao = emp.razao;
    const regime = i % 3 === 0 ? "Normal" : "Simples";

    let faixa;
    let cumCount = 0;
    for (const f of FAIXAS) {
      cumCount += f.count;
      if (i < cumCount) { faixa = f; break; }
    }
    if (!faixa) faixa = FAIXAS[FAIXAS.length - 1];

    const baseCartao = Math.round(faixa.min + Math.random() * (faixa.max - faixa.min));
    const omissaoFator = 0.15 + Math.random() * 0.70;
    
    // Overrides fixos para top 10 divergentes (divB = cartão - nfse)
    const TOP_OVERRIDES = {
      0: { cartao: 28000000, nfse: 14000000 },   // TECH SOLUTIONS: divB = 14M
      10: { cartao: 45000000, nfse: 33500000 },   // BANCO DO NORTE: divB = 11.5M
      11: { cartao: 32000000, nfse: 22200000 },   // VELOX INTERNET: divB = 9.8M
      12: { cartao: 48000000, nfse: 39500000 },   // SEGURANCA PATRIMONIAL: divB = 8.5M
      1: { cartao: 22000000, nfse: 14800000 },    // NORTE DIGITAL: divB = 7.2M
      13: { cartao: 38000000, nfse: 31500000 },   // CONSTRUTORA GUAPORE: divB = 6.5M
      2: { cartao: 18000000, nfse: 12200000 },    // CLINICA SAO LUCAS: divB = 5.8M
      3: { cartao: 15000000, nfse: 9900000 },     // LABORATORIO AMAZONIA: divB = 5.1M
      8: { cartao: 35000000, nfse: 30500000 },    // UNIMED NORTE: divB = 4.5M
      9: { cartao: 16000000, nfse: 12100000 },    // COLEGIO NOVA GERACAO: divB = 3.9M
    };
    
    const override = TOP_OVERRIDES[i];
    const finalCartao = override ? override.cartao : baseCartao;
    const nfse = override ? override.nfse : (i % 8 === 0 ? 0 : Math.round(baseCartao * omissaoFator));
    const pgdas = regime === "Simples" ? Math.round(finalCartao * (omissaoFator + (Math.random() * 0.25 - 0.10))) : 0;

    const divA = regime === "Simples" && pgdas > 0 ? finalCartao - pgdas : null;
    const divB = finalCartao - nfse;
    const divC = regime === "Simples" && pgdas > 0 ? pgdas - nfse : null;
    const vals = [finalCartao, nfse, ...(pgdas > 0 ? [pgdas] : [])].filter(v => v > 0);
    const divD = vals.length > 1 ? Math.max(...vals) - Math.min(...vals) : 0;
    const divE = regime === "Normal" ? finalCartao - nfse : null;

    const pctA = divA !== null && finalCartao > 0 ? (divA / finalCartao) * 100 : null;
    const pctB = finalCartao > 0 ? (divB / finalCartao) * 100 : 0;
    const pctC = divC !== null && pgdas > 0 ? (divC / pgdas) * 100 : null;
    const pctD = vals.length > 1 ? (divD / Math.max(...vals)) * 100 : 0;
    const pctE = divE !== null && finalCartao > 0 ? (divE / finalCartao) * 100 : null;

    let score;
    if (regime === "Normal") {
      score = Math.min(100, Math.max(0, pctE !== null ? pctE * 0.7 + pctD * 0.3 : pctD));
    } else {
      if (pgdas === 0) {
        score = Math.min(100, Math.max(0, pctB * 0.7 + pctD * 0.3));
      } else {
        score = Math.min(100, Math.max(0, (pctA || 0) * 0.3 + pctB * 0.4 + (pctC || 0) * 0.2 + pctD * 0.1));
      }
    }
    if (cnae.tipo === "misto") score = Math.min(100, score + 10);

    const issP = divB > 0 ? divB * cnae.aliq : 0;

    let classificacao;
    if (nfse === 0 && finalCartao > 0) classificacao = "OMISSÃO_TOTAL";
    else if (pctB > 50) classificacao = "OMISSÃO_PARCIAL";
    else if (pctB > 20) classificacao = "DIVERGÊNCIA_MÉDIA";
    else if (pctB > 0) classificacao = "DIVERGÊNCIA_LEVE";
    else classificacao = "REGULAR";

    let prioridade;
    if (score > 70) prioridade = "CRÍTICA";
    else if (score > 50) prioridade = "ALTA";
    else if (score > 30) prioridade = "MÉDIA";
    else if (score > 10) prioridade = "BAIXA";
    else prioridade = "MÍNIMA";

    const cartao2023 = Math.round(finalCartao * (0.8 + Math.random() * 0.3));
    const nfse2023 = Math.round(nfse * (0.75 + Math.random() * 0.4));

    return {
      id: i,
      cnpj: generateCNPJ(i),
      razao,
      cnae: cnae.code,
      cnaeDesc: cnae.desc,
      tipo: cnae.tipo,
      aliq: cnae.aliq,
      regime,
      cartao: finalCartao,
      nfse,
      pgdas,
      divA, divB, divC, divD, divE,
      pctA, pctB, pctC, pctD, pctE,
      score: Math.round(score * 10) / 10,
      issP: Math.round(issP),
      classificacao,
      prioridade,
      cartao2023,
      nfse2023,
      pgdas2023: regime === "Simples" ? Math.round(pgdas * (0.8 + Math.random() * 0.3)) : 0,
    };
  });
}

const MOCK = generateMockData();

// ============================================================
// UTILITIES
// ============================================================
function fmt(v) {
  if (v == null) return "—";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function fmtPct(v) {
  if (v == null) return "—";
  return `${v.toFixed(1)}%`;
}
function fmtNum(v) {
  if (v == null) return "—";
  return v.toLocaleString("pt-BR");
}

const COLORS = {
  bg: "#0a0f1a",
  surface: "#111827",
  surfaceHover: "#1a2235",
  border: "#1e293b",
  borderLight: "#2d3a4f",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  accent: "#3b82f6",
  accentLight: "#60a5fa",
  danger: "#ef4444",
  dangerMuted: "#dc2626",
  warning: "#f59e0b",
  warningMuted: "#d97706",
  success: "#10b981",
  successMuted: "#059669",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  orange: "#f97316",
  pink: "#ec4899",
};

const PRIORIDADE_COLOR = {
  "CRÍTICA": COLORS.danger,
  "ALTA": COLORS.orange,
  "MÉDIA": COLORS.warning,
  "BAIXA": COLORS.accent,
  "MÍNIMA": COLORS.success,
};

const CLASS_COLOR = {
  "OMISSÃO_TOTAL": COLORS.danger,
  "OMISSÃO_PARCIAL": COLORS.orange,
  "DIVERGÊNCIA_MÉDIA": COLORS.warning,
  "DIVERGÊNCIA_LEVE": COLORS.accent,
  "REGULAR": COLORS.success,
};

// ============================================================
// ANIMATED COUNTER
// ============================================================
function AnimatedCounter({ value, prefix = "", suffix = "", duration = 1500 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = typeof value === "number" ? value : 0;
    if (end === 0) { setDisplay(0); return; }
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  
  const formatDisplay = (v) => {
    if (prefix === "R$ ") {
      if (v >= 1000000000) return `${(v / 1000000000).toFixed(2).replace('.', ',')} bi`;
      if (v >= 1000000) return `${(v / 1000000).toFixed(1).replace('.', ',')} mi`;
      if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
      return v.toLocaleString("pt-BR");
    }
    return v.toLocaleString("pt-BR");
  };
  
  return <span>{prefix}{formatDisplay(Math.round(display))}{suffix}</span>;
}

// ============================================================
// COMPONENTS
// ============================================================

function NavItem({ icon: Icon, label, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "12px 14px" : "12px 16px",
        borderRadius: 10, border: "none", cursor: "pointer", width: "100%",
        background: active ? "linear-gradient(135deg, #3b82f620, #3b82f610)" : "transparent",
        color: active ? COLORS.accentLight : COLORS.textMuted,
        borderLeft: active ? `3px solid ${COLORS.accent}` : "3px solid transparent",
        transition: "all 0.2s ease", fontSize: 13, fontWeight: active ? 600 : 400,
        fontFamily: "'DM Sans', sans-serif", justifyContent: collapsed ? "center" : "flex-start",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = COLORS.surfaceHover; e.currentTarget.style.color = COLORS.text; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textMuted; }}}
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

function KPICard({ icon: Icon, label, value, prefix, suffix, trend, trendValue, color, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background: `linear-gradient(145deg, ${COLORS.surface}, ${COLORS.bg})`,
      border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "24px 20px",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle at top right, ${color}10, transparent)`, borderRadius: "0 16px 0 0" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 8 }}>
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: trend === "up" ? COLORS.success : COLORS.danger }}>
          {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600,
      background: `${color}20`, color, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em",
      textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function CardSection({ title, children, style: extraStyle }) {
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
      padding: 24, ...extraStyle,
    }}>
      {title && <h3 style={{ margin: "0 0 20px 0", fontSize: 15, fontWeight: 600, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>{title}</h3>}
      {children}
    </div>
  );
}

// ============================================================
// PAGES
// ============================================================

function DashboardPage({ data, onSelectContribuinte }) {
  const totalDiv = data.reduce((s, d) => s + Math.max(0, d.divB), 0);
  const totalISS = data.reduce((s, d) => s + d.issP, 0);
  const totalEmpresas = 5000; // universo real analisado
  const criticas = 20; // empresas em prioridade crítica

  const byPrioridade = ["CRÍTICA", "ALTA", "MÉDIA", "BAIXA", "MÍNIMA"].map(p => ({
    name: p, value: p === "CRÍTICA" ? 20 : p === "ALTA" ? 85 : p === "MÉDIA" ? 340 : p === "BAIXA" ? 1200 : 3355, fill: PRIORIDADE_COLOR[p],
  }));

  const byClassificacao = Object.keys(CLASS_COLOR).map(c => ({
    name: c.replace("_", " "), value: c === "OMISSÃO_TOTAL" ? 45 : c === "OMISSÃO_PARCIAL" ? 180 : c === "DIVERGÊNCIA_MÉDIA" ? 620 : c === "DIVERGÊNCIA_LEVE" ? 1400 : 2755, fill: CLASS_COLOR[c],
  }));

  const byRegime = [
    { name: "Simples Nacional", value: 3800, fill: COLORS.accent },
    { name: "Regime Normal", value: 1200, fill: COLORS.purple },
  ];

  const topDivergentes = [...data].sort((a, b) => b.divB - a.divB).slice(0, 10);

  const scoreDistribution = [
    { faixa: "0-20", count: 2800 },
    { faixa: "21-40", count: 1100 },
    { faixa: "41-60", count: 650 },
    { faixa: "61-80", count: 350 },
    { faixa: "81-100", count: 100 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>Dashboard Executivo</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Visão consolidada da Malha Fiscal ISSQN — Exercício 2024</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <KPICard icon={Building2} label="Empresas Analisadas" value={totalEmpresas} color={COLORS.accent} delay={0} />
        <KPICard icon={AlertTriangle} label="Divergências Totais" value={totalDiv} prefix="R$ " color={COLORS.danger} delay={100} trend="up" trendValue="+23% vs 2023" />
        <KPICard icon={TrendingUp} label="ISS Potencial" value={totalISS} prefix="R$ " color={COLORS.success} delay={200} trend="up" trendValue="Recuperável" />
        <KPICard icon={AlertOctagon} label="Prioridade Crítica" value={criticas} color={COLORS.danger} delay={300} suffix=" empresas" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
        <CardSection title="Distribuição por Prioridade">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byPrioridade} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {byPrioridade.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardSection>

        <CardSection title="Classificação de Divergências">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byClassificacao} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 9 }} width={100} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {byClassificacao.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardSection>

        <CardSection title="Score de Risco — Distribuição">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="faixa" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} />
              <Bar dataKey="count" fill={COLORS.accent} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardSection>
      </div>

      <CardSection title="Top 10 — Maiores Divergências (Cartão × NFS-e)">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr>
                {["Razão Social", "CNPJ", "Regime", "Cartão", "NFS-e", "Divergência", "Score", "Prioridade", ""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 12px", textAlign: i > 2 ? "right" : "left", color: COLORS.textMuted, fontWeight: 500, borderBottom: `1px solid ${COLORS.border}`, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topDivergentes.map((d, i) => (
                <tr key={d.id} style={{ transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 12px", color: COLORS.text, fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.razao}</td>
                  <td style={{ padding: "10px 12px", color: COLORS.textMuted, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{d.cnpj}</td>
                  <td style={{ padding: "10px 12px" }}><Badge label={d.regime} color={d.regime === "Normal" ? COLORS.purple : COLORS.accent} /></td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.text }}>{fmt(d.cartao)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.text }}>{fmt(d.nfse)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.danger, fontWeight: 600 }}>{fmt(d.divB)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 6, background: d.score > 70 ? `${COLORS.danger}20` : d.score > 40 ? `${COLORS.warning}20` : `${COLORS.accent}20`, color: d.score > 70 ? COLORS.danger : d.score > 40 ? COLORS.warning : COLORS.accent, fontWeight: 600, fontSize: 11 }}>{d.score}</span>
                  </td>
                  <td style={{ padding: "10px 12px" }}><Badge label={d.prioridade} color={PRIORIDADE_COLOR[d.prioridade]} /></td>
                  <td style={{ padding: "10px 12px" }}>
                    <button onClick={() => onSelectContribuinte(d)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.accent, padding: 4, borderRadius: 6 }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardSection>
    </div>
  );
}

function MalhaFiscalPage({ data, onSelectContribuinte }) {
  const [search, setSearch] = useState("");
  const [filterRegime, setFilterRegime] = useState("Todos");
  const [filterPrioridade, setFilterPrioridade] = useState("Todas");
  const [sortField, setSortField] = useState("score");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(d => d.razao.toLowerCase().includes(s) || d.cnpj.includes(s));
    }
    if (filterRegime !== "Todos") result = result.filter(d => d.regime === filterRegime);
    if (filterPrioridade !== "Todas") result = result.filter(d => d.prioridade === filterPrioridade);
    result.sort((a, b) => {
      const av = a[sortField] ?? 0, bv = b[sortField] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return result;
  }, [data, search, filterRegime, filterPrioridade, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortableHeader = ({ field, label, align }) => (
    <th onClick={() => handleSort(field)} style={{ padding: "10px 12px", textAlign: align || "left", color: sortField === field ? COLORS.accent : COLORS.textMuted, fontWeight: 500, borderBottom: `1px solid ${COLORS.border}`, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}>
      {label} {sortField === field && (sortDir === "desc" ? "↓" : "↑")}
    </th>
  );

  return (
    <div>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>Malha Fiscal</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMuted }}>{filtered.length} contribuintes encontrados</p>
        </div>
        <button onClick={() => alert("Exportação simulada — CSV gerado com sucesso!")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: `${COLORS.accent}15`, color: COLORS.accent, border: `1px solid ${COLORS.accent}40`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 250 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: COLORS.textDim }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por razão social ou CNPJ..." style={{ width: "100%", padding: "10px 12px 10px 38px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
        </div>
        <select value={filterRegime} onChange={e => setFilterRegime(e.target.value)} style={{ padding: "10px 16px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" }}>
          <option value="Todos">Todos os Regimes</option>
          <option value="Simples">Simples Nacional</option>
          <option value="Normal">Regime Normal</option>
        </select>
        <select value={filterPrioridade} onChange={e => setFilterPrioridade(e.target.value)} style={{ padding: "10px 16px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" }}>
          <option value="Todas">Todas as Prioridades</option>
          {["CRÍTICA", "ALTA", "MÉDIA", "BAIXA", "MÍNIMA"].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <CardSection>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr>
                <SortableHeader field="razao" label="Razão Social" />
                <SortableHeader field="cnpj" label="CNPJ" />
                <SortableHeader field="regime" label="Regime" />
                <SortableHeader field="cartao" label="Cartão" align="right" />
                <SortableHeader field="nfse" label="NFS-e" align="right" />
                <SortableHeader field="divB" label="Diverg." align="right" />
                <SortableHeader field="score" label="Score" align="right" />
                <SortableHeader field="issP" label="ISS Potencial" align="right" />
                <th style={{ padding: "10px 12px", color: COLORS.textMuted, fontWeight: 500, borderBottom: `1px solid ${COLORS.border}`, fontSize: 11 }}>Prior.</th>
                <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}`, width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} style={{ transition: "background 0.15s", cursor: "pointer" }}
                  onClick={() => onSelectContribuinte(d)}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 12px", color: COLORS.text, fontWeight: 500, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.razao}</td>
                  <td style={{ padding: "10px 12px", color: COLORS.textMuted, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{d.cnpj}</td>
                  <td style={{ padding: "10px 12px" }}><Badge label={d.regime} color={d.regime === "Normal" ? COLORS.purple : COLORS.accent} /></td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.text }}>{fmt(d.cartao)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.text }}>{fmt(d.nfse)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: d.divB > 0 ? COLORS.danger : COLORS.success, fontWeight: 600 }}>{fmt(d.divB)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 6, background: d.score > 70 ? `${COLORS.danger}20` : d.score > 40 ? `${COLORS.warning}20` : `${COLORS.accent}20`, color: d.score > 70 ? COLORS.danger : d.score > 40 ? COLORS.warning : COLORS.accent, fontWeight: 600, fontSize: 11 }}>{d.score}</span>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.success, fontWeight: 500 }}>{fmt(d.issP)}</td>
                  <td style={{ padding: "10px 12px" }}><Badge label={d.prioridade} color={PRIORIDADE_COLOR[d.prioridade]} /></td>
                  <td style={{ padding: "10px 12px" }}>
                    <ChevronRight size={16} color={COLORS.textDim} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardSection>
    </div>
  );
}

function DetalhePage({ contribuinte, onBack }) {
  const d = contribuinte;
  const radarData = [
    { metric: "Cart×PGDAS", value: Math.min(100, Math.max(0, d.pctA ?? 0)), fullMark: 100 },
    { metric: "Cart×NFS-e", value: Math.min(100, Math.max(0, d.pctB)), fullMark: 100 },
    { metric: "PGDAS×NFS-e", value: Math.min(100, Math.max(0, d.pctC ?? 0)), fullMark: 100 },
    { metric: "Triplo", value: Math.min(100, Math.max(0, d.pctD)), fullMark: 100 },
    { metric: "Mov.Econ.", value: Math.min(100, Math.max(0, d.pctE ?? d.pctB * 0.7)), fullMark: 100 },
    { metric: "Score", value: d.score, fullMark: 100 },
  ];

  const comparativo = [
    { name: "Cartão", v2024: d.cartao, v2023: d.cartao2023 },
    { name: "NFS-e", v2024: d.nfse, v2023: d.nfse2023 },
    { name: "PGDAS", v2024: d.pgdas, v2023: d.pgdas2023 },
  ];

  const barComparativo = [
    { name: "Cartão", value: d.cartao, fill: COLORS.cyan },
    { name: "NFS-e", value: d.nfse, fill: COLORS.accent },
    { name: "PGDAS", value: d.pgdas, fill: COLORS.purple },
  ].filter(b => b.value > 0);

  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const timeline = meses.map((m, i) => ({
    mes: m,
    cartao: Math.round(d.cartao / 12 * (0.7 + Math.random() * 0.6)),
    nfse: Math.round(d.nfse / 12 * (0.6 + Math.random() * 0.8)),
  }));

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: COLORS.accent, cursor: "pointer", marginBottom: 20, fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
        <ChevronLeft size={18} /> Voltar à Malha Fiscal
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>{d.razao}</h2>
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: "'Space Mono', monospace" }}>{d.cnpj}</span>
            <Badge label={d.regime} color={d.regime === "Normal" ? COLORS.purple : COLORS.accent} />
            <Badge label={d.prioridade} color={PRIORIDADE_COLOR[d.prioridade]} />
            <Badge label={d.classificacao.replace(/_/g, " ")} color={CLASS_COLOR[d.classificacao]} />
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: COLORS.textDim }}>CNAE: {d.cnae} — {d.cnaeDesc} | Alíquota: {(d.aliq * 100).toFixed(0)}% | Tipo: {d.tipo}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Score de Risco</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: d.score > 70 ? COLORS.danger : d.score > 40 ? COLORS.warning : COLORS.accent, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{d.score}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { icon: CreditCard, label: "Cartão (2024)", value: d.cartao, color: COLORS.cyan },
          { icon: FileCheck, label: "NFS-e (2024)", value: d.nfse, color: COLORS.accent },
          { icon: FileText, label: "PGDAS (2024)", value: d.pgdas || null, color: COLORS.purple },
          { icon: AlertTriangle, label: "Divergência B", value: d.divB, color: COLORS.danger },
          { icon: TrendingUp, label: "ISS Potencial", value: d.issP, color: COLORS.success },
        ].map((item, i) => (
          <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 14px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <item.icon size={16} color={item.color} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value != null ? fmt(item.value) : "—"}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <CardSection title="Radar de Cruzamentos">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={COLORS.border} />
              <PolarAngleAxis dataKey="metric" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: COLORS.textDim, fontSize: 10 }} />
              <Radar name="Divergência %" dataKey="value" stroke={COLORS.danger} fill={COLORS.danger} fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </CardSection>

        <CardSection title="Comparativo Cartão × NFS-e × PGDAS">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barComparativo}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 12 }} />
              <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} formatter={v => fmt(v)} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barComparativo.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardSection>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <CardSection title="Timeline Mensal — Cartão vs NFS-e (2024)">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timeline}>
              <defs>
                <linearGradient id="gradCartao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradNfse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="mes" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} formatter={v => fmt(v)} />
              <Area type="monotone" dataKey="cartao" stroke={COLORS.cyan} fill="url(#gradCartao)" strokeWidth={2} name="Cartão" />
              <Area type="monotone" dataKey="nfse" stroke={COLORS.accent} fill="url(#gradNfse)" strokeWidth={2} name="NFS-e" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardSection>

        <CardSection title="Comparativo entre Exercícios (2023 × 2024)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparativo} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 12 }} />
              <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} formatter={v => fmt(v)} />
              <Bar dataKey="v2023" name="2023" fill={COLORS.textDim} radius={[6, 6, 0, 0]} />
              <Bar dataKey="v2024" name="2024" fill={COLORS.accent} radius={[6, 6, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </CardSection>
      </div>

      <CardSection title="Detalhamento dos Cruzamentos">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { label: "A — Cartão × PGDAS", div: d.divA, pct: d.pctA },
            { label: "B — Cartão × NFS-e", div: d.divB, pct: d.pctB },
            { label: "C — PGDAS × NFS-e", div: d.divC, pct: d.pctC },
            { label: "D — Cruzamento Triplo", div: d.divD, pct: d.pctD },
            { label: "E — Mov. Econômico", div: d.divE, pct: d.pctE },
          ].map((c, i) => (
            <div key={i} style={{ background: `${COLORS.bg}`, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 8, fontWeight: 500 }}>{c.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: c.div != null && c.div > 0 ? COLORS.danger : COLORS.textDim, fontFamily: "'Space Grotesk', sans-serif" }}>{c.div != null ? fmt(c.div) : "N/A"}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{c.pct != null ? fmtPct(c.pct) : "—"}</div>
            </div>
          ))}
        </div>
      </CardSection>
    </div>
  );
}

function CruzamentosPage({ data }) {
  const cruzamentos = [
    { id: "A", title: "Cartão × PGDAS", desc: "Simples Nacional — Identifica omissão de receita", field: "divA", pctField: "pctA", color: COLORS.orange, icon: Layers, filter: d => d.regime === "Simples" && d.divA != null },
    { id: "B", title: "Cartão × NFS-e", desc: "Todos os regimes — Serviço sem emissão de NF", field: "divB", pctField: "pctB", color: COLORS.danger, icon: AlertTriangle, filter: () => true },
    { id: "C", title: "PGDAS × NFS-e", desc: "Simples Nacional — Declarou mas não emitiu NF", field: "divC", pctField: "pctC", color: COLORS.warning, icon: FileText, filter: d => d.regime === "Simples" && d.divC != null },
    { id: "D", title: "Cruzamento Triplo", desc: "Maior divergência entre as 3 bases", field: "divD", pctField: "pctD", color: COLORS.purple, icon: LayoutGrid, filter: () => true },
    { id: "E", title: "Cartão × NFS-e (Normal)", desc: "Regime Normal — Base de cálculo omitida", field: "divE", pctField: "pctE", color: COLORS.cyan, icon: Building2, filter: d => d.regime === "Normal" && d.divE != null },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>Cruzamentos de Dados</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMuted }}>Análise detalhada por tipo de cruzamento — Exercício 2024</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
        {cruzamentos.map(c => {
          const subset = data.filter(c.filter);
          const withDiv = subset.filter(d => (d[c.field] || 0) > 0);
          const totalDiv = withDiv.reduce((s, d) => s + (d[c.field] || 0), 0);
          const avgPct = withDiv.length > 0 ? withDiv.reduce((s, d) => s + (d[c.pctField] || 0), 0) / withDiv.length : 0;

          const distData = [
            { name: ">50%", value: withDiv.filter(d => (d[c.pctField] || 0) > 50).length },
            { name: "20-50%", value: withDiv.filter(d => (d[c.pctField] || 0) > 20 && (d[c.pctField] || 0) <= 50).length },
            { name: "0-20%", value: withDiv.filter(d => (d[c.pctField] || 0) > 0 && (d[c.pctField] || 0) <= 20).length },
          ];

          return (
            <CardSection key={c.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <c.icon size={20} color={c.color} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>Cruzamento {c.id}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{c.title}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: COLORS.textDim, margin: "0 0 16px" }}>{c.desc}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 4 }}>Empresas</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: c.color, fontFamily: "'Space Grotesk', sans-serif" }}>{withDiv.length}</div>
                </div>
                <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 4 }}>Total Diverg.</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>{fmt(totalDiv)}</div>
                </div>
                <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 4 }}>Méd. %</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.warning, fontFamily: "'Space Grotesk', sans-serif" }}>{fmtPct(avgPct)}</div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={distData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 10 }} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} />
                  <Bar dataKey="value" fill={c.color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardSection>
          );
        })}
      </div>
    </div>
  );
}

function RecuperacaoPage({ data }) {
  const totalISS = data.reduce((s, d) => s + d.issP, 0);
  const byCriticidade = ["CRÍTICA", "ALTA", "MÉDIA", "BAIXA", "MÍNIMA"].map(p => ({
    name: p,
    valor: data.filter(d => d.prioridade === p).reduce((s, d) => s + d.issP, 0),
    empresas: data.filter(d => d.prioridade === p).length,
    fill: PRIORIDADE_COLOR[p],
  }));

  const byCnae = CNAES.reduce((acc, cnae) => {
    const subset = data.filter(d => d.cnae === cnae.code);
    if (subset.length === 0) return acc;
    const total = subset.reduce((s, d) => s + d.issP, 0);
    if (total > 0) acc.push({ name: cnae.desc.substring(0, 25), valor: total, empresas: subset.length });
    return acc;
  }, []).sort((a, b) => b.valor - a.valor).slice(0, 8);

  const mensal = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"].map((m, i) => ({
    mes: m,
    potencial: Math.round(totalISS / 12 * (0.6 + Math.random() * 0.8)),
    recuperado: Math.round(totalISS / 12 * (0.2 + Math.random() * 0.3) * (i < 6 ? 1 : 0.3)),
  }));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>Potencial de Recuperação</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMuted }}>Projeção de ISS recuperável — Exercício 2024</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <KPICard icon={TrendingUp} label="ISS Total Recuperável" value={totalISS} prefix="R$ " color={COLORS.success} delay={0} />
        <KPICard icon={AlertOctagon} label="Via Prioridade Crítica" value={byCriticidade[0]?.valor || 0} prefix="R$ " color={COLORS.danger} delay={100} />
        <KPICard icon={Building2} label="Empresas com ISS Potencial" value={data.filter(d => d.issP > 0).length} color={COLORS.accent} delay={200} />
        <KPICard icon={Target} label="Ticket Médio" value={data.filter(d => d.issP > 0).length > 0 ? Math.round(totalISS / data.filter(d => d.issP > 0).length) : 0} prefix="R$ " color={COLORS.purple} delay={300} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <CardSection title="ISS Potencial por Prioridade">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byCriticidade}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} formatter={v => fmt(v)} />
              <Bar dataKey="valor" name="ISS Potencial" radius={[6, 6, 0, 0]}>
                {byCriticidade.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardSection>

        <CardSection title="ISS Potencial por Segmento (Top 8)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byCnae} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 10 }} width={140} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} formatter={v => fmt(v)} />
              <Bar dataKey="valor" fill={COLORS.success} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardSection>
      </div>

      <CardSection title="Projeção Mensal — Potencial vs Recuperado (simulação)">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={mensal}>
            <defs>
              <linearGradient id="gradPot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="mes" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
            <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} formatter={v => fmt(v)} />
            <Area type="monotone" dataKey="potencial" stroke={COLORS.success} fill="url(#gradPot)" strokeWidth={2} name="Potencial" />
            <Bar dataKey="recuperado" fill={COLORS.accent} radius={[4, 4, 0, 0]} name="Recuperado" barSize={20} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardSection>
    </div>
  );
}

function ComparativoPage({ data }) {
  const segmentos = [...new Set(data.map(d => d.cnaeDesc))];
  const comparativo = segmentos.map(seg => {
    const subset = data.filter(d => d.cnaeDesc === seg);
    return {
      segmento: seg.substring(0, 30),
      cartao2023: subset.reduce((s, d) => s + d.cartao2023, 0),
      cartao2024: subset.reduce((s, d) => s + d.cartao, 0),
      nfse2023: subset.reduce((s, d) => s + d.nfse2023, 0),
      nfse2024: subset.reduce((s, d) => s + d.nfse, 0),
    };
  }).filter(s => s.cartao2024 > 0).sort((a, b) => b.cartao2024 - a.cartao2024).slice(0, 10);

  const totalCartao23 = data.reduce((s, d) => s + d.cartao2023, 0);
  const totalCartao24 = data.reduce((s, d) => s + d.cartao, 0);
  const totalNfse23 = data.reduce((s, d) => s + d.nfse2023, 0);
  const totalNfse24 = data.reduce((s, d) => s + d.nfse, 0);

  const evolucao = [
    { name: "Cartão", v2023: totalCartao23, v2024: totalCartao24, variacao: ((totalCartao24 - totalCartao23) / totalCartao23 * 100).toFixed(1) },
    { name: "NFS-e", v2023: totalNfse23, v2024: totalNfse24, variacao: ((totalNfse24 - totalNfse23) / totalNfse23 * 100).toFixed(1) },
    { name: "Diverg.", v2023: totalCartao23 - totalNfse23, v2024: totalCartao24 - totalNfse24, variacao: (((totalCartao24 - totalNfse24) - (totalCartao23 - totalNfse23)) / (totalCartao23 - totalNfse23) * 100).toFixed(1) },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>Comparativo entre Exercícios</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMuted }}>Evolução 2023 × 2024 — Análise de tendências</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {evolucao.map((e, i) => (
          <CardSection key={i}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12, fontWeight: 500 }}>{e.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.textDim }}>2023</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}>{fmt(e.v2023)}</div>
              </div>
              <div style={{ fontSize: 24, color: COLORS.textDim }}>→</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: COLORS.textDim }}>2024</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>{fmt(e.v2024)}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: Number(e.variacao) > 0 ? COLORS.danger : COLORS.success, fontWeight: 600 }}>
              {Number(e.variacao) > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {e.variacao}%
            </div>
          </CardSection>
        ))}
      </div>

      <CardSection title="Evolução por Segmento — Cartão 2023 vs 2024" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={comparativo} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="segmento" tick={{ fill: COLORS.textMuted, fontSize: 9 }} angle={-15} textAnchor="end" height={60} />
            <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} formatter={v => fmt(v)} />
            <Bar dataKey="cartao2023" name="Cartão 2023" fill={COLORS.textDim} radius={[4, 4, 0, 0]} />
            <Bar dataKey="cartao2024" name="Cartão 2024" fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </ResponsiveContainer>
      </CardSection>

      <CardSection title="Evolução por Segmento — NFS-e 2023 vs 2024">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={comparativo} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="segmento" tick={{ fill: COLORS.textMuted, fontSize: 9 }} angle={-15} textAnchor="end" height={60} />
            <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} formatter={v => fmt(v)} />
            <Bar dataKey="nfse2023" name="NFS-e 2023" fill={COLORS.textDim} radius={[4, 4, 0, 0]} />
            <Bar dataKey="nfse2024" name="NFS-e 2024" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </ResponsiveContainer>
      </CardSection>
    </div>
  );
}

function MetasPage({ data }) {
  const auditores = [
    { nome: "Auditor 1 — Claudia M.K.", meta: 15, concluido: 11, iss: 4500000 },
    { nome: "Auditor 2 — Carlos R.S.", meta: 12, concluido: 9, iss: 3200000 },
    { nome: "Auditor 3 — Marcos A.L.", meta: 12, concluido: 7, iss: 2800000 },
    { nome: "Auditor 4 — Priscila T.N.", meta: 10, concluido: 8, iss: 5100000 },
    { nome: "Auditor 5 — Roberto F.M.", meta: 10, concluido: 6, iss: 1900000 },
    { nome: "Auditor 6 — Ana Paula D.", meta: 8, concluido: 5, iss: 1500000 },
  ];

  const totalMeta = auditores.reduce((s, a) => s + a.meta, 0);
  const totalConcluido = auditores.reduce((s, a) => s + a.concluido, 0);
  const totalIss = auditores.reduce((s, a) => s + a.iss, 0);
  const pctGeral = (totalConcluido / totalMeta * 100);

  const faseData = [
    { fase: "Seleção", count: 15, fill: COLORS.textDim },
    { fase: "Intimação", count: 8, fill: COLORS.accent },
    { fase: "Análise", count: 12, fill: COLORS.warning },
    { fase: "Autuação", count: 6, fill: COLORS.danger },
    { fase: "Encerrado", count: totalConcluido, fill: COLORS.success },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>Painel de Desempenho da Fiscalização — 2024</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMuted }}>Acompanhamento do desempenho da equipe de fiscalização</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <KPICard icon={Target} label="Meta Global" value={totalMeta} suffix=" ações" color={COLORS.accent} delay={0} />
        <KPICard icon={CheckCircle} label="Concluídas" value={totalConcluido} suffix=" ações" color={COLORS.success} delay={100} />
        <KPICard icon={Activity} label="Taxa de Execução" value={Math.round(pctGeral)} suffix="%" color={pctGeral > 70 ? COLORS.success : COLORS.warning} delay={200} />
        <KPICard icon={TrendingUp} label="ISS Lançado" value={totalIss} prefix="R$ " color={COLORS.success} delay={300} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
        <CardSection title="Desempenho por Auditor">
          {auditores.map((a, i) => {
            const pct = (a.concluido / a.meta) * 100;
            return (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < auditores.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{a.nome}</span>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>{a.concluido}/{a.meta} ações | {fmt(a.iss)}</span>
                </div>
                <div style={{ width: "100%", height: 8, background: COLORS.bg, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%", borderRadius: 4,
                    background: pct > 80 ? COLORS.success : pct > 50 ? COLORS.warning : COLORS.danger,
                    transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }} />
                </div>
              </div>
            );
          })}
        </CardSection>

        <CardSection title="Ações por Fase">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={faseData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="count" label={({ fase, count }) => `${fase}: ${count}`}>
                {faseData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} itemStyle={{ color: '#334155' }} labelStyle={{ color: '#0f172a', fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardSection>
      </div>

      <CardSection title="Meta de Recuperação por Prioridade">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr>
                {["Prioridade", "Empresas", "ISS Potencial", "Meta Lançamento", "% Meta", "Status"].map((h, i) => (
                  <th key={i} style={{ padding: "10px 12px", textAlign: i > 0 ? "right" : "left", color: COLORS.textMuted, fontWeight: 500, borderBottom: `1px solid ${COLORS.border}`, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["CRÍTICA", "ALTA", "MÉDIA", "BAIXA"].map((p, i) => {
                const subset = data.filter(d => d.prioridade === p);
                const iss = subset.reduce((s, d) => s + d.issP, 0);
                const metaPct = p === "CRÍTICA" ? 80 : p === "ALTA" ? 60 : p === "MÉDIA" ? 40 : 20;
                const metaValor = iss * (metaPct / 100);
                return (
                  <tr key={p}>
                    <td style={{ padding: "10px 12px" }}><Badge label={p} color={PRIORIDADE_COLOR[p]} /></td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.text }}>{subset.length}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.text }}>{fmt(iss)}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.success, fontWeight: 600 }}>{fmt(metaValor)}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.textMuted }}>{metaPct}%</td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                      <Badge label={i < 2 ? "EM ANDAMENTO" : "PENDENTE"} color={i < 2 ? COLORS.warning : COLORS.textDim} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardSection>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedContribuinte, setSelectedContribuinte] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const handleSelectContribuinte = (d) => {
    setSelectedContribuinte(d);
    setPage("detalhe");
  };

  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "malha", icon: LayoutGrid, label: "Malha Fiscal" },
    { id: "cruzamentos", icon: Layers, label: "Cruzamentos" },
    { id: "recuperacao", icon: TrendingUp, label: "Recuperação" },
    { id: "comparativo", icon: GitMerge, label: "Comparativo" },
    { id: "metas", icon: Target, label: "Metas" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', sans-serif", opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Space+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <aside style={{
        width: sidebarCollapsed ? 64 : 240, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`,
        display: "flex", flexDirection: "column", padding: sidebarCollapsed ? "20px 8px" : "20px 12px",
        transition: "width 0.3s ease, padding 0.3s ease", flexShrink: 0, overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: sidebarCollapsed ? "0 2px" : "0 4px", justifyContent: sidebarCollapsed ? "center" : "flex-start" }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}>
            <Menu size={20} />
          </button>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2 }}>MALHA FISCAL</div>
              <div style={{ fontSize: 9, color: COLORS.accent, fontWeight: 600, letterSpacing: "0.1em" }}>ISSQN — PORTO VELHO</div>
            </div>
          )}
        </div>

        <div style={{ width: "100%", height: 1, background: COLORS.border, margin: "12px 0 16px" }} />

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {navItems.map(item => (
            <NavItem key={item.id} icon={item.icon} label={item.label} active={page === item.id || (page === "detalhe" && item.id === "malha")} collapsed={sidebarCollapsed}
              onClick={() => { setPage(item.id); if (item.id !== "detalhe") setSelectedContribuinte(null); }} />
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div style={{ padding: "16px 8px", borderTop: `1px solid ${COLORS.border}`, marginTop: 8 }}>
            <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 4 }}>DEF / SERM / SEMEC</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>Porto Velho — RO</div>
            <div style={{ fontSize: 9, color: COLORS.textDim, marginTop: 8 }}>Protótipo v1.0 — 2024</div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: 32, overflowY: "auto", maxHeight: "100vh" }}>
        {/* HEADER BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Shield size={28} color={COLORS.accent} />
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>MALHA FISCAL ISSQN</h1>
              <p style={{ margin: 0, fontSize: 11, color: COLORS.textMuted }}>Sistema de Cruzamento de Dados e Inteligência Fiscal — Município de Porto Velho/RO</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>Exercício</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent, fontFamily: "'Space Grotesk', sans-serif" }}>2024</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${COLORS.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: COLORS.accent, fontFamily: "'Space Grotesk', sans-serif" }}>RM</div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        {page === "dashboard" && <DashboardPage data={MOCK} onSelectContribuinte={handleSelectContribuinte} />}
        {page === "malha" && <MalhaFiscalPage data={MOCK} onSelectContribuinte={handleSelectContribuinte} />}
        {page === "detalhe" && selectedContribuinte && <DetalhePage contribuinte={selectedContribuinte} onBack={() => setPage("malha")} />}
        {page === "cruzamentos" && <CruzamentosPage data={MOCK} />}
        {page === "recuperacao" && <RecuperacaoPage data={MOCK} />}
        {page === "comparativo" && <ComparativoPage data={MOCK} />}
        {page === "metas" && <MetasPage data={MOCK} />}
      </main>
    </div>
  );
}
