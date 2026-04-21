import { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import EditProfile from "./EditProfile";

export default function ProfilePage() {
  const { authUser, logout } = useAuthStore();
  const [editMode, setEditMode] = useState(false);

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl mt-36">
      {!editMode ? (
        <div className="flex flex-col items-center text-center space-y-4 ">
          {/* Profile Image */}
          <img
            src={authUser.profilePic}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
          />

          {/* User Info */}
          <h2 className="text-2xl font-semibold">
            {authUser.firstName} {authUser.lastName}c
          </h2>

          <div className="text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Email:</span> {authUser.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {authUser.phoneNumber || "Not set"}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {authUser.address || "Not set"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <EditProfile setEditMode={setEditMode} />
      )}
    </div>
  );
}
