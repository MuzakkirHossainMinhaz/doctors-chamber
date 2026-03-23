import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
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
  Row,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import AppIcon from "../../components/AppIcon";
import { db } from "../../firebase.init";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "all",
    "health",
    "nutrition",
    "mental-health",
    "medical-tech",
    "lifestyle",
    "emergency",
  ];

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, selectedCategory, searchTerm]);

  const fetchBlogs = async () => {
    try {
      const blogsQuery = query(
        collection(db, "blogs"),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc"),
        limit(50),
      );
      const blogsSnapshot = await getDocs(blogsQuery);
      const blogsData = blogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toDate
      ? date.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const featuredBlogs = filteredBlogs
    .filter((blog) => blog.featured)
    .slice(0, 3);
  const regularBlogs = filteredBlogs.filter((blog) => !blog.featured);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading blogs...</p>
      </div>
    );
  }

  return (
    <Container className="my-5">
      <div className="rounded-3 p-5 mb-4" style={{ backgroundColor: 'var(--color-gray-50)' }}>
        <h1 className="display-5 fw-bold text-center" style={{ color: 'var(--color-secondary)' }}>Healthcare Blog</h1>
        <p className="lead text-muted text-center">
          Expert insights on health, wellness, and medical care
        </p>
      </div>

      {/* Search and Filter */}
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-lg"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select-lg"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all"
                  ? "All Categories"
                  : category.charAt(0).toUpperCase() +
                    category.slice(1).replace("-", " ")}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <div className="mb-5">
          <h2 className="h4 mb-4">Featured Articles</h2>
          <Row className="g-4">
            {featuredBlogs.map((blog) => (
              <Col md={4} key={blog.id} className="mb-4">
                <Card className="h-100">
                  {blog.featured && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <Badge bg="warning">Featured</Badge>
                    </div>
                  )}
                  <Card.Body>
                    <div className="mb-3">
                      <Badge bg="primary" className="mb-2">
                        {blog.category}
                      </Badge>
                    </div>
                    <h5 className="mb-3">{blog.title}</h5>
                    <p className="text-muted mb-4">{blog.excerpt}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        By {blog.author?.name} • {formatDate(blog.publishedAt)}
                      </small>
                      <Button
                        variant="primary"
                        as={Link}
                        to={`/blog/${blog.id}`}
                        className="rounded-pill"
                      >
                        Read More
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Regular Blogs */}
      {regularBlogs.length > 0 && (
        <div>
          <h2 className="h4 mb-4">Latest Articles</h2>
          <Row className="g-4">
            {regularBlogs.map((blog) => (
              <Col md={6} key={blog.id} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <div className="mb-3">
                      <Badge bg="primary" className="mb-2">
                        {blog.category}
                      </Badge>
                    </div>
                    <h5 className="mb-3">{blog.title}</h5>
                    <p className="text-muted mb-4">{blog.excerpt}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        By {blog.author?.name} • {formatDate(blog.publishedAt)}
                      </small>
                      <Button
                        variant="outline-primary"
                        as={Link}
                        to={`/blog/${blog.id}`}
                        className="rounded-pill"
                      >
                        Read More
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* No Blogs Found */}
      {filteredBlogs.length === 0 && !loading && (
        <Alert variant="info" className="text-center">
          <AppIcon name="bi-journal-text" className="me-2" />
          No blogs found matching your criteria.
          <div className="mt-3">
            <Button variant="outline-primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Alert>
      )}
    </Container>
  );
};

export default BlogList;
