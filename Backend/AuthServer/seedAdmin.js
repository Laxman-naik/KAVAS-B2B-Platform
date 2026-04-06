require("dotenv").config();   
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

async function createAdmin() {
  try {
    const email = "admin@gmail.com";
    const password = "123456"; 
    const full_name = "Super Admin";
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO admins (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [email, hashedPassword, full_name]
    );

    console.log("Admin created successfully!");
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    await pool.end();
  }
}

createAdmin();