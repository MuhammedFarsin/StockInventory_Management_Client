import { useState, useEffect } from "react";
import axiosInstance from "../../Axios/axios";
import ToasterHot from "../../Common/ToastedHot";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../Config/config";
import { toast } from "sonner";

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    hsnCode: "",
    totalStock: "",
    price: "", // Added price field
    isFavorite: false,
    active: true,
    variants: [
      {
        name: "",
        options: [{ name: "", stock: "" }],
      },
    ],
  });
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/get-product/${productId}`
        );
        const product = response.data.product;
        setFormData({
          productCode: product.productCode,
          productName: product.productName,
          hsnCode: product.hsnCode,
          totalStock: product.totalStock,
          price: product.price, // Fetch the price from the product
          isFavorite: product.isFavorite,
          active: product.active,
          variants: product.variants || [
            { name: "", options: [{ name: "", stock: "" }] },
          ],
        });
        if (product.productImage) {
          setProductImage(`${baseURL}/uploads/${product.productImage}`);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error fetching product details");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleOptionChange = (variantIndex, optionIndex, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].options[optionIndex][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { name: "", options: [{ name: "", stock: "" }] },
      ],
    });
  };

  const addOption = (variantIndex) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].options.push({ name: "", stock: "" });
    setFormData({ ...formData, variants: newVariants });
  };

  const deleteOption = (variantIndex, optionIndex) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const deleteVariant = (index) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageUpload = (e) => {
    setProductImage(e.target.files[0]);
  };

  // Validation Function with toast.error
  const validateForm = () => {
    let isValid = true;

    if (!formData.productCode) {
      toast.error("Product Code is required");
      isValid = false;
    }
    if (!formData.productName) {
      toast.error("Product Name is required");
      isValid = false;
    }
    if (!formData.price || formData.price <= 0) { // Validate price field
      toast.error("Price must be greater than 0");
      isValid = false;
    }
    if (!formData.totalStock || formData.totalStock <= 0) {
      toast.error("Total Stock must be greater than 0");
      isValid = false;
    }
    if (formData.variants.length === 0) {
      toast.error("At least one variant is required");
      isValid = false;
    }

    formData.variants.forEach((variant, variantIndex) => {
      if (!variant.name) {
        toast.error(`Variant ${variantIndex + 1} name is required`);
        isValid = false;
      }
      if (variant.options.length === 0) {
        toast.error(`At least one option is required for variant ${variantIndex + 1}`);
        isValid = false;
      }

      variant.options.forEach((option, optionIndex) => {
        if (!option.name) {
          toast.error(`Option ${optionIndex + 1} name is required in variant ${variantIndex + 1}`);
          isValid = false;
        }
        if (option.stock <= 0) {
          toast.error(`Option ${optionIndex + 1} stock must be greater than 0 in variant ${variantIndex + 1}`);
          isValid = false;
        }
      });
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const data = new FormData();
    data.append("productCode", formData.productCode);
    data.append("productName", formData.productName);
    data.append("hsnCode", formData.hsnCode);
    data.append("price", formData.price.toString()); // Append price to the data
    data.append("totalStock", formData.totalStock.toString());
    data.append("isFavorite", formData.isFavorite.toString());
    data.append("active", formData.active.toString());
    data.append("variants", JSON.stringify(formData.variants));

    if (productImage) {
      data.append("productImage", productImage);
    }

    try {
      const response = await axiosInstance.put(
        `/admin/edit-product/${productId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product updated successfully:", response.data);
      toast.success("Product updated successfully");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 ml-64">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>
      <div className="flex justify-center mb-6">
        <label className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 cursor-pointer">
          <input
            type="file"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0"
          />
          {productImage ? (
            <img
              src={typeof productImage === "string" ? productImage : URL.createObjectURL(productImage)}
              alt="Product"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex justify-center items-center text-gray-500">
              <span className="text-3xl">+</span>
            </div>
          )}
        </label>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold">Product Code</label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">HSN Code</label>
            <input
              type="text"
              name="hsnCode"
              value={formData.hsnCode}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Total Stock</label>
            <input
              type="number"
              name="totalStock"
              value={formData.totalStock}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Variants</label>
          {formData.variants.map((variant, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Variant Name"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm mb-2"
                />
                <button
                  type="button"
                  onClick={() => deleteVariant(index)}
                  className="text-red-500 ml-4 mt-2"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                {variant.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="Option Name"
                      value={option.name}
                      onChange={(e) =>
                        handleOptionChange(index, optIndex, "name", e.target.value)
                      }
                      className="w-1/2 p-3 border rounded-lg shadow-sm mr-2"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={option.stock}
                      onChange={(e) =>
                        handleOptionChange(index, optIndex, "stock", e.target.value)
                      }
                      className="w-1/2 p-3 border rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => deleteOption(index, optIndex)}
                      className="text-red-500 ml-4"
                    >
                      Remove Option
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(index)}
                  className="text-blue-500"
                >
                  Add Option
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="text-blue-500">
            Add Variant
          </button>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="isFavorite"
            checked={formData.isFavorite}
            onChange={() => setFormData({ ...formData, isFavorite: !formData.isFavorite })}
            className="mr-2"
          />
          <label className="text-gray-700 font-semibold">Mark as Favourite</label>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={() => setFormData({ ...formData, active: !formData.active })}
            className="mr-2"
          />
          <label className="text-gray-700 font-semibold">Active</label>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Update Product
          </button>
        </div>
      </form>
      <ToasterHot/>
    </div>
  );
}

export default EditProduct;
