import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../Store/Slices/authSlice';
import { removeUser } from '../Store/Slices/userSlice';
import { useDispatch } from 'react-redux';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Remove the token from localStorage
    dispatch(logout()); // Dispatch logout action
    dispatch(removeUser()); // Remove user data from Redux store
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="flex">
      {/* Sidebar Section */}
      <aside className="fixed w-64 h-screen bg-gray-800 text-white p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Stock Management</h2>
        </div>
        <nav className="flex-grow">
          <ul>
            <li className="mb-4">
              <Link
                to="/admin/dashboard"
                className="block py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/admin/products"
                className="block py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Products
              </Link>
            </li>
            {/* Add more navigation links here if needed */}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Logout
        </button>
      </aside>

      {/* Content Area */}
      <div className="flex-grow p-6"> {/* Use flex-grow here */}
        {/* Content goes here, i.e., routes to Dashboard, Products, etc. */}
      </div>
    </div>
  );
}

export default Navbar;