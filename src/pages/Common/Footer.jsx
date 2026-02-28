import { Container } from "react-bootstrap";

const Footer = () => {
  const today = new Date();
  const year = today.getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <div className="text-center">
          <small> {year} Doctor's Chamber. All rights reserved.</small>
          <div className="mt-3">
            <div className="d-flex justify-content-center gap-4">
              <a href="/about" className="text-white text-decoration-none me-3">
                About
              </a>
              <a
                href="/services"
                className="text-white text-decoration-none me-3"
              >
                Services
              </a>
              <a href="/blogs" className="text-white text-decoration-none me-3">
                Blogs
              </a>
              <a href="/contact" className="text-white text-decoration-none">
                Contact
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
