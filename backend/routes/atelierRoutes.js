
const express = require('express');
const router = express.Router();
const { getAtelierData, updateAtelierData } = require('../controllers/atelierController');

router.get('/:id', getAtelierData);
router.put('/:id/data', updateAtelierData);

module.exports = router;
