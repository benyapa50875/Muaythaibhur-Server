const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {jwtDecode} = require('jwt-decode');

// Controller functions for blog CRUD operations

// Create a new blog
exports.createBlog = async (req, res) => {
  const { message } = req.body;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  try {
    const newBlog = await prisma.blog.create({
      data: {
        userId,
        message
      }
    });
    res.json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        user: true,
        blog_view: true,
        blog_like: true,
        comment_blog: {
          include: {
            user: true
          }
        }
      }
    });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        blog_view: true,
        blog_like: true,
        comment_blog: true,
        comment_blog: {
          include: {
            user: true
          }
        }
      }
    });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update blog by ID
exports.updateBlogById = async (req, res) => {
  const { message, views, likes } = req.body;
  const id = parseInt(req.body.blogId, 10);  // Ensure the ID is parsed correctly
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const decodedToken = jwtDecode(token);
  const userId = parseInt(decodedToken.userId, 10);  // Ensure the userId is parsed correctly
  try {
    const updatedBlog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: {
        userId,
        message,
        views,
        likes
      }
    });
    res.json(updatedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update blog views by ID
exports.updateBlogViews = async (req, res) => {
  const id = parseInt(req.body.blogId, 10);  // Ensure the ID is parsed correctly
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const decodedToken = jwtDecode(token);
  const userId = parseInt(decodedToken.userId, 10);  // Ensure the userId is parsed correctly

  try {
    const existingView = await prisma.blog_view.findFirst({
      where: {
        blogId: id,
        userId: userId
      }
    });

    if (!existingView) {
      await prisma.blog_view.create({
        data: {
          blogId: id,
          userId: userId,
          viewDate: new Date()
        }
      });

      const updatedBlog = await prisma.blog.update({
        where: { id: id },
        data: {
          views: {
            increment: 1
          }
        }
      });

      res.json(updatedBlog);
    } else {
      res.status(400).json({ error: 'User has already viewed this blog' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// Update blog likes by ID
exports.updateBlogLikes = async (req, res) => {
  const { blogId } = req.body;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const decodedToken = jwtDecode(token);
  const userId = parseInt(decodedToken.userId, 10);

  try {
    const existingLike = await prisma.blog_like.findFirst({
      where: {
        blogId: parseInt(blogId),
        userId: userId
      }
    });

    if (!existingLike) {
      await prisma.blog_like.create({
        data: {
          blogId: parseInt(blogId),
          userId: userId,
          likeDate: new Date()
        }
      });

      const updatedBlog = await prisma.blog.update({
        where: { id: parseInt(blogId) },
        data: {
          likes: {
            increment: 1
          }
        }
      });

      res.json(updatedBlog);
    } else {
      res.status(400).json({ error: 'User has already liked this blog' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Delete blog by ID
exports.deleteBlogById = async (req, res) => {
  const { id } = req.params;
  const blogId = parseInt(id);

  try {
    // Delete related blog_views
    await prisma.blog_view.deleteMany({
      where: { blogId }
    });

    // Delete related blog_likes
    await prisma.blog_like.deleteMany({
      where: { blogId }
    });

    // Delete related comment_blogs
    await prisma.comment_blog.deleteMany({
      where: { blogId }
    });

    // Delete the blog itself
    await prisma.blog.delete({
      where: { id: blogId }
    });

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller functions for comment_blog CRUD operations

// Create a new comment on a blog
exports.createComment = async (req, res) => {
  const { blogId, message } = req.body;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  try {
    const newComment = await prisma.comment_blog.create({
      data: {
        blogId: parseInt(blogId),
        userId: parseInt(userId),
        message
      }
    });

    // Increment the comments count in the blog record
    await prisma.blog.update({
      where: { id: parseInt(blogId) },
      data: {
        comments: {
          increment: 1
        }
      }
    });

    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all comments
exports.checkLike = async (req, res) => {
  try {
    const { blogId } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
  
    const decodedToken = jwtDecode(token);
    const userId = parseInt(decodedToken.userId, 10);
  
      const existingLike = await prisma.blog_like.findFirst({
        where: {
          blogId: parseInt(blogId),
          userId: userId
        }
      });
      if(existingLike){
        res.status(200).json({ isLike: true });
      }else{
        res.status(200).json({ isLike: false });
      }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment_blog.findMany({
      include: {
        user: true
      }
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get comment by ID
exports.getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await prisma.comment_blog.findMany({
      where: { blogId: parseInt(id) },
      include: {
        user: true,
        blog: true
      }
    });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update comment by ID
exports.updateCommentById = async (req, res) => {
  const { id } = req.params;
  const { userId, message } = req.body;

  try {
    const updatedComment = await prisma.comment_blog.update({
      where: { id: parseInt(id) },
      data: {
        userId,
        message
      }
    });
    res.json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete comment by ID
exports.deleteCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComment = await prisma.comment_blog.delete({
      where: { id: parseInt(id) }
    });

    // Decrement the comments count in the blog record
    await prisma.blog.update({
      where: { id: deletedComment.blogId },
      data: {
        comments: {
          decrement: 1
        }
      }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
