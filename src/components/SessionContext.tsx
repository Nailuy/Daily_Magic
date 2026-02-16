"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SessionContextType {
    sessionActive: boolean;
    activateSession: () => void;
}

const SessionContext = createContext<SessionContextType>({
    sessionActive: false,
    activateSession: () => { },
});

export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessionActive, setSessionActive] = useState(false);

    const activateSession = useCallback(() => {
        // Simulate signing a session token
        setSessionActive(true);
    }, []);

    return (
        <SessionContext.Provider value={{ sessionActive, activateSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
