import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Role-based profile route
  const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-200 shadow-md">
      {/* Logo */}
      <NavLink to="/" className="text-2xl font-bold text-gray-800">
        MyBlog
      </NavLink>

      {/* Links */}
      <ul className="flex gap-6 text-lg font-semibold text-gray-700 items-center">
        {/* Always visible */}
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "text-blue-600" : "")}
          >
            Home
          </NavLink>
        </li>

        {/* Not Logged In */}
        {!isAuthenticated && (
          <>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? "text-blue-600" : "")}
              >
                Register
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "text-blue-600" : "")}
              >
                Login
              </NavLink>
            </li>
          </>
        )}

        {/* Logged In */}
        {isAuthenticated && (
          <>
            <li>
              <NavLink
                to={getProfilePath()}
                className={({ isActive }) => (isActive ? "text-blue-600" : "")}
              >
                Profile
              </NavLink>
            </li>

            <li className="flex gap-2">
              {user?.profileImageUrl && (
                <img
                  src={user.profileImageUrl}
                  className="rounded-2xl w-13"
                  alt="img"
                />
              )}

              <button
                onClick={handleLogout}
                className="hover:text-red-500 transition"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
