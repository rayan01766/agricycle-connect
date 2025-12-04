const { Client } = require('pg');
const bcrypt = require('bcrypt'); // Make sure bcrypt is installed (npm install bcrypt)

// ✅ UPDATED: Your specific Render Database URL
const connectionString = process.env.DATABASE_URL || 'postgresql://agricycle_user:pyWICngSMRXmSgEJvWJBUCB46ZUgHpzn@dpg-d4jk8c8dl3ps73ehujfg-a.oregon-postgres.render.com/agricycle_db_ho3a';

const client = new Client({
  connectionString: connectionString,
  ssl: { 
    rejectUnauthorized: false // Required for Render databases
  }
});

async function seed() {
  try {
    console.log("🔌 Connecting to database...");
    await client.connect();
    
    // 1. Hash the password (so the backend can read it later)
    console.log("🔒 Hashing password...");
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // 2. Insert the user
    // Note: We use "ON CONFLICT DO NOTHING" so it doesn't crash if user exists
    const query = `
      INSERT INTO users (username, password, role) 
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `;
    
    console.log("👤 Creating user 'testuser'...");
    const res = await client.query(query, ['testuser', hashedPassword, 'farmer']);
    
    if (res.rows.length > 0) {
      console.log("✅ SUCCESS: User 'testuser' created!");
    } else {
      console.log("⚠️ NOTICE: User 'testuser' already exists. You can log in now.");
    }

  } catch (err) {
    console.error("❌ ERROR:", err);
  } finally {
    await client.end();
    console.log("👋 Connection closed.");
  }
}

seed();