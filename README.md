# **store-rating-app**

## **Introduction**
A web application for rating and reviewing stores. Users can browse stores, leave ratings, and share their experiences to showcase my skills on full stack development.

## **Live Demo**
- **Frontend Link** : https://store-rating-app-five.vercel.app
- **Backend Link** : https://store-rating-app-i9vn.onrender.com

## **Important Notes**
- Provided all the rotes and their explanation in the backend README.md file
- The backend is deployed on Render, which provides a free-tier hosting solution for backend APIs. However, free-tier instances on Render spin down if they are inactive for a period of time.
- I have used Avien Console to manage the MySQL database, allowing easy query execution and data inspection. It helps in debugging and ensuring backend API data consistency.
- For local development, update the origin of the cors in index.ts in backend :
  ```
  {
    origin : "https://localhost:3001"
  }
  ```
- For local development, update the API URL in the .env file at the root directory:
  ```
  VITE_API_URL=https://localhost:3001/
  ```

## **Prerequisites**
Ensure you have the following dependencies installed:
- Node.js (v14 or higher)
- npm or yarn

## Getting Started

Follow these steps to set up your development environment:

### **1. Clone the repository:**  

```
git clone https://github.com/VigneshNukala/store-rating-app.git
cd store-rating-app
```

### **2. Install dependencies for both frontend and backend:**

- **Backend** : Navigate to the backend/ directory and run npm install (or yarn install).
```bash
cd backend
npm install  # or yarn install
```

- **Frontend** : Navigate to the frontend/ directory and run npm install (or yarn install).
```bash
cd frontend
npm install  # or yarn install
```

### **3. Start the servers (Two Different Terminals):**
- **Backend**
To start the backend server, navigate to the backend/ directory (if not already there) and run in a seperate terminal:
```bash
cd backend
npm run dev  # or yarn dev
```
- **Frontend**
To start the frontend server, navigate to the frontend/ directory (if not already there) and run in a seperate terminal:
```bash
cd frontend
npm run dev  # or yarn start
```

### **3. Open the servers**
Once both servers are running, open your browser and visit:
```
http://localhost:5173/
```
