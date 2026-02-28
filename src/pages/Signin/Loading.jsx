import { Col, Container, Row, Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md="auto">
          <div className="text-center">
            <div className="mb-3">
              <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            <div className="text-muted">
              <i className="bi bi-hospital me-2"></i>
              Doctor's Chamber
            </div>
            <small className="text-muted d-block mt-2">
              Please wait while we prepare your healthcare experience...
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Loading;
