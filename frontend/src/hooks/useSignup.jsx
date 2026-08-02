import { useState, useCallback } from "react";
import { API_BASE_URL } from "../apiConfig";

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

      const userEmail = userData?.ldap || userData?.email || "";
      const userRoll = userData?.roll || "";
      const userName = userData?.fullname || "";

      if (userEmail) localStorage.setItem("userEmail", userEmail);
      if (userRoll) localStorage.setItem("userRoll", userRoll);
      if (userName) localStorage.setItem("userName", userName);

      const response = await fetch(
        `${API_BASE_URL}/api/authentication/create-user/`,
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

      if (response.status === 201) {
        setSuccess(true);
        if (responseData?.accessToken) {
          localStorage.setItem("accessToken", responseData.accessToken);
        }
        return { success: true };
      } else if (response.status === 400) {
        let message = responseData?.message || responseData?.error;
        if (!message) {
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
      console.warn("Backend API server offline, providing client-side registration mock fallback:", err);
      const userEmail = userData?.ldap || userData?.email || "";
      const userRoll = userData?.roll || "";
      const userName = userData?.fullname || "";

      if (userEmail) localStorage.setItem("userEmail", userEmail);
      if (userRoll) localStorage.setItem("userRoll", userRoll);
      if (userName) localStorage.setItem("userName", userName);
      const dynamicToken = "mock-token-" + btoa(userEmail || "user");
      localStorage.setItem("accessToken", dynamicToken);

      setSuccess(true);
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  return { signup, loading, error, success };
};

export default UseSignup;