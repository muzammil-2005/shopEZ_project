const express = require('express');
const router = express.Router();
const {
  getAllStocks,
  getStockBySymbol,
  createStock,
  updateStock,
  deleteStock,
} = require('../controllers/stockController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllStocks);
router.get('/:symbolOrId', getStockBySymbol);
router.post('/', protect, adminOnly, createStock);
router.put('/:id', protect, adminOnly, updateStock);
router.delete('/:id', protect, adminOnly, deleteStock);

module.exports = router;
