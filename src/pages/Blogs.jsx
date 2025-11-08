import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { getAllBlogs } from '../utils/blogs';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    loadBlogs();
  }, [currentPage, searchTerm, selectedTag]);

  const loadBlogs = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: 10
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedTag) params.tag = selectedTag;

    const result = await getAllBlogs(params);
    if (Array.isArray(result)) {
      setBlogs(result);
    }
    setLoading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 200) => {
    if (!content) return '';
    const text = content.replace(/[#*]/g, '').replace(/\n/g, ' ');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="blogs-page">
      <Navbar />
      
      <main className="content">
        <div className="blogs-container">
          <div className="blogs-header">
            <h1 className="page-title">Security Blog</h1>
            <p className="page-subtitle">Learn from security experts and researchers</p>
          </div>

          <div className="blogs-filters">
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className="form-input filter-select"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Topics</option>
              <option value="Security">Security</option>
              <option value="Encryption">Encryption</option>
              <option value="Authentication">Authentication</option>
              <option value="Vulnerabilities">Vulnerabilities</option>
              <option value="Best Practices">Best Practices</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="empty-state">
              <p>No blogs found</p>
            </div>
          ) : (
            <div className="blogs-grid">
              {blogs.map((blog) => (
                <article key={blog._id} className="blog-card">
                  <div className="blog-card-header">
                    <h2 className="blog-title">
                      <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                    </h2>
                    <div className="blog-meta">
                      <span className="blog-author">
                        By {blog.author?.fullName || blog.author?.username || 'Anonymous'}
                      </span>
                      <span className="blog-date">{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>

                  <div className="blog-excerpt">
                    {truncateContent(blog.content)}
                  </div>

                  <div className="blog-card-footer">
                    <div className="blog-tags">
                      {blog.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                    <div className="blog-stats">
                      <span className="stat">
                        <span className="stat-icon">👁️</span>
                        {blog.views || 0} views
                      </span>
                      <span className="stat">
                        <span className="stat-icon">💬</span>
                        {blog.comments?.length || 0} comments
                      </span>
                    </div>
                  </div>

                  <Link to={`/blog/${blog._id}`} className="btn btn-secondary btn-block">
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blogs;
