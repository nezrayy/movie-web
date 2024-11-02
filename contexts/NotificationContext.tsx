import { createContext, useContext, useState } from "react";

interface NotificationContextType {
  message: string;
  open: boolean;
  type?: "default" | "success" | "error";
  showNotification: (message: string, type?: "default" | "success" | "error") => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<"default" | "success" | "error">("default");

  const showNotification = (msg: string, notificationType: "default" | "success" | "error" = "default") => {
    setMessage(msg);
    setType(notificationType);
    setOpen(true);
  };

  const hideNotification = () => {
    setOpen(false);
    setMessage("");
    setType("default");
  };

  return (
    <NotificationContext.Provider value={{ message, open, type, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
