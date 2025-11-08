// Blog API utilities - Re-exports from main API
import { blogsAPI } from './api.js';

// Helper functions for easier use
export const getAllBlogs = async (params) => {
  try {
    const blogs = await blogsAPI.getAll(params);
    return Array.isArray(blogs) ? blogs : [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

export const getBlogById = async (id) => {
  try {
    return await blogsAPI.getById(id);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
};

export const createBlog = async (blogData) => {
  try {
    return await blogsAPI.create(blogData);
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to create blog' 
    };
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    return await blogsAPI.update(id, blogData);
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to update blog' 
    };
  }
};

export const deleteBlog = async (id) => {
  try {
    return await blogsAPI.delete(id);
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to delete blog' 
    };
  }
};

export const addBlogComment = async (id, content) => {
  try {
    return await blogsAPI.addComment(id, content);
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to add comment' 
    };
  }
};

export const getMyBlogs = async () => {
  try {
    const blogs = await blogsAPI.getMyBlogs();
    return Array.isArray(blogs) ? blogs : [];
  } catch (error) {
    console.error('Error fetching my blogs:', error);
    return [];
  }
};

// Re-export blogsAPI for direct use if needed
export { blogsAPI };
