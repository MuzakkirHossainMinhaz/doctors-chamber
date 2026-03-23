import { Col, Container, Row, Spinner } from "react-bootstrap";
import AppIcon from "../../components/AppIcon";

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
              <AppIcon name="bi-hospital" className="me-2" />
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
