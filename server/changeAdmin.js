require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userSchema');

async function changeAdmin() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Đổi admin hiện tại về user
    const currentAdmin = await User.findOne({ role: 'admin' });
    if (currentAdmin) {
      currentAdmin.role = 'user';
      await currentAdmin.save();
      console.log(`Changed ${currentAdmin.email} from admin to user`);
    }
    
    // Tạo admin mới
    const newAdminEmail = 'honhentai734@gmail.com';
    const newAdmin = await User.findOne({ email: newAdminEmail });
    
    if (newAdmin) {
      newAdmin.role = 'admin';
      await newAdmin.save();
      console.log(`Promoted ${newAdmin.email} to admin successfully!`);
      console.log('Name:', newAdmin.name);
      console.log('Role:', newAdmin.role);
    } else {
      console.log(`User with email ${newAdminEmail} not found!`);
    }
    
  } catch (error) {
    console.error('Error changing admin:', error);
  } finally {
    mongoose.disconnect();
  }
}

changeAdmin();
