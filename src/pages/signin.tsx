import { useAuth } from '../context/AuthContext';

// ...existing code...

const SignIn = () => {
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ...existing auth logic...
    
    // After successful authentication
    login(response.token, response.role); // Add this line
    // ...existing navigation logic...
  };
  
  // ...existing code...
};
