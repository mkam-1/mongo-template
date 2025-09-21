const mongoose = require("mongoose");
const config = require("../config/config");

// import all seeders
const adminSeeder = require("./admin");
// later: const userSeeder = require("./user");
// later: const postSeeder = require("./post");

const seeders = [
  { name: "Admin", run: adminSeeder },
  // { name: "User", run: userSeeder },
  // { name: "Post", run: postSeeder },
];

async function run() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("✅ Connected to DB");

    for (const seeder of seeders) {
      console.log(`🌱 Running ${seeder.name} seeder...`);
      await seeder.run();
      console.log(`✅ ${seeder.name} seeder completed`);
    }

    console.log("🎉 All seeders completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  }
}

run();
