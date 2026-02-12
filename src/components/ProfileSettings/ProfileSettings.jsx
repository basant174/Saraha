import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import UpdatePassword from "../UpdatePassword/UpdatePassword";
import FreezeAccount from "../FreezeAccount/FreezeAccount";
import DeleteAccount from "../DeleteAccount/DeleteAccount";
import EditProfile from "../EditProfile/EditProfile";
import ProfileImage from "../ProfileImage/ProfileImage";

export default function ProfileSettings() {
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
     //   email: "",
        password: "",
        gender: "",
    });

    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showActions, setShowActions] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                const res = await axios.get("/api/v1/user/", {
                    headers: { Authorization: `USER ${token}` },
                });

                const currentUser = res.data.data.users.find(
                    (u) => u._id === userId
                );

                if (currentUser) {
                    setProfile({
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                       // email: currentUser.email,
                        password: "",
                        gender: currentUser.gender,
                    });

                    setPhoto(
                        currentUser.cloudProfileImage?.secure_url || null
                    );
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load profile data");
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            await axios.patch("/api/v1/user/", profile, {
                headers: { Authorization: `USER ${token}` },
            });

            toast.success("Profile updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 mb-20">
            {/* Profile Main Section */}
            <div className="flex gap-8">
                <div className="w-1/4">
                    <div className="w-44 h-44 rounded-xl overflow-hidden border border-gray-300">
                        <img
                            src={
                                photo ||
                                "https://i.pinimg.com/736x/9e/d9/fc/9ed9fc6f5360d475c83e1201ad2a909c.jpg"
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-8 text-[#0d4369]">
                        Account Details
                    </h2>

                    <div className="grid gap-3">
                        <label className="block text-sm font-medium  text-[#156faf]">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={profile.firstName}
                            readOnly
                            className="w-[280px] input bg-gray-100 cursor-not-allowed *:border-gray-300 rounded
            focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
                        />

                        <label className="block text-sm font-medium  text-[#156faf]">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={profile.lastName}
                            readOnly
                            className="w-[280px] input bg-gray-100 cursor-not-allowed
                            border-gray-300 rounded
            focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
                        />
                        {/* <label className="block text-sm font-medium  text-[#156faf]">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={profile.email}
                            readOnly
                            className="w-[280px] input bg-gray-100 cursor-not-allowed
                            border-gray-300 rounded
            focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
                        /> */}

                        <label className="block text-sm font-medium  text-[#156faf]">
                            Gender
                        </label>
                        <input
                            type="text"
                            name="gender"
                            placeholder="Gender"
                            value={profile.gender}
                            readOnly
                            className="w-[280px] input bg-gray-100 cursor-not-allowed
                            border-gray-300 rounded
            focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
                        />


                    </div>

                </div>
            </div>

            {/* Toggle Button */}
            <div className="flex justify-end mt-10">
                <button
                    onClick={() => setShowActions(!showActions)}
                    className="bg-[#156faf] text-white px-6 py-2 rounded-lg hover:bg-[#0d4369] transition"
                >
                    {showActions ? "Hide updating Account " : "Updating Account "}
                </button>
            </div>


            {/* Hidden Section */}
            {showActions && (
                <div className="mt-12 space-y-8">
                    <ProfileImage />
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
