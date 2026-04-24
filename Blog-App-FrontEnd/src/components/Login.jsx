import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
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
  linkClass,
} from "../styles/common";
import { NavLink } from "react-router";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();

  const login = useAuth((state) => state.login);
  const formSubmit = async (userData) => {
    console.log(userData);
    await login(userData);
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser.role === "USER") {
        navigate("/user-profile");
      }
      if (currentUser.role === "AUTHOR") {
        navigate("/author-profile");
      }
    }
  });

return (
  <div className={`${pageBackground} flex items-center justify-center min-h-screen px-6`}>
    <form
      onSubmit={handleSubmit(formSubmit)}
      className={formCard}
    >
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>

      {/* Email */}
      <div className={formGroup}>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email", { required: true })}
          className={inputClass}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">Email is required</p>
        )}
      </div>

      {/* Password */}
      <div className={formGroup}>
        <label className={labelClass}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("password", { required: true })}
          className={inputClass}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">Password is required</p>
        )}
      </div>

      {/* Forgot password */}
      <div className="text-right -mt-2 mb-5">
        <a href="/forgot-password" className={`${linkClass} text-sm`}>
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={`${submitBtn} text-lg py-3`}
      >
        Sign In
      </button>

      {/* Footer */}
      <p className={`${mutedText} text-center mt-6 text-base`}>
        dont have an account{" "}
        <span className={`${linkClass} cursor-pointer`}>
          register
        </span>
      </p>
    </form>
  </div>
);
}

export default Login;
