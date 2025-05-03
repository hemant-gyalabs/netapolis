import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeDashboard, runIntegrationChecks } from './utils/init';
import { ThemeProvider } from './contexts/ThemeContext';

// Run initialization before rendering the app
initializeDashboard().then(result => {
  console.log('Dashboard initialization result:', result);

  // Run integration checks if in development mode
  if (process.env.NODE_ENV === 'development') {
    const checkResults = runIntegrationChecks();
    console.log('Integration check results:', checkResults);
  }

  // Render the app
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}).catch(error => {
  console.error('Failed to initialize dashboard:', error);
  
  // Render error fallback
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '40px auto', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center' 
    }}>
      <h1>Error Loading Dashboard</h1>
      <p>
        There was a problem initializing the dashboard. Please try refreshing the page or contact support if the problem persists.
      </p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '10px 16px',
          backgroundColor: '#3f51b5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        Refresh Page
      </button>
    </div>
  );
});