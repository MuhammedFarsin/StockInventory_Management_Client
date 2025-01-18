import { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { Link } from "react-router-dom"
import ToasterHot from "../../Common/ToastedHot";
import axiosInstance from "../../Axios/axios";
import { toast } from "sonner";
import { login } from "../../Store/Slices/authSlice"; // Import the login action
import { setUser } from "../../Store/Slices/userSlice"; // Import the login action

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch(); // Initialize useDispatch

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", { email, password });
      console.log("this is data", response.data.user);
      localStorage.setItem("accessToken", response.data.accessToken);

      dispatch(login());
      dispatch(setUser(response.data.user));

      toast.success("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage : 
          "url('/src/assets/vecteezy_abstract-orange-wavy-background-orange-background-with_35768911.jpg')",
      }}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Log in
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange-500">
            Sign up
          </Link>
        </p>

        <div className="flex items-center mb-4">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span className="px-4 text-gray-500">OR</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
          </div>
          <div className="text-right mb-4">
            <a href="/email-password-reset" className="text-orange-500 text-sm">
              Forgot your password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Log in
          </button>
        </form>
      </div>
      <ToasterHot />
    </div>
  );
}

export default Login;
