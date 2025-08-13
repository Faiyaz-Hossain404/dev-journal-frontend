type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  className,
  type = "button",
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
