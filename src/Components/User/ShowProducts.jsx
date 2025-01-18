import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Store/Slices/authSlice";
import { removeUser } from "../../Store/Slices/userSlice";
import axiosInstance from "../../Axios/axios";

function ShowProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        console.log(response);
        if (response.data && response.data) {
          setProducts(response.data);
        } else {
          console.error("No products found in response");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("accessToken");
    dispatch(logout());
    dispatch(removeUser());
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-600">Welcome to Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        Here are the products added by you. Explore and manage your inventory.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
          >
            <img
              src={`https://farsinstockinvenotory.site/uploads/${product.productImage}`}
              alt={product.productName}
              className="w-full h-56 object-cover mb-4 rounded-t-xl"
            />

            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.productName}</h3>
              <p className="text-lg text-indigo-600">${product.price.toFixed(2)}</p>
              <p className="text-gray-600 mt-2">Code: {product.productCode}</p>
              <p className="text-gray-600 mt-1">HSN Code: {product.hsnCode}</p>
              <p className="text-gray-600 mt-1">Total Stock: {product.totalStock}</p>
              {product.variants && product.variants.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-700">Variants:</h4>
                  <ul className="list-disc ml-6">
                    {product.variants.map((variant) => (
                      <li key={variant._id}>
                        <span className="font-bold text-gray-800">{variant.name}:</span>
                        <ul className="list-disc ml-6">
                          {variant.options.map((option) => (
                            <li key={option._id}>
                              {option.name} - Stock: {option.stock}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowProducts;
