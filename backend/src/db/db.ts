import {
  Pool,
  PoolConnection,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

type Role = "Admin" | "User" | "Owner";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string | null;
  role: Role;
  created_at: string;
}

interface Store {
  ownerEmail: string;
  id: number;
  name: string;
  email: string;
  address: string;
  created_at: string;
}

class StoreRating {
  async getRatingsByStoreWithUsers(storeId: string): Promise<any[]> {
    if (!this.db) throw new Error("Database not connected");

    const [rows] = await this.db!.execute<RowDataPacket[]>(
      `SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        (SELECT AVG(r2.rating) 
         FROM ratings r2 
         JOIN stores s ON r2.store_id = s.id 
         WHERE s.email = u.email AND u.role = 'owner') as owner_avg_rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC`,
      [storeId]
    );

    return rows;
  }

  async getStoreOwnerById(storeId: string): Promise<User | null> {
    if (!this.db) throw new Error("Database not connected");

    const [rows] = await this.db!.execute<RowDataPacket[]>(
      `SELECT u.* 
       FROM users u
       JOIN stores s ON s.email = u.email
       WHERE s.id = ? AND u.role = 'owner'`,
      [storeId]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async updateUserPassword(
    email: string,
    hashedPassword: string
  ): Promise<void> {
    if (!this.db) throw new Error("Database not connected");

    await this.db.execute("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);
  }

  private db: Pool | null = null;

  // Create database connection
  async connect(): Promise<void> {
    if (!this.db) {
      const mysql = await import("mysql2/promise");
      this.db = mysql.createPool({
        host: process.env.DB_HOST as string,
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_NAME as string,
        port: Number(process.env.DB_PORT),
        ssl: { rejectUnauthorized: false },
      });
      console.log("Database connected successfully!");
    }
  }

  // Create Tables
  async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not connected");
    const connection: PoolConnection = await this.db.getConnection();

    try {
      await connection.beginTransaction();

      const queries: string[] = [
        `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          address TEXT,
          role ENUM('admin', 'user', 'owner') NOT NULL DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_users_email (email),
          INDEX idx_users_name (name)
        )`,
        `CREATE TABLE IF NOT EXISTS stores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          address TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_stores_email (email),
          INDEX idx_stores_name (name)
        )`,
        `CREATE TABLE IF NOT EXISTS ratings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          store_id INT NOT NULL,
          rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
          INDEX idx_ratings_user (user_id),
          INDEX idx_ratings_store (store_id)
        )`,
      ];

      for (const query of queries) {
        await connection.execute(query);
      }

      await connection.commit();
      console.log("Tables checked/created successfully!");
    } catch (error) {
      await connection.rollback();
      console.error("Error creating tables:", error);
    } finally {
      connection.release();
    }
  }

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
    address: string,
    role: string
  ): Promise<void> {
    if (!this.db) throw new Error("Database not connected");
    await this.db.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );
  }

  async getUser(email?: string, role?: string): Promise<User | null> {
    if (!this.db) throw new Error("Database not connected");

    let query = `SELECT * FROM users`;
    const params: (string | undefined)[] = [];
    const conditions: string[] = [];

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

    const [users] = await this.db.execute<RowDataPacket[]>(query, params);
    const userList = users as User[];

    // If querying by email, return a single user or null
    return email ? userList[0] || null : null;
  }

  async createStore(
    name: string,
    email: string,
    address: string
  ): Promise<number> {
    if (!this.db) throw new Error("Database not connected");

    const [result] = await this.db.execute<ResultSetHeader>(
      "INSERT INTO stores (name, email, address) VALUES (?, ?, ?)",
      [name, email, address]
    );

    return result.insertId;
  }

