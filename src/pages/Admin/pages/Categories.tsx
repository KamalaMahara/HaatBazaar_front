import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import type { Category } from "../types";
import { Btn, Input, Modal, ConfirmModal, SectionHeader, TableWrapper } from "../components/UI";
import { API, APIWITHTOKEN } from "../../../http";

type CategoryForm = { id?: string; categoryName: string; categoryImageUrl?: string; imageFile?: File | null; };
const EMPTY: CategoryForm = { categoryName: "", categoryImageUrl: "", imageFile: null };

const Categories: React.FC = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [confirm, setConfirm] = useState<{ id: any } | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all categories from backend 
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/category");
      setCats(res.data.data ?? []);
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
  const openAdd = () => { setForm(EMPTY); setImagePreview(null); setFormError(""); setModal("add"); };
  const openEdit = (c: Category) => {
    setForm({ id: String(c.id), categoryName: c.categoryName, categoryImageUrl: c.categoryImageUrl, imageFile: null });
    setImagePreview(c.categoryImageUrl || null);
    setFormError("");
    setModal("edit");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  //  Validation 
  const validate = (): boolean => {
    const trimmed = form.categoryName.trim();
    if (!trimmed) { setFormError("Category name is required."); return false; }
    if (trimmed.length < 2) { setFormError("Must be at least 2 characters."); return false; }
    const isDuplicate = cats.some(
      c => c.categoryName.trim().toLowerCase() === trimmed.toLowerCase() && String(c.id) !== form.id
    );
    if (isDuplicate) { setFormError(`"${trimmed}" already exists.`); return false; }
    return true;
  };

  // Save (Add or Edit) 
  const save = async () => {
    if (!validate()) return;
    try {
      const formData = new FormData();
      formData.append("categoryName", form.categoryName.trim());
      if (form.imageFile) {
        formData.append("categoryImage", form.imageFile);
      }

      if (modal === "add") {
        await APIWITHTOKEN.post("/category", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        await APIWITHTOKEN.patch(`/category/${form.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }
      setModal(null);
      fetchCategories(); // re-fetch to sync with DB
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  };

  //  Delete 
  const deleteCategory = async (id: any) => {
    try {
      const response = await APIWITHTOKEN.delete(`/category/${id}`);
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

  // Loading / Error states 
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
            <div className="flex items-start gap-4 mb-3">
              {c.categoryImageUrl ? (
                <img 
                  src={c.categoryImageUrl.startsWith("http") ? c.categoryImageUrl : `http://localhost:8000/${c.categoryImageUrl}`} 
                  alt={c.categoryName} 
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-gray-500 border border-white/5 font-semibold flex-shrink-0">
                  No Img
                </div>
              )}
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
                {["ID", "Image", "Category Name", "Actions"].map(h => (
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
                  <td className="px-5 py-4">
                    {c.categoryImageUrl ? (
                      <img 
                        src={c.categoryImageUrl.startsWith("http") ? c.categoryImageUrl : `http://localhost:8000/${c.categoryImageUrl}`} 
                        alt={c.categoryName} 
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-500 border border-white/5 font-semibold">
                        No Img
                      </div>
                    )}
                  </td>
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

            {/* Image Upload Area */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                Category Image
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-white/10 hover:border-amber-500/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer bg-gray-900 transition-colors"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview.startsWith("data:") ? imagePreview : (imagePreview.startsWith("http") ? imagePreview : `http://localhost:8000/${imagePreview}`)}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-700 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm text-gray-300">
                    {imagePreview ? "Change image" : "Upload image"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
            </div>

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
