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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 pb-12 pt-6 sm:px-6">
      {!editMode ? (
        <div className="mx-auto w-full max-w-4xl">
          {/* Header Banner */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 p-8 text-white shadow-xl sm:p-12">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <img
                src={profileImage}
                alt={fullName || "profile"}
                className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg sm:h-40 sm:w-40"
              />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold sm:text-4xl">
                  {fullName || "Guest User"}
                </h1>
                <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold capitalize">
                    {authUser.role || "customer"}
                  </span>
                  {authUser?.isBlocked ? (
                    <span className="inline-block rounded-full bg-red-400 px-4 py-1 text-sm font-semibold">
                      Blocked
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-emerald-400 px-4 py-1 text-sm font-semibold">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/90">
                  Manage your account, view order history, and update your
                  preferences
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-orange-600 shadow-md transition hover:shadow-lg hover:bg-orange-50"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-red-600 shadow-md transition hover:shadow-lg hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Contact Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <Mail size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email Address
                    </p>
                    <p className="mt-1 font-medium text-slate-800">
                      {authUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Phone size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone Number
                    </p>
                    <p className="mt-1 font-medium text-slate-800">
                      {authUser.phoneNumber || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Account Details */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Delivery Address
              </h2>
              <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <MapPin size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Street Address
                    </p>
                    <p className="mt-1 font-medium text-slate-800">
                      {authUser.address || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Account Details
              </h2>
              <div className="space-y-4">
                <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-purple-100 p-3">
                      <CalendarDays size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Member Since
                      </p>
                      <p className="mt-1 font-medium text-slate-800">
                        {authUser.createdAt
                          ? new Date(authUser.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Account Statistics
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-md text-center transition hover:shadow-lg">
                <div className="inline-flex rounded-lg bg-orange-100 p-3">
                  <Clock size={24} className="text-orange-600" />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600">Active Orders</p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md text-center transition hover:shadow-lg">
                <div className="inline-flex rounded-lg bg-green-100 p-3">
                  <Star size={24} className="text-green-600" />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600">Total Orders</p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md text-center transition hover:shadow-lg">
                <div className="inline-flex rounded-lg bg-blue-100 p-3">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <p className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-lg font-bold text-slate-900">
                  <span className="text-yellow-600" title="Pending Messages">
                    {myContacts.filter((c) => c.status === "Pending").length}{" "}
                    <span className="text-xs text-slate-500 font-normal">
                      Pending
                    </span>
                  </span>
                  <span className="text-blue-500" title="Under Review Messages">
                    {
                      myContacts.filter((c) => c.status === "Under Review")
                        .length
                    }{" "}
                    <span className="text-xs text-slate-500 font-normal">
                      Under Review
                    </span>
                  </span>
                  <span className="text-green-600" title="Replied Messages">
                    {myContacts.filter((c) => c.status === "Replied").length}{" "}
                    <span className="text-xs text-slate-500 font-normal">
                      Replied
                    </span>
                  </span>
                  <span className="text-slate-600" title="Closed Messages">
                    {myContacts.filter((c) => c.status === "Closed").length}{" "}
                    <span className="text-xs text-slate-500 font-normal">
                      Closed
                    </span>
                  </span>
                </p>
                <p className="text-sm text-slate-600 mt-2">Support Messages</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EditProfile setEditMode={setEditMode} />
      )}
    </div>
  );
}
