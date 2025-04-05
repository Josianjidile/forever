import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: ""
  });

  const toggleState = () => {
    setCurrentState(currentState === "Sign Up" ? "Login" : "Sign Up");
    setFormData({ name: "", email: "", password: "" });
    setFormErrors({ name: "", email: "", password: "" });
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (currentState === "Sign Up" && !formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (currentState === "Sign Up" && !passwordRegex.test(formData.password)) {
      errors.password = "Password must contain letters and numbers";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const endpoint = currentState === "Sign Up" ? "/api/user/register" : "/api/user/login";
      const payload = currentState === "Sign Up" ? formData : {
        email: formData.email,
        password: formData.password
      };

      const response = await axios.post(`${backendUrl}${endpoint}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(currentState === "Sign Up" 
          ? "Account created successfully!" 
          : "Logged in successfully!", {
          autoClose: 2000,
          onClose: () => navigate("/")
        });
      }
    } catch (error) {
      let errorMessage = error.response?.data?.message || 
                       (currentState === "Sign Up" 
                        ? "Failed to create account" 
                        : "Login failed");
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.response?.status === 409) {
        errorMessage = "Email already exists";
      }

      toast.error(errorMessage, { autoClose: 3000 });
      console.error("Authentication error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-[400px] m-auto mt-4 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none" />
      </div>

      {currentState === "Sign Up" && (
        <div className="w-full">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-gray-500`}
            required
          />
          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
        </div>
      )}

      <div className="w-full">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-gray-500`}
          required
        />
        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
      </div>

      <div className="w-full">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-gray-500`}
          required
        />
        {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          currentState === "Sign Up" ? "Sign Up" : "Login"
        )}
      </button>

      <p className="text-sm text-gray-600">
        {currentState === "Sign Up"
          ? "Already have an account? "
          : "Don't have an account? "}
        <button
          type="button"
          onClick={toggleState}
          className="text-blue-600 hover:underline focus:outline-none"
          disabled={isSubmitting}
        >
          {currentState === "Sign Up" ? "Login" : "Sign Up"}
        </button>
      </p>
    </form>
  );
};

export default Login;