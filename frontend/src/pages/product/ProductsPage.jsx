import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore.js";
import ProductCard from "../../components/products/ProductCard.jsx";
import { Search } from "lucide-react";

const categories = [
  "All",
  "Kottu",
  "Fried Rice",
  "Noodles",
  "Biriyani",
  "Rice",
  "Pizza",
  "Bites",
  "Sandwiches",
  "Burgers",
  "Side Dishes",
  "Beverages",
];

export default function ProductsPage() {
  const { products, getProducts, loading } = useProductStore();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getProducts();
  }, []);

  // Filter logic
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      activeCategory === "All" || p.category === activeCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white">
      {/* Search & Filter Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
        {/* Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 bg-linear-to-r from-orange-50 to-red-50 rounded-xl px-4 py-3 border border-orange-200">
            <Search size={18} className="text-orange-500" />
            <input
              type="text"
              placeholder="Search your favorite food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder-orange-400"
            />
          </div>
        </div>

        {/* Categories scroll */}
        <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 pb-4 no-scrollbar max-w-7xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-10 w-28 shrink-0 rounded-md text-center text-sm font-medium transition duration-200 ${
                activeCategory === cat
                  ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md"
                  : "bg-white text-slate-700 border border-orange-200 hover:border-orange-400 hover:bg-orange-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-orange-600 font-medium">
              Loading delicious food...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <p className="text-slate-500 font-medium">No food found</p>
            <p className="text-sm text-slate-400">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
