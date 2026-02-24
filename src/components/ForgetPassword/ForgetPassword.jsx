import React, { useState } from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
export default function ForgetPassword() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const validationSchema = object({
    email: string()
      .required("Email is required")
      .email("Email is invalid"),
  });

// async function sendForgetPassword(values) {
//   let toastId = toast.loading("Sending request...");

//   try {
//     const response = await axios.patch(
//       "/api/v1/auth/forget-password",
//       values
//     );

//     if (response.status === 200) {
//       toast.success("Check your email ✌️");

//       setTimeout(() => {
//         navigate("/resetPassword");
//       }, 1500);
//     }
//   } catch (error) {
//     const status = error.response?.status;
//     if (status === 404) {
//       toast.error("This email is not registered.");
//     } else {
//       toast.error("Something went wrong. Please try again.");
//     }
//   } finally {
//     toast.dismiss(toastId);
//   }
// }
async function sendForgetPassword(values) {
  let toastId = toast.loading("Sending request...");

  try {
    const response = await axios.patch(
      "/api/v1/auth/forget-password",
      values
    );

    if (response.status === 200) {
      // خزن الايميل في localStorage
      localStorage.setItem("resetEmail", values.email);

      toast.success("Check your email ✌️");

      setTimeout(() => {
        navigate("/resetPassword");
      }, 1500);
    }
  } catch (error) {
    const status = error.response?.status;
    if (status === 404) {
      toast.error("This email is not registered.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } finally {
    toast.dismiss(toastId);
  }
}

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: sendForgetPassword,
  });

  return (
    <section className="min-h-screen bg-sky-200 flex items-center justify-center">
      <div className="bg-white w-[320px] rounded-3xl shadow-lg px-6 py-8 relative">

        <span className="w-3 h-3 bg-sky-200 rounded-full absolute top-6 left-6"></span>
        <span className="w-4 h-4 border border-sky-300 rounded-full absolute top-10 right-8"></span>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Forget Password
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Enter your email to reset your password
        </p>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-sky-300 placeholder-gray-400"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {apiError && (
            <p className="text-red-500 text-sm mt-1">{apiError}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-full font-medium hover:bg-[#a7d3e6] hover:text-white transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          Remembered your password?{" "}
          <Link to="/login" className="text-sky-500 font-medium">
            Log In
          </Link>
        </p>
      </div>
    </section>
  );
}
