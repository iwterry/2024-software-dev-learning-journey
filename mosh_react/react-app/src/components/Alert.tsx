import { MouseEventHandler, ReactNode } from "react"

interface AlertProps {
  children: ReactNode;
  onClose: MouseEventHandler;
  shouldShowAlert: boolean
}

export default function Alert({ children, onClose, shouldShowAlert } : AlertProps) {
  return (shouldShowAlert && (
    <div style={{ "border": "1px solid gray", "width" : "500px", "backgroundColor": "lightblue" }}>
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  ));
}