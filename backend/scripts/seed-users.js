const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

async function seedUsers() {
  try {
    console.log('🌱 Seeding users...');
    
    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', 10);
    const farmerHash = await bcrypt.hash('farmer123', 10);
    const companyHash = await bcrypt.hash('company123', 10);
    
    console.log('✅ Generated password hashes');
    
    // Clear existing users
    await pool.query('DELETE FROM users');
    console.log('✅ Cleared existing users');
    
    // Insert admin
    await pool.query(
      `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)`,
      ['admin@agricycle.com', adminHash, 'Admin User', 'admin']
    );
    console.log('✅ Created admin user: admin@agricycle.com / admin123');
    
    // Insert farmer
    await pool.query(
      `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)`,
      ['farmer@example.com', farmerHash, 'John Farmer', 'farmer']
    );
    console.log('✅ Created farmer user: farmer@example.com / farmer123');
    
    // Insert company
    await pool.query(
      `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)`,
      ['company@example.com', companyHash, 'Green Recycling Co', 'company']
    );
    console.log('✅ Created company user: company@example.com / company123');
    
    console.log('\n🎉 User seeding completed successfully!');
    
    // Verify users were created
    const result = await pool.query('SELECT id, email, name, role FROM users ORDER BY id');
    console.log('\n📋 Users in database:');
    result.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
