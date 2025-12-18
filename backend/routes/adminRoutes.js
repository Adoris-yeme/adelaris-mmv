
const express = require('express');
const router = express.Router();
const {
    getAteliersWithManager,
    updateSubscription,
    getPendingShowcaseModels,
    updateShowcaseStatus
} = require('../controllers/adminController');

router.get('/ateliers', getAteliersWithManager);
router.put('/ateliers/:atelierId/subscription', updateSubscription);

router.get('/showcase/pending-models', getPendingShowcaseModels);
router.put('/showcase/models/:modelId/status', updateShowcaseStatus);

module.exports = router;
