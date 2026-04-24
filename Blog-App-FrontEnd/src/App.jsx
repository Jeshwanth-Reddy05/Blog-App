import React, { useEffect } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import { createBrowserRouter, RouterProvider } from "react-router";
import RouteLayout from "./components/RouteLayout";
import Home from "./components/Home";
import UserDashboard from "./components/UserDashboard";
import AuthorDashboard from "./components/AuthorDashboard";
import AuthorArticles from "./components/AuthorArticles";
import WriteArticle from "./components/WriteArticle";
import ArticleById from "./components/ArticleById";
import EditArticle from "./components/EditArticle";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import { useAuth } from "./store/authStore";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const { checkAuth, loading } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return <p>Loading...</p>;
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RouteLayout />,
      errorElement:<ErrorBoundary/>,
      children: [
        {
          path: "",
          element: <Home />,
        },

        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "author-profile",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorDashboard />
            </ProtectedRoute>
          ),

          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "writearticles",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ArticleById />,
        },
        {
          path: "edit-article/:id",
          element: <EditArticle />,
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;
