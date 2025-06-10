import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookSuc from './BookSuc';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError('Missing session ID');
        console.error('No session_id provided in URL');
        return;
      }

      try {
        console.log('Calling confirm-payment with session_id:', sessionId);
        const response = await fetch(`http://project-api.com/api/confirm-payment?session_id=${sessionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Confirm payment error response:', errorData);
          throw new Error(`Failed to confirm payment: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        console.log('Confirm payment response:', data);
        if (data.message === 'Payment confirmed') {
          setPaymentConfirmed(true);
          setShowPopup(true);
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          throw new Error('Unexpected response from confirm-payment');
        }
      } catch (err) {
        console.error('Error in confirmPayment:', err.message);
        setError(err.message);
      }
    };

    confirmPayment();
  }, [sessionId, navigate]);

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/'); // Redirect immediately when closing popup
  };

  if (error) {
    return (
      <div>
        <h2>Payment Confirmation Error</h2>
        <p>Error: {error}</p>
        <p>Please contact support or try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {paymentConfirmed ? (
        <div>
          <h2>Appointment Confirmed!</h2>
          <p>Thank you for your payment. You'll receive a confirmation email shortly.</p>
          <BookSuc isOpen={showPopup} onClose={handleClosePopup} />
        </div>
      ) : (
        <div>
          <h2>Processing Payment...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;