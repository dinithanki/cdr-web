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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl animate-fadeIn ">
      <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Last Name */}
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Phone */}
        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Address */}
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Image Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 rounded-lg"
        />

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
