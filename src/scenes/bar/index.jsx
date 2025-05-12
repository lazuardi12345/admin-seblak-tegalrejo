import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import axios from "axios";
import dayjs from "dayjs"; 

const Bar = () => {
  const [dailyData, setDailyData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://testing.kopdesmerahputih.id/api/transaction-stats/daily');
        if (response.data.status === 'success') {
          setDailyData(response.data.daily);
        } else {
          console.error('Gagal mengambil data');
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = dailyData.map((item) => ({
    name: item.date,
    transaksi: item.total_transactions,
    total: parseFloat(item.total_amount),
  }));

  const getWeekNumber = (dateStr) => {
    const date = dayjs(dateStr);
    return date.week;
  };

 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  return (
    <Box m="20px">
      <Header title="Laporan Harian" subtitle="Statistik Harian Transaksi" />
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Box flex={1} minWidth="300px">
          <BarChart data={chartData} />
        </Box>
        <Box ml={4} flex={1} minWidth="400px">
          <Typography variant="h6" gutterBottom>Detail Transaksi Harian</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Hari</TableCell>
                  <TableCell>Transaksi</TableCell>
                  <TableCell>Total (Rp)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dailyData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Mengambil data untuk halaman aktif
                  .map((item, index) => {
                    const tanggal = dayjs(item.date);
                    return (
                      <TableRow key={index}>
                        <TableCell>{tanggal.format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{tanggal.format('dddd')}</TableCell>
                        <TableCell>{item.total_transactions}</TableCell>
                        <TableCell>{parseFloat(item.total_amount).toLocaleString("id-ID")}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]} 
              component="div"
              count={dailyData.length} 
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage} 
              onRowsPerPageChange={handleChangeRowsPerPage} 
            />
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Bar;
