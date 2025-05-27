const express = require('express');
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams:true });

/**
 * @swagger
 * /course:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get all courses
 */
router.get('/',getCourses);

/**
 * @swagger
 * /course:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get all courses
 */
router.post('/',protect,authorize('publisher','admin'),addCourse);

/**
 * @swagger
 * /course:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get all courses
 */
router.get('/:id',getCourse);

/**
 * @swagger
 * /course:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get all courses
 */
router.put('/:id',protect,authorize('publisher','admin'),updateCourse);

/**
 * @swagger
 * /course:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get all courses
 */
router.delete('/:id',protect,authorize('publisher','admin'),deleteCourse)



module.exports = router;