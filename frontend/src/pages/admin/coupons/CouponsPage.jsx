import { useEffect, useMemo, useState } from "react";
import { useAdminStore } from "../../../store/adminStore.js";

const DISCOUNT_TYPES = ["PERCENT", "FIXED"];

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "No expiry";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function CouponsPage() {
  const {
    coupons,
    couponsLoading,
    getCoupons,
    createCoupon,
    updateCoupon,
    toggleCouponStatus,
  } = useAdminStore();

  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [createForm, setCreateForm] = useState({
    code: "",
    discountType: "PERCENT",
    discountValue: "",
    minOrderAmount: "0",
    expiryDate: "",
    isActive: true,
  });

  const [editForm, setEditForm] = useState({
    code: "",
    discountType: "PERCENT",
    discountValue: "",
    minOrderAmount: "0",
    expiryDate: "",
    isActive: true,
  });

  useEffect(() => {
    getCoupons();
  }, [getCoupons]);

  const filteredCoupons = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return coupons.filter((coupon) => {
      const code = String(coupon.code || "").toLowerCase();

      const matchesSearch = code.includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && coupon.isActive) ||
        (statusFilter === "inactive" && !coupon.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, statusFilter]);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      code: createForm.code.trim().toUpperCase(),
      discountType: createForm.discountType,
      discountValue: Number(createForm.discountValue || 0),
      minOrderAmount: Number(createForm.minOrderAmount || 0),
      expiryDate: createForm.expiryDate || null,
      isActive: Boolean(createForm.isActive),
    };

    const created = await createCoupon(payload);
    setIsSaving(false);

    if (!created) return;

    setCreateForm({
      code: "",
      discountType: "PERCENT",
      discountValue: "",
      minOrderAmount: "0",
      expiryDate: "",
      isActive: true,
    });
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setEditForm({
      code: coupon.code || "",
      discountType: coupon.discountType || "PERCENT",
      discountValue: String(coupon.discountValue ?? ""),
      minOrderAmount: String(coupon.minOrderAmount ?? 0),
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().slice(0, 10)
        : "",
      isActive: Boolean(coupon.isActive),
    });
  };

  const closeEditModal = () => setSelectedCoupon(null);

  const handleEditCoupon = async (e) => {
    e.preventDefault();
    if (!selectedCoupon?._id) return;

    setIsSaving(true);

    const payload = {
      code: editForm.code.trim().toUpperCase(),
      discountType: editForm.discountType,
      discountValue: Number(editForm.discountValue || 0),
      minOrderAmount: Number(editForm.minOrderAmount || 0),
      expiryDate: editForm.expiryDate || null,
      isActive: Boolean(editForm.isActive),
    };

    const updated = await updateCoupon(selectedCoupon._id, payload);
    setIsSaving(false);

    if (updated) {
      closeEditModal();
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Coupons</h1>
        <p className="text-sm text-gray-500">
          Create discount codes and control coupon activation rules.
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Create New Coupon
        </h2>

        <form
          onSubmit={handleCreateCoupon}
          className="grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          <input
            name="code"
            value={createForm.code}
            onChange={handleCreateChange}
            placeholder="Code (e.g. SAVE10)"
            className="rounded-lg border px-3 py-2"
            required
          />

          <select
            name="discountType"
            value={createForm.discountType}
            onChange={handleCreateChange}
            className="rounded-lg border px-3 py-2"
          >
            {DISCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            name="discountValue"
            type="number"
            min="0"
            value={createForm.discountValue}
            onChange={handleCreateChange}
            placeholder="Discount value"
            className="rounded-lg border px-3 py-2"
            required
          />

          <input
            name="minOrderAmount"
            type="number"
            min="0"
            value={createForm.minOrderAmount}
            onChange={handleCreateChange}
            placeholder="Minimum order amount"
            className="rounded-lg border px-3 py-2"
          />

          <input
            name="expiryDate"
            type="date"
            value={createForm.expiryDate}
            onChange={handleCreateChange}
            className="rounded-lg border px-3 py-2"
          />

          <select
            name="isActive"
            value={String(createForm.isActive)}
            onChange={handleCreateChange}
            className="rounded-lg border px-3 py-2"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
              {isSaving ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Search by coupon code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 md:w-1/3"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {couponsLoading ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          Loading coupons...
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          No coupons created yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Rule</th>
                <th className="px-4 py-3">Min Order</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No coupons match your filters.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="border-t text-sm text-gray-700"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {coupon.code}
                    </td>
                    <td className="px-4 py-3">
                      {coupon.discountType === "PERCENT"
                        ? `${coupon.discountValue}% off`
                        : `$${coupon.discountValue} off`}
                    </td>
                    <td className="px-4 py-3">${coupon.minOrderAmount || 0}</td>
                    <td className="px-4 py-3">
                      {formatDate(coupon.expiryDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          coupon.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="rounded-lg bg-blue-500 px-3 py-2 text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleCouponStatus(coupon._id, !coupon.isActive)
                          }
                          className={`rounded-lg px-3 py-2 text-white ${
                            coupon.isActive ? "bg-red-500" : "bg-green-600"
                          }`}
                        >
                          {coupon.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Coupon
              </h2>
              <button
                onClick={closeEditModal}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={handleEditCoupon}
              className="grid grid-cols-1 gap-3 md:grid-cols-2"
            >
              <input
                name="code"
                value={editForm.code}
                onChange={handleEditChange}
                placeholder="Coupon code"
                className="rounded-lg border px-3 py-2"
                required
              />

              <select
                name="discountType"
                value={editForm.discountType}
                onChange={handleEditChange}
                className="rounded-lg border px-3 py-2"
              >
                {DISCOUNT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <input
                name="discountValue"
                type="number"
                min="0"
                value={editForm.discountValue}
                onChange={handleEditChange}
                placeholder="Discount value"
                className="rounded-lg border px-3 py-2"
                required
              />

              <input
                name="minOrderAmount"
                type="number"
                min="0"
                value={editForm.minOrderAmount}
                onChange={handleEditChange}
                placeholder="Minimum order amount"
                className="rounded-lg border px-3 py-2"
              />

              <input
                name="expiryDate"
                type="date"
                value={editForm.expiryDate}
                onChange={handleEditChange}
                className="rounded-lg border px-3 py-2"
              />

              <select
                name="isActive"
                value={String(editForm.isActive)}
                onChange={handleEditChange}
                className="rounded-lg border px-3 py-2"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <div className="mt-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
