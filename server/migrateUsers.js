require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userSchema');

async function migrateUsers() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Tìm tất cả users không có role hoặc role = null
    const usersWithoutRole = await User.find({
      $or: [
        { role: { $exists: false } },
        { role: null },
        { role: '' }
      ]
    });
    
    console.log(`Found ${usersWithoutRole.length} users without role`);
    
    if (usersWithoutRole.length === 0) {
      console.log('All users already have roles assigned');
      return;
    }
    
    // Cập nhật tất cả users này thành role 'user'
    const updateResult = await User.updateMany(
      {
        $or: [
          { role: { $exists: false } },
          { role: null },
          { role: '' }
        ]
      },
      { 
        $set: { role: 'user' }
      }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} users with role 'user'`);
    
    // Hiển thị tất cả users sau khi update
    const allUsers = await User.find({}, 'name email role autoEnabled');
    console.log('\nAll users after migration:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role || 'undefined'}`);
    });
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.disconnect();
  }
}

migrateUsers();
