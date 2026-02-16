import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function GoogleSignup({ onGoogleLogin }) {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id:
        "65908178579-4tog5vpgsloddhr1t1f4a3gshtocclva.apps.googleusercontent.com",
      callback: async (response) => {
        const idToken = response.credential;
        if (!idToken) {
          toast.error("Google login failed");
          return;
        }

        setLoading(true);
        try {
          const resLogin = await axios.post("/api/v1/auth/social-login", { idToken });
          const accessToken = resLogin.data.data.creidentails.accessToken;
          localStorage.setItem("token", accessToken);

          const resProfile = await axios.get("/api/v1/user/", {
            headers: { Authorization: `USER ${accessToken}` },
          });

          const currentUser = resProfile.data.data.users[0]; // لو عندك أكثر من يوزر، اعملي فلتر على البريد
          if (currentUser) {
            localStorage.setItem("userId", currentUser._id);
            localStorage.setItem("firstName", currentUser.firstName);
            localStorage.setItem("lastName", currentUser.lastName);
            localStorage.setItem("email", currentUser.email);
            localStorage.setItem("gender", currentUser.gender);


            const profileImage =
              user.cloudProfileImage?.secure_url || user.profileImage || null;
            localStorage.setItem("profileImage", profileImage);
          }

          if (onGoogleLogin) onGoogleLogin();
          toast.success(`Welcome ${currentUser?.firstName || ""} 👋`);
          navigate("/home");
        } catch (error) {
          console.error(error.response);
          toast.error(error.response?.data?.message || "Google login failed");
        } finally {
          setLoading(false);
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 280,
    });

    window.google.accounts.id.prompt();
  }, [navigate, onGoogleLogin]);

  return (
    <div className="w-full flex justify-center">
      {loading ? (
        <button
          disabled
          className="w-full py-2 rounded-full bg-gray-200 text-gray-500"
        >
          Loading...
        </button>
      ) : (
        <div ref={buttonRef}></div>
      )}
    </div>
  );
}
