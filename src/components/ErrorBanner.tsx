export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
      <span aria-hidden="true">⚠</span>
      <span>{message}</span>
    </div>
  );
}