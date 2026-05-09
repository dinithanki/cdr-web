import { Link } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "../store/cartStore.js";
import { useAuthStore } from "../store/authStore.js";
import { confirmAction } from "../utils/confirmAction.js";

const formatLkr = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const CartDrawer = () => {
  const {
    items,
    isDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
    getCartSubtotal,
    clearCart,
  } = useCartStore();
  const { authUser } = useAuthStore();

  const handleQuantityChange = async (item, delta) => {
    const nextQty = Number(item.qty || 1) + delta;

    if (nextQty < 1) {
      await removeItem(item.productId, { persistToServer: Boolean(authUser) });
      return;
    }

    await updateQuantity(item.productId, nextQty, {
      persistToServer: Boolean(authUser),
    });
  };

  const handleClearCart = async () => {
    const shouldClear = await confirmAction({
      title: "Clear cart?",
      message: "Clear all items from cart?",
      confirmText: "Clear cart",
      cancelText: "Keep items",
      variant: "warning",
    });
    if (!shouldClear) return;

    await clearCart({ persistToServer: Boolean(authUser) });
  };

  if (!isDrawerOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close cart drawer"
        onClick={closeCartDrawer}
        className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm"
      />

      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-orange-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-100 bg-linear-to-r from-orange-50 to-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
            <p className="text-sm text-slate-500">
              {authUser ? "Synced with your account" : "Saved on this device"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCartDrawer}
            className="rounded-full p-2 transition hover:bg-orange-100"
          >
            <X className="size-5 text-slate-700" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center text-slate-500">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                <ShoppingBag className="size-7 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  Your cart is empty
                </p>
                <p className="text-sm">Add a few dishes to see them here.</p>
              </div>
              <Link
                to="/products"
                onClick={closeCartDrawer}
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 rounded-2xl border border-orange-100 bg-white p-3 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl bg-orange-50 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {formatLkr(item.price)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.productId, {
                          persistToServer: Boolean(authUser),
                        })
                      }
                      className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-xl border border-orange-100 bg-orange-50">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, -1)}
                        className="p-2 text-orange-600"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="min-w-10 px-2 text-center text-sm font-semibold text-slate-900">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, 1)}
                        className="p-2 text-orange-600"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {formatLkr(Number(item.price) * Number(item.qty))}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4 border-t border-orange-100 bg-white p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-semibold text-slate-900">
              {formatLkr(getCartSubtotal())}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            disabled={items.length === 0}
            className="w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Cart
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={closeCartDrawer}
              className="rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50"
            >
              Continue Shopping
            </button>
            <Link
              to="/cart"
              onClick={closeCartDrawer}
              className="rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              View Cart
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
