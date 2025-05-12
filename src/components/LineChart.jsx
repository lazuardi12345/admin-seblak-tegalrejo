import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import axios from "axios";

const LineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("https://testing.kopdesmerahputih.id/api/transaction-stats/monthly")
      .then((res) => {
        if (res.data.status === "success") {
          const formatted = res.data.monthly.map((item) => ({
            name: `${getMonthName(item.month)} ${item.year}`,
            total: parseFloat(item.total_amount),
          }));
          setData(formatted);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
      });
  }, []);

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("id-ID", { month: "short" });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
