/**
 * Database Connection Pool
 * Manages PostgreSQL connections for the application
 */

const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'devops_dashboard',
  max: parseInt(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: 2000,
});

// Pool error handling
pool.on('error', (err) => {
  console.error('Unexpected connection pool error:', err);
});

/**
 * Query wrapper with error handling
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} Query result
 */
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get single row
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} Single row or null
 */
async function getOne(text, params) {
  const result = await query(text, params);
  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Get all rows
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} Array of rows
 */
async function getAll(text, params) {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Health check - verify database connection
 * @returns {Promise<boolean>}
 */
async function healthCheck() {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error.message);
    return false;
  }
}

module.exports = {
  query,
  getOne,
  getAll,
  healthCheck,
  pool
};
