import { useEffect, useMemo, useState } from "react";
import { useAdminStore } from "../../../store/adminStore.js";

const SAMPLE_SUBTOTAL = 5000;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function SettingsPage() {
  const { settings, settingsLoading, getSettings, updateSettings } =
    useAdminStore();

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    deliveryFee: "350",
    taxPercentage: "0",
    serviceCharge: "0",
  });

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  useEffect(() => {
    if (!settings) return;

    setFormData({
      deliveryFee: String(settings.deliveryFee ?? 0),
      taxPercentage: String(settings.taxPercentage ?? 0),
      serviceCharge: String(settings.serviceCharge ?? 0),
    });
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const preview = useMemo(() => {
    const subtotal = SAMPLE_SUBTOTAL;
    const deliveryFee = Number(formData.deliveryFee || 0);
    const taxPercentage = Number(formData.taxPercentage || 0);
    const serviceCharge = Number(formData.serviceCharge || 0);

    const tax = (subtotal * taxPercentage) / 100;
    const service = (subtotal * serviceCharge) / 100;
    const total = subtotal + deliveryFee + tax + service;

    return { subtotal, deliveryFee, tax, service, total };
  }, [formData.deliveryFee, formData.serviceCharge, formData.taxPercentage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      deliveryFee: Number(formData.deliveryFee || 0),
      taxPercentage: Number(formData.taxPercentage || 0),
      serviceCharge: Number(formData.serviceCharge || 0),
    };

    await updateSettings(payload);
    setIsSaving(false);
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">
          Control delivery fee, tax percentage, service charge, and pricing
          behavior for all food orders.
        </p>
      </div>

      {settingsLoading ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          Loading settings...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Pricing Rules
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Delivery Fee
                </label>
                <input
                  name="deliveryFee"
                  type="number"
                  min="0"
                  value={formData.deliveryFee}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Tax Percentage (%)
                </label>
                <input
                  name="taxPercentage"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.taxPercentage}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Service Charge (%)
                </label>
                <input
                  name="serviceCharge"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.serviceCharge}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Price Preview
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>Sample Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(preview.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold">
                  {formatCurrency(preview.deliveryFee)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span className="font-semibold">
                  {formatCurrency(preview.tax)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Service</span>
                <span className="font-semibold">
                  {formatCurrency(preview.service)}
                </span>
              </div>
              <div className="mt-3 border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Final Total</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(preview.total)}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Preview uses a sample subtotal of{" "}
              {formatCurrency(SAMPLE_SUBTOTAL)}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
