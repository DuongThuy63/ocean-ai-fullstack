require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userSchema');

async function manageAdmins() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    console.log('=== ADMIN MANAGEMENT TOOL ===\n');
    
    // Hiển thị menu
    const action = process.argv[2];
    const email = process.argv[3];
    
    if (!action) {
      console.log('Usage:');
      console.log('  node manageAdmins.js list                    - Xem tất cả admins');
      console.log('  node manageAdmins.js promote <email>         - Promote user thành admin');
      console.log('  node manageAdmins.js demote <email>          - Demote admin về user');
      console.log('  node manageAdmins.js users                   - Xem tất cả users\n');
      return;
    }
    
    switch (action) {
      case 'list':
        await listAdmins();
        break;
      case 'promote':
        if (!email) {
          console.log('Please provide email: node manageAdmins.js promote <email>');
          return;
        }
        await promoteUser(email);
        break;
      case 'demote':
        if (!email) {
          console.log('Please provide email: node manageAdmins.js demote <email>');
          return;
        }
        await demoteAdmin(email);
        break;
      case 'users':
        await listAllUsers();
        break;
      default:
        console.log('Invalid action. Use: list, promote, demote, or users');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

async function listAdmins() {
  const admins = await User.find({ role: 'admin' }, 'name email role createdAt');
  console.log(`Found ${admins.length} admin(s):\n`);
  
  if (admins.length === 0) {
    console.log('No admins found!');
    return;
  }
  
  admins.forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${admin.createdAt ? admin.createdAt.toLocaleDateString() : 'N/A'}\n`);
  });
}

async function promoteUser(email) {
  const user = await User.findOne({ email });
  
  if (!user) {
    console.log(`❌ User with email ${email} not found!`);
    return;
  }
  
  if (user.role === 'admin') {
    console.log(`⚠️  User ${email} is already an admin!`);
    return;
  }
  
  user.role = 'admin';
  await user.save();
  
  console.log(`✅ Successfully promoted ${user.name} (${email}) to admin!`);
  await listAdmins();
}

async function demoteAdmin(email) {
  const admin = await User.findOne({ email });
  
  if (!admin) {
    console.log(`❌ User with email ${email} not found!`);
    return;
  }
  
  if (admin.role !== 'admin') {
    console.log(`⚠️  User ${email} is not an admin!`);
    return;
  }
  
  admin.role = 'user';
  await admin.save();
  
  console.log(`✅ Successfully demoted ${admin.name} (${email}) to regular user!`);
  await listAdmins();
}

async function listAllUsers() {
  const users = await User.find({}, 'name email role createdAt').sort({ role: -1, name: 1 });
  console.log(`Found ${users.length} user(s):\n`);
  
  users.forEach((user, index) => {
    const roleIcon = user.role === 'admin' ? '👑' : '👤';
    console.log(`${index + 1}. ${roleIcon} ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A'}\n`);
  });
}

manageAdmins();