  // Update getAllStores method
  async getAllStores(filters?: {
    name?: string;
    address?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }): Promise<Store[]> {
    if (!this.db) throw new Error("Database not connected");

    let query = "SELECT * FROM stores";
    const params: string[] = [];
    const conditions: string[] = [];

    if (filters) {
      if (filters.name) {
        conditions.push("name LIKE ?");
        params.push(`%${filters.name}%`);
      }
      if (filters.address) {
        conditions.push("address LIKE ?");
        params.push(`%${filters.address}%`);
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (filters?.sortBy) {
      query += ` ORDER BY ${filters.sortBy} ${filters.sortOrder || "ASC"}`;
    }

    const [rows] = await this.db.execute<RowDataPacket[]>(query, params);
    return rows as Store[];
  }

  async submitRating(
    storeId: number,
    rating: number,
    userId: number
  ): Promise<void> {
    if (!this.db) throw new Error("Database not connected");
    await this.db.execute(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, storeId, rating]
    );
  }

  async updateRating(
    storeId: number,
    rating: number,
    userId: number
  ): Promise<void> {
    if (!this.db) throw new Error("Database not connected");
    await this.db.execute(
      "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
      [rating, userId, storeId]
    );
  }

  async getAverageRating(storeId: string): Promise<any[]> {
    if (!this.db) throw new Error("Database not connected");
    console.log("Hello")
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_ratings,
        MIN(rating) as lowest_rating,
        MAX(rating) as highest_rating
       FROM ratings
       WHERE store_id = ?`,
      [storeId]
    );
    console.log(rows);
    return rows;
  }

  async getStore(storeId?: number, email?: string): Promise<Store | null> {
    if (!this.db) throw new Error("Database not connected");

    let query = "SELECT * FROM stores";
    const params: (number | string)[] = [];
    const conditions: string[] = [];

    if (storeId) {
      conditions.push("id = ?");
      params.push(storeId);
    }

    if (email) {
      conditions.push("email = ?");
      params.push(email);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const [stores] = await this.db.execute<RowDataPacket[]>(query, params);
    const storeList = stores as Store[];

    return storeList.length > 0 ? storeList[0] : null;
  }

  // For Admin Dashboard
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
  }> {
    if (!this.db) throw new Error("Database not connected");

    const [userCount] = await this.db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users"
    );
    const [storeCount] = await this.db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM stores"
    );
    const [ratingCount] = await this.db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM ratings"
    );

    return {
      totalUsers: userCount[0].count,
      totalStores: storeCount[0].count,
      totalRatings: ratingCount[0].count,
    };
  }

  // Get all users with filters
  async getAllUsers(filters?: {
    name?: string;
    email?: string;
    role?: string;
  }): Promise<User[]> {
    if (!this.db) throw new Error("Database not connected");

    let query = "SELECT id, name, email, address, role FROM users";
    const params: string[] = [];
    const conditions: string[] = [];

    if (filters) {
      if (filters.name) {
        conditions.push("name LIKE ?");
        params.push(`%${filters.name}%`);
      }
      if (filters.email) {
        conditions.push("email LIKE ?");
        params.push(`%${filters.email}%`);
      }
      if (filters.role) {
        conditions.push("role = ?");
        params.push(filters.role);
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const [rows] = await this.db.execute<RowDataPacket[]>(query, params);
    return rows as User[];
  }

  // Get user by ID
  async getUserById(userId: number): Promise<User | null> {
    if (!this.db) throw new Error("Database not connected");

    const [rows] = await this.db.execute<RowDataPacket[]>(
      "SELECT id, name, email, address, role FROM users WHERE id = ?",
      [userId]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  }

  // Get store ratings
  async getRatingByStore(storeId: string): Promise<any[]> {
    if (!this.db) throw new Error("Database not connected");

    const [rows] = await this.db.execute<RowDataPacket[]>(
      `SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    return rows;
  }

  // Get user ratings
  async getUserRatings(userId: number): Promise<any[]> {
    if (!this.db) throw new Error("Database not connected");

    const [rows] = await this.db.execute<RowDataPacket[]>(
      `SELECT r.*, s.name as store_name 
       FROM ratings r 
       JOIN stores s ON r.store_id = s.id 
       WHERE r.user_id = ?`,
      [userId]
    );

    return rows;
  }

  // Get rating by ID
  async getRatingById(ratingId: number): Promise<any | null> {
    if (!this.db) throw new Error("Database not connected");

    const [rows] = await this.db.execute<RowDataPacket[]>(
      "SELECT * FROM ratings WHERE id = ?",
      [ratingId]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  async updateUserRole(email: string, newRole: string): Promise<void> {
    if (!this.db) throw new Error("Database not connected");

    await this.db.execute("UPDATE users SET role = ? WHERE email = ?", [
      newRole,
      email,
    ]);
  }

  async deleteUser(email: string): Promise<void> {
    if (!this.db) throw new Error("Database not connected");

    await this.db.execute("DELETE FROM users WHERE email = ?", [email]);
  }

  async getAllRatings(): Promise<any[]> {
    if (!this.db) throw new Error("Database not connected");
    const [rows] = await this.db.execute<RowDataPacket[]>(
      "SELECT * FROM ratings"
    );
    return rows;
  }

  async getStoresWithRatings(filters?: {
    name?: string;
    address?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }): Promise<Store[]> {
    if (!this.db) throw new Error("Database not connected");

    let query = `
      SELECT 
        s.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;

    const params: string[] = [];
    const conditions: string[] = [];

    if (filters?.name) {
      conditions.push("s.name LIKE ?");
      params.push(`%${filters.name}%`);
    }
    if (filters?.address) {
      conditions.push("s.address LIKE ?");
      params.push(`%${filters.address}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` GROUP BY s.id`;

    if (filters?.sortBy) {
      query += ` ORDER BY ${filters.sortBy} ${filters.sortOrder || "ASC"}`;
    }

    const [rows] = await this.db.execute<RowDataPacket[]>(query, params);
    return rows as Store[];
  }

  async getUserStoreRating(
    userId: number,
    storeId: number
  ): Promise<number | null> {
    if (!this.db) throw new Error("Database not connected");

    const [rows] = await this.db.execute<RowDataPacket[]>(
      "SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    return rows.length > 0 ? rows[0].rating : null;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.end();
      this.db = null;
      console.log("Database connection closed.");
    }
  }
}

const database = new StoreRating();
export { database };
