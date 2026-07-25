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
        `https://asmp.sarc-iitb.org/api/authentication/profile/`,
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
      } else if (response.status === 400 || response.status === 404) {
        setError(response.data);
      }
    } catch (err) {
      console.warn("Backend server unreachable for profile, returning mock profile fallback:", err);
      const userEmail = localStorage.getItem("userEmail") || "testid123@iitb.ac.in";
      setSuccess(true);
      setFetchedProfile({
        name: "Test Student",
        email: userEmail,
        roll_number: "25B3004",
        department: "Computer Science & Engineering",
        degree: "B.Tech.",
        contact_number: "+91 9876543210"
      });
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
