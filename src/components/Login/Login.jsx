import React, { useState } from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignup from "../GoogleSignup/GoogleSignup";
import toast from "react-hot-toast";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false); // <-- state جديدة

  const regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const validationSchema = object({
    email: string()
      .required("Email is required")
      .email("Email is invalid"),
    password: string()
      .required("Password is required")
      .matches(
        regexPassword,
        "Password should be at least 8 characters, include uppercase, lowercase, number, and special character"
      ),
  });

async function sendDataToLogin(values) {
  let toastId = toast.loading("Logging in...");
  setApiError(null);

  try {
   
    const response = await axios.post("/api/v1/auth/login", values);
    const accessToken = response.data.data.creidentails.accessToken;
    localStorage.setItem("token", accessToken);

    const resProfile = await axios.get("/api/v1/user/getUser", {
      headers: { Authorization: `USER ${accessToken}` }, 
    });

 
    const currentUser = resProfile.data.data.user;
    if (currentUser) localStorage.setItem("userId", currentUser._id);

    toast.success("Logged in successfully!");
    setTimeout(() => navigate("/home"), 1000);
  } catch (error) {
    console.log(error.response);
    toast.error(error.response?.data?.message || "Something went wrong!");
    const status = error.response?.status;
    if (status === 400) toast.error("This Password is incorrect.");
    else if (status === 404) toast.error("This email is incorrect.");
    //else toast.error("Something went wrong. Please try again.");
  } finally {
    toast.dismiss(toastId);
  }
}

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: sendDataToLogin,
  });

  return (
    <section className="min-h-screen bg-sky-200 flex items-center justify-center">
      <div className="bg-white w-[320px] rounded-3xl shadow-lg px-6 py-8 relative">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Log in
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">Welcome back</p>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 text-sm rounded-lg border-gray-200
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 text-sm rounded-lg border-gray-200
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
            />
          </div>

          {!isGoogleLogin && ( // <-- شرط لإخفاء Forgot Password عند Google login
            <div className="text-left mt-2">
              <Link
                to="/ForgetPassword"
                className="text-xs text-sky-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-full font-medium hover:bg-[#a7d3e6] hover:text-white transition"
          >
            Log In
          </button>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <GoogleSignup
            onGoogleLogin={() => setIsGoogleLogin(true)} // <-- نمرر الدالة للـ GoogleSignup
          />
        </form>

        <p className="text-center text-xs text-gray-400 mt-3">
          Don't have an account?{" "}
          <Link to="/" className="text-sky-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
