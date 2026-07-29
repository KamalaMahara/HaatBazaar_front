import React, { useState, useEffect, useRef } from "react";
import { StatusBadge } from "../components/UI";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../../../store/adminProductSlice";
import { Status } from "../../../globals/types/types";
import { API } from "../../../http";

type ProductForm = {
  id?: string;
  name: string;
  category: string; // will hold selected categoryId
  description: string;
  price: string | number;
  stock: string | number;
  status: "Active" | "Inactive" | "Out of Stock";
  image: string | null;
  imageFile?: File | null;
};

const EMPTY: ProductForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  status: "Active",
  image: null,
  imageFile: null,
};

const ProductImage: React.FC<{ src: string | null; name: string; size?: string }> = ({
  src,
  name,
  size = "w-9 h-9",
}) => {
  if (src && src.trim() !== "") {
    const fullSrc = src.startsWith("http") ? src : `http://localhost:8000/${src}`;
    return (
      <img
        src={fullSrc}
        alt={name}
        className={`${size} rounded-lg object-cover flex-shrink-0`}
        onError={(e) => {
          // If image fails to load, replace with initial placeholder
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<span class="text-amber-400 font-bold text-sm">${name.charAt(0).toUpperCase()}</span>`;
            parent.className = `${size} rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0`;
          }
        }}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-amber-400 font-bold text-sm">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, status } = useAppSelector((store) => store.adminProducts);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; categoryName: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get("/category");
        setCategories(res.data.data ?? []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  const mappedProducts = products.map((p) => ({
    id: p.id,
    name: p.productName,
    categoryId: p.categoryId,
    category: p.category?.categoryName || "Unknown",
    description: p.productDescription || "",
    price: p.productPrice ?? null,
    stock: p.productTotalStock,
    image: p.productImageUrl,
    status: (p.productTotalStock === 0 ? "Out of Stock" : "Active") as
      | "Active"
      | "Out of Stock",
  }));

  const filtered = mappedProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setForm(EMPTY);
    setImagePreview(null);
    setModal("add");
  };

  const openEdit = (p: (typeof mappedProducts)[0]) => {
    setForm({
      id: p.id,
      name: p.name,
      category: p.categoryId,
      description: p.description,
      price: p.price ?? "",
      stock: p.stock,
      status: p.status,
      image: p.image,
      imageFile: null,
    });
    setImagePreview(p.image);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setForm(EMPTY);
    setImagePreview(null);
  };

  const handleSave = () => {
    console.log("Image file:", form.imageFile);
    if (!form.name || !form.price || form.stock === "" || !form.category || !form.description) {
      alert("Please fill in name, price, stock, category and description");
      return;
    }

    const formData = new FormData();
    formData.append("productName", form.name);
    formData.append("productPrice", String(form.price));
    formData.append("productTotalStock", String(form.stock));
    formData.append("productDiscount", "0");
    formData.append("categoryId", form.category);
    formData.append("productDescription", form.description);

    if (form.imageFile) {
      formData.append("productImage", form.imageFile);
    }

    if (modal === "add") {
      console.log("========== FORMDATA ==========");

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      dispatch(addProduct(formData));
    } else if (modal === "edit" && form.id) {
      dispatch(updateProduct(form.id, formData));
    }

    closeModal();
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (status === Status.LOADING) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          Loading products...
        </div>
      </div>
    );
  }

  if (status === Status.ERROR) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-red-400">Failed to load products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Products</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {mappedProducts.length} total products
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-amber-500 hover:bg-amber-400 transition-colors px-4 py-2 rounded-xl text-black font-bold text-sm"
        >
          + Add Product
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-800 text-white text-sm placeholder-gray-500 border border-white/5 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* TABLE */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Product</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Price</th>
              <th className="text-left px-4 py-3 font-medium">Stock</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="text-white hover:bg-white/3 transition-colors"
              >
                {/* Product name + image */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage src={p.image} name={p.name} />
                    <span className="font-medium text-white">{p.name}</span>
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-300">{p.category}</td>

                <td className="px-4 py-3 text-gray-300">
                  {p.price !== null ? `Rs. ${p.price}` : "—"}
                </td>

                <td className="px-4 py-3 text-gray-300">{p.stock}</td>

                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-base">No products found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-bold text-base">
                {modal === "add" ? "Add Product" : "Edit Product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition-colors border-none bg-transparent cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">
                  Product Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-xl p-4 flex items-center gap-4 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview.startsWith("data:") || imagePreview.startsWith("blob:") ? imagePreview : `http://localhost:8000/${imagePreview}`}
                      alt="preview"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-500"
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
                  <div>
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

              {/* Product Name */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="e.g. Foundation"
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Enter product description..."
                  rows={3}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Stock row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={onChange}
                    placeholder="0"
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={onChange}
                    placeholder="0"
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={onChange}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-700 hover:bg-gray-600 transition-colors py-2.5 rounded-xl text-white text-sm font-medium border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-amber-500 hover:bg-amber-400 transition-colors py-2.5 rounded-xl text-black text-sm font-bold border-none cursor-pointer"
              >
                {modal === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;