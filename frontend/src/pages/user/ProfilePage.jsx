import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

function ProfilePage() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!authUser) {
      checkAuth();
    }
  }, [authUser, checkAuth]);

  if (isCheckingAuth) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!authUser) {
    return <div className="p-6">Please login to see your profile.</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {authUser.profilePic ? (
        <img
          src={authUser.profilePic}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      ) : null}

      <p>
        <strong>First Name:</strong> {authUser.firstName || "-"}
      </p>
      <p>
        <strong>Last Name:</strong> {authUser.lastName || "-"}
      </p>
      <p>
        <strong>Email:</strong> {authUser.email || "-"}
      </p>
      <p>
        <strong>Role:</strong> {authUser.role || "user"}
      </p>
    </div>
  );
}

export default ProfilePage;
