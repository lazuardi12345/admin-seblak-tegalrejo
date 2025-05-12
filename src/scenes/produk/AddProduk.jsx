import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";

const TambahProduk = () => {
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

  // Mengambil data kategori dan level
  const fetchKategoriAndLevels = async () => {
    try {
      const [kategoriRes, levelRes] = await Promise.all([
        axios.get("https://testing.kopdesmerahputih.id/api/kategoris"),
        axios.get("https://testing.kopdesmerahputih.id/api/levels"),
      ]);
      setKategoriList(kategoriRes.data);
      setLevelList(levelRes.data);
    } catch (error) {
      console.error("Gagal memuat kategori dan level:", error);
    }
  };

  useState(() => {
    fetchKategoriAndLevels();
  }, []);

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
    setFormData((prev) => ({
      ...prev,
      img: file ? URL.createObjectURL(file) : prev.img,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Membuat FormData untuk dikirimkan
    const data = new FormData();
    data.append("nama", formData.nama); // Kirim nama produk
    data.append("harga", formData.harga); // Kirim harga produk
    data.append("stok", formData.stok); // Kirim status stok
    data.append("deskripsi", formData.deskripsi); // Kirim deskripsi produk
    data.append("kategori_id", formData.kategori_id); // Kirim kategori produk
    data.append("levels", JSON.stringify(formData.levels)); // Kirim data levels (misalnya kategori khusus)

    // **Perbaikan**: Hanya kirim gambar jika ada gambar yang dipilih
    if (imageFile) {
        // Validasi jenis file dan ukuran jika perlu
        if (imageFile.type.startsWith("image/") && imageFile.size <= 5 * 1024 * 1024) {  // Maksimal 5MB
            data.append("image_file", imageFile); // Kirim gambar dengan nama field yang benar
        } else {
            alert("File yang diupload harus berupa gambar dan maksimal ukuran 5MB.");
            return;  // Hentikan eksekusi jika validasi file gagal
        }
    } else {
        alert("Gambar produk wajib diunggah!");
        return;  // Hentikan eksekusi jika tidak ada gambar yang dipilih
    }

    try {
        const res = await axios.post(
            `https://testing.kopdesmerahputih.id/api/produks`, // URL POST
            data,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        setSnackbarMessage("Data produk berhasil ditambahkan!");
        setOpenSnackbar(true);
        setTimeout(() => {
            navigate("/produk"); // Redirect setelah 2 detik
        }, 2000);

    } catch (error) {
        console.error("Gagal menyimpan data:", error.response?.data || error.message);

        // Jika status 422, tampilkan detail validasi error
        if (error.response && error.response.status === 422) {
            const errorMessages = error.response.data.messages;
            console.log("Detail Validasi Error:", errorMessages);

            // Tampilkan semua kesalahan validasi secara rinci
            if (errorMessages) {
                Object.keys(errorMessages).forEach(field => {
                    console.log(`Field ${field} gagal validasi:`, errorMessages[field]);
                });
            }

            alert("Ada kesalahan pada data yang dikirim: " + JSON.stringify(errorMessages));
        } else {
            alert("Terjadi kesalahan, coba lagi.");
        }
    }
};


  return (
    <Box m="20px">
      <Header title="TAMBAH PRODUK" subtitle="Menambahkan Produk Baru" />
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
            Tambah Produk
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

export default TambahProduk;
