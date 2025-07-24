type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 shadow-md text-white w-full">
      {children}
    </div>
  );
}
