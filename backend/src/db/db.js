require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
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

  // Create Products Table
  async createTable() {
    await this.connect();
    const connection = await this.db.getConnection();

    try {
      await connection.beginTransaction();

      const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          address TEXT,
          role ENUM('System Administrator', 'Normal User', 'Store Owner') NOT NULL DEFAULT 'Normal User',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const storesTable = `
        CREATE TABLE IF NOT EXISTS stores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          address TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
          FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
        )
      `;

      await connection.execute(usersTable);
      await connection.execute(storesTable);
      await connection.execute(ratingsTable);

      connection.commit();
      console.log("Tables checked/created successfully!");
    } catch (error) {
      await connection.rollback();
      await console.error("Error creating table:", error);
    }
  }

  async createUser(name, email, hashedPassword, address, role) {
    const id = uuidv4();
    return this.db.execute(
      "INSERT INTO users (id, name, email, password, address, role) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, email, hashedPassword, address, role]
    );
  }

  async getUser(email) {
    const [rows] = await this.db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Close the database connection
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


