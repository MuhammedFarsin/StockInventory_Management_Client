import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Store/Slices/authSlice";
import { removeUser } from "../../Store/Slices/userSlice";

function ShowProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("accessToken");
    dispatch(logout())
    dispatch(removeUser())
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">This is home</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default ShowProducts;
