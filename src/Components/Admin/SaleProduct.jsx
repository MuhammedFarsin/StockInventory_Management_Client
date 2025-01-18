import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Axios/axios";
import ToasterHot from "../../Common/ToastedHot";
import { toast } from "sonner";

const SaleProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [buyerDetails, setBuyerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch the product details based on the productId
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/admin/get-sale-product/${productId}`);
        if (response.data && response.data.saleProduct) {
          setProduct(response.data.saleProduct[0]); // Assuming saleProduct is an array
        } else {
          toast.error("Product not found.");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    setBuyerDetails({
      ...buyerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSale = async () => {
    // Validate buyer details
    if (!buyerDetails.name || !buyerDetails.email || !buyerDetails.phone || !buyerDetails.address) {
      toast.error("Please fill in all buyer details.");
      return;
    }

    // Validate quantity
    if (quantity <= 0 || quantity > product.totalStock) {
      toast.error("Invalid quantity.");
      return;
    }

    try {
      const saleData = {
        buyerDetails,
        quantitySold: quantity,
      };

      const response = await axiosInstance.post(`/admin/sale-product/${productId}`, saleData);
      if (response.status === 200) {
        toast.success("Sale completed successfully!");
        navigate("/admin/dashboard"); // Navigate back to product list
      }
    } catch (error) {
      console.error("Error completing sale:", error);
      toast.error("Failed to complete the sale.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 ml-64">
      <main className="flex-grow p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Complete the Sale</h2>
          {product ? (
            <>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">Product Name:</p>
                  <p className="text-gray-700">{product.productName}</p>
                </div>
                <div>
                  <p className="font-semibold text-lg">Price:</p>
                  <p className="text-gray-700">₹{product.price}</p>
                </div>
                <div>
                  <p className="font-semibold text-lg">Available Stock:</p>
                  <p className="text-gray-700">{product.totalStock}</p>
                </div>
                <div>
                  <label htmlFor="quantity" className="font-semibold text-lg">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    max={product.totalStock}
                    className="mt-2 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <h3 className="font-semibold text-xl mt-6">Buyer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="name" className="font-semibold">Buyer Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter buyer's name"
                      value={buyerDetails.name}
                      onChange={handleInputChange}
                      className="mt-2 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="font-semibold">Buyer Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter buyer's email"
                      value={buyerDetails.email}
                      onChange={handleInputChange}
                      className="mt-2 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="font-semibold">Buyer Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="Enter buyer's phone"
                      value={buyerDetails.phone}
                      onChange={handleInputChange}
                      className="mt-2 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="font-semibold">Buyer Address</label>
                    <textarea
                      id="address"
                      name="address"
                      placeholder="Enter buyer's address"
                      value={buyerDetails.address}
                      onChange={handleInputChange}
                      className="mt-2 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
                    ></textarea>
                  </div>
                </div>
                <button
                  onClick={handleSale}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg mt-6 w-full"
                >
                  Complete Sale
                </button>
              </div>
            </>
          ) : (
            <p>Product details not available.</p>
          )}
        </div>
      </main>
      <ToasterHot />
    </div>
  );
};

export default SaleProduct;
