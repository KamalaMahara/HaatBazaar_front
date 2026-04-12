import React, { useState, useMemo, useEffect, useCallback } from "react";
import type { Category } from "../types";
import { Btn, Input, Modal, ConfirmModal, SectionHeader, TableWrapper } from "../components/UI";
import axios from "axios";

const API = "http://localhost:8000/category";

type CategoryForm = { id?: number; categoryName: string; };
const EMPTY: CategoryForm = { categoryName: "", };

const Categories: React.FC = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [confirm, setConfirm] = useState<{ id: number } | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY);
  const [formError, setFormError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch all categories from backend 
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const json = await res.json();
      setCats(json.data ?? []);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Search filter 
  const filteredCats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return cats;
    return cats.filter(c =>
      c.categoryName.toLowerCase().includes(q) ||
      String(c.id).includes(q)
    );
  }, [cats, searchQuery]);

  // Modal helpers 
  const openAdd = () => { setForm(EMPTY); setFormError(""); setModal("add"); };
  const openEdit = (c: Category) => {
    setForm({ id: c.id, categoryName: c.categoryName, });
    setFormError("");
    setModal("edit");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setFormError("");
  };

  //  Validation 
  const validate = (): boolean => {
    const trimmed = form.categoryName.trim();
    if (!trimmed) { setFormError("Category name is required."); return false; }
    if (trimmed.length < 2) { setFormError("Must be at least 2 characters."); return false; }
    const isDuplicate = cats.some(
      c => c.categoryName.trim().toLowerCase() === trimmed.toLowerCase() && c.id !== form.id
    );
    if (isDuplicate) { setFormError(`"${trimmed}" already exists.`); return false; }
    return true;
  };

  // Save (Add or Edit) 
  const save = async () => {
    if (!validate()) return;
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);
    try {
      if (modal === "add") {
        await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ categoryName: form.categoryName.trim() }),
        });
      } else {
        await fetch(`${API}/${form.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ categoryName: form.categoryName.trim() }),
        });
      }
      setModal(null);
      fetchCategories(); // re-fetch to sync with DB
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  };

  //  Delete ─
  const deleteCategory = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(API + "/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setConfirm(null);
        fetchCategories();
      } else {
        setConfirm(null);
      }
    } catch (error) {
      console.log("Error deleting category:", error);
    }
  };

  // ─── Loading / Error states 
  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
      Loading categories...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-20 text-red-400 text-sm">{error}</div>
  );

  return (
    <div>
      <SectionHeader
        title="Categories"
        subtitle={`${cats.length} categories total`}
        action={<Btn onClick={openAdd}>+ Add Category</Btn>}
      />

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by category name or ID..."
          className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-gray-800 border border-white/[0.1] text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
        />
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-1.5 ml-1">
            {filteredCats.length} result{filteredCats.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {filteredCats.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">No categories match your search.</div>
        ) : filteredCats.map(c => (
          <div key={c.id} className="bg-gray-800 rounded-2xl border border-white/[0.07] p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">ID #{c.id}</p>
                <p className="font-bold text-gray-100">{c.categoryName}</p>
              </div>

            </div>
            <div className="flex gap-2 pt-3 border-t border-white/[0.07]">
              <Btn small onClick={() => openEdit(c)} variant="ghost" className="flex-1">✏️ Edit</Btn>
              <Btn small variant="danger" onClick={() => setConfirm({ id: c.id })} className="flex-1">🗑 Delete</Btn>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <TableWrapper>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["ID", "Category Name", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {filteredCats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500 text-sm">
                    No categories match your search.
                  </td>
                </tr>
              ) : filteredCats.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-gray-500 text-sm font-mono">{c.id}</td>
                  <td className="px-5 py-4 font-semibold text-gray-100">{c.categoryName}</td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Btn small onClick={() => openEdit(c)} variant="ghost">✏️ Edit</Btn>
                      <Btn small variant="danger" onClick={() => setConfirm({ id: c.id })}>🗑 Delete</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal title={modal === "add" ? "Add Category" : "Edit Category"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input
              label="Category Name"
              name="categoryName"
              value={form.categoryName}
              onChange={onChange}
              placeholder="e.g. Electronics"
            />
            {formError && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <span>⚠️</span><span>{formError}</span>
              </div>
            )}

            <div className="flex gap-3 justify-end mt-2">
              <Btn onClick={() => setModal(null)} variant="ghost">Cancel</Btn>
              <Btn onClick={save}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {confirm && (
        <ConfirmModal
          message="Are you sure you want to delete this category? This cannot be undone."
          onConfirm={() => deleteCategory(confirm.id)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Categories;