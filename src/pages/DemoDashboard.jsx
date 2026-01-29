import { useMemo, useState } from "react";
import {
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis,
    Tooltip, ResponsiveContainer,
    CartesianGrid, Legend
} from "recharts";

import "../styles/UserDashboard.css";
import demoData from "../data/demoData";

/* SAME COLORS */
const COLORS = {
    Approved: "#22c55e",
    Rejected: "#ef4444",
    Safe: "#16a34a",
    Risk: "#f59e0b"
};

const DemoDashboard = () => {

    const [statusFilter, setStatusFilter] = useState({
        Approved: true,
        Rejected: true
    });

    const filteredUsers = useMemo(() => {
        if (
            (statusFilter.Approved && statusFilter.Rejected) ||
            (!statusFilter.Approved && !statusFilter.Rejected)
        ) {
            return demoData;
        }
        return demoData.filter(u => statusFilter[u.Approval_Status]);
    }, [statusFilter]);

    /* ===== KPIs ===== */
    const approvedCount = filteredUsers.filter(u => u.Approval_Status === "Approved").length;
    const rejectedCount = filteredUsers.filter(u => u.Approval_Status === "Rejected").length;

    const approvalData = [
        { name: "Approved", value: approvedCount },
        { name: "Rejected", value: rejectedCount }
    ];

    const safeDrivingData = [
        {
            name: "Safe Driving",
            value: filteredUsers.filter(u => u.safe_driving_flag === "Safe Driving").length
        },
        {
            name: "Risk Factors",
            value: filteredUsers.filter(u => u.safe_driving_flag !== "Safe Driving").length
        }
    ];

    return (
        <div className="dashboard-page">
            <div className="dashboard-content">

                <h2>🎯 Insurance Analytics Demo</h2>
                <p>Preview dashboards with sample insurance data.</p>

                {/* FILTER */}
                <div style={{ marginBottom: 16, display: "flex", gap: 20 }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={statusFilter.Approved}
                            onChange={() =>
                                setStatusFilter(p => ({ ...p, Approved: !p.Approved }))
                            }
                        /> Approved
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={statusFilter.Rejected}
                            onChange={() =>
                                setStatusFilter(p => ({ ...p, Rejected: !p.Rejected }))
                            }
                        /> Rejected
                    </label>
                </div>

                {/* CHART GRID */}
                <div className="chart-grid">

                    <div className="chart-card">
                        <h5>Approval Distribution</h5>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={approvalData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value">
                                    {approvalData.map((e, i) => (
                                        <Cell key={i} fill={COLORS[e.name]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h5>Approval Distribution (Share)</h5>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={approvalData} dataKey="value" label>
                                    {approvalData.map((e, i) => (
                                        <Cell key={i} fill={COLORS[e.name]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h5>Safe Driving Analysis</h5>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={safeDrivingData}
                                    innerRadius={70}
                                    outerRadius={100}
                                    label
                                >
                                    <Cell fill={COLORS.Safe} />
                                    <Cell fill={COLORS.Risk} />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DemoDashboard;
