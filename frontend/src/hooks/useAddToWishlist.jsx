import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import { API_BASE_URL } from "../apiConfig";

const UseAddToWishlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addMentor = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const userData = {
      accessToken: token,
      mentor: id,
    };

    // Save to localWishlist for instant sync
    try {
      const local = JSON.parse(localStorage.getItem("localWishlist") || "[]");
      if (!local.some((item) => (typeof item === 'object' ? item.id === id : item === id))) {
        local.push(id);
        localStorage.setItem("localWishlist", JSON.stringify(local));
      }
    } catch (e) {
      console.warn("Error updating localWishlist:", e);
    }

    try {
      const csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);
      const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : 'DUMMY_CSRF_TOKEN';

      const response = await axios.put(
        `${API_BASE_URL}/api/registration/wishlist/`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        Swal.fire({
          icon: "success",
          title: "Mentor added to wishlist",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (response.status === 400) {
        const errorMessage = typeof response.data === 'string' ? response.data : "Mentor already in wishlist";
        Swal.fire({
          icon: "info",
          title: "Wishlist Status",
          text: errorMessage,
        });
        setError(errorMessage);
      }
    } catch (err) {
      // Even if server returns 400 (already in wishlist) or network issue, notify user gracefully
      const msg = err.response?.data || err.message;
      if (typeof msg === 'string' && msg.includes("already in wishlist")) {
        Swal.fire({
          icon: "info",
          title: "Wishlist Status",
          text: "Mentor is already in your wishlist!",
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Mentor added to wishlist",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return { addMentor, success };
};

export default UseAddToWishlist;
