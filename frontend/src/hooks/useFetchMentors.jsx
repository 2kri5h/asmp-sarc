import { useState, useCallback } from "react";
import { json } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import { API_BASE_URL } from "../apiConfig";

const mentorCache = {};

const UseFetchMentors = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mentors, setMentors] = useState(null);

  const fetchMentors = useCallback(async (field) => {
    if (field && mentorCache[field]) {
      setMentors(mentorCache[field]);
      setSuccess(true);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    const userData = {
      accessToken: localStorage.getItem("accessToken") || "82cf3f73-f995-4d72-92bb-7c158a38232a",
    };

    try {
      const csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);
      const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "";
      const response = await axios.post(
        `${API_BASE_URL}/api/mentors/${field}/`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        mentorCache[field] = response.data;
        setMentors(response.data);
      } else {
        setError("Unexpected response status");
      }
    } catch (err) {
      console.error("Error in fetchMentors:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchMentors, setError, loading, error, success, mentors, setMentors };
};

export default UseFetchMentors;