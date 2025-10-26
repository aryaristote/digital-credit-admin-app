import { DataSource } from 'typeorm';
import { seedUsers } from './users.seed';
import { seedSavings } from './savings.seed';
import { seedCredits } from './credits.seed';
import dataSource from '../../config/typeorm.config';

async function runSeeds() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('📦 Database connected, starting seed...\n');

    // Run seeds in order
    await seedUsers(dataSource);
    await seedSavings(dataSource);
    await seedCredits(dataSource);

    console.log('\n✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeeds();
