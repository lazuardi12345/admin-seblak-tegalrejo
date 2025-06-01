import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

// login
import Login from "./components/login";

// Komponen layout
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

// Komponen halaman
import Dashboard from "./scenes/dashboard";
import Produk from "./scenes/produk";
import EditProduk from "./scenes/produk/EditProduk";
import AddProduk from "./scenes/produk/AddProduk";
import Contacts from "./scenes/transaction";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Level from "./scenes/level";
import Kategori from "./scenes/kategori";
import ManualTransactionForm from "./scenes/transaksi";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/produk" element={<Produk />} />
              <Route path="/edit-produk/:id" element={<EditProduk />} />
              <Route path="/tambah-produk" element={<AddProduk />} />
              <Route path="/transaction" element={<Contacts />} />
              <Route path="/transaksi-manual" element={<ManualTransactionForm />} />
              <Route path="/kategori" element={<Kategori />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/level" element={<Level />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
