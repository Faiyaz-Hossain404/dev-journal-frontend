type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`bg-zinc-800 rounded-lg p-4 shadow-md text-white w-full ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
