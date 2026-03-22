import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { auth, db } from "../firebase.init";

const defaultSettings = {
  preferences: {
    emailNotifications: true,
    smsReminders: true,
    newsletter: false,
  },
  language: "en",
  timezone: "UTC",
};

const Settings = () => {
  const [user, loading] = useAuthState(auth);
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      setLoadingData(true);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setSettings((prev) => ({
            ...prev,
            preferences: {
              ...prev.preferences,
              ...(userDoc.data().preferences || {}),
            },
            language: userDoc.data().language || prev.language,
            timezone: userDoc.data().timezone || prev.timezone,
          }));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          preferences: settings.preferences,
          language: settings.language,
          timezone: settings.timezone,
          updatedAt: new Date(),
        },
        { merge: true },
      );
      toast.success("Settings updated.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingData) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading settings...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white p-4">
          <h2 className="mb-1">Account Settings</h2>
          <p className="text-muted mb-0">
            Manage preferences, notifications, and localization.
          </p>
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md={6}>
                <h5>Notifications</h5>
                <Form.Check
                  type="switch"
                  label="Email Notifications"
                  checked={settings.preferences.emailNotifications}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        emailNotifications: event.target.checked,
                      },
                    }))
                  }
                />
                <Form.Check
                  type="switch"
                  label="SMS Reminders"
                  checked={settings.preferences.smsReminders}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        smsReminders: event.target.checked,
                      },
                    }))
                  }
                />
                <Form.Check
                  type="switch"
                  label="Newsletter"
                  checked={settings.preferences.newsletter}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        newsletter: event.target.checked,
                      },
                    }))
                  }
                />
              </Col>
              <Col md={6}>
                <h5>Regional Preferences</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Select
                    value={settings.language}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        language: event.target.value,
                      }))
                    }
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Timezone</Form.Label>
                  <Form.Select
                    value={settings.timezone}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        timezone: event.target.value,
                      }))
                    }
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="BST">Bangladesh Standard Time</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
