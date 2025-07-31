import { useEffect } from 'react';

export default function LimitWarningPopup({ onClose, onAddMore }){
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  return (
    <div className="limit-popup-overlay">
      <div className="limit-popup-content">
        <h3>⚠️ Sending Limit Reached</h3>
        <p>
          All your configured emails have reached their daily sending limit (450 emails per account). 
          To continue sending:
        </p>
        <ul>
          <li>Add more email configurations</li>
          <li>Wait until daily limits reset</li>
        </ul>
        <div className="popup-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={onAddMore}>
            Add More Emails
          </button>
        </div>
      </div>
    </div>
  );
};