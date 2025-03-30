import { useEffect, useState } from "react";
import axios from "axios";

const StoreList = () => {
  interface Store {
    id: number;
    name: string;
  }

  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users/stores");
        setStores(response.data.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch stores");
      }
    };
    fetchStores();
  }, []);

  return (
    <div>
      <h1>Store List</h1>
      {error && <p>{error}</p>}
      <ul>
        {stores.map((store) => (
          <li key={store.id}>{store.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default StoreList;
