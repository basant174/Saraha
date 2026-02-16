import { useFormik } from "formik";
import { object, string, ref } from "yup";
import React from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignup from "../GoogleSignup/GoogleSignup";

export default function Signup() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const validationSchema = object({
    firstName: string()
      .required("First Name is required")
      .min(2, "First Name must be at least 2 characters")
      .max(20, "First Name must be at most 20 characters"),

    lastName: string()
      .required("Last Name is required")
      .min(2, "Last Name must be at least 2 characters")
      .max(20, "Last Name must be at most 20 characters"),

    email: string().required("Email is required").email("Email is invalid"),

    password: string()
      .required("Password is required")
      .matches(
        regexPassword,
        "Password should be at least 8 characters, include uppercase, lowercase, number, and special character"
      ),

    confirmPassword: string()
      .required("Confirm Password is required")
      .oneOf([ref("password")], "Passwords must match"),

    phone: string().required("Phone is required"),
    gender: string().required("Gender is required"),
  });


  async function sendDataToSignup(values) {
    let toastId = toast.loading("Signing up...");
    setApiError(null);

    try {
      const response = await axios.post(
"/api/v1/auth/signup",
        values,
      );

      if (response.data.message === "User created successfully") {
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/ConfirmEmail", { state: { email: values.email } });
        }, 2000);
      }


    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
    finally {
      toast.dismiss(toastId);
    }
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      gender: "",
      role: "ADMIN",
    },
    validationSchema,
    onSubmit: sendDataToSignup,
  });

  return (
    <section className="min-h-screen bg-sky-200 flex items-center justify-center ">
      <div className="bg-white w-[320px] rounded-3xl shadow-lg px-6 py-8 relative my-8">
        {/* Decorative circles */}
        <span className="w-3 h-3 bg-sky-200 rounded-full absolute top-6 left-6"></span>
        <span className="w-4 h-4  border border-sky-300 rounded-full absolute top-10 right-8"></span>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Sign up
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Create an account, it’s free
        </p>

        <form className="space-y-4 " onSubmit={formik.handleSubmit}>
          <div className="flex gap-3">
            <div className="w-1/2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 text-sm rounded-lg border-gray-200
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.firstName}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 text-sm rounded-lg border-gray-200
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.lastName}
                </p>
              )}
            </div>
          </div>

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
              className="w-full px-4 py-2.5 text-sm rounded-lg border
               border-gray-200 focus:outline-none focus:border-yellow-500 placeholder-gray-400"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 text-sm rounded-lg  border-gray-200
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 text-sm rounded-lg border-gray-200
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Gender</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={formik.values.gender === "MALE"}
                  onChange={formik.handleChange}
                  className="accent-sky-400"
                />
                <span className="text-sm text-gray-700">Male</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={formik.values.gender === "FEMALE"}
                  onChange={formik.handleChange}
                  className="accent-sky-400"
                />
                <span className="text-sm text-gray-700">Female</span>
              </label>
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
            )}
          </div>

          {apiError && (
            <p className="text-red-500 text-sm mt-1">{apiError}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-full font-medium hover:bg-[#a7d3e6] hover:text-white transition"
          >
            Sign Up
          </button>



          <div className="my-4 flex items-center gap-3">
  <div className="flex-1 h-px bg-gray-200"></div>
  <span className="text-xs text-gray-400">OR</span>
  <div className="flex-1 h-px bg-gray-200"></div>
</div>

<GoogleSignup/>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-500 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
