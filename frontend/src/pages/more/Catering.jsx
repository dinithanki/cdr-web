const highlights = [
  {
    title: "Curated Menus",
    description:
      "Seasonal menu design with vegetarian, vegan, and premium signature options.",
  },
  {
    title: "On-Time Service",
    description:
      "Live station setup, warm delivery, and precise serving schedule for every event.",
  },
  {
    title: "Professional Team",
    description:
      "Experienced chefs and hospitality staff trained for corporate and private events.",
  },
];

const packages = [
  {
    name: "Essential",
    guests: "Up to 30 guests",
    details: "Buffet setup, 2 mains, 2 sides, desserts, and beverage station.",
    price: "From LKR 55,000",
  },
  {
    name: "Signature",
    guests: "Up to 80 guests",
    details:
      "Custom menu, themed table styling, service team, and live grill corner.",
    price: "From LKR 145,000",
    featured: true,
  },
  {
    name: "Grand",
    guests: "80+ guests",
    details:
      "Multi-course experience, premium staff, decor coordination, and event manager.",
    price: "Custom quote",
  },
];

const process = [
  "Tell us your event details",
  "Get a custom menu + quote within 24 hours",
  "We plan setup, service, and timing",
  "You host while we handle everything",
];

export default function Catering() {
  return (
    <main className="w-full">
      <section className="relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-amber-50 via-white to-orange-100/60 px-6 py-14 shadow-sm md:px-12">
        <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-orange-200/50 blur-2xl" />
        <div className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-amber-300/30 blur-2xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-orange-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              Catering by Dragon Dine
            </p>
            <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Premium Catering for Memorable Events
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
              From boardroom lunches to wedding celebrations, we craft food and
              service experiences that feel polished, warm, and unforgettable.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/contact"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Request Catering
              </a>
              <a
                href="/products"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400"
              >
                Explore Menu
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-700">
                Events served
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">1,200+</p>
              <p className="mt-1 text-sm text-slate-600">
                Corporate, private, and social events.
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-700">
                Customer rating
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">4.9/5</p>
              <p className="mt-1 text-sm text-slate-600">
                Trusted by event planners and hosts.
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-700">
                Coverage
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                Kurunegala, Kandy, Colombo and nearby regions
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Why clients choose us
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Catering packages
          </h2>
          <a
            href="/contact"
            className="text-sm font-semibold text-orange-700 hover:text-orange-800"
          >
            Need a custom package?
          </a>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {packages.map((pack) => (
            <article
              key={pack.name}
              className={`rounded-2xl border p-5 shadow-sm ${
                pack.featured
                  ? "border-orange-300 bg-gradient-to-b from-orange-50 to-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                {pack.guests}
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                {pack.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {pack.details}
              </p>
              <p className="mt-6 text-base font-bold text-slate-900">
                {pack.price}
              </p>
              <a
                href="/contact"
                className="mt-5 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
              >
                Book Consultation
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-900 px-6 py-8 text-slate-100 md:px-8">
        <h2 className="text-2xl font-extrabold">
          Simple event planning process
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {process.map((step, index) => (
            <div
              key={step}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-3"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm text-slate-100">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
