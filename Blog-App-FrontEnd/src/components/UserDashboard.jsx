import React, { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  pageBackground,
  pageWrapper,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleBody,
  timestampClass,
  ghostBtn,
  primaryBtn,
  loadingClass,
  errorClass,
} from "../styles/common";

function UserDashboard() {
  const CurrentUser = useAuth((state) => state.CurrentUser);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Fetch articles
  useEffect(() => {
    const read = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/user-api/articles", {
          withCredentials: true,
        });

        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    read();
  }, []);

  //  Safe date format
  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN");
  };

  //  Safe author name
  const getAuthorName = (author) => {
    if (!author) return "Unknown Author";

    if (typeof author === "string") return "Author"; // only ID case

    return author.firstName || "Author";
  };

  // Navigate to article
  const navigateToArticle = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        {error && <p className={errorClass}>{error}</p>}

        {/* Articles */}
        <div className={articleGrid}>
          {articles.map((articleObj) => (
            <div key={articleObj?._id} className={articleCardClass}>
              <div className="flex flex-col h-full">
                {/* Top */}
                <div>
                  <p className={articleTitle}>
                    {articleObj?.title || "Untitled"}
                  </p>

                  <p className={articleBody}>
                    {articleObj?.content
                      ? articleObj.content.slice(0, 120) + "..."
                      : "No content available"}
                  </p>

                  {/*  Author */}
                  <p className="text-sm text-gray-500 mt-2">
                    {getAuthorName(articleObj?.author)}
                  </p>

                  {/*  Date */}
                  <p className={timestampClass}>
                    {formatDate(articleObj?.createdAt)}
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={() => navigateToArticle(articleObj)}
                  className={`${ghostBtn} mt-auto pt-4`}
                >
                  Read Article
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
