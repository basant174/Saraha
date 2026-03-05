import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FavoriteMessages() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
            const res = await axios.get("/api/v1/message/get-my-messages", {
                headers: { Authorization: `USER ${token}` },

            });

            const favMessages = (res.data.data?.messages || [])
                .filter(msg => favIds.includes(msg._id))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setFavorites(favMessages);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load favorite messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <section className="max-w-3xl mx-auto mt-12 px-4 mb-10">
            <div className="bg-gradient-to-br from-[#fff1f1] to-white rounded-3xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
                    Favorite Messages  <i class="fa-solid fa-heart"></i>
                </h2>

                {loading && (
                    <div className="space-y-4 animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                )}

                {!loading && favorites.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No favorites yet 💔</p>
                    </div>
                )}

                {!loading && favorites.length > 0 && (
                    <ul className="space-y-5">
                        {favorites.map((msg) => (
                            <li
                                key={msg._id}
                                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-500 font-bold">
                                        <i className="fa-regular fa-heart"></i>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-gray-800 leading-relaxed">{msg.content}</p>
                                        <span className="block text-xs text-gray-400 mt-2">
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}