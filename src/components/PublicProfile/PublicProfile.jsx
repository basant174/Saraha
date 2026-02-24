import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function PublicProfile() {
  const { shareId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // 🔹 دالة لجلب بيانات البروفايل
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/v1/user/public/${shareId}`, {
        headers: { Authorization: `USER ${token}` },
      });
      setProfileData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch public profile:", err.response || err);
      toast.error("Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  // 🔹 useEffect للتنفيذ عند تحميل الصفحة أو تغير shareId
  useEffect(() => {
    fetchProfile();
  }, [shareId]);

  // 🔹 ارسال رسالة
  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!shareId) {
      toast.error("No recipient selected!");
      return;
    }

    if (trimmedMessage.length < 2) {
      toast.error("Message must be at least 2 characters");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/v1/message/send-message/${shareId}`,
        { content: trimmedMessage },
        { headers: { Authorization: `USER ${token}` } }
      );

      toast.success("Message sent!");
      setMessage("");

      // تحديث بيانات البروفايل فورًا بعد إرسال الرسالة
      await fetchProfile();
    } catch (err) {
      console.error("Send message error:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile || !profileData)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-md mx-auto my-10">
      <Toaster position="top-right" />

      {/* Profile Card */}
      <div className="bg-gradient-to-b from-sky-50 to-white rounded-2xl shadow-lg p-6 text-center">
        <img
          src={
            profileData.image ||
            "https://i.pinimg.com/736x/9e/d9/fc/9ed9fc6f5360d475c83e1201ad2a909c.jpg"
          }
          alt={profileData.name}
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-sky-200 object-cover shadow-md"
        />
        <h2 className="text-2xl font-bold text-[#0d4369] mb-2">{profileData.name}</h2>

        {/* Message Box */}
        <div className="text-left mt-7">
          <label className="block text-sm font-medium mb-2 text-[#156faf]">
            Send a message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none mb-4"
            placeholder="Write your message here..."
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-600 hover:to-sky-500"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}