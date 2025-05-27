const express = require('express');
const { getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, bootcampPhotoUpload } = require('../controllers/bootcampController');
const courseRouter = require('./courseRoutes');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use('/:bootcampId/courses',courseRouter)

router.get('/',getBootcamps);

router.get('/:id',getBootcamp);

router.post('/',protect,authorize('publisher','admin'),createBootcamp);

router.put('/:id',protect,authorize('publisher','admin'),updateBootcamp);

router.delete('/:id',protect,authorize('publisher','admin'),deleteBootcamp);

router.put('/:id/photo',protect,authorize('publisher','admin'),bootcampPhotoUpload);




module.exports = router;