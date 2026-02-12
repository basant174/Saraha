import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


export default function SendMessage() {
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // جلب كل اليوزرات لاختيار المستلم
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/user/", {
          headers: { Authorization: `USER ${token}` },
        });
        setUsers(res.data.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleSend = async () => {
    if (!receiverId) {
      toast.error("Please select a receiver!");
      return;
    }
    if (!content.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/v1/message/send-message/${receiverId}`,
        { content },
        { headers: { Authorization: `USER ${token}` } }
      );
      console.log("Message sent:", res.data);
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
    <div className="max-w-md  mx-auto bg-white p-6 rounded-lg shadow-md mb-16 mt-20 ">
      <Toaster position="top-right" />

      <h2 className="  mb-6  text-2xl font-bold text-[#0d4369]">Send Message</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-[#156faf]">Receiver</label>
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 
                 focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"


        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName} 
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-[#156faf]">Message</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full border border-gray-300  px-3 py-2 
          rounded focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
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
