import { useAuthStore } from "../../store/authStore.js";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axios.js";
import { Ticket, Clock, Copy, Check } from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function Promotions() {
  const { authUser } = useAuthStore();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        const response = await axiosInstance.get("/coupons/active/list");
        console.log("Coupons fetched:", response.data);
        setCoupons(response.data);
      } catch (error) {
        console.error(
          "Error fetching coupons:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 pb-12 pt-6 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-lg bg-blue-50 p-8 text-slate-600">
            <h2 className="mb-2 text-xl font-semibold text-slate-800">
              Please login to view promotions
            </h2>
            <p>Sign in to your account to access exclusive offers.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 pb-12 pt-6 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Promotions</h1>
        <p className="mb-8 text-slate-600">
          Check out our active coupons and save on your next order
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">Loading promotions...</div>
          </div>
        ) : coupons.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <Ticket size={40} className="mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600">
              No active promotions available right now
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => {
              const isLimitReached =
                coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;
              return (
                <div
                  key={coupon._id}
                  className={`rounded-xl shadow-md transition ${
                    isLimitReached
                      ? "bg-gray-100 opacity-60"
                      : "bg-white hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`border-b border-slate-200 p-4 text-white ${
                      isLimitReached
                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                        : "bg-gradient-to-r from-orange-500 to-red-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
                          Promo Code
                        </p>
                        <p className="mt-1 text-2xl font-bold">{coupon.code}</p>
                      </div>
                      <div className="rounded-lg bg-white/20 p-2">
                        <Ticket size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Discount
                      </p>
                      <p className="mt-1 text-xl font-bold text-orange-600">
                        {coupon.discountType === "PERCENT"
                          ? `${coupon.discountValue}%`
                          : formatCurrency(coupon.discountValue)}
                      </p>
                    </div>

                    {coupon.minOrderAmount && (
                      <div className="mb-4 text-xs text-slate-600">
                        <p className="font-semibold">
                          Min. order: {formatCurrency(coupon.minOrderAmount)}
                        </p>
                      </div>
                    )}

                    {coupon.expiryDate && (
                      <div className="mb-4 flex items-center gap-2 text-xs text-slate-600">
                        <Clock size={14} />
                        <span>
                          Expires{" "}
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {coupon.description && (
                      <p className="mb-4 text-xs text-slate-600">
                        {coupon.description}
                      </p>
                    )}

                    {coupon.usageLimit && (
                      <div className="mb-4 text-xs text-slate-600">
                        <p className="font-semibold">
                          Usage: {coupon.usageCount}/{coupon.usageLimit}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      disabled={isLimitReached}
                      className={`w-full rounded-lg px-3 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition ${
                        isLimitReached
                          ? "cursor-not-allowed bg-gray-200 text-gray-500"
                          : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      }`}
                    >
                      {isLimitReached ? (
                        <>Limit Reached</>
                      ) : copiedCode === coupon.code ? (
                        <>
                          <Check size={16} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
