/**
 * Database Initialization Script
 * Creates schema and loads sample data into PostgreSQL
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration from environment variables
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'devops_dashboard'
};

async function initializeDatabase() {
  let client;
  
  try {
    console.log('🔄 Connecting to PostgreSQL database...');
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`📦 Database: ${dbConfig.database}`);
    
    client = new Client(dbConfig);
    await client.connect();
    console.log('✅ Connected successfully!');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('\n📋 Executing schema.sql...');
    await client.query(schemaSql);
    console.log('✅ Schema created successfully!');

    // Verify data was inserted
    const result = await client.query('SELECT COUNT(*) as count FROM incidents');
    const incidentCount = result.rows[0].count;
    console.log(`✅ Database initialized with ${incidentCount} sample incidents`);

    // Display sample data
    const incidents = await client.query('SELECT id, title, severity FROM incidents ORDER BY created_at DESC');
    console.log('\n📊 Sample data:');
    incidents.rows.forEach((incident, index) => {
      console.log(`   ${index + 1}. [${incident.severity}] ${incident.title}`);
    });

    console.log('\n🎉 Database initialization completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('\n📌 Troubleshooting:');
    console.error('   - Ensure PostgreSQL is running');
    console.error('   - Check .env file for correct DB_HOST, DB_USER, DB_PASSWORD');
    console.error('   - Verify database exists or create with: createdb devops_dashboard');
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// Run initialization
initializeDatabase();
