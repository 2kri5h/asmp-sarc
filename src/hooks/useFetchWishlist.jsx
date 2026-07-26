import { useState, useCallback } from "react";
import { json } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

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
      const accessToken = localStorage.getItem("accessToken") || "82cf3f73-f995-4d72-92bb-7c158a38232a";

      const response = await axios.get(
        `${API_BASE_URL}/api/registration/wishlist/`,
        {
          params: {
            accessToken: accessToken,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let fetchedMentors = [];
      if (response.status === 200 && Array.isArray(response.data)) {
        fetchedMentors = response.data.map(m => ({
          ...m,
          name: m.fullname || m.name,
        }));
      }

      // Merge localWishlist if present
      let localWishlist = [];
      try {
        localWishlist = JSON.parse(localStorage.getItem("localWishlist") || "[]");
      } catch (e) {
        localWishlist = [];
      }

      if (localWishlist.length > 0) {
        // Fetch all mentors from backend if needed to resolve localWishlist IDs
        try {
          const allRes = await axios.post(`${API_BASE_URL}/api/mentors/all/`, { accessToken });
          if (allRes.status === 200 && Array.isArray(allRes.data)) {
            const allMentors = allRes.data.map(m => ({ ...m, name: m.fullname || m.name }));
            const localObjects = allMentors.filter(m => localWishlist.includes(m.id));
            
            // Combine while preventing duplicates
            const combinedMap = new Map();
            fetchedMentors.forEach(m => combinedMap.set(m.id, m));
            localObjects.forEach(m => combinedMap.set(m.id, m));
            fetchedMentors = Array.from(combinedMap.values());
          }
        } catch (e) {
          console.warn("Could not fetch all mentors for local merge:", e);
        }
      }

      setSuccess(true);
      setMentors(fetchedMentors);
    } catch (err) {
      console.warn("Error fetching wishlist API, checking localWishlist:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchMentors, loading, error, success, mentors, setMentors };
};

export default UseFetchWishlist;