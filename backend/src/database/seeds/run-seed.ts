import { DataSource } from 'typeorm';
import { seedAdmins } from './admin.seed';
import dataSource from '../../config/typeorm.config';

async function runSeeds() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('📦 Database connected, starting seed...\n');

    await seedAdmins(dataSource);

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
