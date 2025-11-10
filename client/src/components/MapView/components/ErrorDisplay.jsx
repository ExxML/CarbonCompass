/**
 * ErrorDisplay Component
 * Displays error messages in a centered modal overlay
 */

function ErrorDisplay({ error, title = 'Error' }) {
  if (!error) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        background: 'rgba(220, 38, 38, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '16px 20px',
        maxWidth: '300px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'white',
          fontFamily: 'Roboto, sans-serif',
          marginBottom: '8px',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        {error}
      </div>
    </div>
  );
}

export default ErrorDisplay;
