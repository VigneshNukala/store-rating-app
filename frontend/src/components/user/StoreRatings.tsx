import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";


const StoreRatings = () => {
  const { storeId } = useParams();
  const [ratings, setRatings] = useState<{ id: string; rating: number }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get(
          `/users/ratings/store/${storeId}`
        );
        setRatings(response.data.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch ratings");
      }
    };
    fetchRatings();
  }, [storeId]);

  return (
    <div>
      <h1>Store Ratings</h1>
      {error && <p>{error}</p>}
      <ul>
        {ratings.map((rating) => (
          <li key={rating.id}>Rating: {rating.rating}</li>
        ))}
      </ul>
    </div>
  );
};

export default StoreRatings;
