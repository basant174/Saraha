import { useFormik } from "formik";
import { object, string } from "yup";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

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

  // async function sendDataToLogin(values) {
  //   let toastId = toast.loading("Logging in...");
  //   setApiError(null);

  //   try {
  //     const response = await axios.post("/api/v1/auth/login", values);

  //     if (response.data.message?.toLowerCase().includes("success")) {

  //       localStorage.setItem("token", response.data.data.creidentails.accessToken );



  //       console.log("Saved token:", response.data.data.creidentails.accessToken);
  //       console.log("From localStorage:", localStorage.getItem("token"));

  //       toast.success("Logged in successfully!");
  //       setTimeout(() => {
  //         navigate("/home");
  //       }, 2000);
  //     }
  //   }
  //   catch (error) {
  //     console.log(error.response);

  //     const status = error.response?.status;

  //     if (status === 400) {
  //       toast.error("his email or password is is incorrect");
  //       //setApiError("The password you entered is incorrect.");
  //     }
  //     else if (status === 404) {
  //       toast.error("This email is incorrect.");
  //       // setApiError("This email address is not registered.");
  //     }
  //     else {
  //       toast.error("Something went wrong. Please try again.");
  //       //setApiError("Something went wrong. Please try again.");
  //     }
  //   }


  //   finally {
  //     toast.dismiss(toastId);
  //   }
  // }
  async function sendDataToLogin(values) {
    let toastId = toast.loading("Logging in...");
    setApiError(null);

    try {
      const response = await axios.post("/api/v1/auth/login", values);


      const accessToken = response.data.data.creidentails.accessToken;
      localStorage.setItem("token", accessToken);

   
      const resProfile = await axios.get("/api/v1/user/", {
        headers: { Authorization: `ADMIN ${accessToken}` },
      });

      // array كل اليوزرات
      const currentUser = resProfile.data.data.users.find(
        u => u.email === values.email // نقدر نستخدم الإيميل لمطابقة اليوزر الحالي
      );

      if (currentUser) {
        localStorage.setItem("userId", currentUser._id); // نخزن ال id
      }

      toast.success("Logged in successfully!");
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (error) {
      console.log(error.response);
      const status = error.response?.status;

      if (status === 400) toast.error("Email or password is incorrect.");
      else if (status === 404) toast.error("This email is incorrect.");
      else toast.error("Something went wrong. Please try again.");

    } finally {
      toast.dismiss(toastId);
    }
  }


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: sendDataToLogin,
  });

  return (
    <section className="min-h-screen bg-sky-200 flex items-center justify-center">
      <div className="bg-white w-[320px] rounded-3xl shadow-lg px-6 py-8 relative">

        {/* Decorative circles */}
        <span className="w-3 h-3 bg-sky-200 rounded-full absolute top-6 left-6"></span>
        <span className="w-4 h-4 border border-sky-300 rounded-full absolute top-10 right-8"></span>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Log in
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Welcome back
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
              className="w-full px-4 py-2.5 text-sm rounded-lg border-gray-200
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"

            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
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
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          {apiError && (
            <p className="text-red-500 text-sm mt-1">{apiError}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-full font-medium hover:bg-[#a7d3e6] hover:text-white transition"
          >
            Log In
          </button>

          {/* تحت زرار الدخول مباشرة */}
          <div className="text-left mt-2">
            <Link
              to="/ForgetPassword" // هنا رابط الصفحة اللي هتعمل فيها الريست
              className="text-xs text-sky-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-3">
          Don&apos;t have an account?{" "}
          <Link to="/" className="text-sky-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
