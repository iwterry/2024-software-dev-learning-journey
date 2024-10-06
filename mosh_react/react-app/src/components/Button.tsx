import { MouseEventHandler } from "react";

interface ButtonProps {
  type?: 'primary' | 'danger' | 'success' | 'info';
  children: string;
  onClick: MouseEventHandler;
}

export default function Button({ type ='primary', children, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${type}`} onClick={onClick}>{children}</button>
  );
}