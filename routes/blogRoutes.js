const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticateToken = require('../middlewares/authMiddleware');

// Routes for blog CRUD operations

// Create a new blog
router.post('/', authenticateToken, blogController.createBlog);

// Get all blogs
router.get('/', blogController.getAllBlogs);

// Get blog by ID
router.get('/:id', blogController.getBlogById);

// Update blog by ID
router.put('/update/:id', authenticateToken, blogController.updateBlogById);

// Update blog views by ID
router.put('/views', authenticateToken, blogController.updateBlogViews);

// Update blog likes by ID
router.get('/check', blogController.checkLike);

router.put('/likes', blogController.updateBlogLikes);

// Delete blog by ID
router.delete('/:id', blogController.deleteBlogById);

// Routes for comment_blog CRUD operations

// Create a new comment on a blog
router.post('/comments', blogController.createComment);

// Get all comments
router.get('/comments', blogController.getAllComments);

// Get comment by ID
router.get('/comments/:id', blogController.getCommentById);

// Update comment by ID
router.put('/comments/:id', blogController.updateCommentById);

// Delete comment by ID
router.delete('/comments/:id', blogController.deleteCommentById);

module.exports = router;
