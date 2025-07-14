require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userSchema');
const Transaction = require('./models/Transaction');
const plans = require('./config/plans');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  await Transaction.deleteMany({});

  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await User.create({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: 'password123',
      role: 'user'
    });
    const defaultPlan = plans[0];
    await Transaction.create({
      user: user._id,
      planName: defaultPlan.name,
      price: defaultPlan.price
    });
    users.push(user);
  }

  console.log('Seeded users:', users.length);
  await mongoose.disconnect();
}

seed();
