import React, { useState } from "react";
import { seedCategories, } from "../data/seeddata";
import type { Category } from "../types";
import { Btn, Input, Modal, ConfirmModal, StatusBadge, SectionHeader, TableWrapper } from "../components/UI";

type CategoryForm = { id?: number; name: string; icon: string; status: "Active" | "Inactive"; productCount?: number };
const EMPTY: CategoryForm = { name: "", icon: "", status: "Active" };

const Categories: React.FC = () => {
  const [cats, setCats] = useState<Category[]>(seedCategories);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [confirm, setConfirm] = useState<{ id: number } | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (c: Category) => { setForm({ ...c }); setModal("edit"); };
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = () => {
    if (!form.name.trim()) return;
    if (modal === "add") {
      setCats(p => [...p, { ...form, id: Date.now(), productCount: 0 } as Category]);
    } else {
      setCats(p => p.map(c => c.id === form.id ? { ...c, ...form } as Category : c));
    }
    setModal(null);
  };

  return (
    <div>
      <SectionHeader
        title="Categories"
        subtitle={`${cats.length} categories total`}
        action={<Btn onClick={openAdd}>+ Add Category</Btn>}
      />

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {cats.map(c => (
          <div key={c.id} className="bg-gray-800 rounded-2xl border border-white/[0.07] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <p className="font-bold text-gray-100">{c.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.productCount} products</p>
                </div>
              </div>
              <StatusBadge status={c.status} />
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
                {["Icon", "Name", "Products", "Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {cats.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-2xl">{c.icon}</td>
                  <td className="px-5 py-4 font-semibold text-gray-100">{c.name}</td>
                  <td className="px-5 py-4 text-gray-400">{c.productCount}</td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
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

      {modal && (
        <Modal title={modal === "add" ? "Add Category" : "Edit Category"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input label="Category Name" name="name" value={form.name} onChange={onChange} placeholder="e.g. Electronics" />
            <Input label="Icon (emoji)" name="icon" value={form.icon} onChange={onChange} placeholder="e.g. ⚡" />
            <Input label="Status" name="status" value={form.status} onChange={onChange} options={["Active", "Inactive"]} />
            <div className="flex gap-3 justify-end mt-2">
              <Btn onClick={() => setModal(null)} variant="ghost">Cancel</Btn>
              <Btn onClick={save}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmModal
          message="Are you sure you want to delete this category? This cannot be undone."
          onConfirm={() => { setCats(p => p.filter(c => c.id !== confirm.id)); setConfirm(null); }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Categories;