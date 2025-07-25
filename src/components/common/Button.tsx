type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  onClick,
  className,
  type = "button",
}: ButtonProps) {
  return (
    <button onClick={onClick} className={className} type={type}>
      {children}
    </button>
  );
}
