import React, { useState } from "react";
import axios from "axios";

const SubmitRating = () => {
  const [storeId, setStoreId] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/users/rating", {
        storeId,
        rating,
      });
      setMessage(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Failed to submit rating");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Submit Rating</h1>
      <input
        type="text"
        placeholder="Store ID"
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default SubmitRating;
