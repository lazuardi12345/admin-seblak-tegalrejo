import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";

const EditProduk = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    stok: "",
    deskripsi: "",
    kategori_id: "",
    img: "", // Gambar produk
    levels: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [kategoriList, setKategoriList] = useState([]);
  const [levelList, setLevelList] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchProduk();
    fetchKategori();
    fetchLevels();
  }, []);

  const fetchProduk = async () => {
    try {
      const res = await axios.get(`https://testing.kopdesmerahputih.id/api/produks/${id}`);
      const produkData = res.data; // Renamed from 'produk' to 'produkData'
      setFormData({
        nama: produkData.nama,
        harga: produkData.harga,
        stok: produkData.stok,
        deskripsi: produkData.deskripsi,
        kategori_id: produkData.kategori_id || "",
        img: produkData.img || "", // URL gambar yang sudah ada
        levels: produkData.levels.map((lvl) => lvl.id),
      });
    } catch (error) {
      console.error("Gagal memuat data produk:", error);
    }
  };

  const fetchKategori = async () => {
    try {
      const res = await axios.get("https://testing.kopdesmerahputih.id/api/kategoris");
      setKategoriList(res.data);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  };

  const fetchLevels = async () => {
    try {
      const res = await axios.get("https://testing.kopdesmerahputih.id/api/levels");
      setLevelList(res.data);
    } catch (error) {
      console.error("Gagal memuat level:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLevelChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      levels: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    // Untuk menampilkan gambar baru di preview
    setFormData((prev) => ({
      ...prev,
      img: file ? URL.createObjectURL(file) : prev.img, // Preview gambar
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Membuat FormData untuk dikirimkan
    const data = new FormData();
    data.append("nama", formData.nama); // Kirim nama jika diubah
    data.append("harga", formData.harga); // Kirim harga jika diubah
    data.append("stok", formData.stok); // Kirim stok jika diubah
    data.append("deskripsi", formData.deskripsi); // Kirim deskripsi jika diubah
    data.append("kategori_id", formData.kategori_id); // Kirim kategori jika diubah
    data.append("levels", JSON.stringify(formData.levels)); // Kirim levels jika diubah
  
    // **Perbaikan**: Hanya kirim gambar jika ada perubahan pada gambar
    if (imageFile) {
      data.append("img", imageFile); // Kirim gambar baru jika ada perubahan gambar
    }
  
    try {
      const res = await axios.post(
        `https://testing.kopdesmerahputih.id/api/produks/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          params: { _method: 'PUT' }, // Menambahkan _method=PUT untuk simulasi PUT request
        }
      );
      
      setSnackbarMessage("Data produk berhasil disimpan!");
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/produk");
      }, 2000);
  
    } catch (error) {
      console.error("Gagal menyimpan data:", error.response?.data || error.message);
      if (error.response && error.response.status === 422) {
        alert("Ada kesalahan pada data yang dikirim: " + JSON.stringify(error.response.data.errors));
      }
    }
  };
  
  return (
    <Box m="20px">
      <Header title="EDIT PRODUK" subtitle="Ubah Data Produk" />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Box display="grid" gap="20px" gridTemplateColumns="repeat(2, 1fr)">
          <TextField
            fullWidth
            label="Nama Produk"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Harga"
            name="harga"
            type="number"
            value={formData.harga}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth>
            <InputLabel>Stok</InputLabel>
            <Select
              name="stok"
              value={formData.stok}
              label="Stok"
              onChange={handleChange}
              required
            >
              <MenuItem value="tersedia">tersedia</MenuItem>
              <MenuItem value="habis">habis</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Kategori</InputLabel>
            <Select
              name="kategori_id"
              value={formData.kategori_id}
              label="Kategori"
              onChange={handleChange}
              required
            >
              {kategoriList.map((kat) => (
                <MenuItem key={kat.id} value={kat.id}>
                  {kat.nama_kategori}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select
              multiple
              name="levels"
              value={formData.levels}
              onChange={handleLevelChange}
              renderValue={(selected) =>
                levelList
                  .filter((lvl) => selected.includes(lvl.id))
                  .map((lvl) => lvl.nama_level)
                  .join(", ")
              }
            >
              {levelList.map((lvl) => (
                <MenuItem key={lvl.id} value={lvl.id}>
                  {lvl.nama_level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <Box>
            <Typography variant="body1" mb={1}>
              Pilih Gambar
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {formData.img && (
                <img
                  src={formData.img}
                  alt="Preview"
                  style={{
                    width: "150px",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                    boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/produk")}
          >
            Kembali
          </Button>
          <Button type="submit" variant="contained" color="success">
            Simpan Perubahan
          </Button>
        </Box>
      </form>

      {/* Snackbar untuk pemberitahuan */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProduk;
