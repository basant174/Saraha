import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMyMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/v1/message/get-my-messages", {
        headers: {
          Authorization: `USER ${token}`,
        },
        params: {
          page,
          limit: 4,
        },
      });

const sortedMessages = (res.data.data.messages || []).sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

setMessages(sortedMessages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMessages();
  }, [page]);

  return (
    <section className="max-w-3xl mx-auto mt-12 px-4 mb-10">
      <div className="bg-gradient-to-br from-[#eaf4fb] to-white rounded-3xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#0d4369] mb-6 text-center">
          My Messages
        </h2>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No messages yet 💭
            </p>
            <p className="text-sm text-gray-400 mt-1">
              When someone sends you a message, it will appear here.
            </p>
          </div>
        )}

        {/* Messages */}
        {!loading && messages.length > 0 && (
          <ul className="space-y-5">
            {messages.map((msg) => (
              <li
                key={msg._id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#5b9ac7] flex items-center justify-center text-white font-bold">
                 <i class="fa-regular fa-message"></i>
                  </div>

                  {/* Message */}
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">
                      {msg.content}
                    </p>
                    <span className="block text-xs text-gray-400 mt-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {!loading && messages.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2 rounded-full bg-gray-200 text-gray-600 
                         hover:bg-gray-300 transition disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="text-sm text-gray-500">
              Page {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2 rounded-full bg-[#5b9ac7] text-white 
                         hover:bg-[#4a89b3] transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
