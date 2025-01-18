import { useState } from "react";
import axiosInstance from "../../Axios/axios";
import ToasterHot from "../../Common/ToastedHot";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    price: "", // Product price field
    hsnCode: "",
    totalStock: "",
    isFavourite: false,
    active: true,
    variants: [
      {
        name: "",
        options: [{ name: "", stock: "" }], // Removed price from options
      },
    ],
  });
  const [productImage, setProductImage] = useState(null);

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
        { name: "", options: [{ name: "", stock: "" }] }, // Removed price from new variant
      ],
    });
  };

  const deleteVariant = (index) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const addOption = (variantIndex) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].options.push({ name: "", stock: "" }); // Removed price from new option
    setFormData({ ...formData, variants: newVariants });
  };

  const deleteOption = (variantIndex, optionIndex) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation
    if (!formData.productCode.trim()) {
      toast.error("Product Code is required.");
      return;
    }
    if (!formData.productName.trim()) {
      toast.error("Product Name is required.");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Product Price must be a valid number.");
      return;
    }
    if (formData.totalStock && formData.totalStock <= 0) {
      toast.error("Total Stock must be a valid number.");
      return;
    }
    if (!formData.hsnCode || !/^\d{4,}$/.test(formData.hsnCode)) {
      toast.error("Please enter a valid HSN code (at least 4 digits).");
      return; // Prevent form submission if HSN code is invalid
    }
  
    // Check if variants and options are valid
    for (let i = 0; i < formData.variants.length; i++) {
      const variant = formData.variants[i];
      if (!variant.name.trim()) {
        toast.error(`Variant Name is required for variant ${i + 1}`);
        return;
      }
  
      for (let j = 0; j < variant.options.length; j++) {
        const option = variant.options[j];
        if (!option.name.trim()) {
          toast.error(`Option Name is required for option ${j + 1} in variant ${i + 1}`);
          return;
        }
        if (!option.stock || option.stock <= 0) {
          toast.error(`Stock must be a valid number for option ${j + 1} in variant ${i + 1}`);
          return;
        }
        if (!productImage) {
          toast.error("Please upload a product image.");
          return; // Prevent form submission if image is not uploaded
        }
      }
    }
  
    // If validation passes, continue with the form submission
    const data = new FormData();
    data.append("productCode", formData.productCode);
    data.append("productName", formData.productName);
    data.append("price", formData.price); 
    data.append("hsnCode", formData.hsnCode);
    data.append("totalStock", formData.totalStock);
    data.append("isFavourite", formData.isFavourite);
    data.append("active", formData.active);
    data.append("variants", JSON.stringify(formData.variants));
    if (productImage) {
      data.append("productImage", productImage);
    }
  
    try {
      const response = await axiosInstance.post("/admin/create-product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product added successfully:", response.data);
      toast.success("Product added successfully");
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
      setFormData({
        productCode: "",
        productName: "",
        price: "",
        hsnCode: "",
        totalStock: "",
        isFavourite: false,
        active: true,
        variants: [
          {
            name: "",
            options: [{ name: "", stock: "" }],
          },
        ],
      });
      setProductImage(null);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto p-8 ml-64">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <div className="flex justify-center mb-6">
        <label className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 cursor-pointer">
          <input
            type="file"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0"
          />
          {productImage ? (
            <img
              src={URL.createObjectURL(productImage)}
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
        <div className="bg-white w-full rounded-lg shadow-lg p-9">
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
              <label className="block text-gray-700 font-semibold">Product Price</label>
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
                    <div key={optIndex} className="flex justify-between items-center">
                      <input
                        type="text"
                        placeholder="Option Name"
                        value={option.name}
                        onChange={(e) =>
                          handleOptionChange(index, optIndex, "name", e.target.value)
                        }
                        className="p-3 border rounded-lg shadow-sm"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={option.stock}
                        onChange={(e) =>
                          handleOptionChange(index, optIndex, "stock", e.target.value)
                        }
                        className="p-3 border rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => deleteOption(index, optIndex)}
                        className="text-red-500 ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className="text-blue-500 hover:underline"
                  >
                    Add Option
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="text-blue-500 hover:underline"
            >
              Add Variant
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFavourite"
              checked={formData.isFavourite}
              onChange={(e) => setFormData({ ...formData, isFavourite: e.target.checked })}
              className="mr-2"
            />
            <label className="text-gray-700">Favourite</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="mr-2"
            />
            <label className="text-gray-700">Active</label>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      <ToasterHot />
    </div>
  );
}

export default AddProduct;
