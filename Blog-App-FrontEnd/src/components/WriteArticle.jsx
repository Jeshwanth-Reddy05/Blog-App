import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "../store/authStore";

function WriteArticle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth((state) => state.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitArticle = async (articleObj) => {
    setLoading(true);

    // attach author id
    articleObj.author = currentUser?._id;

    try {
      await axios.post(
        "https://blog-backend-je06.onrender.com/author-api/articles",
        articleObj,
        { withCredentials: true }
      );

      toast.success("Article published successfully!");

      reset();
      navigate("/author-profile/articles");

    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      
      <h2 className="text-2xl font-bold mb-6 text-center">
        Write New Article
      </h2>

      <form onSubmit={handleSubmit(submitArticle)} className="space-y-5">

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter article title"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            className="w-full border px-3 py-2 rounded focus:outline-none"
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block font-semibold mb-1">Content</label>
          <textarea
            rows="8"
            placeholder="Write your article content..."
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 50,
                message: "Content must be at least 50 characters",
              },
            })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Publishing..." : "Publish Article"}
        </button>

        {loading && (
          <p className="text-center text-gray-500">
            Publishing article...
          </p>
        )}
      </form>
    </div>
  );
}

export default WriteArticle;