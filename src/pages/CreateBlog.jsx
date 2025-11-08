import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { createBlog } from '../utils/blogs';
import { isAuthenticated, getCurrentUser } from '../utils/auth';

const CreateBlog = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    isPublished: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    
    const blogData = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPublished: formData.isPublished
    };

    const result = await createBlog(blogData);
    
    if (result.success) {
      alert('Blog created successfully!');
      navigate(`/blog/${result.blog._id}`);
    } else {
      setError(result.message || 'Failed to create blog');
      setSubmitting(false);
    }
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="create-blog-page">
      <Navbar />
      
      <main className="content">
        <div className="create-blog-container">
          <div className="create-blog-header">
            <h1 className="page-title">✍️ Create New Blog Post</h1>
            <p className="page-subtitle">Share your security knowledge with the community</p>
          </div>

          <form onSubmit={handleSubmit} className="create-blog-form">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">
                Content * (Markdown supported)
              </label>
              <textarea
                id="content"
                name="content"
                className="form-input blog-content-textarea"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your blog content here... (Supports Markdown formatting)"
                rows="20"
                required
              />
              <small className="form-hint">
                Tip: You can use Markdown for formatting (# Headers, **bold**, *italic*, etc.)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="tags" className="form-label">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="form-input"
                value={formData.tags}
                onChange={handleChange}
                placeholder="security, encryption, authentication..."
              />
              <small className="form-hint">
                Separate tags with commas
              </small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />
                <span>Publish immediately</span>
              </label>
              <small className="form-hint">
                Uncheck to save as draft
              </small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/blogs')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : (formData.isPublished ? 'Publish Blog' : 'Save Draft')}
              </button>
            </div>
          </form>

          <div className="markdown-guide">
            <h3>Markdown Quick Reference:</h3>
            <ul>
              <li><code># Header 1</code> - Large header</li>
              <li><code>## Header 2</code> - Medium header</li>
              <li><code>**bold**</code> - <strong>Bold text</strong></li>
              <li><code>*italic*</code> - <em>Italic text</em></li>
              <li><code>- Item</code> - Bullet list</li>
              <li><code>[Link](url)</code> - Hyperlink</li>
              <li><code>`code`</code> - Inline code</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateBlog;
