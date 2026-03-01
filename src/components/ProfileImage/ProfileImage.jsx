// ProfileImage.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProfileImage({ setPhoto, isFrozen }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    if (isFrozen) return; // منع التغيير لو الحساب مجمد

    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch("/api/v1/user/profile-image", formData, {
        headers: { Authorization: `USER ${token}` },
      });

      console.log("Upload Response:", res.data);

      const imageUrl = res.data.data?.secure_url;
      if (imageUrl) {
        setPhoto(imageUrl);
        localStorage.setItem("profileImage", imageUrl);
        toast.success("Profile image updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
      <h1 className="text-2xl font-bold text-[#0d4369] mb-8">Update Image</h1>

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 object-cover rounded-full border-2 border-gray-200 shadow-sm"
        />
      ) : (
        <div className="w-28 h-28 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400">
          Preview
        </div>
      )}

      <label
        className={`ml-28 mt-5 px-6 py-2 rounded-md font-medium transition ${
          isFrozen
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-[#5b9ac7] hover:text-white"
        }`}
      >
        {loading ? "Uploading..." : "Choose Image"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading || isFrozen}
        />
      </label>

      {loading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
    </div>
  );
}