import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import axios from "axios";

const Pie = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
    "#a4de6c", "#d0ed57", "#fa8072", "#a0522d", "#9370db",
    "#f7a35c", "#91e8e1", "#ff6666", "#bada55", "#ffb347"
  ];

  useEffect(() => {
    axios
      .get("https://testing.kopdesmerahputih.id/api/transaction-stats/weekly")
      .then((res) => {
        if (res.data.status === "success") {
          setWeeklyData(res.data.weekly);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
      });
  }, []);

  const pieData = weeklyData.map((item, index) => ({
    name: `Minggu ${item.week}`,
    value: parseFloat(item.total_amount),
    fill: COLORS[index % COLORS.length],
  }));

  const getDateRangeFromWeek = (weekString) => {
    const year = parseInt(weekString.toString().slice(0, 4));
    const week = parseInt(weekString.toString().slice(4));
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7;
    const targetDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
    const dayOfWeek = targetDate.getDay();
    const monday = new Date(targetDate);
    monday.setDate(targetDate.getDate() - ((dayOfWeek + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
  };

  const getRangeHari = (start, end) => {
    const options = { day: "numeric", month: "short" };
    const startDate = start.toLocaleDateString("id-ID", options);
    const endDate = end.toLocaleDateString("id-ID", options);
    return `${startDate} - ${endDate}`;
  };

  const getBulan = (date) => {
    return date.toLocaleString("id-ID", { month: "long" });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box m="10px">
      <Header title="Laporan Mingguan" subtitle="Statistik Mingguan Transaksi" />
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        {/* PieChart Component */}
        <Box flex={1}>
          <PieChart data={pieData} />
        </Box>

        {/* Tabel Data */}
        <Box ml={4} flex={1} minWidth="400px">
          <Typography variant="h6" gutterBottom>Detail Mingguan</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Minggu</TableCell>
                  <TableCell>Rentang Hari</TableCell>
                  <TableCell>Bulan</TableCell>
                  <TableCell>Transaksi</TableCell>
                  <TableCell>Total (Rp)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weeklyData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Mengambil data untuk halaman aktif
                  .map((item, index) => {
                    const { start, end } = getDateRangeFromWeek(item.week);
                    return (
                      <TableRow key={index}>
                        <TableCell>Minggu {item.week}</TableCell>
                        <TableCell>{getRangeHari(start, end)}</TableCell>
                        <TableCell>{getBulan(start)}</TableCell>
                        <TableCell>{item.total_transactions}</TableCell>
                        <TableCell>{parseFloat(item.total_amount).toLocaleString("id-ID")}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]} // Pilihan jumlah baris per halaman
              component="div"
              count={weeklyData.length} // Jumlah total data
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage} // Mengubah halaman
              onRowsPerPageChange={handleChangeRowsPerPage} // Mengubah jumlah baris per halaman
            />
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Pie;
