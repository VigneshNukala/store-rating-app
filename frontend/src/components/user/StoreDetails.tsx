import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StoreDetails = () => {
  const { id } = useParams();
  interface Store {
    name: string;
    address: string;
  }

  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/stores/${id}`
        );
        setStore(response.data.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch store details");
      }
    };
    fetchStoreDetails();
  }, [id]);

  return (
    <div>
      <h1>Store Details</h1>
      {error && <p>{error}</p>}
      {store && (
        <div>
          <p>Name: {store.name}</p>
          <p>Address: {store.address}</p>
        </div>
      )}
    </div>
  );
};

export default StoreDetails;
