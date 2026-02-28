import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);

  const slides = [
    {
      title: "Protect Your Health",
      subtitle: "and Take Care of Your Body",
      description:
        "Comprehensive healthcare services with modern medical expertise and compassionate care.",
      doctor: "Prof. Dr. Md. Abdullah",
      image: "https://i.ibb.co/y5M2GJN/banner.png",
      cta: "Book Appointment",
      ctaLink: "/checkout",
    },
    {
      title: "Expert Medical Care",
      subtitle: "When You Need It Most",
      description:
        "24/7 emergency services with specialized medical professionals ready to help you.",
      doctor: "Available 24/7",
      image: "https://i.ibb.co/6P6fX2C/medical-care.png",
      cta: "Emergency Services",
      ctaLink: "/contact",
    },
    {
      title: "Personalized Treatment",
      subtitle: "Tailored to Your Needs",
      description:
        "Custom healthcare plans designed specifically for your unique health requirements.",
      doctor: "Personal Care",
      image: "https://i.ibb.co/3s6TQ2L/personalized-care.png",
      cta: "Get Consultation",
      ctaLink: "/checkout",
    },
  ];

  useEffect(() => {
    setIsAnimated(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="home"
      className="min-vh-100 position-relative overflow-hidden bg-primary"
    >
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-10"></div>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient bg-opacity-20"></div>
      </div>

      <Container className="position-relative z-2">
        <Row className="align-items-center min-vh-100">
          <Col lg={6} className={`${isAnimated ? "animate-fade-in-up" : ""}`}>
            <div className="d-inline-flex align-items-center bg-white bg-opacity-90 rounded-pill mb-4 px-3 py-2">
              <span className="text-primary me-2">
                <i className="bi bi-hospital fs-5"></i>
              </span>
              <span className="fw-semibold">{slides[currentSlide].doctor}</span>
            </div>

            <h1 className="display-4 fw-bold text-white mb-3">
              {slides[currentSlide].title}
              <span className="d-block text-white-50 fs-5">
                {slides[currentSlide].subtitle}
              </span>
            </h1>

            <p className="text-white-75 fs-5 mb-4">
              {slides[currentSlide].description}
            </p>

            <div className="d-flex gap-3 mb-5">
              <Button
                as={Link}
                to={slides[currentSlide].ctaLink}
                variant="primary"
                size="lg"
                className="rounded-pill"
              >
                <i className="bi bi-calendar-plus me-2"></i>
                {slides[currentSlide].cta}
              </Button>
              <Button
                as={Link}
                to="/services"
                variant="light"
                size="lg"
                className="rounded-pill"
              >
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Browse Services
              </Button>
            </div>

            <div className="d-flex gap-4">
              <div className="text-center">
                <div className="display-6 fw-bold text-white">15+</div>
                <div className="text-white-75">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="display-6 fw-bold text-white">5000+</div>
                <div className="text-white-75">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="display-6 fw-bold text-white">24/7</div>
                <div className="text-white-75">Emergency Care</div>
              </div>
            </div>
          </Col>

          <Col lg={6} className={`${isAnimated ? "animate-fade-in" : ""}`}>
            <div className="position-relative">
              <div className="position-relative overflow-hidden rounded-4 shadow-lg">
                <img
                  src={slides[currentSlide].image}
                  alt="Medical Care"
                  className="img-fluid"
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient bg-opacity-30 rounded-4"></div>
              </div>

              <div className="position-absolute top-50 start-50 translate-middle">
                <div className="d-flex gap-3">
                  <div className="bg-white rounded-3 shadow-lg p-3 text-center">
                    <i className="bi bi-heart-pulse text-danger fs-4"></i>
                    <div className="small mt-1">Heart Health</div>
                  </div>
                  <div className="bg-white rounded-3 shadow-lg p-3 text-center">
                    <i className="bi bi-shield-check text-success fs-4"></i>
                    <div className="small mt-1">Insurance</div>
                  </div>
                  <div className="bg-white rounded-3 shadow-lg p-3 text-center">
                    <i className="bi bi-award text-warning fs-4"></i>
                    <div className="small mt-1">Certified</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light btn-sm rounded-circle"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            <div className="d-flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm rounded-circle ${index === currentSlide ? "btn-primary" : "btn-outline-light"}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="btn btn-light btn-sm rounded-circle"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Banner;
