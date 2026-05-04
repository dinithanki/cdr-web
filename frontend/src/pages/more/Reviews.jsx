import { useAuthStore } from "../../store/authStore.js";

export default function Reviews() {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 pb-12 pt-6 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-lg bg-blue-50 p-8 text-slate-600">
            <h2 className="mb-2 text-xl font-semibold text-slate-800">
              Please login to view reviews
            </h2>
            <p>Sign in to your account to see your order reviews.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 pb-12 pt-6 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">My Reviews</h1>

        <div className="rounded-xl bg-white p-8 shadow-md text-center">
          <p className="text-slate-600">
            You haven't written any reviews yet. Start reviewing your favorite
            orders!
          </p>
        </div>
      </div>
    </div>
  );
}
