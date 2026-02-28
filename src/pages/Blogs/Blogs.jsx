import { useState } from "react";
import { Container, Nav, Spinner, Tab } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.init";
import BlogCMS from "./BlogCMS";
import BlogList from "./BlogList";

const Blogs = () => {
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState("blogs");

  // Check if user is admin
  const isAdmin =
    user?.email === "admin@doctorschamber.com" ||
    user?.email === "abdullah@example.com";

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading blogs...</p>
      </div>
    );
  }

  return (
    <Container className="blogs-page">
      <div className="blogs-header">
        <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--color-secondary)' }}>Healthcare Blog</h1>
        <p className="lead text-muted">
          Expert insights on health, wellness, and medical care
        </p>
      </div>

      {isAdmin && (
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Nav variant="pills" className="justify-content-center mb-4">
            <Nav.Item>
              <Nav.Link eventKey="blogs">View Blogs</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="manage">Manage Blogs</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="blogs">
              <BlogList />
            </Tab.Pane>
            <Tab.Pane eventKey="manage">
              <BlogCMS />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      )}

      {!isAdmin && <BlogList />}
    </Container>
  );
};

export default Blogs;
