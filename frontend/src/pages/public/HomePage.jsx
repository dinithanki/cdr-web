import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bike,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

const highlights = [
  {
    title: "Fast Delivery",
    description: "Fresh meals at your door in 30-40 minutes in covered zones.",
    icon: Bike,
  },
  {
    title: "Always Fresh",
    description: "Cooked on order with daily ingredients and quality checks.",
    icon: Sparkles,
  },
  {
    title: "Trusted Service",
    description: "Secure checkout, reliable support, and consistent taste.",
    icon: ShieldCheck,
  },
];

const categories = [
  "Kottu",
  "Fried Rice",
  "Biriyani",
  "Burgers",
  "Noodles",
  "Beverages",
];

const heroCookingVideoUrl =
  "https://videos.pexels.com/video-files/2620043/2620043-hd_1920_1080_25fps.mp4";

function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white text-slate-900">
      <section className="relative isolate overflow-hidden px-4 pb-14 pt-10 sm:px-6 lg:px-8">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute -right-20 top-0 h-60 w-60 rounded-full bg-red-300/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-700 shadow-sm">
              <Star className="size-3.5" />
              Dragon Dine Signature
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Delicious Food,
              <span className="block bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Delivered With Fire
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
              Explore a bold menu of Sri Lankan favorites and modern comfort
              bites, crafted fresh and delivered fast.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Order Now
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/catering"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400"
              >
                Catering Services
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-700">
              <div className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-orange-600" />
                Open daily 9:00 AM - 11:00 PM
              </div>
              <div className="inline-flex items-center gap-2">
                <Star className="size-4 fill-orange-500 text-orange-500" />
                Rated 4.9 by food lovers
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-slate-900 shadow-xl">
              <video
                className="h-full min-h-72 w-full object-cover sm:min-h-80 lg:min-h-112"
                src={heroCookingVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="inline-flex rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-200 backdrop-blur">
                  Kitchen Live
                </p>
                <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  Fresh Cooking, Every Order
                </h2>
                <p className="mt-2 max-w-md text-sm text-orange-100/90 sm:text-base">
                  Watch how our chefs prepare your meals with speed, heat, and
                  flavor.
                </p>
                <Link
                  to="/promotions"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
                >
                  View Promotions
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-orange-200 bg-white/90 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">
                  Orders completed
                </p>
                <p className="mt-2 text-3xl font-black text-slate-900">25k+</p>
              </article>

              <article className="rounded-2xl border border-red-200 bg-linear-to-br from-red-50 to-orange-50 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                  Average delivery
                </p>
                <p className="mt-2 text-3xl font-black text-slate-900">35m</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
          Why Dragon Dine
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="inline-flex rounded-lg bg-orange-100 p-2 text-orange-700">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-3 text-lg font-extrabold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                Popular Categories
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                Pick What You Crave
              </h2>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
            >
              Browse Full Menu
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category}
                to="/products"
                className="rounded-xl border border-orange-200 bg-linear-to-r from-orange-50 to-red-50 px-4 py-3 text-center text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-orange-300"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
