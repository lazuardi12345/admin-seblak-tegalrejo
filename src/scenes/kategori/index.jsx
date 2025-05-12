import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

const Kategori = () => {
  const [namaKategori, setNamaKategori] = useState("");
  const [kategoriList, setKategoriList] = useState([]);

  const API_URL = "https://testing.kopdesmerahputih.id/api/kategoris";

  // Ambil data kategori dari API
  const fetchKategori = async () => {
    try {
      const response = await axios.get(API_URL);
      setKategoriList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  // Tambah kategori
  const handleAddKategori = async () => {
    if (!namaKategori.trim()) return;

    try {
      await axios.post(API_URL, {
        nama_kategori: namaKategori,
      });
      setNamaKategori("");
      fetchKategori(); // Refresh list
    } catch (error) {
      console.error("Gagal menambahkan kategori:", error);
    }
  };

  // Hapus kategori
  const handleDeleteKategori = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchKategori(); // Refresh list
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="KATEGORI" subtitle="Kelola Daftar Kategori Produk" />

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Nama Kategori"
          variant="outlined"
          value={namaKategori}
          onChange={(e) => setNamaKategori(e.target.value)}
          fullWidth
        />
        <IconButton
          color="success"
          onClick={handleAddKategori}
          sx={{ height: 55 }}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Box>

      <List>
        {kategoriList.length > 0 ? (
          kategoriList.map((kategori) => (
            <ListItem
              key={kategori.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => handleDeleteKategori(kategori.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                my: 1,
                px: 2,
              }}
            >
              <ListItemText primary={kategori.nama_kategori} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Belum ada kategori.
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default Kategori;
