const db = require('../config/database');

class Waste {
  static async create({ farmer_id, type, quantity, price, location, image, description }) {
    const result = await db.query(
      `INSERT INTO waste_listings 
       (farmer_id, type, quantity, price, location, image, description, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') 
       RETURNING *`,
      [farmer_id, type, quantity, price, location, image, description]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT wl.*, u.name as farmer_name, u.email as farmer_email 
      FROM waste_listings wl 
      JOIN users u ON wl.farmer_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND wl.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.type) {
      query += ` AND wl.type = $${paramCount}`;
      params.push(filters.type);
      paramCount++;
    }

    query += ' ORDER BY wl.created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT wl.*, u.name as farmer_name, u.email as farmer_email 
       FROM waste_listings wl 
       JOIN users u ON wl.farmer_id = u.id 
       WHERE wl.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByFarmerId(farmerId) {
    const result = await db.query(
      'SELECT * FROM waste_listings WHERE farmer_id = $1 ORDER BY created_at DESC',
      [farmerId]
    );
    return result.rows;
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Dynamically build the UPDATE query based on provided fields
    if (updateData.type !== undefined) {
      fields.push(`type = $${paramCount}`);
      values.push(updateData.type);
      paramCount++;
    }
    if (updateData.quantity !== undefined) {
      fields.push(`quantity = $${paramCount}`);
      values.push(updateData.quantity);
      paramCount++;
    }
    if (updateData.price !== undefined) {
      fields.push(`price = $${paramCount}`);
      values.push(updateData.price);
      paramCount++;
    }
    if (updateData.location !== undefined) {
      fields.push(`location = $${paramCount}`);
      values.push(updateData.location);
      paramCount++;
    }
    if (updateData.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(updateData.description);
      paramCount++;
    }
    if (updateData.image !== undefined) {
      fields.push(`image = $${paramCount}`);
      values.push(updateData.image);
      paramCount++;
    }

    // Always update the updated_at timestamp
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `
      UPDATE waste_listings 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id, status, adminId) {
    const result = await db.query(
      `UPDATE waste_listings 
       SET status = $1, approved_by = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [status, adminId, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM waste_listings WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Waste;
