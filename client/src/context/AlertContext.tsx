import React, { createContext, useContext, useState, useCallback } from 'react';

export type AlertType = 'error' | 'warning' | 'success';

export interface AlertItem {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertContextType {
  alerts: AlertItem[];
  showAlert: (type: AlertType, message: string) => void;
  dismissAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback((type: AlertType, message: string) => {
    const id = crypto.randomUUID();
    setAlerts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissAlert(id);
    }, 5000);
  }, [dismissAlert]);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, dismissAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
