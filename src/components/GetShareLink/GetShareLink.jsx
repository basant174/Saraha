import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SendMessage from "../SendMessage/SendMessage";

export default function ShareProfile() {
  const [shareLink, setShareLink] = useState("");
  const [sharedId, setSharedId] = useState("");
  const token = localStorage.getItem("token");
console.log("TOKEN:", token);
  useEffect(() => {
    async function getShareLink() {
      try {
        const res = await axios.get("/api/v1/user/share-profile", {
          headers: { Authorization: `USER ${token}` },
        });

        const link =
          res.data.data?.shareLink ||
          `http://localhost:5173/u/${res.data.data.user._id}`;


setSharedId(res.data.data.id);
setShareLink(res.data.data.shareLink);


      } catch (error) {
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
    <section className="min-h-screen flex items-center justify-center bg-[#062135] px-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 text-center shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Share your link 🔗</h2>
        <p className="text-sm text-gray-400 mb-4">
          Let people send you anonymous messages
        </p>

        <input value={shareLink} readOnly className="w-full p-3 rounded-xl border text-sm text-gray-600 mb-4" />

        <div className="flex gap-3 mb-6">
          <button onClick={copyLink} className="flex-1 bg-sky-500 text-white py-2 rounded-full hover:bg-sky-600 transition">
            Copy Link
          </button>
          <a href={shareLink} target="_blank" rel="noreferrer" className="flex-1 border border-sky-500 text-sky-500 py-2 rounded-full hover:bg-sky-50 transition">
            Preview
          </a>
        </div>

{sharedId && <SendMessage sharedId={sharedId} />}
      </div>
    </section>
  );
}
