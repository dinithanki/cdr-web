import { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { Camera, Save, X } from "lucide-react";

const DEFAULT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80";

export default function AdminProfileEdit({ setEditMode }) {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(authUser?.profilePic || null);

  const [formData, setFormData] = useState({
    firstName: authUser?.firstName || "",
    lastName: authUser?.lastName || "",
    phoneNumber: authUser?.phoneNumber || "",
    address: authUser?.address || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
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
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-orange-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Edit Profile
          </h1>
          <p className="mt-2 text-slate-600">
            Update your admin profile information and photo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PROFILE IMAGE SECTION */}
          <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-600">
              Profile Photo
            </p>

            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Current Image Preview */}
              <div className="relative">
                <img
                  src={preview || DEFAULT_PROFILE_IMAGE}
                  alt="profile preview"
                  className="h-32 w-32 rounded-2xl object-cover border-4 border-orange-400 shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
                <label
                  htmlFor="image-input"
                  className="absolute -bottom-2 -right-2"
                >
                  <div className="rounded-full bg-orange-600 p-2 shadow-lg cursor-pointer hover:bg-orange-700 transition">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </label>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-700">
                  Change your profile photo
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-4 block w-full rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 px-4 py-2 text-sm text-slate-700 transition hover:border-orange-400"
                />
              </div>
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-600">
              Personal Information
            </p>

            <div className="mt-6 space-y-4">
              {/* EMAIL (READ ONLY) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  value={authUser?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Email cannot be changed
                </p>
              </div>

              {/* FIRST NAME */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* LAST NAME */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* PHONE NUMBER */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-sm"
            >
              <X className="h-5 w-5" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
