const express = require('express');
const router = express.Router();
const { getMyPortfolio, addFunds } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyPortfolio);
router.post('/deposit', protect, addFunds);

module.exports = router;
