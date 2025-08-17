type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  title?: string;
};

export default function Button({
  children,
  onClick,
  className,
  type = "button",
  disabled,
  title,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
      title={title}
    >
      {children}
    </button>
  );
}
