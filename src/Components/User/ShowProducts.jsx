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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome to Dashboard ... !</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <p className="mb-4 text-gray-600">
        Welcome, Admin! Here are the products added by you:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={`https://farsinstockinvenotory.site/uploads/${product.productImage}`}
              alt={product.productName}
              className="w-full h-48 object-cover"
            />

            {console.log(product.productImage)}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.productName}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <p className="text-gray-500 mt-2">Code: {product.productCode}</p>
              <p className="text-gray-500 mt-2">HSN Code: {product.hsnCode}</p>
              <p className="text-gray-500 mt-2">
                Total Stock: {product.totalStock}
              </p>
              {product.variants && product.variants.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-semibold">Variants:</h4>
                  <ul className="list-disc ml-4">
                    {product.variants.map((variant) => (
                      <li key={variant._id}>
                        <span className="font-bold">{variant.name}:</span>
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
