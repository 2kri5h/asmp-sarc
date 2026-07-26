import { useState, useCallback } from "react";
import { json } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const UseDeleteFromWishlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteMentor = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const token = localStorage.getItem("accessToken") || "82cf3f73-f995-4d72-92bb-7c158a38232a";
    const userData = {
      accessToken: token,
      mentor: id,
    };

    // Remove from localWishlist
    try {
      const local = JSON.parse(localStorage.getItem("localWishlist") || "[]");
      const updated = local.filter((item) => (typeof item === 'object' ? item.id !== id : item !== id));
      localStorage.setItem("localWishlist", JSON.stringify(updated));
    } catch (e) {
      console.warn("Error cleaning localWishlist:", e);
    }

    try {
      const csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);
      const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "DUMMY_CSRF_TOKEN";

      const response = await axios.post(
        `http://127.0.0.1:8000/api/registration/wishlist/`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setSuccess(true);
        Swal.fire({
          icon: "success",
          title: "Mentor Removed from wishlist",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data || "Could not remove mentor",
        });
        setError(response.data);
      }

      // const response = await fetch('/api/mentors/', {
      //     method: 'GET',
      //     headers: {
      //         'Content-Type': 'application/json',
      //         // Include CSRF token in headers
      //         'X-CSRFToken': csrfToken,
      //     },
      //     body: JSON.stringify(userData),
      // });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteMentor, success };
};

export default UseDeleteFromWishlist;
