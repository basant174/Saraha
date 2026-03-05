import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(""); 

  const toggleFavorite = async (messageId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`/api/v1/message/fav/${messageId}`, {}, {
        headers: { Authorization: `USER ${token}` },
      });

      let favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (favIds.includes(messageId)) {
        favIds = favIds.filter(id => id !== messageId);
      } else {
        favIds.push(messageId);
      }
      localStorage.setItem("favorites", JSON.stringify(favIds));

      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId ? { ...msg, isFav: !msg.isFav } : msg
        )
      );

      toast.success("Favorite updated!");
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to update favorite");
    }
  };

  const fetchMyMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please login first.");
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/v1/message/get-my-messages", {
        headers: { Authorization: `USER ${token}` },
        params: { page, limit: 20 }, 
      });

      const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");

      const sortedMessages = (res.data.data?.messages || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(msg => ({
          ...msg,
          isFav: favIds.includes(msg._id)
        }));

      setMessages(sortedMessages);
      setFilteredMessages(sortedMessages); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMessages();
  }, [page]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredMessages(
      messages.filter(msg => msg.content.toLowerCase().includes(lowerSearch))
    );
  }, [search, messages]);

  return (
    <section className="max-w-3xl mx-auto mt-12 px-4 mb-10">
      <div className="bg-gradient-to-br from-[#eaf4fb] to-white rounded-3xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#0d4369] mb-4 text-center">
          My Messages
        </h2>


        <div className="mb-6 flex justify-center">
          <div className="relative w-3/4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b9ac7] focus:border-[#5b9ac7] transition"
            />
          </div>
        </div>
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        )}

        {!loading && filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No messages found 💭</p>
          </div>
        )}

        {!loading && filteredMessages.length > 0 && (
          <ul className="space-y-5">
            {filteredMessages.map((msg) => (
              <li
                key={msg._id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5b9ac7] flex items-center justify-center text-white font-bold">
                    <i className="fa-regular fa-message"></i>
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">{msg.content}</p>
                    <span className="block text-xs text-gray-400 mt-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavorite(msg._id)}
                    className="bg-transparent border-none outline-none p-0"
                  >
                    <i
                      className={`fa-heart text-2xl transition ${msg.isFav ? "fa-solid text-red-500" : "fa-regular text-gray-400"
                        }`}
                    ></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}