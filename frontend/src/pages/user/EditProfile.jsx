import { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";

export default function EditProfile({ setEditMode }) {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();

  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: authUser.firstName || "",
    lastName: authUser.lastName || "",
    phoneNumber: authUser.phoneNumber || "",
    address: authUser.address || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("address", formData.address);

    if (file) {
      data.append("image", file);
    }

    await updateProfile(data);
    setEditMode(false);
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-orange-100 bg-white/95 p-6 shadow-xl backdrop-blur-sm sm:p-8">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Edit Profile</h2>
      <p className="mb-6 text-sm text-slate-500">
        Update your details to keep your delivery experience smooth.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        />

        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        />

        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        />

        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        />

        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full rounded-xl border border-orange-200 bg-orange-50/40 p-2.5 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-200"
          />
        </div>

        <div className="flex gap-3 pt-2 sm:col-span-2">
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="flex-1 rounded-xl bg-linear-to-r from-orange-500 to-red-500 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-orange-600 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="flex-1 rounded-xl border border-orange-200 bg-white py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
