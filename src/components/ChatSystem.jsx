import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
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
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase.init";

const ChatSystem = () => {
  const [user, loading] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState("offline");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const messagesQuery = query(
      collection(db, "chatMessages"),
      orderBy("createdAt", "asc"),
      limit(100),
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      scrollToBottom();
    });

    // Simulate admin status
    setChatStatus("online");

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage.trim(),
      senderId: user.uid,
      senderName: user.displayName || "User",
      senderEmail: user.email,
      type: "user",
      createdAt: new Date(),
      read: false,
    };

    try {
      await addDoc(collection(db, "chatMessages"), messageData);
      setNewMessage("");

      // Simulate admin response
      setTimeout(
        () => {
          simulateAdminResponse();
        },
        1000 + Math.random() * 2000,
      );
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const simulateAdminResponse = async () => {
    const responses = [
      "Thank you for your message. How can I help you today?",
      "I understand your concern. Let me assist you with that.",
      "That's a great question! Let me provide you with more information.",
      "I'm here to help. Could you please provide more details?",
      "Thank you for reaching out. I'll do my best to assist you.",
      "I appreciate your patience. Let me look into this for you.",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    const adminMessage = {
      text: randomResponse,
      senderId: "admin",
      senderName: "Dr. Abdullah",
      senderEmail: "admin@doctorschamber.com",
      type: "admin",
      createdAt: new Date(),
      read: false,
    };

    try {
      await addDoc(collection(db, "chatMessages"), adminMessage);
    } catch (error) {
      console.error("Failed to send admin response:", error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toDate
      ? timestamp.toDate().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date(timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toDate
      ? timestamp.toDate().toLocaleDateString()
      : new Date(timestamp).toLocaleDateString();
  };

  const isToday = (timestamp) => {
    const messageDate = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);
    const today = new Date();
    return messageDate.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading chat...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Container className="my-5">
        <Alert variant="info" className="text-center">
          <i className="bi bi-chat-dots me-2"></i>
          <h4>Chat Support</h4>
          <p>Please sign in to access our chat support system.</p>
          <Button variant="success" href="/signin">
            Sign In
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div className="chat-info">
                  <h5 className="mb-0">Chat Support</h5>
                  <div className="d-flex align-items-center">
                    <div
                      className={`bg-${chatStatus === "online" ? "success" : "secondary"} rounded-circle me-2`}
                      style={{ width: "10px", height: "10px" }}
                    ></div>
                    <small className="ms-2">
                      {chatStatus === "online"
                        ? "Dr. Abdullah is online"
                        : "Support is offline"}
                    </small>
                  </div>
                </div>
                <Badge bg="success" className="availability-badge">
                  <i className="bi bi-shield-check me-1"></i>
                  Secure Chat
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              <div
                className="messages-container"
                style={{ height: "400px", overflowY: "auto" }}
              >
                {messages.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i className="bi bi-chat-dots display-4 mb-3"></i>
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const showDate =
                        index === 0 ||
                        !isToday(message.createdAt) ||
                        !isToday(messages[index - 1]?.createdAt) ||
                        formatDate(message.createdAt) !==
                          formatDate(messages[index - 1]?.createdAt);

                      return (
                        <React.Fragment key={message.id}>
                          {showDate && (
                            <div className="text-center text-muted my-3">
                              <small>{formatDate(message.createdAt)}</small>
                            </div>
                          )}
                          <div
                            className={`d-flex mb-3 ${message.type === "admin" ? "justify-content-start" : "justify-content-end"}`}
                          >
                            <div
                              className={`p-3 rounded-3 ${message.type === "admin" ? "bg-light" : "bg-primary text-white"}`}
                              style={{ maxWidth: "70%" }}
                            >
                              <div className="d-flex align-items-center mb-2">
                                <strong>{message.senderName}</strong>
                                <small className="ms-auto text-muted">
                                  {formatTime(message.createdAt)}
                                </small>
                              </div>
                              <div>{message.text}</div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    {isTyping && (
                      <div className="d-flex justify-content-start mb-3">
                        <div className="bg-light p-3 rounded-3">
                          <div className="d-flex align-items-center">
                            <small className="text-muted">
                              Dr. Abdullah is typing
                            </small>
                            <div className="ms-2">
                              <span
                                className="d-inline-block bg-secondary rounded-circle"
                                style={{
                                  width: "4px",
                                  height: "4px",
                                  margin: "0 1px",
                                }}
                              ></span>
                              <span
                                className="d-inline-block bg-secondary rounded-circle"
                                style={{
                                  width: "4px",
                                  height: "4px",
                                  margin: "0 1px",
                                }}
                              ></span>
                              <span
                                className="d-inline-block bg-secondary rounded-circle"
                                style={{ width: "4px", height: "4px" }}
                              ></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </Card.Body>

            <Card.Footer className="p-3">
              <Form onSubmit={handleSendMessage}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={handleTyping}
                    className="flex-grow-1"
                  />
                  <Button
                    variant="success"
                    type="submit"
                    disabled={!newMessage.trim()}
                  >
                    <i className="bi bi-send"></i>
                  </Button>
                </div>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatSystem;
