/**
 * ErrorDisplay Component
 * Displays error messages in a centered modal overlay
 */

function ErrorDisplay({ error, title = 'Error' }) {
  if (!error) return null;

  return (
    <div className="fixed left-1/2 top-1/2 z-[10000] max-w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-red-600/95 px-5 py-4 text-center backdrop-blur-[10px]">
      <div className="mb-2 font-['Roboto'] text-sm font-medium text-white">{title}</div>
      <div className="font-['Roboto'] text-xs text-white/90">{error}</div>
    </div>
  );
}

export default ErrorDisplay;
