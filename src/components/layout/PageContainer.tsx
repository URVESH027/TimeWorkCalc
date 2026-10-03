interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`mx-auto w-full max-w-5xl flex-1 px-4 py-8 focus:outline-none ${className ?? ""}`}
    >
      {children}
    </main>
  );
}
