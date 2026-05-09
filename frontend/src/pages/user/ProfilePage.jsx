import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { useContactStore } from "../../store/contactStore.js";
import EditProfile from "./EditProfile";
import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Edit2,
  LogOut,
  Clock,
  Star,
  MessageSquare,
} from "lucide-react";

const DEFAULT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80";

export default function ProfilePage() {
  const { authUser, logout } = useAuthStore();
  const { myContacts, fetchMyContacts } = useContactStore();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (authUser && !editMode) {
      fetchMyContacts();
    }
  }, [authUser, editMode, fetchMyContacts]);

  useEffect(() => {
    if (!editMode) return;

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [editMode]);

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
  const memberSince = authUser.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";
  const supportCounts = {
    pending: myContacts.filter((c) => c.status === "Pending").length,
    underReview: myContacts.filter((c) => c.status === "Under Review").length,
    replied: myContacts.filter((c) => c.status === "Replied").length,
    closed: myContacts.filter((c) => c.status === "Closed").length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 pb-10 pt-5 sm:px-6">
      {!editMode ? (
        <div className="mx-auto w-full max-w-7xl">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-16 bg-white" />
            <div className="-mt-12 flex flex-col gap-5 px-5 pb-5 sm:flex-row sm:items-end sm:px-8">
              <div className="relative shrink-0 h-24 w-24 sm:h-28 sm:w-28">
                <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-slate-100 shadow-lg">
                  <span className="text-3xl font-black text-slate-300">
                    {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <img
                  src={profileImage}
                  alt="Profile"
                  className="absolute inset-0 h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1 pb-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                        {fullName || "Guest User"}
                      </h2>
                      {authUser?.isBlocked ? (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-700 ring-1 ring-red-500/20">
                          Blocked
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-500/20">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-500">
                      <span className="inline-flex items-center gap-1.5 capitalize text-slate-700">
                        <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                        {authUser.role || "customer"}
                      </span>
                      <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                      <span>{authUser.email}</span>
                      <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                      <span>Joined {memberSince}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={logout}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-lg font-black text-slate-950">
                  Contact Details
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  Customer Info
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="mb-2 inline-flex rounded-lg bg-orange-100 p-2">
                    <Mail size={18} className="text-orange-600" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Email Address
                  </p>
                  <p className="mt-1 break-words font-semibold text-slate-900">
                    {authUser.email}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="mb-2 inline-flex rounded-lg bg-sky-100 p-2">
                    <Phone size={18} className="text-blue-600" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Phone Number
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {authUser.phoneNumber || "Not set"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
                  <div className="mb-2 inline-flex rounded-lg bg-emerald-100 p-2">
                    <MapPin size={18} className="text-green-600" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Delivery Address
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {authUser.address || "Not set"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-black text-slate-950">
                Account Details
              </h2>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="mb-2 inline-flex rounded-lg bg-violet-100 p-2">
                  <CalendarDays size={18} className="text-purple-600" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Member Since
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {memberSince}
                </p>
              </div>

              <div className="mt-3 rounded-xl bg-slate-950 p-4 text-white">
                <p className="text-sm font-semibold text-white/70">
                  Account Health
                </p>
                <p className="mt-1 text-xl font-black">
                  {authUser?.isBlocked ? "Action Needed" : "Good Standing"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {authUser?.isBlocked
                    ? "Please contact support to review your account."
                    : "Your account is active and ready for orders."}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    Account Activity
                  </h2>
                  <p className="text-sm text-slate-500">
                    A quick look at orders and support messages.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-orange-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-white p-2 shadow-sm">
                      <Clock size={18} className="text-orange-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-950">0</p>
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-700">
                    Active Orders
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-emerald-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-white p-2 shadow-sm">
                      <Star size={18} className="text-green-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-950">0</p>
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-700">
                    Total Orders
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-sky-50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-lg bg-white p-2 shadow-sm">
                      <MessageSquare size={18} className="text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      Support Messages
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span className="rounded-lg bg-white px-2 py-1.5 font-bold text-yellow-700">
                      {supportCounts.pending} Pending
                    </span>
                    <span className="rounded-lg bg-white px-2 py-1.5 font-bold text-blue-700">
                      {supportCounts.underReview} Review
                    </span>
                    <span className="rounded-lg bg-white px-2 py-1.5 font-bold text-green-700">
                      {supportCounts.replied} Replied
                    </span>
                    <span className="rounded-lg bg-white px-2 py-1.5 font-bold text-slate-700">
                      {supportCounts.closed} Closed
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <EditProfile setEditMode={setEditMode} />
      )}
    </div>
  );
}
