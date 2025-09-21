const User = require("../models/user");

async function adminSeeder() {
  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) {
    console.log("⚠️ Admin already exists, skipping seeder");
    return;
  }

  await User.create({
    fullName: "Super Admin",
    email: "admin@example.com",
    password: "Admin@123", // make sure password is hashed in pre-save
    role: "admin",
    isActive: true,
  });

  console.log("👑 Admin user created");
}

module.exports = adminSeeder;
