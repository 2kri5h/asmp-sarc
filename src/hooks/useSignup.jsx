import { useState, useCallback } from "react";

const UseSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get CSRF token from cookies
      const csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);
      const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "DUMMY_CSRF_TOKEN";

      console.log("Sending userData:", userData);
      const response = await fetch(
        "http://127.0.0.1:8000/api/authentication/create-user/",
        // `http://127.0.0.1:8000/api/authentication/create-user/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(userData),
        }
      );

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.status === 201) {
        setSuccess(true);
        return { success: true };
      } else if (response.status === 400) {
        // DRF returns validation errors as field: [error] objects
        let message = responseData?.message || responseData?.error;
        if (!message) {
          // Extract first validation error from DRF field errors
          const firstKey = Object.keys(responseData || {})[0];
          if (firstKey && Array.isArray(responseData[firstKey])) {
            message = `${firstKey}: ${responseData[firstKey][0]}`;
          } else {
            message = "Registration failed. Please check your details.";
          }
        }
        setError(message);
        return { success: false, message };
      } else {
        const message = responseData?.detail || "Unknown error occurred.";
        setError(message);
        return { success: false, message };
      }

    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { signup, loading, error, success };
};

export default UseSignup;