import React, { useEffect, useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

const BarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("https://testing.kopdesmerahputih.id/api/transaction-stats/daily")
      .then((response) => {
        if (response.data.status === "success") {
          const formatted = response.data.daily.map(item => ({
            date: item.date,
            total: parseFloat(item.total_amount),
            transaksi: item.total_transactions,
          }));
          setData(formatted);
        } else {
          console.error("Gagal fetch data");
        }
      })
      .catch(error => console.error("Gagal fetch data:", error));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
        <Legend />
        <Bar dataKey="total" name="Total (Rp)" fill="#8884d8" />
        <Bar dataKey="transaksi" name="Jumlah Transaksi" fill="#82ca9d" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
