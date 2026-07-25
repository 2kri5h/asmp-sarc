import { useState, useCallback } from "react";
import Swal from "sweetalert2";

const UseEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const editProfile = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get CSRF token from cookies
      const csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);
      const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "DUMMY_CSRF_TOKEN";
      // console.log(localStorage.getItem('profile'));

      const response = await fetch(
        "http://127.0.0.1:8000/api/authentication/profile/",
        // `http://127.0.0.1:8000/api/authentication/profile/`,
        {
          method: localStorage.getItem("profile") ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.status === 200) {
        setError("Profile Edited Successfully");
        localStorage.setItem("profile", { profile: "true" });
        Swal.fire({
          icon: "success",
          title: "Profile Edited Successfully",
          showConfirmButton: false,
        });
      }
      if (response.status === 400) {
        setError("Please verify your ldap first");
      }
      if (response.status === 404) {
        setError("No user found");
      }
      if (response.status == 406) {
        Swal.fire({
          icon: "error",
          title: "Please fill all the fields",
          showConfirmButton: false,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { editProfile, loading, error, success };
};

export default UseEditProfile;
