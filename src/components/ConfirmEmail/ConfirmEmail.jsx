import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(180); 

  
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);


  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  async function handleConfirm(e) {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing. Please signup first.");
      return;
    }

    if (!otp) {
      toast.error("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch("/api/v1/auth/confirm-email", {
        email,
        otp,
      });

      if (response.data.message.toLowerCase().includes("success")) {
        toast.success("Email confirmed successfully!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.data?.error === "Invalid OTP") {
        toast.error("Incorrect OTP, please try again");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (timer > 0) return;

    try {
      await axios.patch("/api/v1/auth/re-send-otp", { email });
      toast.success("OTP sent to your email!");
      setTimer(180); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  }

  return (
    <section className="min-h-screen bg-sky-200 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[320px]">
        <h2 className="text-center text-xl font-semibold mb-4">
          Confirm Your Email
        </h2>

        <form onSubmit={handleConfirm} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-full hover:bg-[#a7d3e6] hover:text-white transition"
          >
            {loading ? "Confirming..." : "Confirm Email"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Didn't receive OTP?{" "}
          <button
            onClick={resendOtp}
            disabled={timer > 0}
            className={`font-medium ${
              timer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-sky-500"
            }`}
          >
            {timer > 0 ? `Resend in ${formatTime()}` : "Resend"}
          </button>
        </p>
      </div>
    </section>
  );
}