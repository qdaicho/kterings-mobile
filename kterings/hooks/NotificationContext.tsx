import React, { createContext, useState, ReactNode } from "react";

export interface Notification {
    id: string;
    message: string;
    created_at: Date;
    read_at: null | Date;
}
interface NotificationContextType {
    notifications: Notification[];
    updateNotifications: (newNotifications: Notification[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

interface NotificationProviderProps {
    children: ReactNode;
}

export const useNotifications = () => {
    const context = React.useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotifications must be used within a NotificationProvider"
        );
    }
    return context;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const updateNotifications = (newNotifications: Notification[]) => {
        setNotifications([...newNotifications]);
    };

    return (
        <NotificationContext.Provider
            value={{ notifications, updateNotifications }}
        >
            {children}
        </NotificationContext.Provider>
    );
};