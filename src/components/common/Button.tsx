import classNames from "classnames";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  onClick,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "px-10 py-1 rounded-lg text-sm font-semibold transition duration-200",
        {
          "bg-white text black border-transparent hover:bg-gray-100":
            variant === "primary",
          "bg-zinc-900 text-white hover:bg-zinc-800": variant === "secondary",
        }
      )}
    >
      {children}
    </button>
  );
}
