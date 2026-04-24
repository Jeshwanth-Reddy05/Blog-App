import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { formCard, formTitle, formGroup, labelClass, inputClass, submitBtn, errorClass } from "../styles/common";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const articleFromState = location.state;

  const [article, setArticle] = useState(articleFromState || null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Prefill form (state OR fetch)
  useEffect(() => {
    if (articleFromState) {
      setValue("title", articleFromState.title);
      setValue("category", articleFromState.category);
      setValue("content", articleFromState.content);
    } else if (id) {
      const fetchArticle = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`https://blog-backend-je06.onrender.com/user-api/article/${id}`, { withCredentials: true });

          const data = res.data.payload;

          setArticle(data);

          setValue("title", data.title);
          setValue("category", data.category);
          setValue("content", data.content);
        } catch (err) {
          toast.error("Failed to load article");
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [articleFromState, id, setValue]);

  // Update article
  const updateArticle = async (data) => {
    try {
      const res = await axios.put(`https://blog-backend-je06.onrender.com/author-api/articles/${id}`, data, { withCredentials: true });

      toast.success("Article updated");

      navigate(`/article/${id}`, {
        state: res.data.payload,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Article not found</p>;

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input className={inputClass} {...register("title", { required: "Title required" })} />

          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <select className={inputClass} {...register("category", { required: "Category required" })}>
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>

          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>

          <textarea rows="14" className={inputClass} {...register("content", { required: "Content required" })} />

          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        <button className={submitBtn}>Update Article</button>
      </form>
    </div>
  );
}

export default EditArticle;