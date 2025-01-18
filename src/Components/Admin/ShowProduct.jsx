import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../Axios/axios";
import { baseURL } from "../../Config/config";
import ToasterHot from "../../Common/ToastedHot";
import { toast } from "sonner";
import ConfirmationModal from "../../Common/ConfirmationModal"; // Import your modal

function ShowProduct () {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-products");
        console.log(response);
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          console.error("No products found in response");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (productId) => {
    navigate(`/admin/edit-product/${productId}`); 
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Deleting the product
      const response = await axiosInstance.delete(
        `/admin/delete-product/${productId}`
      );
  
      if (response.status === 200) {
        toast.success("Product deleted successfully");
  
        // Make sure the ID used is the correct one.
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)  // Ensure '_id' is correct key
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete the product");
    }
  };

  const handleAddProduct = () => {
    navigate("/admin/add-product");
  };

  const handleSale = (productId) => {
    navigate(`/admin/sale/${productId}`); // Navigate to the sale page for that product
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ml-64">
      {/* Sidebar */}
      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Amazing Collection</h1>
          <button
            onClick={handleAddProduct}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg"
          >
            Add Product
          </button>
        </div>
  
        <div className="bg-white rounded-lg shadow-lg p-6">
          {products.length > 0 ? (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium text-gray-700">Image</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium text-gray-700">Product Code</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium text-gray-700">Product Name</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium text-gray-700">Total Stock</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium text-gray-700">HSN Code</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`border-b border-gray-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={`${baseURL}/uploads/${product.productImage}`}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-700">{product.productCode}</td>
                    <td className="px-6 py-4 text-gray-700">{product.productName}</td>
                    <td className="px-6 py-4 text-gray-700">{product.totalStock}</td>
                    <td className="px-6 py-4 text-gray-700">{product.hsnCode}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEditProduct(product._id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleSale(product._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                        >
                          Sale
                        </button>
                        <ConfirmationModal
                          onConfirm={() => handleDeleteProduct(product._id)}
                          title="Are you sure you want to delete?"
                          text="This action cannot be undone!"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No products available</p>
          )}
        </div>
      </main>
      <ToasterHot />
    </div>
  );
}

export default ShowProduct;
