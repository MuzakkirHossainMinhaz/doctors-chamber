import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
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
import AppIcon from "./AppIcon";
import { auth, db } from "../firebase.init";
import useAuthRole from "../hooks/useAuthRole";

const ChatSystem = () => {
  const [user, loading] = useAuthState(auth);
  const { isAdmin, isDoctor } = useAuthRole();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const messagesEndRef = useRef(null);

  const isStaffUser = isAdmin() || isDoctor();

  useEffect(() => {
    if (!user) return;

    const chatQuery = isStaffUser
      ? query(collection(db, "chatMessages"), orderBy("createdAt", "desc"), limit(200))
      : query(
          collection(db, "chatMessages"),
          where("conversationId", "==", user.uid),
          orderBy("createdAt", "asc"),
          limit(200),
        );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((messageDoc) => ({
        id: messageDoc.id,
        ...messageDoc.data(),
      }));

      setMessages(messagesData);

      if (isStaffUser && !selectedConversationId && messagesData.length > 0) {
        setSelectedConversationId(messagesData[0].conversationId);
      }
    });

    return () => unsubscribe();
  }, [isStaffUser, selectedConversationId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversationId]);

  const conversations = useMemo(() => {
    if (!isStaffUser) return [];

    const grouped = new Map();
    messages.forEach((message) => {
      if (!grouped.has(message.conversationId)) {
        grouped.set(message.conversationId, message);
      }
    });

    return Array.from(grouped.values());
  }, [isStaffUser, messages]);

  const currentMessages = useMemo(() => {
    if (!isStaffUser) return messages;

    return messages
      .filter((message) => message.conversationId === selectedConversationId)
      .sort((a, b) => {
        const first = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const second = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return first - second;
      });
  }, [isStaffUser, messages, selectedConversationId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    const conversationId = isStaffUser ? selectedConversationId : user.uid;
    if (!conversationId) return;

    const messageData = {
      text: newMessage.trim(),
      senderId: user.uid,
      senderName: user.displayName || user.email || "User",
      senderEmail: user.email,
      senderRole: isStaffUser ? "staff" : "patient",
      conversationId,
      createdAt: new Date(),
      read: false,
    };

    await addDoc(collection(db, "chatMessages"), messageData);
    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return (timestamp.toDate ? timestamp.toDate() : new Date(timestamp)).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return (timestamp.toDate ? timestamp.toDate() : new Date(timestamp)).toLocaleDateString();
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
          <AppIcon name="bi-chat-dots" className="me-2" />
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
    <Container fluid className="my-5">
      <Row className="g-4">
        {isStaffUser && (
          <Col lg={4}>
            <Card className="h-100">
              <Card.Header className="text-white" style={{ backgroundColor: "var(--color-primary)" }}>
                <h5 className="mb-0">Support Inbox</h5>
              </Card.Header>
              <Card.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
                {conversations.length === 0 ? (
                  <Alert variant="info" className="mb-0">
                    No patient conversations yet.
                  </Alert>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      type="button"
                      className={`w-100 text-start border rounded p-3 mb-3 bg-white ${
                        selectedConversationId === conversation.conversationId ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedConversationId(conversation.conversationId)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{conversation.senderName}</strong>
                        <small className="text-muted">{formatDate(conversation.createdAt)}</small>
                      </div>
                      <div className="small text-muted">{conversation.senderEmail}</div>
                      <div className="small mt-2">{conversation.text}</div>
                    </button>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        )}

        <Col lg={isStaffUser ? 8 : 10} className="mx-auto">
          <Card className="h-100">
            <Card.Header className="text-white" style={{ backgroundColor: "var(--color-primary)" }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">
                    {isStaffUser ? "Conversation Workspace" : "Chat Support"}
                  </h5>
                  <small>
                    {isStaffUser
                      ? "Reply to patient conversations from the clinic inbox."
                      : "Send real support messages to the clinic team."}
                  </small>
                </div>
                <Badge bg="success">{isStaffUser ? "Staff Mode" : "Patient Support"}</Badge>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              <div style={{ height: "420px", overflowY: "auto" }}>
                {currentMessages.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <AppIcon name="bi-chat-dots" className="display-4 mb-3" />
                    <p>
                      {isStaffUser
                        ? "Select a conversation from the inbox."
                        : "No messages yet. Start a conversation with the clinic."}
                    </p>
                  </div>
                ) : (
                  currentMessages.map((message) => {
                    const isOwnMessage = message.senderId === user.uid;
                    return (
                      <div
                        key={message.id}
                        className={`d-flex mb-3 ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`}
                      >
                        <div
                          className={`p-3 rounded-3 ${isOwnMessage ? "text-white" : ""}`}
                          style={{
                            maxWidth: "70%",
                            backgroundColor: isOwnMessage
                              ? "var(--color-primary)"
                              : "var(--color-gray-50)",
                          }}
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
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </Card.Body>

            <Card.Footer className="p-3">
              <Form onSubmit={handleSendMessage}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    className="flex-grow-1"
                    disabled={isStaffUser && !selectedConversationId}
                  />
                  <Button
                    variant="success"
                    type="submit"
                    disabled={!newMessage.trim() || (isStaffUser && !selectedConversationId)}
                  >
                    <AppIcon name="bi-send" />
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
