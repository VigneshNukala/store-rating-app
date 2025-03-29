require("dotenv").config();
const mysql = require("mysql2/promise");

class StoreRating {
  constructor() {
    this.db = null;
  }

  // Create database connection
  async connect() {
    if (!this.db) {
      this.db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false },
      });
      console.log("Database connected successfully!");
    }
  }

  // Create Tables
  async createTables() {
    const connection = await this.db.getConnection();

    try {
      await connection.beginTransaction();

      const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          address TEXT,
          role ENUM('System Administrator', 'Normal User', 'Store Owner') NOT NULL DEFAULT 'Normal User',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_users_email (email),
          INDEX idx_users_name (name)
        )
      `;

      const storesTable = `
        CREATE TABLE IF NOT EXISTS stores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          address TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_stores_email (email),
          INDEX idx_stores_name (name)
        )
      `;

      const ratingsTable = `
        CREATE TABLE IF NOT EXISTS ratings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          store_id INT NOT NULL,
          rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
          INDEX idx_ratings_user (user_id),
          INDEX idx_ratings_store (store_id)
        )
      `;

      await connection.execute(usersTable);
      await connection.execute(storesTable);
      await connection.execute(ratingsTable);

      await connection.commit();
      console.log("Tables checked/created successfully!");
    } catch (error) {
      await connection.rollback();
      console.error("❌ Error creating tables:", error);
    } finally {
      connection.release();
    }
  }

  // Create a new user
  async createUser(name, email, hashedPassword, address, role) {
    return await this.db.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );
  }

  // Fetch a user by email
  async getUser(email = null, role) {
    let query = `SELECT * FROM users`;

    const params = [];
    const conditions = [];

    if (role) {
      conditions.push("role = ?");
      params.push(role);
    }

    if (email) {
      conditions.push("email = ?");
      params.push(email);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const [users] = await this.db.execute(query, params);

    if (email) {
      return users[0];
    } else if (role) {
      return users;
    } else {
      return users;
    }
  }

  // Creating a Store
  async createStore(name, email, address) {
    const [result] = await this.db.execute(
      "INSERT INTO stores (name, email, address) VALUES (?, ?, ?)",
      [name, email, address]
    );
    return result.insertId;
  }

  // Retrive all stores from stores table
  async getAllStores() {
    return this.db.execute("SELECT * FROM stores");
  }

  // Get store by store_id
  async getStore(name, address) {
    let query = `SELECT * FROM stores WHERE 1=1`;
    const params = [];

    if (name) {
      query += ` AND name LIKE ?`;
      params.push(`%${name}%`);
    }
    if (address) {
      query += " AND address LIKE ?";
      params.push(`%${address}%`);
    }
    const [stores] = await this.db.execute(query, params);
    return stores;
  }
  // Get count of users, stores, ratings from the db for admin only
  async getAdminDashboard() {
    const [rows] = await this.db.execute(
      "SELECT (SELECT COUNT(*) FROM users) AS users, (SELECT COUNT(*) FROM stores) AS stores, (SELECT COUNT(*) FROM ratings) AS ratings"
    );
    return rows.length > 0 ? rows : null;
  }

  // Submit rating to rating table
  async submitRating(storeId, rating, userId) {
    return this.db.execute(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, storeId, rating]
    );
  }

  // Update Rating
  async updateRating(storeId, rating, userId) {
    return this.db.execute(
      "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
      [rating, userId, storeId]
    );
  }

  //Get Rating by StoreId
  async getRatingByStore(storeId) {
    return this.db.execute("SELECT * FROM ratings WHERE store_id = ?", [
      storeId,
    ]);
  }

  //Get Average Rating
  async getAverageRating(storeId) {
    const [rows] = this.db.execute(
      "SELECT AVG(rating) AS avg_ratingFROM ratings WHERE store_id = ?",
      [storeId]
    );
    return rows[0].avg_rating;
  }

  // Close database connection
  async close() {
    if (this.db) {
      await this.db.end();
      this.db = null;
      console.log("Database connection closed.");
    }
  }
}

const database = new StoreRating();

module.exports = { database };
