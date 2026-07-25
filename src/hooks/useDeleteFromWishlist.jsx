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
    const userData = {
      accessToken: localStorage.getItem("accessToken"),
      // "accessToken" : "82cf3f73-f995-4d72-92bb-7c158a38232a",
      mentor: id,
    };

    try {
      // Get CSRF token from cookies
      const csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);
      const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "DUMMY_CSRF_TOKEN";
      // const csrfToken = "35Znfr3R2fYtO0zbFhuj3Li6s68F9sx9"

      const response = await axios.post(
        `http://127.0.0.1:8000/api/registration/wishlist/`,
        // `http://127.0.0.1:8000/api/registration/wishlist/`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            // Include CSRF token in headers
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        Swal.fire({
          icon: "success",
          title: "Mentor Removed from wishlist",
          showConfirmButton: false,
          timer: 1500, // Auto close after 1.5 seconds
        }).then(() => {
          window.location.reload(); // Refresh the page immediately after the alert is closed or timer expires
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data,
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
