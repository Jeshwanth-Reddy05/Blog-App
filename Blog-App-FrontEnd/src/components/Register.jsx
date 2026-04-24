import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  divider,
  loadingClass,
} from "../styles/common";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    console.log(newUser);
    // Create form data object
    const formData = new FormData();
    //get user object
    let { role, profileImageUrl, ...userObj } = newUser;
    //add all fields except profilePic to FormData object
    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });
    // add profilePic to Formdata object
    formData.append("profileImageUrl", profileImageUrl[0]);
    try {
      // let { role, ...userObj } = newUser;

      if (role === "USER") {
        console.log("its user");
        // req to user api
        let resObj = await axios.post(
          "https://blog-backend-je06.onrender.com/user-api/users",
          formData,
        );
        console.log(resObj);
        if (resObj.status === 201) {
          navigate("/login");
        }
      }
      if (role === "AUTHOR") {
        let resObj = await axios.post(
          "https://blog-backend-je06.onrender.com/user-api/users",
          formData,
        );
        console.log(resObj);
        if (resObj.status === 201) {
          // navigate
          navigate("/login");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "registration failed");
    } finally {
      setLoading(false);
    }
  };

  // clean after preview
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div
      className={`${pageBackground} flex items-center justify-center py-16 px-4`}
    >
      <form onSubmit={handleSubmit(onUserRegister)} className={formCard}>
        {/* Title */}
        <h2 className={formTitle}>Create an Account</h2>

        {/* Login link */}
        <p className={`${mutedText} text-center mt-2 mb-4`}>
          already have an account?{" "}
          <span className="text-violet-600 hover:text-violet-500 font-medium cursor-pointer">
            login
          </span>
        </p>

        {/* Role */}
        <div className="mb-5">
          <p className={labelClass}>Register as</p>
          <div className="flex gap-6 mt-1 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="USER"
                {...register("role", { required: true })}
                className="accent-violet-600 w-4 h-4"
              />
              <span className="text-sm text-stone-700 font-medium">User</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="AUTHOR"
                {...register("role", { required: true })}
                className="accent-violet-600 w-4 h-4"
              />
              <span className="text-sm text-stone-700 font-medium">Author</span>
            </label>
          </div>
        </div>

        <div className={divider} />

        {/* First + Last Name */}
        <div className="sm:flex gap-4 mb-4">
          <div className="flex-1">
            <label className={labelClass}>First Name</label>
            <input
              type="text"
              placeholder="First name"
              {...register("fisrtName", { required: "First name is required" })}
              className={inputClass}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              {...register("lastName", { required: "Last name is required" })}
              className={inputClass}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className={formGroup}>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className={inputClass}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className={formGroup}>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            placeholder="Min. 6 characters"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className={inputClass}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Profile Image */}
        <div className={formGroup}>
          <label className={labelClass}>Profile Image URL</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            {...register("profileImageUrl")}
            onChange={(e) => {
              //get image file
              const file = e.target.files[0];
              // validation for image format
              if (file) {
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                  setError("Only JPG or PNG allowed");
                  return;
                }
                //validation for file size
                if (file.size > 2 * 1024 * 1024) {
                  setError("File size must be less than 2MB");
                  return;
                }
                //Converts file → temporary browser URL(create preview URL)
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
                setError(null);
              }
            }}
          />
          {/* conditional redering  */}
          {preview && (
            <div className="mt-3 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full border"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className={submitBtn}>
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Register;
