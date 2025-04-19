import React from 'react';

export default function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <span className="loader" /> {/* you can style .loader in App.css */}
    </div>
  );
}
