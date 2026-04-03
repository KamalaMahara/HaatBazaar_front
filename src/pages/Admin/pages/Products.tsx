import React, { useState } from "react";
import { seedProducts, seedCategories, } from "../data/seeddata";
import type { Product } from "../types";
import { Btn, Input, Modal, ConfirmModal, StatusBadge, SectionHeader, TableWrapper } from "../components/UI";

type ProductForm = { id?: number; name: string; category: string; price: string | number; stock: string | number; status: Product["status"]; image: string; };
const EMPTY: ProductForm = { name: "", category: "Electronics", price: "", stock: "", status: "Active", image: "📦" };

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [confirm, setConfirm] = useState<{ id: number } | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [search, setSearch] = useState("");

  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (p: Product) => { setForm({ ...p }); setModal("edit"); };
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = () => {
    if (!form.name.trim()) return;
    const parsed = { ...form, id: form.id ?? Date.now(), price: Number(form.price), stock: Number(form.stock) } as Product;
    if (modal === "add") setProducts(p => [...p, parsed]);
    else setProducts(p => p.map(x => x.id === parsed.id ? parsed : x));
    setModal(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader
        title="Products"
        subtitle={`${products.length} products total`}
        action={<Btn onClick={openAdd}>+ Add Product</Btn>}
      />

      {/* Search bar */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍  Search products or categories..."
        className="w-full bg-gray-800 border border-white/[0.07] rounded-xl px-4 py-2.5 text-gray-100 text-sm outline-none focus:border-amber-500 placeholder:text-gray-600 transition-colors mb-4"
      />

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {filtered.map(p => (
          <div key={p.id} className="bg-gray-800 rounded-2xl border border-white/[0.07] p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-2xl shrink-0">{p.image}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-100 truncate">{p.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Price</p>
                <p className="font-bold text-amber-500">Rs. {p.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Stock</p>
                <p className={`font-semibold ${p.stock === 0 ? "text-red-400" : "text-gray-100"}`}>{p.stock}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-white/[0.07]">
              <Btn small onClick={() => openEdit(p)} variant="ghost" className="flex-1">✏️ Edit</Btn>
              <Btn small variant="danger" onClick={() => setConfirm({ id: p.id })} className="flex-1">🗑 Delete</Btn>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-500 py-10">No products found.</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <TableWrapper>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-xl shrink-0">{p.image}</div>
                      <span className="font-semibold text-gray-100 text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{p.category}</td>
                  <td className="px-5 py-4 font-bold text-amber-500 text-sm">Rs. {p.price.toLocaleString()}</td>
                  <td className={`px-5 py-4 text-sm font-medium ${p.stock === 0 ? "text-red-400" : "text-gray-100"}`}>{p.stock}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Btn small onClick={() => openEdit(p)} variant="ghost">✏️ Edit</Btn>
                      <Btn small variant="danger" onClick={() => setConfirm({ id: p.id })}>🗑 Delete</Btn>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </TableWrapper>
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add Product" : "Edit Product"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input label="Product Name" name="name" value={form.name} onChange={onChange} placeholder="e.g. Samsung Galaxy A54" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Price (Rs.)" name="price" value={form.price} onChange={onChange} type="number" placeholder="45000" />
              <Input label="Stock" name="stock" value={form.stock} onChange={onChange} type="number" placeholder="50" />
            </div>
            <Input label="Category" name="category" value={form.category} onChange={onChange} options={seedCategories.map(c => c.name)} />
            <Input label="Image (emoji)" name="image" value={form.image} onChange={onChange} placeholder="e.g. 📱" />
            <Input label="Status" name="status" value={form.status} onChange={onChange} options={["Active", "Inactive", "Out of Stock"]} />
            <div className="flex gap-3 justify-end mt-2">
              <Btn onClick={() => setModal(null)} variant="ghost">Cancel</Btn>
              <Btn onClick={save}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmModal
          message="Are you sure you want to delete this product? This cannot be undone."
          onConfirm={() => { setProducts(p => p.filter(x => x.id !== confirm.id)); setConfirm(null); }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Products;