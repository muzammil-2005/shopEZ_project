const express = require('express');
const router = express.Router();
const { deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
