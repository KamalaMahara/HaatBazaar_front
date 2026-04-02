import { useState, type ChangeEvent } from "react";
import type { Product, Category } from "../types";
import { COLORS } from "../Theme";
import { Btn, Input, Modal, ConfirmModal, statusBadge, Th } from "../components/UI";
import { seedProducts, seedCategories } from "../data/seeddata";

type ProductForm = {
  id?: number;
  name: string;
  category: string;
  price: string | number;
  stock: string | number;
  status: Product["status"];
  image: string;
};

const EMPTY_FORM: ProductForm = {
  name: "",
  category: "Electronics",
  price: "",
  stock: "",
  status: "Active",
  image: "📦",
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [confirm, setConfirm] = useState<{ id: number } | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [search, setSearch] = useState<string>("");

  const openAdd = (): void => {
    setForm(EMPTY_FORM);
    setModal("add");
  };

  const openEdit = (p: Product): void => {
    setForm({ ...p });
    setModal("edit");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const save = (): void => {
    if (!form.name.trim()) return;
    const parsed: Product = {
      id: form.id ?? Date.now(),
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      status: form.status,
      image: form.image,
    };
    if (modal === "add") {
      setProducts((prev) => [...prev, parsed]);
    } else {
      setProducts((prev) => prev.map((p) => (p.id === parsed.id ? parsed : p)));
    }
    setModal(null);
  };

  const confirmDelete = (): void => {
    if (!confirm) return;
    setProducts((prev) => prev.filter((p) => p.id !== confirm.id));
    setConfirm(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const categoryOptions: string[] = seedCategories.map((c: Category) => c.name);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, margin: 0 }}>
            Products
          </h2>
          <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>
            {products.length} products total
          </p>
        </div>
        <Btn onClick={openAdd}>+ Add Product</Btn>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="🔍  Search products or categories..."
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "11px 16px",
            color: COLORS.text,
            fontSize: 14,
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: COLORS.surface,
          borderRadius: 16,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : "none",
                }}
              >
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: COLORS.amberDim,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                      }}
                    >
                      {p.image}
                    </div>
                    <span style={{ fontWeight: 600, color: COLORS.text, fontSize: 14 }}>
                      {p.name}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", color: COLORS.muted, fontSize: 14 }}>
                  {p.category}
                </td>
                <td style={{ padding: "14px 20px", fontWeight: 700, color: COLORS.amber, fontSize: 14 }}>
                  Rs. {p.price.toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    color: p.stock === 0 ? COLORS.danger : COLORS.text,
                    fontSize: 14,
                  }}
                >
                  {p.stock}
                </td>
                <td style={{ padding: "14px 20px" }}>{statusBadge(p.status)}</td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small onClick={() => openEdit(p)} variant="ghost">✏️ Edit</Btn>
                    <Btn small danger onClick={() => setConfirm({ id: p.id })}>🗑 Delete</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>
            No products found.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          title={modal === "add" ? "Add Product" : "Edit Product"}
          onClose={() => setModal(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Product Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Samsung Galaxy A54" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Price (Rs.)" name="price" value={form.price} onChange={handleChange} type="number" placeholder="e.g. 45000" />
              <Input label="Stock" name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="e.g. 50" />
            </div>
            <Input label="Category" name="category" value={form.category} onChange={handleChange} options={categoryOptions} />
            <Input label="Image (emoji)" name="image" value={form.image} onChange={handleChange} placeholder="e.g. 📱" />
            <Input label="Status" name="status" value={form.status} onChange={handleChange} options={["Active", "Inactive", "Out of Stock"]} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn onClick={() => setModal(null)} variant="ghost">Cancel</Btn>
              <Btn onClick={save}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {confirm && (
        <ConfirmModal
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={confirmDelete}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Products;