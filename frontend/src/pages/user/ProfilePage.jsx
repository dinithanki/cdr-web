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
    <div className="min-h-screen bg-[#f8fafc] px-4 pb-14 pt-8 sm:px-6">
      {!editMode ? (
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                My Account
              </p>
              <h1 className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">
                Hello, {authUser.firstName || "there"}
              </h1>
            </div>
            <p className="max-w-xl text-sm text-slate-500 sm:text-right">
              Keep your delivery details and account preferences up to date.
            </p>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-28 bg-linear-to-r from-orange-700 via-orange-600 to-red-600" />
            <div className="-mt-14 flex flex-col gap-6 px-5 pb-6 sm:flex-row sm:items-end sm:px-8">
              <img
                src={profileImage}
                alt={fullName || "Profile"}
                className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg"
              />

              <div className="flex-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Profile Overview
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                      {fullName || "Guest User"}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Member since {memberSince}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold capitalize text-orange-700 ring-1 ring-orange-100">
                        {authUser.role || "customer"}
                      </span>
                      {authUser?.isBlocked ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-red-100">
                          Blocked
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={logout}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-slate-950">
                  Contact Details
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  Customer Info
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 inline-flex rounded-lg bg-orange-100 p-3">
                    <Mail size={20} className="text-orange-600" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Email Address
                  </p>
                  <p className="mt-1 break-words font-semibold text-slate-900">
                    {authUser.email}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 inline-flex rounded-lg bg-sky-100 p-3">
                    <Phone size={20} className="text-blue-600" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Phone Number
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {authUser.phoneNumber || "Not set"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                  <div className="mb-3 inline-flex rounded-lg bg-emerald-100 p-3">
                    <MapPin size={20} className="text-green-600" />
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

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 text-xl font-black text-slate-950">
                Account Details
              </h2>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-3 inline-flex rounded-lg bg-violet-100 p-3">
                  <CalendarDays size={20} className="text-purple-600" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Member Since
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {memberSince}
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-slate-950 p-5 text-white">
                <p className="text-sm font-semibold text-white/70">
                  Account Health
                </p>
                <p className="mt-2 text-2xl font-black">
                  {authUser?.isBlocked ? "Action Needed" : "Good Standing"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {authUser?.isBlocked
                    ? "Please contact support to review your account."
                    : "Your account is active and ready for orders."}
                </p>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Account Activity
                </h2>
                <p className="text-sm text-slate-500">
                  A quick look at orders and support messages.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-orange-50 p-5">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <Clock size={22} className="text-orange-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-950">0</p>
                </div>
                <p className="mt-4 text-sm font-bold text-slate-700">
                  Active Orders
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-emerald-50 p-5">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <Star size={22} className="text-green-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-950">0</p>
                </div>
                <p className="mt-4 text-sm font-bold text-slate-700">
                  Total Orders
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-sky-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <MessageSquare size={22} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    Support Messages
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="rounded-lg bg-white px-3 py-2 font-bold text-yellow-700">
                    {supportCounts.pending} Pending
                  </span>
                  <span className="rounded-lg bg-white px-3 py-2 font-bold text-blue-700">
                    {supportCounts.underReview} Review
                  </span>
                  <span className="rounded-lg bg-white px-3 py-2 font-bold text-green-700">
                    {supportCounts.replied} Replied
                  </span>
                  <span className="rounded-lg bg-white px-3 py-2 font-bold text-slate-700">
                    {supportCounts.closed} Closed
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <EditProfile setEditMode={setEditMode} />
      )}
    </div>
  );
}
