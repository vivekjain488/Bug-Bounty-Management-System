import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { getBlogById, addBlogComment } from '../utils/blogs';
import { getCurrentUser, isAuthenticated } from '../utils/auth';
import ReactMarkdown from 'react-markdown';

const BlogDetail = () => {
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    setLoading(true);
    setError('');
    
    try {
      const blogData = await getBlogById(id);
      
      if (blogData) {
        setBlog(blogData);
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      console.error('Error loading blog:', err);
      setError('Failed to load blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      return;
    }

    setSubmittingComment(true);
    const result = await addBlogComment(id, commentContent);
    
    if (result.success) {
      setCommentContent('');
      loadBlog(); // Reload to get updated comments
    } else {
      alert(result.message || 'Failed to add comment');
    }
    
    setSubmittingComment(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <Navbar />
        <main className="content">
          <div className="loading-state">
            <p>Loading blog...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <Navbar />
        <main className="content">
          <div className="error-state">
            <h2>😕 {error || 'Blog not found'}</h2>
            <p>This blog post doesn't exist or has been removed.</p>
            <Link to="/blogs" className="btn btn-primary">
              ← Back to Blogs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <Navbar />
      
      <main className="content">
        <article className="blog-detail-container">
          {/* Header */}
          <header className="blog-detail-header">
            <div className="blog-breadcrumb">
              <Link to="/blogs">← Back to Blogs</Link>
            </div>
            
            <h1 className="blog-detail-title">{blog.title}</h1>
            
            <div className="blog-detail-meta">
              <div className="author-info">
                <div className="author-avatar">
                  {(blog.author?.fullName || blog.author?.username || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <div className="author-name">
                    {blog.author?.fullName || blog.author?.username || 'Anonymous'}
                  </div>
                  <div className="author-email">{blog.author?.email}</div>
                </div>
              </div>
              
              <div className="blog-stats-inline">
                <span className="stat">
                  <span className="stat-icon">📅</span>
                  {formatDate(blog.createdAt)}
                </span>
                <span className="stat">
                  <span className="stat-icon">👁️</span>
                  {blog.views} views
                </span>
                <span className="stat">
                  <span className="stat-icon">💬</span>
                  {blog.comments?.length || 0} comments
                </span>
              </div>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-tags-header">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="blog-content">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          {/* Comments Section */}
          <section className="blog-comments-section">
            <h2 className="comments-title">
              💬 Comments ({blog.comments?.length || 0})
            </h2>

            {/* Add Comment Form */}
            {isAuthenticated() ? (
              <form onSubmit={handleSubmitComment} className="comment-form">
                <textarea
                  className="form-input comment-textarea"
                  placeholder="Add your comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows="4"
                  required
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submittingComment}
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <div className="auth-prompt">
                <p>
                  <Link to="/login">Login</Link> to leave a comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-author">
                        <div className="comment-avatar">
                          {(comment.author?.fullName || comment.author?.username || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="comment-author-name">
                            {comment.author?.fullName || comment.author?.username || 'Anonymous'}
                          </div>
                          <div className="comment-date">
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="comment-content">
                      {comment.content}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
