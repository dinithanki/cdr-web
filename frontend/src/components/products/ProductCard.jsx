import { ShoppingCart, Clock } from "lucide-react";
import toast from "react-hot-toast";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80";

const formatLkr = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function ProductCard({ product }) {
  const imageUrl = product.image?.trim() ? product.image : PLACEHOLDER_IMAGE;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex((item) => item._id === product._id);

    if (existingIndex >= 0) {
      cart[existingIndex].qty += 1;
      toast.success(`${product.name} quantity increased`);
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: imageUrl,
        qty: 1,
      });
      toast.success(`${product.name} added to cart`);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <article className="group h-full bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-linear-to-br from-orange-100 to-red-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-110 transition duration-500"
          loading="lazy"
        />
        {/* Badge */}
        {product.preparationTime && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-md">
            <Clock size={14} className="text-orange-600" />
            <span className="text-xs font-semibold text-slate-900">
              {product.preparationTime}m
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
            {product.name}
          </h2>
          <p className="text-xs text-slate-500 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price & Button */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {formatLkr(product.price)}
            </p>
            {product.size && (
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                {product.size}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
