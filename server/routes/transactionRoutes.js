const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
  updateTransactionStatus,
} = require('../controllers/transactionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createTransaction);
router.get('/my', protect, getMyTransactions);
router.get('/', protect, adminOnly, getAllTransactions);
router.put('/:id/status', protect, adminOnly, updateTransactionStatus);

module.exports = router;
