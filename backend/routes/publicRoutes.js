
const express = require('express');
const router = express.Router();
const {
    getReviews,
    addReview,
    respondToReview,
    getSiteContent,
    updateSiteContent,
    getShowcaseModels,
    placeShowroomOrder
} = require('../controllers/publicController');

router.get('/reviews', getReviews);
router.post('/reviews', addReview);
router.put('/reviews/:id/response', respondToReview);

router.get('/site-content', getSiteContent);
router.put('/site-content', updateSiteContent);

router.get('/showroom/models', getShowcaseModels);
router.post('/showroom/orders', placeShowroomOrder);

module.exports = router;
