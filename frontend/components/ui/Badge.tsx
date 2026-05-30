interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${className ?? ""}`}
      style={color ? { backgroundColor: `${color}18`, color } : { backgroundColor: "#f4f4f5", color: "#71717a" }}
    >
      {children}
    </span>
  );
}
