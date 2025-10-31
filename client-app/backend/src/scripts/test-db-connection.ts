import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { dataSourceOptions } from '../config/typeorm.config';

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');

  const dataSource = new DataSource(dataSourceOptions);
  const pgOptions = dataSourceOptions as PostgresConnectionOptions;

  try {
    console.log('📊 Connection Configuration:');
    console.log(`   Host: ${pgOptions.host}`);
    console.log(`   Port: ${pgOptions.port}`);
    console.log(`   Database: ${pgOptions.database}`);
    console.log(`   Username: ${pgOptions.username}`);
    console.log('');

    console.log('⏳ Attempting to connect...');
    await dataSource.initialize();

    console.log('✅ Database connection successful!\n');

    // Test a simple query
    console.log('🧪 Running test query...');
    const result = await dataSource.query(
      'SELECT NOW() as current_time, version() as pg_version',
    );
    console.log('✅ Query executed successfully!');
    console.log(`   Current Time: ${result[0].current_time}`);
    console.log(
      `   PostgreSQL Version: ${result[0].pg_version.split(' ')[0]} ${result[0].pg_version.split(' ')[1]}\n`,
    );

    // Check if database exists and has tables
    const tablesResult = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`📋 Found ${tablesResult.length} tables in database:`);
    if (tablesResult.length > 0) {
      tablesResult.forEach((row: any) => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log(
        '   ⚠️  No tables found. Run migrations or enable synchronize in development mode.',
      );
    }

    await dataSource.destroy();
    console.log('\n✅ Connection closed successfully.');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Database connection failed!\n');
    console.error('Error Details:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}\n`);

    console.log('🔧 Troubleshooting Tips:');
    console.log('   1. Ensure PostgreSQL is running');
    console.log('   2. Check database credentials in .env file');
    console.log('   3. Verify database exists: createdb digital_credit_client');
    console.log('   4. Check network connectivity');
    console.log('   5. Verify PostgreSQL is listening on the correct port\n');

    process.exit(1);
  }
}

// Run the test
testDatabaseConnection();
