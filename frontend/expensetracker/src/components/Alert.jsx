// Success / error banner. type is "success" or "error". Renders nothing when there is no message.
function Alert({ type = "error", children, onClose }) {
  if (!children) {
    return null;
  }
  return (
    <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>
      <span>{children}</span>
      {onClose && (
        <button type="button" className="alert-close" aria-label="Dismiss message" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
}

export default Alert;
