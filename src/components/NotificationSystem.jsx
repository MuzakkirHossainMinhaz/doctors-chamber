import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import AppIcon from "./AppIcon";
import { auth, db } from "../firebase.init";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: [],
      unreadCount: 0,
      markAsRead: () => {},
      markAllAsRead: () => {},
      addNotification: () => {},
    };
  }
  return context;
};

const NotificationSystem = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(50),
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationsData);

      const unread = notificationsData.filter((n) => !n.read).length;
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
        readAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    const promises = unreadNotifications.map((n) => markAsRead(n.id));

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const addNotification = async (notificationData) => {
    try {
      const notification = {
        ...notificationData,
        createdAt: new Date(),
        read: false,
      };

      await addDoc(collection(db, "notifications"), notification);
    } catch (error) {
      console.error("Failed to add notification:", error);
    }
  };

  const contextValue = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationToast notifications={notifications} />
    </NotificationContext.Provider>
  );
};

const NotificationToast = ({ notifications }) => {
  const [show, setShow] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (n) => !n.read && !n.shown,
    );

    if (unreadNotifications.length > 0 && !show) {
      const notification = unreadNotifications[0];
      setCurrentNotification(notification);
      setShow(true);

      // Mark as shown
      setTimeout(() => {
        markNotificationAsShown(notification.id);
      }, 1000);
    }
  }, [notifications, show]);

  const markNotificationAsShown = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        shown: true,
      });
    } catch (error) {
      console.error("Failed to mark notification as shown:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return "bi-calendar-check";
      case "payment":
        return "bi-credit-card";
      case "appointment":
        return "bi-clock";
      case "system":
        return "bi-info-circle";
      case "verification":
        return "bi-shield-check";
      case "message":
        return "bi-chat-dots";
      default:
        return "bi-bell";
    }
  };

  const getNotificationVariant = (type) => {
    switch (type) {
      case "booking":
        return "success";
      case "payment":
        return "primary";
      case "appointment":
        return "warning";
      case "system":
        return "info";
      case "verification":
        return "secondary";
      case "message":
        return "dark";
      default:
        return "secondary";
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case "booking":
        return "Appointment Booked";
      case "payment":
        return "Payment Processed";
      case "appointment":
        return "Appointment Reminder";
      case "system":
        return "Doctor's Chamber Update";
      case "verification":
        return "Email Verified";
      case "message":
        return "New Message";
      default:
        return "Notification";
    }
  };

  return (
    <ToastContainer position="top-end">
      <Toast
        show={show}
        onClose={() => setShow(false)}
        bg={getNotificationVariant(currentNotification?.type)}
        text="white"
        className="notification-toast"
      >
        <Toast.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <AppIcon
              name={getNotificationIcon(currentNotification?.type)}
              className="me-2"
            />
            <strong className="me-auto">
              {getNotificationTitle(currentNotification?.type) ||
                currentNotification?.title}
            </strong>
          </div>
          <small className="text-white">
            {currentNotification?.createdAt?.toDate?.()?.toLocaleTimeString() ||
              "Just now"}
          </small>
        </Toast.Header>
        <Toast.Body>
          <div className="mb-2">
            <strong className="d-block mb-1">
              {currentNotification?.message}
            </strong>
            {currentNotification?.type === "booking" && (
              <div className="mt-2">
                <Button variant="outline-light" size="sm" href="/my-bookings">
                  <AppIcon name="bi-calendar-week" className="me-1" />
                  View Appointments
                </Button>
              </div>
            )}
            {currentNotification?.type === "payment" && (
              <div className="mt-2">
                <Button variant="outline-light" size="sm" href="/billing">
                  <AppIcon name="bi-receipt" className="me-1" />
                  View Billing
                </Button>
              </div>
            )}
            {currentNotification?.type === "appointment" && (
              <div className="mt-2">
                <Button variant="outline-light" size="sm" href="/my-bookings">
                  <AppIcon name="bi-clock-history" className="me-1" />
                  View Schedule
                </Button>
              </div>
            )}
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificationSystem;
