import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete, Visibility, Print } from "@mui/icons-material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf"; // Import jsPDF for PDF creation

const Transaction = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fallback colors in case of undefined
  const greenIconColor = colors.greenAccent ? colors.greenAccent[200] : "#4caf50"; // fallback to green
  const redIconColor = colors.red ? colors.red[500] : "#f44336"; // fallback to red

  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const printRef = useRef();

  const fetchTransactions = () => {
    axios
      .get("https://testing.kopdesmerahputih.id/api/transaction")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setTransactions(data);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus transaksi ini?")) {
      axios
        .delete(`https://testing.kopdesmerahputih.id/api/transaction/${id}`)
        .then(() => {
          alert("Transaksi berhasil dihapus");
          fetchTransactions();
        })
        .catch((err) => {
          console.error("Gagal menghapus transaksi:", err);
        });
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Seblak Prasmanan Tegalrejo", 20, 30);
    doc.text(`Order ID: ${selectedTransaction.order_id}`, 20, 40);
    doc.text(`Nama: ${selectedTransaction.customer_name}`, 20, 50);
    doc.text(`Alamat: ${selectedTransaction.alamat}`, 20, 60);
    doc.text(`Metode Bayar: ${selectedTransaction.payment_method}`, 20, 70);
    doc.text(`Status: ${selectedTransaction.status}`, 20, 80);
    doc.text(`TOTAL: Rp${selectedTransaction.total_price}`, 20, 90);
    doc.text("----------------------------------------------------", 20, 100);
    doc.text("Items:", 20, 110);

    selectedTransaction.items?.forEach((item, index) => {
      const yPosition = 120 + index * 10;
      doc.text(`• ${item.product?.nama} (${item.level?.nama_level})`, 20, yPosition);
      doc.text(`   Qty: ${item.quantity}  Subtotal: Rp${item.subtotal}`, 20, yPosition + 5);
    });

    doc.text("----------------------------------------------------", 20, 120 + selectedTransaction.items.length * 10);
    doc.text(`TOTAL: Rp${selectedTransaction.total_price}`, 20, 130 + selectedTransaction.items.length * 10);
    doc.save(`${selectedTransaction.order_id}_transaction.pdf`);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "order_id", headerName: "Order ID", flex: 1 },
    { field: "customer_name", headerName: "Customer Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "alamat", headerName: "Address", flex: 1 },
    { field: "total_price", headerName: "Total Price", flex: 1 },
    { field: "payment_method", headerName: "Payment Method", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedTransaction(params.row);
              setOpenModal(true);
            }}
            sx={{ color: greenIconColor }} // Icon color for visibility (green)
          >
            <Visibility />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            sx={{ color: redIconColor }} // Icon color for delete (red)
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TRANSAKSI" subtitle="Daftar List Transaksi " />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={transactions}
          getRowId={(row) => row.id}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Detail & Struk */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detail Transaksi</DialogTitle>
        <DialogContent dividers>
          {selectedTransaction && (
            <Box ref={printRef} p={2} sx={{ fontFamily: "monospace" }}>
              <Typography variant="h6" align="center">Seblak Prasmanan Tegalrejo</Typography>
              <Typography align="center">Jl. Contoh Alamat No.123</Typography>
              <hr />
              <Typography><strong>Order ID:</strong> {selectedTransaction.order_id}</Typography>
              <Typography><strong>Nama:</strong> {selectedTransaction.customer_name}</Typography>
              <Typography><strong>Alamat:</strong> {selectedTransaction.alamat}</Typography>
              <Typography><strong>Metode Bayar:</strong> {selectedTransaction.payment_method}</Typography>
              <Typography><strong>Status:</strong> {selectedTransaction.status}</Typography>
              <hr />
              <Typography><strong>Items:</strong></Typography>
              {selectedTransaction.items?.map((item, i) => (
                <Box key={i} ml={2}>
                  <Typography>• {item.product?.nama} ({item.level?.nama_level})</Typography>
                  <Typography>   Qty: {item.quantity}  Subtotal: Rp{item.subtotal}</Typography>
                </Box>
              ))}
              <hr />
              <Typography variant="h6">TOTAL: Rp{selectedTransaction.total_price}</Typography>
              <Typography align="center" mt={2}>Terima Kasih!</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} sx={{ color: redIconColor }}>
            Tutup
          </Button>
          <Button onClick={handlePrint} variant="contained" startIcon={<Print />} sx={{ backgroundColor: greenIconColor }}>
            Cetak (Bluetooth/USB)
          </Button>
          <Button onClick={handlePrintPDF} variant="contained" sx={{ backgroundColor: "#1976d2" }}>
            Cetak PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transaction;
