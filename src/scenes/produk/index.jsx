import { useEffect, useState } from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"; // Import Add icon
import { useNavigate } from "react-router-dom";

const Produk = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [produkList, setProdukList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("https://testing.kopdesmerahputih.id/api/produks")
      .then((response) => {
        const dataWithId = response.data.produk.map((item) => ({
          id: item.id,
          nama: item.nama,
          harga: item.harga,
          deskripsi: item.deskripsi,
          img: item.img,
          kategori: item.kategori?.nama_kategori || "-",
          stok: item.stok,
          levels: item.levels.map((lvl) => lvl.nama_level).join(", "),
        }));
        setProdukList(dataWithId);
      })
      .catch((error) => {
        console.error("Error fetching produk data:", error);
      });
  };

  const handleEdit = (id) => {
    navigate(`/edit-produk/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      axios
        .delete(`https://testing.kopdesmerahputih.id/api/produks/${id}`)
        .then(() => {
          fetchData(); // Refresh data
        })
        .catch((error) => {
          console.error("Error deleting produk:", error);
        });
    }
  };

  const handleAdd = () => {
    navigate("/tambah-produk"); 
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "nama",
      headerName: "Nama Produk",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "harga", headerName: "Harga", width: 100 },
    { field: "stok", headerName: "Stok", width: 100 },
    { field: "kategori", headerName: "Kategori", flex: 1 },
    { field: "levels", headerName: "Level", flex: 1 },
    { field: "deskripsi", headerName: "Deskripsi", flex: 2 },
    {
      field: "img",
      headerName: "Gambar",
      flex: 1,
      renderCell: ({ row }) => (
        <img
          src={row.img}
          alt={row.nama}
          style={{ width: "60px", height: "40px", objectFit: "cover" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Aksi",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <IconButton
            onClick={() => handleEdit(row.id)}
            sx={{ color: "green" }} 
          >
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    }
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="PRODUK" subtitle="Manajemen Data Produk" />
        <IconButton
          onClick={handleAdd}
          sx={{
            backgroundColor: colors.greenAccent[500],
            color: "white",
            "&:hover": {
              backgroundColor: colors.greenAccent[700],
            },
          }}
        >
          <AddIcon /> {/* Plus icon */}
        </IconButton>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
        }}
      >
        <DataGrid rows={produkList} columns={columns} />
      </Box>
    </Box>
  );
};

export default Produk;
