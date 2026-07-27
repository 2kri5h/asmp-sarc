import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';

const UseForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const forgotPassword = useCallback(async (email) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);
            const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "DUMMY_CSRF_TOKEN";

            const response = await fetch(
                // 'http://127.0.0.1:8000/api/authentication/forgot-password/',
                "http://127.0.0.1:8000/api/authentication/forgot-password/",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken, // Add this if CSRF is required
                    },
                    body: JSON.stringify({ email }),
                }
            );

            console.log(response);
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            const responseData = await response.json().catch(() => null);
            console.log("Response data:", responseData);

            if (response.status === 200) {
                setSuccess(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Credentials Sent',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            } else if (response.status === 400 || response.status === 404) {
                setError(responseData?.error || 'Failed to send reset email');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: responseData?.error || 'Failed to send reset email',
                    showConfirmButton: false,
                });
            } else {
                setError('Unexpected error occurred');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unexpected error occurred',
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            setError('Failed to send reset email');
            console.error('Error during forgotPassword:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send reset email',
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    return { forgotPassword, loading, error, success };
};

export default UseForgotPassword;
