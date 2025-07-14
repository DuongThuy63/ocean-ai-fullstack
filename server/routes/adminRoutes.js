const router = require('express').Router();
const Transaction = require('../models/Transaction');
const User = require('../models/userSchema');
const { checkAuth, authorize } = require('../middleware/authMiddleware');

// Xem tất cả transactions (users đã mua plan)
router.get('/transactions', checkAuth, authorize(['admin']), async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// Xem tất cả users
router.get('/users', checkAuth, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, 'name email role autoEnabled createdAt')
      .sort({ createdAt: -1 });
    
    // Lấy thông tin plan của từng user
    const usersWithPlans = await Promise.all(
      users.map(async (user) => {
        const transactions = await Transaction.find({ user: user._id })
          .sort({ createdAt: -1 });
        return {
          ...user.toObject(),
          plans: transactions,
          latestPlan: transactions[0] || null
        };
      })
    );
    
    res.json(usersWithPlans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Cập nhật role của user
router.put('/users/:userId/role', checkAuth, authorize(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { role }, 
      { new: true, select: 'name email role' }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
});

// Thống kê tổng quan cho admin
router.get('/stats', checkAuth, authorize(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalTransactions = await Transaction.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    // Thống kê theo plan
    const planStats = await Transaction.aggregate([
      { $group: { _id: '$planName', count: { $sum: 1 }, revenue: { $sum: '$price' } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalUsers,
      totalAdmins,
      regularUsers: totalUsers - totalAdmins,
      totalTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      planStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Admin hủy plan của user
router.delete('/transactions/:transactionId', checkAuth, authorize(['admin']), async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    await Transaction.findByIdAndDelete(transactionId);
    res.json({ message: 'Transaction cancelled successfully by admin' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling transaction', error: error.message });
  }
});

module.exports = router;
