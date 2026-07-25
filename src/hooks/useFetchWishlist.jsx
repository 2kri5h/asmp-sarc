import { useState, useCallback } from "react";
import { json } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const UseFetchWishlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mentors, setMentors] = useState([]);

  const fetchMentors = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // const accessToken = "82cf3f73-f995-4d72-92bb-7c158a38232a";
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/registration/wishlist/`,
        // `http://127.0.0.1:8000/api/registration/wishlist/`,
        {
          params: {
            accessToken: accessToken,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setMentors(response.data);
        // console.log("response.data= ", response.data)
      } else {
        setError("Error fetching wishlist");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchMentors, loading, error, success, mentors };
};

export default UseFetchWishlist;