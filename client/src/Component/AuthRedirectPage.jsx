import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const AuthRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getAuthTokens = async () => {
      try {
        toast.success('OAuth successful. Proceeding with job update.', {
          position: 'top-left',
        });
        navigate(-1);
      } catch (error) {
        console.error('Error handling auth redirect:', error);
        toast.error('Error completing OAuth. Please try again.', {
          position: 'top-left',
        });
        // navigate(-1);
      }
    };

    getAuthTokens();
  }, []);

  return (
    <div>
      <h1>Authenticating...</h1>
      <ToastContainer />
    </div>
  );
};

export default AuthRedirectPage;
