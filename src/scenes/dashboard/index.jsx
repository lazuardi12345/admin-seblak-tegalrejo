import { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LocalMallIcon from "@mui/icons-material/LocalMall"; // Ganti dengan ikon yang sesuai
import Header from "../../components/Header";
import LineChart from "../../components/LineChart"; // Ganti dengan komponen LineChart yang benar
import axios from "axios";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produkRes = await axios.get("https://testing.kopdesmerahputih.id/api/produks");
        const transaksiRes = await axios.get("https://testing.kopdesmerahputih.id/api/transaction");

        // Sesuaikan dengan nama field yang benar berdasarkan response
        setTotalProducts(produkRes.data.total_produk); // Mengambil total produk
        setTotalTransactions(transaksiRes.data.total_transactions); // Mengambil total transaksi
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert("Terjadi kesalahan saat mengambil data!");
        
        if (error.response) {
          console.error("Response error:", error.response);
        } else if (error.request) {
          console.error("Request error:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Ringkasan Data Produk & Transaksi" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Unduh Laporan
          </Button>
        </Box>
      </Box>

      {/* GRID */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* TOTAL TRANSAKSI */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"  // Pusatkan elemen
          p="20px"
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <LocalMallIcon sx={{ color: colors.greenAccent[600], fontSize: "30px", marginRight: "10px" }} />
            <Typography variant="h6" color={colors.grey[100]} sx={{ marginRight: "10px" }}>
              Total Transaksi
            </Typography>
            <Typography variant="h4" color={colors.greenAccent[600]}>
              {totalTransactions}
            </Typography>
          </Box>
        </Box>

        {/* TOTAL PRODUK */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"  // Pusatkan elemen
          p="20px"
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "30px", marginRight: "10px" }} />
            <Typography variant="h6" color={colors.grey[100]} sx={{ marginRight: "10px" }}>
              Total Produk
            </Typography>
            <Typography variant="h4" color={colors.greenAccent[600]}>
              {totalProducts}
            </Typography>
          </Box>
        </Box>

        {/* Grafik Statistik (LineChart) */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Typography variant="h6" color={colors.grey[100]} gutterBottom>
            Statistik Bulanan
          </Typography>
          <LineChart data={[]} /> {/* Ganti data sesuai kebutuhan */}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
