import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const UseFetchProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fetchedProfile, setFetchedProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/authentication/profile/`,
        // `http://127.0.0.1:8000/api/authentication/profile/`,
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
        console.log("Response :", response.data);
        setSuccess(true);
        setFetchedProfile(response.data);
        console.log(fetchedProfile);
      } else if (response.status === 400 || response.status === 404) {
        setError(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchedProfile !== null) {
      console.log(fetchedProfile);
    }
  }, [fetchedProfile]);

  return { fetchProfile, setError, loading, error, success, fetchedProfile };
};

export default UseFetchProfile;
