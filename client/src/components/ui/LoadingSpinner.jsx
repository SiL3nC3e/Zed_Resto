export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );
}
