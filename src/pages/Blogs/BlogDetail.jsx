import {
  collection,
  doc,
  getDoc,
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
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase.init";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const blogDoc = await getDoc(doc(db, "blogs", id));

      if (blogDoc.exists()) {
        const blogData = { id: blogDoc.id, ...blogDoc.data() };
        setBlog(blogData);

        // Fetch related blogs
        fetchRelatedBlogs(blogData);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (currentBlog) => {
    try {
      const relatedQuery = query(
        collection(db, "blogs"),
        where("status", "==", "published"),
        where("category", "==", currentBlog.category),
        where("__name__", "!=", currentBlog.id),
        orderBy("publishedAt", "desc"),
        limit(3),
      );

      const relatedSnapshot = await getDocs(relatedQuery);
      const relatedData = relatedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRelatedBlogs(relatedData);
    } catch (error) {
      console.error("Failed to fetch related blogs:", error);
    } finally {
      setLoading(false);
    }
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

  const formatReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(" ").length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return `${readingTime} min read`;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <h4>Blog Not Found</h4>
          <p>The blog you're looking for doesn't exist or has been removed.</p>
          <Button variant="success" as={Link} to="/blogs">
            Back to Blogs
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="bg-light rounded-3 p-4 mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/blogs" className="text-primary text-decoration-none">
            <i className="bi bi-house-door me-2"></i>
            Blogs
          </Link>
          <span className="text-muted">/</span>
          <span className="text-primary fw-semibold">{blog.title}</span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3 mb-4">
        <Badge bg="primary" className="me-2">
          {blog.category}
        </Badge>
        {blog.featured && <Badge bg="warning">Featured</Badge>}
      </div>

      <h1 className="display-4 fw-bold mb-4">{blog.title}</h1>
      <p className="lead text-muted mb-4">{blog.excerpt}</p>

      <div className="d-flex align-items-center gap-4 mb-4">
        <div className="d-flex align-items-center">
          <div className="text-center">
            <div
              className="bg-primary text-white rounded-circle"
              style={{ width: "60px", height: "60px" }}
            >
              <i className="bi bi-person fs-3"></i>
            </div>
            <div className="ms-3">
              <h6 className="mb-1">{blog.author?.name}</h6>
              <p className="text-muted small">
                Published on {formatDate(blog.publishedAt)}
              </p>
            </div>
          </div>
          <div className="text-center">
            <span className="text-muted">
              {formatReadingTime(blog.content)}
            </span>{" "}
            read
          </div>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Body className="p-4">
              <div className="blog-content">
                {blog.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">About the Author</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="mb-3">
                <div
                  className="bg-primary text-white rounded-circle mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-person fs-1"></i>
                </div>
                <h6 className="mt-2">{blog.author?.name}</h6>
                <p className="text-muted">
                  Healthcare professional sharing insights on medical care,
                  wellness, and healthy living.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {relatedBlogs.length > 0 && (
        <Row className="g-4 mt-5">
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">Related Articles</h5>
              </Card.Header>
              <Card.Body>
                <div className="related-blogs">
                  {relatedBlogs.map((relatedBlog) => (
                    <div key={relatedBlog.id} className="mb-3">
                      <h6 className="mb-2">
                        <Link
                          to={`/blog/${relatedBlog.id}`}
                          className="text-primary text-decoration-none"
                        >
                          {relatedBlog.title}
                        </Link>
                      </h6>
                      <small className="text-muted">
                        {formatDate(relatedBlog.publishedAt)}
                      </small>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">Categories</h5>
              </Card.Header>
              <Card.Body>
                <div className="categories-list">
                  {[
                    "health",
                    "nutrition",
                    "mental-health",
                    "medical-tech",
                    "lifestyle",
                    "emergency",
                  ].map((category) => (
                    <Link
                      key={category}
                      to={`/blogs?category=${category}`}
                      className="d-block text-decoration-none mb-2 text-primary"
                    >
                      {category.charAt(0).toUpperCase() +
                        category.slice(1).replace("-", " ")}
                    </Link>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <div className="text-center mt-5">
        <Button
          variant="outline-primary"
          as={Link}
          to="/blogs"
          className="me-3"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Blogs
        </Button>
        <Button
          variant="success"
          as={Link}
          to="/checkout"
          className="rounded-pill"
        >
          <i className="bi bi-calendar-plus me-2"></i>
          Book Appointment
        </Button>
      </div>
    </Container>
  );
};

export default BlogDetail;
