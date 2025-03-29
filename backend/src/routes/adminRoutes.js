const bcrypt = require("bcryptjs");
const express = require("express");

const database = require("../db/db");
const authorizeRoles = require("../middleware/roleMiddleware");
console.log("AuthorizeRoles",typeof authorizeRoles); 

const adminRouter = express.Router();

adminRouter.use(authorizeRoles("System Administrator"));

//step 1
adminRouter.post("/add-user", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required.",
      });
    }

    const existingUser = await database.getUser(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ status: "error", message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await database.createUser(name, email, hashedPassword, address, role);

    return res
      .status(201)
      .json({ status: "success", message: "User registered successfully." });
  } catch (error) {
    return res.status(500).json({
      status: error,
      message: "Internal Server Error. Please try again later.",
    });
  }
});

//step1
adminRouter.post("/add-store", async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const storeId = await database.createStore(name, email, address);
    res.status(201).json({ message: "Store added successfully", storeId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//step2 count of all users, stores, rating
adminRouter.get("/dashboard", async (req, res) => {
  try {
    const dashboardDetails = await database.getDashboardDetails();
    res
      .status(200)
      .json({ message: "Admin Dashboard Details Retrived", dashboardDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//step3 listing all users with filtering
adminRouter.get("/users", async (req, res) => {
  try {
    let { role = "System Administrator" } = req.role;
    const users = await database.getUser(role);
    return res.status(200).json({ message: "Users Retrieved", users });
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
});

//step3 listing all stores with filtering
// adminRouter.get("/stores", (req, res) => {
//     let query = "SELECT * FROM stores";
//     const params = [];

//     if (req.query.name) {
//       query += " WHERE name LIKE ?";
//       params.push(`%${req.query.name}%`);
//     }

//     if (req.query.address) {
//       query += params.length ? " AND address LIKE ?" : " WHERE address LIKE ?";
//       params.push(`%${req.query.address}%`);
//     }

//     db.query(query, params, (err, result) => {
//       if (err) return res.status(500).json({ message: err.message });
//       res.json(result);
//     });
//   });

//step4 lisiting user details with rating if the user is store owner else only the user details
// adminRouter.get("/user/:id", (req, res) => {
//     const userId = req.params.id;

//     db.query("SELECT id, name, email, role FROM users WHERE id = ?", [userId], (err, users) => {
//       if (err) return res.status(500).json({ message: err.message });
//       if (!users.length) return res.status(404).json({ message: "User not found" });

//       const user = users[0];

//       if (user.role !== "store_owner") {
//         return res.json(user);
//       }

//       // Fetch ratings if the user is a store owner
//       db.query(
//         "SELECT u.name AS user, r.rating FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = ?",
//         [userId],
//         (err, ratings) => {
//           if (err) return res.status(500).json({ message: err.message });
//           user.ratings = ratings;
//           res.json(user);
//         }
//       );
//     });
//   });

module.exports = adminRouter;
