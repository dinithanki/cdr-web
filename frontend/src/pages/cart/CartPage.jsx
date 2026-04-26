import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "../../store/cartStore.js";
import { useAuthStore } from "../../store/authStore.js";

const formatLkr = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const CartPage = () => {
  const { items, updateQuantity, removeItem, getCartSubtotal } = useCartStore();
  const { clearCart } = useCartStore();
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
    const shouldClear = window.confirm("Clear all items from cart?");
    if (!shouldClear) return;

    await clearCart({ persistToServer: Boolean(authUser) });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Cart
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Full cart view
            </h1>
            <p className="mt-2 text-slate-600">
              Review items, adjust quantities, and continue to checkout.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-orange-50"
          >
            Back to menu
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-orange-200 bg-white/80 p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
              <ShoppingBag className="size-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-slate-500">
              Add items from the menu to build your order.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-2xl bg-orange-50 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-slate-900">
                          {item.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
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

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
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

                      <p className="text-lg font-semibold text-slate-900">
                        {formatLkr(Number(item.price) * Number(item.qty))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="sticky top-24 h-fit rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Order summary
              </h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Items</span>
                  <span>
                    {items.reduce(
                      (total, item) => total + Number(item.qty || 0),
                      0,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {formatLkr(getCartSubtotal())}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Proceed to Checkout
              </Link>

              <button
                type="button"
                onClick={handleClearCart}
                className="mt-3 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Clear Cart
              </button>

              <Link
                to="/products"
                className="mt-3 block w-full rounded-xl border border-orange-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-orange-50"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
