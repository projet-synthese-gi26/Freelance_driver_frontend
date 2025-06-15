import React, { useEffect, useState } from "react";

interface MousePosition {
    x: number;
    y: number;
}
interface ErrorMessageProps {
    message: string;
    position: MousePosition;

}
const ErrorTooltip = ({ message, position }:ErrorMessageProps) => {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 1000); // 3 secondes
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: "red",
        color: "white",
        padding: "5px",
        borderRadius: "5px",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
};

export default ErrorTooltip;
