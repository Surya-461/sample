import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import "../styles/adminDashboard.css";

/* ================= COLORS ================= */
const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444"];

/* ================= DATA URL ================= */
const INSURANCE_URL =
  "https://raw.githubusercontent.com/Surya-461/users/refs/heads/main/insuranceData.js";

/* ================= REVENUE DATA ================= */
import revenueData from "../data/revenueData";

/* ================= SAFE JS FETCH ================= */
const fetchJSData = async (url) => {
  const res = await fetch(url);
  const code = await res.text();

  const blob = new Blob([code], { type: "text/javascript" });
  const blobUrl = URL.createObjectURL(blob);

  try {
    const module = await import(/* @vite-ignore */ blobUrl);
    return module.default;
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};

/* ================= ANIMATED COUNTER ================= */
const AnimatedNumber = ({ value, duration = 800 }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{display}</>;
};

const AdminDashboard = () => {
  const [usageData, setUsageData] = useState([]);
  const [clientId, setClientId] = useState("All");
  const [loginMonth, setLoginMonth] = useState("All");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchJSData(INSURANCE_URL).then(setUsageData);
  }, []);

  /* ================= FILTERED DATA ================= */
  const filteredUsage = useMemo(() => {
    return usageData.filter((d) => {
      const month = new Date(d.login_datetime).toLocaleString("en", {
        month: "short"
      });
      return (
        (clientId === "All" || d.client_id === clientId) &&
        (loginMonth === "All" || month === loginMonth)
      );
    });
  }, [usageData, clientId, loginMonth]);

  const filteredRevenue = useMemo(() => {
    if (clientId === "All") return revenueData;
    return revenueData.filter(
      r => String(r.client_id) === String(clientId)
    );
  }, [clientId]);


  /* ================= KPIs ================= */
  const totalClients = new Set(usageData.map(d => d.client_id)).size;
  const activeClients = new Set(filteredUsage.map(d => d.client_id)).size;
  const loginCounts = filteredUsage.length;

  const avgSession = useMemo(() => {
    if (filteredUsage.length === 0) return 0;

    const clientMap = {};

    filteredUsage.forEach(d => {
      if (!clientMap[d.client_id]) {
        clientMap[d.client_id] = [];
      }
      clientMap[d.client_id].push(d.session_duration_minutes);
    });

    const clientAverages = Object.values(clientMap).map(arr =>
      arr.reduce((a, b) => a + b, 0) / arr.length
    );

    const overallAvg =
      clientAverages.reduce((a, b) => a + b, 0) / clientAverages.length;

    return overallAvg.toFixed(2);
  }, [filteredUsage]);


  const subscriptionType = filteredUsage[0]?.subscription_type || "Monthly";

  const totalRevenue = filteredRevenue.reduce(
    (sum, d) => sum + d.total_amount_paid,
    0
  );


  /* ================= CHART DATA ================= */
  const loginBySubClient = useMemo(() => {
    const map = {};
    filteredUsage.forEach(d => {
      const key = `${d.subscription_type}-${d.client_id}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([key, value]) => {
      const [subscription_type, client_id] = key.split("-");
      return { subscription_type, client_id, value };
    });
  }, [filteredUsage]);

  const purposeData = useMemo(() => {
    const map = {};
    filteredUsage.forEach(d => {
      map[d.purpose_of_login] =
        (map[d.purpose_of_login] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredUsage]);

  const revenueByMonth = useMemo(() => {
    const map = {};

    filteredRevenue.forEach(d => {
      const month = new Date(d.subscription_start_date)
        .toLocaleString("en", { month: "short" });

      map[month] = (map[month] || 0) + d.total_amount_paid;
    });

    return Object.entries(map).map(([month, value]) => ({
      month,
      value
    }));
  }, [filteredRevenue]);


  const avgSessionByClient = useMemo(() => {
    const map = {};
    filteredUsage.forEach(d => {
      if (!map[d.client_id]) map[d.client_id] = [];
      map[d.client_id].push(d.session_duration_minutes);
    });
    return Object.entries(map).map(([client, arr]) => ({
      client,
      value: (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)
    }));
  }, [filteredUsage]);

  return (
    <div className="admin-dashboard">

      {/* ================= FILTERS ================= */}
      <div className="filters">
        <select onChange={(e) => setClientId(e.target.value)}>
          <option>All</option>
          {[...new Set(usageData.map(d => d.client_id))].map(id =>
            <option key={id}>{id}</option>
          )}
        </select>

        <select onChange={(e) => setLoginMonth(e.target.value)}>
          <option>All</option>
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            .map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* ================= CLIENT DETAILS ================= */}
      {clientId !== "All" && filteredUsage.length > 0 && (
        <div className="client-details-card">
          <div className="client-details-header">
            <h3>Client Details</h3>
            <span className="client-badge">{clientId}</span>
          </div>

          <div className="client-details-grid">
            <div>
              <label>Insurance Company</label>
              <p>{filteredUsage[0].insurance_company_name}</p>
            </div>
            <div>
              <label>Manager Name</label>
              <p>{filteredUsage[0].manager_name}</p>
            </div>
            <div>
              <label>Email</label>
              <p>{filteredUsage[0].email}</p>
            </div>
            <div>
              <label>Mobile Number</label>
              <p>{filteredUsage[0].mobile_number}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= KPI CARDS ================= */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-info">
          <span>Total Clients</span>
          <h2><AnimatedNumber value={totalClients} /></h2>
        </div>

        <div className="kpi-card kpi-success">
          <span>Active Clients</span>
          <h2><AnimatedNumber value={activeClients} /></h2>
        </div>

        <div className="kpi-card kpi-info">
          <span>Login Counts</span>
          <h2><AnimatedNumber value={loginCounts} /></h2>
        </div>

        <div className="kpi-card kpi-warning">
          <span>Avg Session (min)</span>
          <h2><AnimatedNumber value={avgSession} /></h2>
        </div>

        <div className="kpi-card kpi-info">
          <span>Subscription Type</span>
          <h2>{subscriptionType}</h2>
        </div>

        <div className="kpi-card kpi-success">
          <span>Total Revenue</span>
          <h2><AnimatedNumber value={(totalRevenue / 1000).toFixed(0)} />K</h2>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Login Activity</h3>
          <ResponsiveContainer height={240}>
            <BarChart data={loginBySubClient}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="client_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Purpose of Login</h3>
          <ResponsiveContainer height={240}>
            <PieChart>
              <Pie data={purposeData} dataKey="value" outerRadius={90}>
                {purposeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer height={240}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip />
              <Line dataKey="value" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Avg Session Duration</h3>
          <ResponsiveContainer height={240}>
            <BarChart data={avgSessionByClient} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="client" />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
