import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

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
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/authentication/profile/`,
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
        setFetchedProfile(response.data);
      } else {
        // Invalid token on backend - purge stale localStorage items
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRoll");
        localStorage.removeItem("userName");
        setFetchedProfile(null);
        setError(response.data);
      }
    } catch (err) {
      console.warn("Profile fetch issue or backend response error:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
        // Stale token! Clear invalid localStorage items
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRoll");
        localStorage.removeItem("userName");
        setFetchedProfile(null);
      } else {
        // Network offline - check if valid stored credentials exist
        const storedEmail = localStorage.getItem("userEmail") || "";
        const storedRoll = localStorage.getItem("userRoll") || "";
        const storedName = localStorage.getItem("userName") || "";

        if (storedEmail && storedRoll) {
          setSuccess(true);
          setFetchedProfile({
            user: {
              fullname: storedName,
              ldap: storedEmail.includes("@") ? storedEmail : `${storedEmail}@iitb.ac.in`,
              roll: storedRoll,
            },
            email: storedEmail,
            roll_number: storedRoll,
          });
        } else {
          setFetchedProfile(null);
        }
      }
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
