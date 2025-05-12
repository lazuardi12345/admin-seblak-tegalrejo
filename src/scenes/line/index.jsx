import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import axios from "axios";

const Line = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [page, setPage] = useState(0); // Halaman aktif
  const [rowsPerPage, setRowsPerPage] = useState(12); // Jumlah data per halaman

  useEffect(() => {
    axios
      .get("https://testing.kopdesmerahputih.id/api/transaction-stats/monthly")
      .then((res) => {
        if (res.data.status === "success") {
          setMonthlyData(res.data.monthly);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
      });
  }, []);

  // Fungsi untuk menghandle perubahan halaman
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Fungsi untuk menghandle perubahan jumlah baris per halaman
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset halaman ke 0 setelah mengubah jumlah baris per halaman
  };

  return (
    <Box m="20px">
      <Header title="Laporan Bulanan" subtitle="Statistik Bulanan Transaksi" />
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        <Box flex={1} height="75vh">
          <LineChart />
        </Box>
        <Box flex={1}>
          <TableContainer component={Paper}>
            <Typography variant="h6" p={2}>
              Statistik Bulanan
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Bulan</strong></TableCell>
                  <TableCell><strong>Total Pesanan</strong></TableCell>
                  <TableCell><strong>Total (Rp)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Mengambil data sesuai halaman
                  .map((item, index) => {
                    const monthName = new Date(item.year, item.month - 1).toLocaleString("id-ID", { month: "long" });
                    return (
                      <TableRow key={index}>
                        <TableCell>{monthName} {item.year}</TableCell>
                        <TableCell>{item.total_transactions}</TableCell>
                        <TableCell>Rp {parseFloat(item.total_amount).toLocaleString("id-ID")}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[12, 25, 50]} // Pilihan jumlah data per halaman
              component="div"
              count={monthlyData.length} // Jumlah total data
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage} // Fungsi untuk mengubah halaman
              onRowsPerPageChange={handleChangeRowsPerPage} // Fungsi untuk mengubah jumlah baris per halaman
            />
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Line;
