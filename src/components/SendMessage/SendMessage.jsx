import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SendMessage({ sharedId }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const token = localStorage.getItem("token");
    const trimmedContent = content.trim();

    if (!sharedId) {
      toast.error("No recipient selected!");
      return;
    }

    if (trimmedContent.length < 2) {
      toast.error("Message must be at least 2 characters");
      return;
    }

    setLoading(true);
    try {
await axios.post(
  `/api/v1/message/send-message/${sharedId}`, // sharedId = _id
  { content: trimmedContent },
  { headers: { Authorization: `USER ${token}` } }
);


      toast.success("Message sent!");
      setContent("");
    } catch (err) {
      console.error("Send message error:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-16 mt-20">
      <Toaster position="top-right" />

      <h2 className="mb-6 text-2xl font-bold text-[#0d4369]">Send Message</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-[#156faf]">
          Message
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white font-semibold ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}
