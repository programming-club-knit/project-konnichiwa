/**
 * Database Migration Script
 * Migrates data from the Old PTSC MongoDB Atlas cluster to the Current Project DB.
 *
 * Usage:
 *   node scripts/migrate-db.js
 *
 * Or pass custom URIs:
 *   SOURCE_URI="mongodb+srv://..." TARGET_URI="mongodb://localhost:27017/ptsc" node scripts/migrate-db.js
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

// Fix Windows SRV DNS resolution for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

// Load environment variables from .env if present
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      if (!process.env[k.trim()]) {
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  });
}

const SOURCE_URI = process.env.SOURCE_URI || 'mongodb+srv://shobhitsri1405:J2GOZQUpZZjc6i91@cluster0.5qf8igz.mongodb.net/event-management';
const TARGET_URI = process.env.TARGET_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ptsc';

console.log('='.repeat(65));
console.log('  PTSC DATABASE MIGRATION SCRIPT');
console.log('='.repeat(65));
console.log(`Source DB: ${SOURCE_URI.replace(/:([^:@]+)@/, ':****@')}`);
console.log(`Target DB: ${TARGET_URI.replace(/:([^:@]+)@/, ':****@')}`);
console.log('-'.repeat(65));

async function migrate() {
  let sourceConn = null;
  let targetConn = null;

  try {
    console.log('Connecting to Source Database...');
    sourceConn = await mongoose.createConnection(SOURCE_URI, {
      serverSelectionTimeoutMS: 15000,
    }).asPromise();
    console.log(' Connected to Source Database successfully.');

    console.log('Connecting to Target Database...');
    targetConn = await mongoose.createConnection(TARGET_URI, {
      serverSelectionTimeoutMS: 15000,
    }).asPromise();
    console.log(' Connected to Target Database successfully.');

    console.log('-'.repeat(65));

    // Get list of collections from Source DB
    const sourceCollections = await sourceConn.db.listCollections().toArray();
    const collectionNames = sourceCollections.map(c => c.name).filter(n => !n.startsWith('system.'));

    console.log(`Found ${collectionNames.length} collections in Source Database:`);
    console.log(collectionNames.map(n => ` - ${n}`).join('\n'));
    console.log('-'.repeat(65));

    const migrationSummary = [];

    for (const collName of collectionNames) {
      console.log(`Migrating collection: [${collName}]...`);
      const sourceColl = sourceConn.db.collection(collName);
      const targetColl = targetConn.db.collection(collName);

      const count = await sourceColl.countDocuments();
      if (count === 0) {
        console.log(`  -> Empty collection, skipping documents.`);
        migrationSummary.push({ collection: collName, count: 0, status: 'Empty' });
        continue;
      }

      console.log(`  -> Reading ${count} documents from Source...`);
      const docs = await sourceColl.find({}).toArray();

      let upsertedCount = 0;
      let updatedCount = 0;

      for (const doc of docs) {
        let filter = { _id: doc._id };
        if (collName === 'settings' && doc.key) {
          filter = { key: doc.key };
        } else if (collName === 'users' && doc.email) {
          filter = { $or: [{ email: doc.email }, { username: doc.username }, { _id: doc._id }] };
        } else if (collName === 'events' && doc.title) {
          filter = { $or: [{ title: doc.title }, { _id: doc._id }] };
        }

        try {
          const res = await targetColl.updateOne(
            filter,
            { $set: doc },
            { upsert: true }
          );
          if (res.upsertedCount) upsertedCount += res.upsertedCount;
          if (res.modifiedCount || res.matchedCount) updatedCount += 1;
        } catch (err) {
          // If unique constraint conflicts with another document, replace directly by _id
          try {
            await targetColl.deleteOne(filter);
            await targetColl.insertOne(doc);
            upsertedCount += 1;
          } catch (insertErr) {
            console.warn(`    ⚠️ Warning on doc ${doc._id}:`, insertErr.message);
          }
        }
      }

      console.log(`  -> Successfully migrated ${docs.length} docs to [${collName}]`);
      migrationSummary.push({
        collection: collName,
        totalSourceDocs: docs.length,
        status: `Processed (Upserted: ${upsertedCount}, Updated: ${updatedCount})`,
      });
    }

    console.log('\n' + '='.repeat(65));
    console.log('  MIGRATION SUMMARY');
    console.log('='.repeat(65));
    console.table(migrationSummary);
    console.log('\n Database migration completed successfully!');

  } catch (err) {
    console.error('\n Migration Error:', err.message);
    if (err.stack) console.error(err.stack);
  } finally {
    if (sourceConn) await sourceConn.close();
    if (targetConn) await targetConn.close();
    console.log('Connections closed.');
  }
}

migrate();
