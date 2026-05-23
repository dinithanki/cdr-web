import { useEffect } from "react";
import { Star } from "lucide-react";
import { useReviewStore } from "../../store/reviewStore.js";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function About() {
  const { approvedReviews, loading, getApprovedReviews } = useReviewStore();

  useEffect(() => {
    if (approvedReviews.length === 0) {
      getApprovedReviews();
    }
  }, [approvedReviews.length, getApprovedReviews]);

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-orange-500 text-orange-500"
              : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-linear-to-b from-orange-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <p className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-900 mb-5">
              About Us
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Food made with care, served with trust.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl">
              We bring together fresh ingredients, warm service, and memorable
              meals for every occasion. Our customers shape what we do, and
              their reviews tell the story better than we can.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                <p className="text-3xl font-bold text-slate-900">Fresh</p>
                <p className="mt-1 text-sm text-slate-600">Ingredients daily</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                <p className="text-3xl font-bold text-slate-900">Trusted</p>
                <p className="mt-1 text-sm text-slate-600">
                  Real customer feedback
                </p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                <p className="text-3xl font-bold text-slate-900">Made</p>
                <p className="mt-1 text-sm text-slate-600">For everyday joy</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-4xl bg-orange-200/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-4xl bg-linear-to-r from-orange-700 via-orange-600 to-red-600 p-8 text-white shadow-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-orange-200">
                Customer love
              </p>
              <h2 className="mt-4 text-3xl font-bold">
                Reviews from real orders
              </h2>
              <p className="mt-4 text-slate-300">
                Discover genuine experiences from our community and see what
                customers are saying about us.
              </p>
              <div className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-sm text-slate-300">What we stand for</p>
                <p className="mt-2 text-lg font-medium">
                  Quality meals, clear service, and reviews you can trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 lg:mt-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Customer Reviews
              </h2>
              <p className="mt-2 text-slate-600">
                A selection of public reviews from our customers.
              </p>
            </div>
            <p className="text-sm text-slate-500">
              Showing {approvedReviews.length} review
              {approvedReviews.length === 1 ? "" : "s"}
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
              Loading reviews...
            </div>
          ) : approvedReviews.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
              No reviews yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {approvedReviews.map((review) => (
                <article
                  key={review._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {review.userId?.firstName} {review.userId?.lastName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    {review.userId?.profilePic ? (
                      <img
                        src={review.userId.profilePic}
                        alt={review.userId?.firstName || "Customer"}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-orange-100"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-900">
                        {(review.userId?.firstName?.[0] || "C") +
                          (review.userId?.lastName?.[0] || "")}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">{renderStars(review.rating)}</div>

                  {review.comment ? (
                    <p className="mt-4 text-sm leading-7 text-slate-700">
                      {review.comment}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-slate-500 italic">
                      No written comment provided.
                    </p>
                  )}

                  {review.orderId?.items?.length > 0 && (
                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Ordered items
                      </p>
                      <div className="mt-3 space-y-1">
                        {review.orderId.items.slice(0, 2).map((item, index) => (
                          <p
                            key={`${review._id}-${index}`}
                            className="text-sm text-slate-600"
                          >
                            • {item.name} x{item.quantity}
                          </p>
                        ))}
                        {review.orderId.items.length > 2 && (
                          <p className="text-sm text-slate-500">
                            +{review.orderId.items.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
