import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { auth, db } from "../../firebase.init";

const BlogCMS = () => {
  const [user, loading] = useAuthState(auth);
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "health",
    tags: "",
    featured: false,
    status: "draft",
  });

  const categories = [
    "health",
    "nutrition",
    "mental-health",
    "medical-tech",
    "lifestyle",
    "emergency",
  ];
  const statuses = ["draft", "published", "archived"];

  // Check if user is admin or author
  const isAdmin =
    user?.email === "admin@doctorschamber.com" ||
    user?.email === "abdullah@example.com";

  useEffect(() => {
    if (!user) return;
    fetchBlogs();
  }, [user]);

  const fetchBlogs = async () => {
    setLoadingData(true);
    try {
      const blogsQuery = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc"),
      );
      const blogsSnapshot = await getDocs(blogsQuery);
      const blogsData = blogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
    } catch (error) {
      toast.error("Failed to fetch blogs");
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...blogForm,
        tags: blogForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        author: {
          name: user.displayName || "Anonymous",
          email: user.email,
          uid: user.uid,
        },
        createdAt: editingBlog ? editingBlog.createdAt : new Date(),
        updatedAt: new Date(),
        publishedAt:
          blogForm.status === "published" && !editingBlog
            ? new Date()
            : editingBlog?.publishedAt,
      };

      if (editingBlog) {
        await updateDoc(doc(db, "blogs", editingBlog.id), blogData);
        toast.success("Blog updated successfully");
      } else {
        await addDoc(collection(db, "blogs"), blogData);
        toast.success("Blog created successfully");
      }

      setShowModal(false);
      setEditingBlog(null);
      setBlogForm({
        title: "",
        content: "",
        excerpt: "",
        category: "health",
        tags: "",
        featured: false,
        status: "draft",
      });
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to save blog");
      console.error(error);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteDoc(doc(db, "blogs", blogId));
        toast.success("Blog deleted successfully");
        fetchBlogs();
      } catch (error) {
        toast.error("Failed to delete blog");
        console.error(error);
      }
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      category: blog.category,
      tags: blog.tags.join(", "),
      featured: blog.featured || false,
      status: blog.status,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getStatusBadge = (status) => {
    const variant =
      status === "published"
        ? "success"
        : status === "archived"
          ? "secondary"
          : "warning";
    return <Badge bg={variant}>{status}</Badge>;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toDate
      ? date.toDate().toLocaleDateString()
      : new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading blog management...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-shield-exclamation me-2"></i>
          <h4>Access Denied</h4>
          <p>You don't have permission to access the blog management system.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="bg-primary text-white rounded-3 p-5 mb-4">
        <h1 className="display-5 fw-bold text-center">
          Blog Management System
        </h1>
        <p className="lead text-center">
          Create and manage healthcare blog content
        </p>
        <div className="text-center">
          <Button variant="light" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Create New Blog
          </Button>
        </div>
      </div>

      <Row className="g-4">
        <Col>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">All Blogs ({blogs.length})</h5>
            </Card.Header>
            <Card.Body>
              {loadingData ? (
                <div className="text-center my-5">
                  <Spinner animation="border" variant="success" />
                  <p className="mt-3">Loading blogs...</p>
                </div>
              ) : blogs.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <i className="bi bi-journal-text me-2"></i>
                  No blogs found. Create your first blog!
                </Alert>
              ) : (
                <div className="blog-list">
                  {blogs.map((blog) => (
                    <Card key={blog.id} className="mb-3">
                      <Card.Body>
                        <Row>
                          <Col md={8}>
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h5 className="mb-2">{blog.title}</h5>
                                <p className="text-muted">{blog.excerpt}</p>
                                <div className="d-flex align-items-center gap-2 mt-2">
                                  <small className="text-muted">
                                    By {blog.author?.name} •{" "}
                                    {formatDate(blog.createdAt)}
                                  </small>
                                  <div>
                                    <Badge bg="primary" className="me-2">
                                      {blog.category}
                                    </Badge>
                                    {blog.featured && (
                                      <Badge bg="warning">Featured</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleEditBlog(blog)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteBlog(blog.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Blog Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingBlog ? "Edit Blog" : "Create New Blog"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBlogSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Blog Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={blogForm.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Excerpt</Form.Label>
              <Form.Control
                as="textarea"
                name="excerpt"
                value={blogForm.excerpt}
                onChange={handleInputChange}
                rows={2}
                placeholder="Brief description of the blog"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={blogForm.category}
                    onChange={handleInputChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() +
                          cat.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={blogForm.status}
                    onChange={handleInputChange}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={blogForm.tags}
                onChange={handleInputChange}
                placeholder="health, nutrition, wellness"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="featured"
                checked={blogForm.featured}
                onChange={handleInputChange}
                label="Featured Blog"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={blogForm.content}
                onChange={handleInputChange}
                rows={8}
                placeholder="Write your blog content here..."
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                {editingBlog ? "Update" : "Publish"} Blog
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BlogCMS;
