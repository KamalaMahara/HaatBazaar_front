import { useState, type ChangeEvent } from "react";
import type { Category } from "../types";
import { COLORS } from "../Theme";
import { Btn, Input, Modal, ConfirmModal, statusBadge, Th } from "../components/UI";
import { seedCategories } from "../data/seeddata";

type CategoryForm = Omit<Category, "id" | "productCount">;

const EMPTY_FORM: CategoryForm = { name: "", icon: "", status: "Active" };

const Categories: React.FC = () => {
  const [cats, setCats] = useState<Category[]>(seedCategories);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [confirm, setConfirm] = useState<{ id: number } | null>(null);
  const [form, setForm] = useState<CategoryForm & { id?: number; productCount?: number }>(EMPTY_FORM);

  const openAdd = (): void => {
    setForm(EMPTY_FORM);
    setModal("add");
  };

  const openEdit = (c: Category): void => {
    setForm({ ...c });
    setModal("edit");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const save = (): void => {
    if (!form.name.trim()) return;
    if (modal === "add") {
      const newCat: Category = {
        id: Date.now(),
        name: form.name,
        icon: form.icon,
        status: form.status as Category["status"],
        productCount: 0,
      };
      setCats((prev) => [...prev, newCat]);
    } else {
      setCats((prev) =>
        prev.map((c) =>
          c.id === form.id
            ? { ...c, name: form.name, icon: form.icon, status: form.status as Category["status"] }
            : c
        )
      );
    }
    setModal(null);
  };

  const confirmDelete = (): void => {
    if (!confirm) return;
    setCats((prev) => prev.filter((c) => c.id !== confirm.id));
    setConfirm(null);
  };

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
            Categories
          </h2>
          <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>
            {cats.length} categories total
          </p>
        </div>
        <Btn onClick={openAdd}>+ Add Category</Btn>
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
              {["Icon", "Name", "Products", "Status", "Actions"].map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cats.map((c, i) => (
              <tr
                key={c.id}
                style={{
                  borderBottom: i < cats.length - 1 ? `1px solid ${COLORS.border}` : "none",
                }}
              >
                <td style={{ padding: "14px 20px", fontSize: 24 }}>{c.icon}</td>
                <td style={{ padding: "14px 20px", fontWeight: 600, color: COLORS.text }}>
                  {c.name}
                </td>
                <td style={{ padding: "14px 20px", color: COLORS.muted }}>
                  {c.productCount}
                </td>
                <td style={{ padding: "14px 20px" }}>{statusBadge(c.status)}</td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small onClick={() => openEdit(c)} variant="ghost">✏️ Edit</Btn>
                    <Btn small danger onClick={() => setConfirm({ id: c.id })}>🗑 Delete</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          title={modal === "add" ? "Add Category" : "Edit Category"}
          onClose={() => setModal(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Category Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Electronics" />
            <Input label="Icon (emoji)" name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. ⚡" />
            <Input label="Status" name="status" value={form.status} onChange={handleChange} options={["Active", "Inactive"]} />
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
          message="Are you sure you want to delete this category? This action cannot be undone."
          onConfirm={confirmDelete}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Categories;