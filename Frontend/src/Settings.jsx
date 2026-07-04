import { useState } from "react";

function Settings() {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const updateProfile = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({ name, profileImage })
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  const changePassword = async (oldPassword, newPassword) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h2>Settings</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Profile Image URL"
        onChange={(e) => setProfileImage(e.target.value)}
      />

      <button onClick={updateProfile}>Update Profile</button>

      <hr />

      <h3>Change Password</h3>

      <input placeholder="Old Password" id="oldPass" type="password" />
      <input placeholder="New Password" id="newPass" type="password" />

      <button
        onClick={() =>
          changePassword(
            document.getElementById("oldPass").value,
            document.getElementById("newPass").value
          )
        }
      >
        Change Password
      </button>
    </div>
  );
}

export default Settings;