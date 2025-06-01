import React, { useState, useEffect } from "react";
import axios from "axios";

const ManualTransactionForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    alamat: "",
    payment_method: "cash",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch produk
  useEffect(() => {
    axios
      .get("https://testing.kopdesmerahputih.id/api/produks")
      .then((res) => {
        if (res.data && Array.isArray(res.data.produk)) {
          setProducts(res.data.produk);
        } else {
          console.error("Format data produk tidak sesuai", res.data);
        }
      })
      .catch((err) => console.error("Gagal fetch produk:", err));
  }, []);

  // Handle input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Tambah produk ke cart
  const addProductToCart = (product) => {
    const exists = selectedItems.find((item) => item.product.id === product.id);
    if (exists) {
      alert("Produk sudah ada di keranjang. Untuk mengubah level atau jumlah, gunakan daftar produk terpilih.");
      return;
    }
    setSelectedItems((prev) => [...prev, { product, quantity: 1, level_id: "" }]);
  };

  // Update jumlah produk
  const updateItemQuantity = (id, quantity) => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) return;
    setSelectedItems((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, quantity: qty } : item))
    );
  };

  // Update level produk
  const updateItemLevel = (id, level_id) => {
    setSelectedItems((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, level_id } : item))
    );
  };

  // Hapus produk
  const removeItem = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item.product.id !== id));
  };

  // Hitung total harga
  const totalHarga = selectedItems.reduce(
    (sum, item) => sum + parseFloat(item.product.harga) * item.quantity,
    0
  );

  // Submit form transaksi
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      alert("Silakan pilih minimal 1 produk.");
      return;
    }
    if (!form.customer_name || !form.email || !form.alamat) {
      alert("Mohon lengkapi semua data pelanggan.");
      return;
    }

    const payload = {
      customer_name: form.customer_name,
      email: form.email,
      alamat: form.alamat,
      payment_method: form.payment_method,
      products: selectedItems.map((item) => ({
        product_id: item.product.id,
        product_quantity: item.quantity,
        level_id: item.level_id || null,
      })),
    };

    try {
      const res = await axios.post(
        "https://testing.kopdesmerahputih.id/api/checkout",
        payload
      );
      alert("Transaksi berhasil ditambahkan!");
      setSelectedItems([]);
      setForm({
        customer_name: "",
        email: "",
        alamat: "",
        payment_method: "cash",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error response:", err.response);
      alert("Gagal menambahkan transaksi. Status: " + err.response?.status);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Daftar Produk
      </h2>

      {/* Produk Grid 4 per baris */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <img
              src={p.img}
              alt={p.nama}
              className="rounded-t-lg object-cover h-40 w-full"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{p.nama}</h3>
              <p className="text-green-700 font-bold text-xl mb-4">Rp{p.harga}</p>
              <button
                onClick={() => addProductToCart(p)}
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-md"
                aria-label={`Tambah ${p.nama} ke keranjang`}
              >
                <span className="text-2xl">+</span> Tambah
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Produk Terpilih */}
      <h3 className="text-3xl font-semibold mt-16 mb-6 text-gray-800">
        Produk Terpilih
      </h3>

      {selectedItems.length === 0 ? (
        <p className="text-gray-500 text-center">Belum ada produk dipilih.</p>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          {selectedItems.map((item) => (
            <div
              key={item.product.id}
              className="border rounded-lg p-5 flex items-center shadow-md"
            >
              <img
                src={item.product.img}
                alt={item.product.nama}
                className="w-24 h-24 object-cover rounded-md mr-6"
              />
              <div className="flex-1">
                <h4 className="font-bold text-xl mb-1">{item.product.nama}</h4>
                <div className="flex flex-wrap gap-6 items-center">
                  <label className="flex flex-col text-gray-700">
                    Jumlah
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItemQuantity(item.product.id, e.target.value)
                      }
                      className="mt-1 border rounded-md px-3 py-1 w-20"
                    />
                  </label>

                  <label className="flex flex-col text-gray-700">
                    Level
                    <select
                      value={item.level_id}
                      onChange={(e) =>
                        updateItemLevel(item.product.id, e.target.value)
                      }
                      className="mt-1 border rounded-md px-3 py-1 w-32"
                    >
                      <option value="">Pilih Level</option>
                      <option value="1">Level 1</option>
                      <option value="2">Level 2</option>
                      <option value="3">Level 3</option>
                    </select>
                  </label>

                  <div className="text-lg font-semibold text-green-700">
                    Subtotal: Rp{parseFloat(item.product.harga) * item.quantity}
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.product.id)}
                className="text-red-600 text-3xl font-bold hover:text-red-800 transition-colors ml-6"
                aria-label={`Hapus ${item.product.nama} dari keranjang`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total dan Bayar */}
      <div className="max-w-5xl mx-auto mt-12 flex justify-between items-center">
        <div className="text-3xl font-extrabold text-gray-900">
          Total: Rp{totalHarga}
        </div>
        <button
          disabled={selectedItems.length === 0}
          onClick={() => setIsModalOpen(true)}
          className={`px-8 py-3 rounded-lg text-white font-bold shadow-lg transition-colors duration-300 ${
            selectedItems.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Bayar
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-6 border-b pb-3 text-gray-900">
              Form Pembayaran
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="customer_name"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="alamat"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Alamat
                </label>
                <textarea
                  id="alamat"
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="payment_method"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Metode Pembayaran
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="cash">Cash</option>
                  <option value="midtrans">Online</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-md border border-gray-400 hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animasi fadeIn */}
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default ManualTransactionForm;
