const bcrypt = require('bcryptjs');

async function generateHashes() {
  const passwords = {
    admin123: await bcrypt.hash('admin123', 10),
    farmer123: await bcrypt.hash('farmer123', 10),
    company123: await bcrypt.hash('company123', 10)
  };
  
  console.log('Generated Password Hashes:');
  console.log('admin123:', passwords.admin123);
  console.log('farmer123:', passwords.farmer123);
  console.log('company123:', passwords.company123);
  
  console.log('\n--- Copy these into schema.sql ---\n');
  console.log(`-- Admin user (password: admin123)`);
  console.log(`INSERT INTO users (email, password, name, role) VALUES`);
  console.log(`('admin@agricycle.com', '${passwords.admin123}', 'Admin User', 'admin');`);
  console.log();
  console.log(`-- Sample farmer (password: farmer123)`);
  console.log(`INSERT INTO users (email, password, name, role) VALUES`);
  console.log(`('farmer@example.com', '${passwords.farmer123}', 'John Farmer', 'farmer');`);
  console.log();
  console.log(`-- Sample company (password: company123)`);
  console.log(`INSERT INTO users (email, password, name, role) VALUES`);
  console.log(`('company@example.com', '${passwords.company123}', 'Green Recycling Co', 'company');`);
}

generateHashes();
