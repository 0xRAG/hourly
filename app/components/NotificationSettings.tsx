"use client";

import { useEffect, useState } from "react";

export default function NotificationSettings() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      alert("Notifications are not supported in this browser");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        // Send a test notification
        new Notification("Notifications enabled!", {
          body: "You will now receive reminders to log your hours.",
          icon: "/icon.svg",
        });

        // Schedule daily reminders
        scheduleReminders();
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const scheduleReminders = () => {
    // Check if service worker is registered and supports sync
    if (
      "serviceWorker" in navigator &&
      "sync" in ServiceWorkerRegistration.prototype
    ) {
      navigator.serviceWorker.ready.then(() => {
        // Schedule a reminder for 5 PM every day
        const now = new Date();
        const targetTime = new Date();
        targetTime.setHours(17, 0, 0, 0); // 5 PM

        if (targetTime < now) {
          targetTime.setDate(targetTime.getDate() + 1);
        }

        const timeUntilReminder = targetTime.getTime() - now.getTime();

        setTimeout(() => {
          sendReminder();
          // Repeat daily
          setInterval(sendReminder, 24 * 60 * 60 * 1000);
        }, timeUntilReminder);
      });
    }
  };

  const sendReminder = () => {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Time to log your hours!", {
          body: "Don't forget to add your hours for today.",
          icon: "/icon.svg",
          badge: "/icon.svg",
          tag: "hour-reminder",
          requireInteraction: false,
        } as NotificationOptions);
      });
    }
  };

  const sendTestNotification = async () => {
    console.log({ permission });
    if (permission === "granted") {
      try {
        // Check if service worker is available
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          console.log("Service worker ready, showing notification");
          await registration.showNotification("Test Notification", {
            body: "This is a test reminder to log your hours.",
            icon: "/icon.svg",
            badge: "/icon.svg",
            tag: "test-notification",
          });
          console.log("Notification shown via service worker");
        } else {
          // Fallback to regular notification
          console.log("Service worker not available, using regular notification");
          new Notification("Test Notification", {
            body: "This is a test reminder to log your hours.",
            icon: "/icon.svg",
          });
        }
      } catch (error) {
        console.error("Error showing notification:", error);
        // Fallback to regular notification
        try {
          new Notification("Test Notification", {
            body: "This is a test reminder to log your hours.",
            icon: "/icon.svg",
          });
        } catch (fallbackError) {
          console.error("Fallback notification also failed:", fallbackError);
          alert("Failed to show notification. Check browser console for details.");
        }
      }
    } else {
      console.log("Permission not granted:", permission);
    }
  };

  if (!isSupported) {
    return (
      <div className="notification-section">
        <h3>Notifications</h3>
        <div className="notification-status disabled">
          <span className="notification-icon">⚠️</span>
          <div className="notification-text">
            <strong>Not Supported</strong>
            <p>Your browser does not support notifications</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-section">
      <h3>Notifications</h3>

      {permission === "granted" ? (
        <>
          <div className="notification-status enabled">
            <span className="notification-icon">✓</span>
            <div className="notification-text">
              <strong>Enabled</strong>
              <p>You will receive daily reminders at 5 PM to log your hours</p>
            </div>
          </div>
          <button
            onClick={sendTestNotification}
            className="enable-notifications-btn"
          >
            Send Test Notification
          </button>
        </>
      ) : permission === "denied" ? (
        <div className="notification-status disabled">
          <span className="notification-icon">✗</span>
          <div className="notification-text">
            <strong>Blocked</strong>
            <p>Please enable notifications in your browser settings</p>
          </div>
        </div>
      ) : (
        <>
          <div className="notification-status">
            <span className="notification-icon">🔔</span>
            <div className="notification-text">
              <strong>Enable Reminders</strong>
              <p>Get daily reminders to log your hours</p>
            </div>
          </div>
          <button
            onClick={requestPermission}
            className="enable-notifications-btn"
          >
            Enable Notifications
          </button>
        </>
      )}
    </div>
  );
}
