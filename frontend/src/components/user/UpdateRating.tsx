import React, { useState } from "react";
import axios from "axios";

const UpdateRating = () => {
  const [ratingId, setRatingId] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3001/users/rating/${ratingId}`,
        {
          rating,
        }
      );
      setMessage(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Failed to update rating");
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h1>Update Rating</h1>
      <input
        type="text"
        placeholder="Rating ID"
        value={ratingId}
        onChange={(e) => setRatingId(e.target.value)}
      />
      <input
        type="number"
        placeholder="New Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <button type="submit">Update</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UpdateRating;
