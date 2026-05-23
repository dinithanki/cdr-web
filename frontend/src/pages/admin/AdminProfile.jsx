import { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import AdminProfileEdit from "./AdminProfileEdit";
import { Mail, Phone, MapPin, LogOut, Edit3, ShieldCheck } from "lucide-react";

const DEFAULT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80";

export default function AdminProfilePage() {
  const { authUser, logout } = useAuthStore();
  const [editMode, setEditMode] = useState(false);

  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500 text-lg">Loading admin profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-orange-50 to-white p-4 sm:p-6 lg:p-8">
      {!editMode ? (
        <div className="mx-auto max-w-4xl">
          {/* HEADER SECTION */}
          <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-linear-to-r from-slate-900 via-orange-900 to-slate-900 p-8 sm:p-12 shadow-xl">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-slate-500/20 blur-3xl" />

            <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-end sm:gap-6 sm:text-left">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={authUser.profilePic || DEFAULT_PROFILE_IMAGE}
                  alt="profile"
                  className="h-32 w-32 rounded-2xl object-cover border-4 border-orange-400 shadow-lg sm:h-40 sm:w-40"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
                <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500 p-3 shadow-lg">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
              </div>

              <div className="mt-4 sm:mt-0 sm:flex-1">
                <p className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-500/20 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-200 mb-2">
                  <ShieldCheck className="h-3 w-3" />
                  Administrator
                </p>
                <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                  {authUser.firstName} {authUser.lastName}
                </h1>
                <p className="mt-2 text-orange-200">{authUser.email}</p>
              </div>
            </div>
          </div>

          {/* INFO CARDS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-blue-100 p-2 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-600">Email</p>
              <p className="mt-1 text-lg font-bold text-slate-900 break-all">
                {authUser.email}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-green-100 p-2 text-green-600">
                <Phone className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-600">Phone</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {authUser.phoneNumber || "Not set"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
              <div className="inline-flex rounded-lg bg-purple-100 p-2 text-purple-600">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-600">
                Address
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {authUser.address || "Not set"}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Edit3 className="h-5 w-5" />
              Edit Profile
            </button>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-6 py-3 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      ) : (
        <AdminProfileEdit setEditMode={setEditMode} />
      )}
    </div>
  );
}
