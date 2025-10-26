import dataSource from '../config/typeorm.config';

async function testConnection() {
  console.log('🔍 Testing database connection...\n');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    database: process.env.DB_DATABASE || 'digital_credit_client',
  };

  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Username: ${config.username}`);
  console.log(`  Database: ${config.database}\n`);

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    console.log('✅ Database connection successful!');
    console.log(`📊 Connected to: ${config.database} @ ${config.host}:${config.port}`);

    // Test a simple query
    const result = await dataSource.query('SELECT version()');
    console.log(`🗄️  PostgreSQL version: ${result[0].version.split(',')[0]}`);

    // Check if tables exist
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tables.length > 0) {
      console.log(`\n📋 Found ${tables.length} table(s):`);
      tables.forEach((table: any) => {
        console.log(`   - ${table.table_name}`);
      });
    } else {
      console.log('\n⚠️  No tables found in the database');
    }
  } catch (error: any) {
    console.error('\n❌ Database connection failed!');
    console.error(`Error: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Possible issues:');
      console.error('   - PostgreSQL server is not running');
      console.error('   - Host or port is incorrect');
    } else if (error.code === '28P01') {
      console.error('\n💡 Possible issues:');
      console.error('   - Username or password is incorrect');
    } else if (error.code === '3D000') {
      console.error('\n💡 Possible issues:');
      console.error('   - Database does not exist');
      console.error(`   - Create database: CREATE DATABASE ${config.database};`);
    }

    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

testConnection();
