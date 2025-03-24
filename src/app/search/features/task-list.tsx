import { createContext, useContext, useState, ReactNode } from "react";

interface ExpandContextType {
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}

export const ExpandContext = createContext<ExpandContextType>({
  expandedId: null,
  setExpandedId: () => {},
});

interface ExpandProviderProps {
  children: ReactNode;
}

export const ExpandProvider = ({ children }: ExpandProviderProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return (
    <ExpandContext.Provider value={{ expandedId, setExpandedId }}>
      {children}
    </ExpandContext.Provider>
  );
};

export const useExpand = () => useContext(ExpandContext);

export const TaskList = ({ children }: { children: ReactNode }) => {
  return <ExpandProvider>{children}</ExpandProvider>;
};
