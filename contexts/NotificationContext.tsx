import { createContext, useContext, useState, ReactNode } from "react";

// Interface untuk nilai konteks
interface NotificationContextType {
  message: string;
  open: boolean;
  showNotification: (message: string) => void;
  hideNotification: () => void;
}

// Inisialisasi nilai default konteks
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const showNotification = (message: string) => {
    setMessage(message);
    setOpen(true);
  };

  const hideNotification = () => {
    setOpen(false);
    setMessage("");
  };

  return (
    <NotificationContext.Provider value={{ message, open, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook untuk menggunakan konteks
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
