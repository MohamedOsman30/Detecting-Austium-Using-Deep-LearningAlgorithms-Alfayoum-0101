import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const token = queryParams.get('token');
                const errorParam = queryParams.get('error');

                if (errorParam) {
                    throw new Error(errorParam);
                }

                if (!token) {
                    throw new Error('Authentication token not found');
                }

                // Store the token
                localStorage.setItem('authToken', token);

                // Fetch user data using the token
                const response = await axios.get('http://project-api.com/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Save user data
                localStorage.setItem(`userData_${token}`, JSON.stringify(response.data.data));

                // Redirect to dashboard
                navigate('/');
            } catch (err) {
                setError(err.message || 'Authentication failed');
                console.error('Auth Error:', err);
            } finally {
                setLoading(false);
            }
        };

        authenticateUser();
    }, [location, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return null; // Redirected already, no need to render anything
};

export default AuthCallback;