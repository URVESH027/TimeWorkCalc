interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={`mx-auto w-full max-w-5xl flex-1 px-4 py-8 ${className ?? ""}`}
    >
      {children}
    </main>
  );
}
