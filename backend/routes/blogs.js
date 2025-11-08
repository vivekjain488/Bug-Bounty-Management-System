import express from 'express';
import Blog from '../models/Blog.js';
import { authenticate } from '../middleware/auth.js';
import CryptoJS from 'crypto-js';

const router = express.Router();

// Encryption key - in production, use environment variable
const ENCRYPTION_KEY = process.env.BLOG_ENCRYPTION_KEY || 'your-secret-encryption-key-change-this-in-production';

// Helper function to encrypt content
const encryptContent = (content) => {
  try {
    return CryptoJS.AES.encrypt(content, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Helper function to decrypt content
const decryptContent = (encryptedContent) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Get all published blogs (public route)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, search } = req.query;
    
    const query = { isPublished: true };
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'username fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    // Decrypt content for each blog
    const blogsWithDecryptedContent = blogs.map(blog => {
      if (blog.encryptedContent) {
        const decryptedContent = decryptContent(blog.encryptedContent);
        return {
          ...blog,
          content: decryptedContent || blog.content, // Fallback to unencrypted if decryption fails
          encryptedContent: undefined // Don't send encrypted content to frontend
        };
      }
      return {
        ...blog,
        encryptedContent: undefined
      };
    });
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      success: true,
      blogs: blogsWithDecryptedContent,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blogs',
      error: error.message 
    });
  }
});

// Get single blog by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username fullName email')
      .populate('comments.author', 'username fullName');
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }
    
    // Increment view count
    blog.views += 1;
    await blog.save();
    
    // Decrypt content
    let decryptedContent = blog.content;
    if (blog.encryptedContent) {
      const decrypted = decryptContent(blog.encryptedContent);
      if (decrypted) {
        decryptedContent = decrypted;
      }
    }
    
    const blogData = blog.toObject();
    blogData.content = decryptedContent;
    delete blogData.encryptedContent; // Don't send encrypted content to frontend
    
    res.json({
      success: true,
      blog: blogData
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blog',
      error: error.message 
    });
  }
});

// Create new blog (authenticated route)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, tags, isPublished } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }
    
    // Encrypt the content
    const encryptedContent = encryptContent(content);
    
    if (!encryptedContent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to encrypt content' 
      });
    }
    
    const blog = new Blog({
      title,
      content, // Store plain text for search/indexing
      encryptedContent, // Store encrypted version for security
      author: req.user.userId,
      tags: tags || [],
      isPublished: isPublished !== undefined ? isPublished : false
    });
    
    await blog.save();
    await blog.populate('author', 'username fullName email');
    
    // Don't send encrypted content back
    const blogData = blog.toObject();
    delete blogData.encryptedContent;
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog: blogData
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create blog',
      error: error.message 
    });
  }
});

// Update blog (authenticated route - author only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this blog' 
      });
    }
    
    const { title, content, tags, isPublished } = req.body;
    
    if (title) blog.title = title;
    if (tags) blog.tags = tags;
    if (isPublished !== undefined) blog.isPublished = isPublished;
    
    if (content) {
      blog.content = content;
      const encryptedContent = encryptContent(content);
      if (encryptedContent) {
        blog.encryptedContent = encryptedContent;
      }
    }
    
    await blog.save();
    await blog.populate('author', 'username fullName email');
    
    const blogData = blog.toObject();
    delete blogData.encryptedContent;
    
    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog: blogData
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update blog',
      error: error.message 
    });
  }
});

// Delete blog (authenticated route - author only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this blog' 
      });
    }
    
    await blog.deleteOne();
    
    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete blog',
      error: error.message 
    });
  }
});

// Add comment to blog (authenticated route)
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Comment content is required' 
      });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }
    
    blog.comments.push({
      author: req.user.userId,
      content
    });
    
    await blog.save();
    await blog.populate('comments.author', 'username fullName');
    
    res.json({
      success: true,
      message: 'Comment added successfully',
      comments: blog.comments
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add comment',
      error: error.message 
    });
  }
});

// Get user's blogs (authenticated route)
router.get('/user/my-blogs', authenticate, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    
    // Decrypt content for each blog
    const blogsWithDecryptedContent = blogs.map(blog => {
      if (blog.encryptedContent) {
        const decryptedContent = decryptContent(blog.encryptedContent);
        return {
          ...blog,
          content: decryptedContent || blog.content,
          encryptedContent: undefined
        };
      }
      return {
        ...blog,
        encryptedContent: undefined
      };
    });
    
    res.json({
      success: true,
      blogs: blogsWithDecryptedContent
    });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blogs',
      error: error.message 
    });
  }
});

export default router;
