import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserRatings = () => {
  const { userId } = useParams();
  interface Rating {
    id: string;
    rating: number;
  }

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/ratings/user/${userId}`
        );
        setRatings(response.data.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch user ratings");
      }
    };
    fetchRatings();
  }, [userId]);

  return (
    <div>
      <h1>User Ratings</h1>
      {error && <p>{error}</p>}
      <ul>
        {ratings.map((rating) => (
          <li key={rating.id}>Rating: {rating.rating}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserRatings;
