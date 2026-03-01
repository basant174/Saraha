import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function EmailLoginRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("EmailLoginRedirect mounted");

        const hash = window.location.hash; 
        console.log("Hash:", hash);

        const tokenMatch = hash.match(/token=([^&]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;
        console.log("Token from hash:", token);


        if (!token) {
            toast.error("Invalid link or token missing");
            navigate("/login");
            return;
        }
        const verifyEmailLogin = async () => {
            try {
                const res = await axios.post("/api/v1/user/email-login", { token });

                console.log("Full response:", res);

                const credentials = res.data.data?.credentials;
                const user = res.data.data?.user;

                if (!credentials) {
                    toast.error("Login failed: No credentials returned");
                    return;
                }

                localStorage.setItem("token", credentials.accessToken);
                localStorage.setItem("refreshToken", credentials.refreshToken);
                localStorage.setItem("user", JSON.stringify(user));

                console.log("Stored Access Token:", localStorage.getItem("token"));
                console.log("Stored Refresh Token:", localStorage.getItem("refreshToken"));

                toast.success("Login successful!");
                navigate("/MyMessages");
            } catch (err) {
                console.error("Email login failed:", err.response?.data || err.message);
                toast.error("Login failed, link may be expired or invalid");
            }
        };
        verifyEmailLogin();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-gray-600 text-lg animate-pulse">
                Logging you in, please wait...
            </p>
        </div>
    );
}