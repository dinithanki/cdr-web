import { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import EditProfile from "./EditProfile";
import { Mail, Phone, MapPin, CalendarDays, ShieldCheck } from "lucide-react";

const DEFAULT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80";

export default function ProfilePage() {
  const { authUser, logout } = useAuthStore();
  const [editMode, setEditMode] = useState(false);

  if (!authUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-orange-50 via-amber-50 to-white px-4 pt-28 text-slate-600">
        Loading profile...
      </div>
    );
  }

  const fullName =
    `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim();
  const profileImage = authUser.profilePic?.trim()
    ? authUser.profilePic
    : DEFAULT_PROFILE_IMAGE;

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white px-4 pb-10 pt-28 sm:px-6">
      {!editMode ? (
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-orange-100 bg-white/95 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <img
              src={profileImage}
              alt={fullName || "profile"}
              className="h-28 w-28 rounded-full border-4 border-orange-200 object-cover shadow-md sm:h-32 sm:w-32"
            />

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {fullName || "Guest User"}
              </h2>
              <p className="text-sm font-medium text-orange-600">
                {authUser.role || "customer"}
              </p>
            </div>

            <div className="grid w-full gap-3 pt-2 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-left">
                <Mail size={18} className="mt-0.5 text-orange-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {authUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-left">
                <Phone size={18} className="mt-0.5 text-orange-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {authUser.phoneNumber || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-left sm:col-span-2">
                <MapPin size={18} className="mt-0.5 text-orange-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Address
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {authUser.address || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-left">
                <CalendarDays size={18} className="mt-0.5 text-orange-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Joined
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {authUser.createdAt
                      ? new Date(authUser.createdAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-left">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 text-orange-600" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Account Status
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      Current
                    </p>
                  </div>
                </div>
                {authUser?.isBlocked ? (
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
                    Blocked
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="mt-2 flex w-full flex-col gap-3 pt-3 sm:flex-row">
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-orange-600 hover:to-red-600"
              >
                Edit Profile
              </button>

              <button
                onClick={logout}
                className="flex-1 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <EditProfile setEditMode={setEditMode} />
      )}
    </div>
  );
}
