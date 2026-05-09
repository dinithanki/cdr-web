import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore.js";
import { confirmAction } from "../../utils/confirmAction.js";

export default function AdminProducts() {
  const {
    products,
    loading,
    getProductsAdmin,
    createProduct,
    deleteProduct,
    updateProduct,
  } = useProductStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    size: "Medium",
    isAvailable: true,
  });

  useEffect(() => {
    getProductsAdmin();
  }, [getProductsAdmin]);

  const categories = [
    "all",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((product) => {
    const name = (product.name || "").toLowerCase();
    const category = (product.category || "").toLowerCase();
    const normalizedSearch = searchTerm.toLowerCase();

    const matchesSearch =
      name.includes(normalizedSearch) || category.includes(normalizedSearch);

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && product.isAvailable) ||
      (statusFilter === "unavailable" && !product.isAvailable);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      preparationTime: product.preparationTime ?? "",
      size: product.size || "Medium",
      isAvailable: Boolean(product.isAvailable),
    });
    setImageFile(null);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setImageFile(null);
  };
  const openViewModal = (product) => setViewProduct(product);
  const closeViewModal = () => setViewProduct(null);
  const openCreateModal = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      preparationTime: "",
      size: "Medium",
      isAvailable: true,
    });
    setImageFile(null);
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setImageFile(files?.[0] || null);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "isAvailable" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct?._id) return;

    setIsSaving(true);
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", String(Number(formData.price)));
    payload.append("category", formData.category);
    payload.append("preparationTime", String(Number(formData.preparationTime)));
    payload.append("size", formData.size);
    payload.append("isAvailable", String(formData.isAvailable));

    if (imageFile) {
      payload.append("image", imageFile);
    }

    const updatedProduct = await updateProduct(selectedProduct._id, payload);
    setIsSaving(false);

    if (updatedProduct) closeEditModal();
  };

  const handleDelete = async (product) => {
    if (!product?._id) return;

    const shouldDelete = await confirmAction({
      title: "Delete product?",
      message: `Delete ${product.name}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Keep product",
      variant: "danger",
    });

    if (!shouldDelete) return;
    await deleteProduct(product._id);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", String(Number(formData.price)));
    payload.append("category", formData.category);
    payload.append("preparationTime", String(Number(formData.preparationTime)));
    payload.append("size", formData.size);
    payload.append("isAvailable", String(formData.isAvailable));

    if (imageFile) {
      payload.append("image", imageFile);
    }

    await createProduct(payload);
    setIsSaving(false);
    closeCreateModal();
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "Not available";

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">Manage menu products.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Add Product
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 md:w-1/3"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          No products found in system.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No products match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t text-sm text-gray-700"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">
                      ${Number(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{product.size || "Medium"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.isAvailable
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openViewModal(product)}
                        className="mr-2 rounded-lg bg-slate-600 px-3 py-2 text-white"
                      >
                        View
                      </button>

                      <button
                        onClick={() => openEditModal(product)}
                        className="mr-2 rounded-lg bg-blue-500 px-3 py-2 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Product Details
              </h2>
              <button
                onClick={closeViewModal}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-center">
                {viewProduct.image ? (
                  <img
                    src={viewProduct.image}
                    alt={viewProduct.name || "Product image"}
                    className="h-40 w-40 rounded-xl border object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-xl border bg-gray-50 text-xs text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              <p>
                <span className="font-medium text-gray-900">Name:</span>{" "}
                {viewProduct.name || "Not available"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Category:</span>{" "}
                {viewProduct.category || "Not available"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Description:</span>{" "}
                {viewProduct.description || "Not available"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Price:</span> $
                {Number(viewProduct.price || 0).toFixed(2)}
              </p>
              <p>
                <span className="font-medium text-gray-900">Size:</span>{" "}
                {viewProduct.size || "Medium"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Prep Time:</span>{" "}
                {viewProduct.preparationTime || "Not available"} min
              </p>
              <p>
                <span className="font-medium text-gray-900">Status:</span>{" "}
                {viewProduct.isAvailable ? "Available" : "Unavailable"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Created:</span>{" "}
                {formatDate(viewProduct.createdAt)}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeViewModal}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Product
              </h2>
              <button
                onClick={closeEditModal}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product name"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                name="preparationTime"
                type="number"
                min="15"
                value={formData.preparationTime}
                onChange={handleChange}
                placeholder="Preparation time (minutes)"
                className="rounded-lg border px-3 py-2"
                required
              />

              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="rounded-lg border px-3 py-2"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>

              <select
                name="isAvailable"
                value={String(formData.isAvailable)}
                onChange={handleChange}
                className="rounded-lg border px-3 py-2"
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-gray-700">
                  Product Image
                </label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {imageFile
                    ? `Selected: ${imageFile.name}`
                    : selectedProduct?.image
                      ? "Leave empty to keep the current image."
                      : "Optional. If you skip this, the default product image is used."}
                </p>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="rounded-lg border px-3 py-2 md:col-span-2"
                rows={4}
                required
              />

              <div className="mt-2 flex justify-end gap-2 md:col-span-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Add Product
              </h2>
              <button
                onClick={closeCreateModal}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product name"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                name="preparationTime"
                type="number"
                min="15"
                value={formData.preparationTime}
                onChange={handleChange}
                placeholder="Preparation time (minutes)"
                className="rounded-lg border px-3 py-2"
                required
              />

              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="rounded-lg border px-3 py-2"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>

              <select
                name="isAvailable"
                value={String(formData.isAvailable)}
                onChange={handleChange}
                className="rounded-lg border px-3 py-2"
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-gray-700">
                  Product Image
                </label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {imageFile
                    ? `Selected: ${imageFile.name}`
                    : selectedProduct?.image
                      ? "Leave empty to keep the current image."
                      : "Optional. If you skip this, the default product image is used."}
                </p>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="rounded-lg border px-3 py-2 md:col-span-2"
                rows={4}
                required
              />

              <div className="mt-2 flex justify-end gap-2 md:col-span-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
