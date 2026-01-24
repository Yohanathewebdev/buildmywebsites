import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const OrderFeedbackForm = ({ order, onClose }) => {
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/orders/feedback/",
        {
          order: order.id,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );

      alert("Thank you for your feedback ❤️");
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 mt-3">
      <h5>Feedback for Order #{order.id}</h5>

      <label>Rating</label>
      <select
        className="form-select"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <label className="mt-2">Comment</label>
      <textarea
        className="form-control"
        rows="3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="mt-3 d-flex gap-2">
        <button
          className="btn btn-success"
          disabled={loading}
          onClick={submitFeedback}
        >
          Submit
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OrderFeedbackForm;
