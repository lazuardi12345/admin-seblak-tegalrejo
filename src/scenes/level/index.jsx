import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import axios from "axios";

const LevelPage = () => {
  const [levels, setLevels] = useState([]);
  const [newLevel, setNewLevel] = useState("");

  const fetchLevels = async () => {
    try {
      const response = await axios.get("https://testing.kopdesmerahputih.id/api/levels");
      setLevels(response.data);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const handleAdd = async () => {
    if (!newLevel) return;
    try {
      await axios.post("https://testing.kopdesmerahputih.id/api/levels", {
        nama_level: newLevel,
      });
      setNewLevel("");
      fetchLevels();
    } catch (error) {
      console.error("Error adding level:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://testing.kopdesmerahputih.id/api/levels/${id}`);
      fetchLevels();
    } catch (error) {
      console.error("Error deleting level:", error);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  return (
    <Box m="20px">
      <Header title="DATA LEVEL" subtitle="Manajemen Level User" />

      {/* Tambah Level */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Nama Level"
          variant="outlined"
          value={newLevel}
          onChange={(e) => setNewLevel(e.target.value)}
        />
        <IconButton color="success" onClick={handleAdd}>
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* List Level */}
      <List>
  {levels.map((level) => (
    <ListItem
      key={level.id}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          color="error"
          onClick={() => handleDelete(level.id)}
        >
          <DeleteIcon />
        </IconButton>
      }
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)", // semi-transparent background
        border: "1px solid white", // white border
        borderRadius: "8px",
        mb: 1,
        px: 2,
      }}
    >
      <ListItemText
        primary={
          <Typography variant="h6" sx={{ color: "white" }}>
            {level.nama_level}
          </Typography>
        }
        secondary={
          <Typography sx={{ color: "white" }}>
            ID: {level.id}
          </Typography>
        }
      />
    </ListItem>
  ))}
</List>

    </Box>
  );
};

export default LevelPage;
 