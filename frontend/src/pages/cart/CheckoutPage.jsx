import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axios.js";
import { useCartStore } from "../../store/cartStore.js";
import { useAuthStore } from "../../store/authStore.js";

const formatLkr = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { authUser } = useAuthStore();
  const { items, getCartSubtotal, clearCart } = useCartStore();

  const [settings, setSettings] = useState({
    deliveryFee: 0,
    taxPercentage: 0,
    serviceCharge: 0,
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    name: authUser
      ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim()
      : "",
    phone: authUser?.phoneNumber || "",
    address: authUser?.address || "",
    paymentMethod: "COD",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setSettingsLoading(true);
        const res = await axiosInstance.get("/settings");

        setSettings({
          deliveryFee: Number(res.data?.deliveryFee || 0),
          taxPercentage: Number(res.data?.taxPercentage || 0),
          serviceCharge: Number(res.data?.serviceCharge || 0),
        });
      } catch (error) {
        toast.error("Failed to load pricing settings");
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Update form when user data loads
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        name: `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim(),
        phone: authUser.phoneNumber || prev.phone,
        address: authUser.address || prev.address,
      }));
    }
  }, [authUser]);

  const subtotal = getCartSubtotal();

  const pricing = useMemo(() => {
    const deliveryFee = Number(settings.deliveryFee || 0);
    const tax = (subtotal * Number(settings.taxPercentage || 0)) / 100;
    const service = (subtotal * Number(settings.serviceCharge || 0)) / 100;
    const discount = Number(couponDiscount || 0);
    const total = subtotal + deliveryFee + tax + service - discount;

    return {
      deliveryFee,
      tax,
      service,
      discount,
      total: Math.max(0, total),
    };
  }, [
    couponDiscount,
    settings.deliveryFee,
    settings.serviceCharge,
    settings.taxPercentage,
    subtotal,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      toast.error("Enter a coupon code");
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const res = await axiosInstance.post("/coupons/validate", {
        code: normalizedCode,
        subtotal,
      });

      const discount = Number(res.data?.discount || 0);
      setCouponCode(normalizedCode);
      setCouponDiscount(discount);
      toast.success(`Coupon applied: -${formatLkr(discount)}`);
    } catch (error) {
      setCouponDiscount(0);
      toast.error(error.response?.data?.message || "Invalid coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    toast.success("Coupon removed");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      toast.error("Please fill name, phone and address");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: Number(item.price || 0),
        quantity: Number(item.qty || 1),
      }));

      const payload = {
        items: orderItems,
        subtotal,
        discount: pricing.discount,
        couponCode: couponCode || null,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        paymentMethod: formData.paymentMethod,
      };

      const res = await axiosInstance.post("/orders", payload);

      await clearCart({ persistToServer: true });

      toast.success("Order placed successfully");
      navigate("/cart", {
        replace: true,
        state: { orderId: res.data?._id || "" },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Cart is empty</h1>
            <p className="mt-2 text-slate-600">
              Add food items before checkout.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Checkout
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Complete your order
          </h1>
          <p className="mt-2 text-slate-600">
            Confirm delivery details, apply coupon, and place your food order.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form
            onSubmit={handlePlaceOrder}
            className="space-y-5 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Delivery details
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-orange-200 px-3 py-2.5 outline-none focus:border-orange-400"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-orange-200 px-3 py-2.5 outline-none focus:border-orange-400"
                  placeholder="07XXXXXXXX"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-xl border border-orange-200 px-3 py-2.5 outline-none focus:border-orange-400"
                placeholder="Delivery address"
                required
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 rounded-xl border border-orange-200 px-4 py-3 cursor-pointer hover:bg-orange-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-slate-500">
                      Pay when order arrives
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-orange-200 px-4 py-3 cursor-pointer hover:bg-orange-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={formData.paymentMethod === "CARD"}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Card Payment
                    </p>
                    <p className="text-xs text-slate-500">
                      Credit/Debit card payment
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-orange-200 px-3 py-2.5 outline-none focus:border-orange-400"
                  placeholder="SAVE10"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || subtotal <= 0}
                  className="rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-orange-50"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </button>

                {pricing.discount > 0 && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPlacingOrder || settingsLoading}
              className="w-full rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
            >
              {isPlacingOrder ? "Placing order..." : "Place Order"}
            </button>
          </form>

          <aside className="h-fit rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Order summary
            </h2>

            <div className="mt-4 space-y-3 border-b border-orange-100 pb-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start justify-between gap-2 text-sm"
                >
                  <p className="text-slate-700">
                    {item.name}{" "}
                    <span className="text-slate-500">x {item.qty}</span>
                  </p>
                  <p className="font-semibold text-slate-900">
                    {formatLkr(Number(item.price || 0) * Number(item.qty || 0))}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatLkr(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>
                  {settingsLoading ? "..." : formatLkr(pricing.deliveryFee)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Tax</span>
                <span>{settingsLoading ? "..." : formatLkr(pricing.tax)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Service Charge</span>
                <span>
                  {settingsLoading ? "..." : formatLkr(pricing.service)}
                </span>
              </div>

              <div className="flex items-center justify-between text-green-700">
                <span>Discount</span>
                <span>-{formatLkr(pricing.discount)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-orange-100 pt-3 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>
                  {settingsLoading ? "..." : formatLkr(pricing.total)}
                </span>
              </div>
            </div>

            <Link
              to="/cart"
              className="mt-4 block w-full rounded-xl border border-orange-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-orange-50"
            >
              Back to Cart
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
