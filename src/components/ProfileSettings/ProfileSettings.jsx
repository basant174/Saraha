import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import UpdatePassword from "../UpdatePassword/UpdatePassword";
import FreezeAccount from "../FreezeAccount/FreezeAccount";
import DeleteAccount from "../DeleteAccount/DeleteAccount";
import EditProfile from "../EditProfile/EditProfile";
import ProfileImage from "../ProfileImage/ProfileImage";
import SendMessage from "../SendMessage/SendMessage";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    password: "",
    gender: "",
  });
  const [photo, setPhoto] = useState(localStorage.getItem("profileImage") || null);
  const [showActions, setShowActions] = useState(false);

  // --- Share Link & SharedId State ---
  const [shareLink, setShareLink] = useState("");
  const [sharedId, setSharedId] = useState(""); // مهم جدًا
  const token = localStorage.getItem("token");

  useEffect(() => {
    // --- Set profile info from localStorage ---
    setProfile({
      firstName: localStorage.getItem("firstName") || "",
      lastName: localStorage.getItem("lastName") || "",
      gender: localStorage.getItem("gender") || "",
      password: "",
    });

    // --- Fetch share link and user ID ---
    async function getShareLink() {
      try {
        const res = await axios.get("/api/v1/user/share-profile", {
          headers: { Authorization: `USER ${token}` },
        });

        console.log("Share Profile Response:", res.data); // تابعي هنا شكل البيانات

        const link = res.data.data?.shareLink || "";
        setShareLink(link);

        // sharedId نجيبه من data.id مباشرة
        const id = res.data.data?.id || "";
        setSharedId(id);

      } catch (error) {
        console.error("Share link error:", error.response || error);
        toast.error("Failed to load share link");
      }
    }

    getShareLink();
  }, [token]);

  function copyLink() {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied!");
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 mb-20">
      {/* Profile Main Section */}
      <div className="flex gap-8">
        {/* Profile Image */}
        <div className="w-1/4">
          <div className="w-44 h-44 rounded-xl overflow-hidden border border-gray-300">
            <img
              src={
                photo ||
                "https://i.pinimg.com/736x/e5/9f/a1/e59fa1f693e66a9606fb04f1da6f359f.jpg"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Account Details */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md my-5">
          <h2 className="text-2xl font-bold mb-8 text-[#0d4369]">
            Account Details
          </h2>

          <div className="grid gap-3">
            <label className="block text-sm font-medium text-[#156faf]">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              readOnly
              className="w-[280px] input bg-gray-100 cursor-not-allowed border-gray-300 rounded focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
            />

            <label className="block text-sm font-medium text-[#156faf]">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              readOnly
              className="w-[280px] input bg-gray-100 cursor-not-allowed border-gray-300 rounded focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
            />

            <label className="block text-sm font-medium text-[#156faf]">Gender</label>
            <input
              type="text"
              value={profile.gender}
              readOnly
              className="w-[280px] input bg-gray-100 cursor-not-allowed border-gray-300 rounded focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
            />
          </div>
        </div>
      </div>

      {/* --- Share Profile Section --- */}
      <div className="bg-slate-100 w-full p-6 rounded-3xl text-center shadow-xl mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Share your link 🔗
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Let people send you anonymous messages
        </p>

        <input
          value={shareLink}
          readOnly
          className="w-full p-3 rounded-xl border text-sm text-gray-600 mb-4"
        />

        <div className="flex gap-3 mb-6">
          <button
            onClick={copyLink}
            className="flex-1 bg-sky-500 text-white py-2 rounded-full hover:bg-sky-600 transition"
          >
            Copy Link
          </button>
   
        </div>


        {/* {sharedId && <SendMessage sharedId={sharedId} />} */}
      </div>

      {/* Toggle Button */}
      <div className="flex justify-end mt-10">
        <button
          onClick={() => setShowActions(!showActions)}
          className="bg-[#156faf] text-white px-6 py-2 rounded-lg hover:bg-[#0d4369] transition"
        >
          {showActions ? "Hide updating Account" : "Updating Account"}
        </button>
      </div>

     {showActions && (
  <div className="mt-12 space-y-8">
    <ProfileImage setPhoto={setPhoto} />
    <EditProfile />
    <UpdatePassword />
    <FreezeAccount />
    <DeleteAccount />
  </div>
)}

      <Toaster />
    </div>
  );
}
