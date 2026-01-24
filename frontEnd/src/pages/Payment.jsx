import { useParams, useNavigate } from "react-router-dom";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handlePayment = () => {
    // Later: integrate Flutterwave / PayPal / Stripe
    alert("Payment successful!");
    navigate("/orders");
  };

  return (
    <div className="container mt-5 text-center">
      <h3 className="fw-bold mb-3">Payment</h3>
      <p>Order ID: <strong>{orderId}</strong></p>

      <button className="btn btn-primary btn-lg" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
