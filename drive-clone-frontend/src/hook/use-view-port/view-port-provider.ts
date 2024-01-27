import React, { useState, useEffect, createContext, FC, ReactNode } from "react";

interface ViewportContextType {
  width: number;
  height: number;
}

export const viewportContext = createContext<ViewportContextType>({
  width: 0,
  height: 0,
});

interface ViewportProviderProps {
  children: ReactNode;
}

export const ViewportProvider: FC<ViewportProviderProps> = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  );
};
