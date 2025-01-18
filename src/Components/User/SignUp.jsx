import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ToasterHot from "../../Common/ToastedHot";
import axiosInstance from "../../Axios/axios";
import { toast } from "react-hot-toast";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/signup", {
        username,
        email,
        password,
      });

      toast.success(response.data.message);

      navigate("/");
    } catch (error) {
      // Error handling
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/src/assets/vecteezy_abstract-orange-wavy-background-orange-background-with_35768911.jpg')",
      }}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Sign Up
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Sign Up
          </button>
        </form>
      </div>
      <ToasterHot />
    </div>
  );
}

export default SignUp;
