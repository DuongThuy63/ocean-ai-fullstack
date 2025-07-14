require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userSchema');

async function createAdmin() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Tìm user để promote thành admin (có thể thay đổi email này)
    const emailToPromote = 'honhentai734@gmail.com'; // Thay bằng email có trong DB
    
    // Kiểm tra xem user này đã là admin chưa
    const userToCheck = await User.findOne({ email: emailToPromote });
    
    if (userToCheck && userToCheck.role === 'admin') {
      console.log('User is already an admin:', userToCheck.email);
      return;
    }
    
    const userToPromote = await User.findOne({ email: emailToPromote });
    
    if (userToPromote) {
      // Cập nhật user hiện có thành admin
      userToPromote.role = 'admin';
      await userToPromote.save();
      
      console.log('User promoted to admin successfully:');
      console.log('Email:', userToPromote.email);
      console.log('Name:', userToPromote.name);
      console.log('Role:', userToPromote.role);
    } else {
      // Tạo admin user mới nếu không tìm thấy user để promote
      const adminUser = await User.create({
        name: 'HonAI',
        email: 'honhentai734@gmail.com',
        role: 'admin'
      });
      
      console.log('New admin user created successfully:');
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
    }
    
    // Hiển thị tất cả admins hiện tại
    const allAdmins = await User.find({ role: 'admin' }, 'name email role');
    console.log('\nAll current admins:');
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name} (${admin.email})`);
    });
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
