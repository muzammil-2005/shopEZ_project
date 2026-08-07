const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function syncAllCollections() {
  console.log('🔌 Connecting to Local MongoDB (127.0.0.1:27017/shopez_app_db)...');
  const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/shopez_app_db');
  const localDb = localConn.connection.db;

  const collections = ['users', 'products', 'carts', 'wishlists', 'orders', 'reviews'];
  const localData = {};

  for (const colName of collections) {
    const docs = await localDb.collection(colName).find({}).toArray();
    localData[colName] = docs;
    console.log(`  └─ Found ${docs.length} documents in local [${colName}]`);
  }

  await localConn.disconnect();
  console.log('✅ Local data retrieved successfully.');

  console.log('\n☁️ Connecting to Atlas Cloud MongoDB (shopez_db)...');
  const atlasConn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 20000,
  });
  const atlasDb = atlasConn.connection.db;

  console.log(`✅ Connected to Atlas DB: ${atlasConn.connection.name}`);

  for (const colName of collections) {
    const docs = localData[colName];
    if (docs && docs.length > 0) {
      console.log(`  └─ Syncing ${docs.length} documents into Atlas collection [${colName}]...`);
      await atlasDb.collection(colName).deleteMany({});
      await atlasDb.collection(colName).insertMany(docs);
    }
  }

  console.log('\n------------------------------------------------------------');
  console.log('🎉 MATCHING DATA SYNCED TO MONGODB ATLAS SUCCESSFULLY!');
  console.log('------------------------------------------------------------');
  
  await atlasConn.disconnect();
  process.exit(0);
}

syncAllCollections().catch((err) => {
  console.error('❌ Sync Failed:', err);
  process.exit(1);
});
